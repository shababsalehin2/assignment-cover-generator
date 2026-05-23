// src/utils/exportDOCX.js
import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  BorderStyle, TableRow, TableCell, Table, WidthType, ShadingType, ImageRun
} from 'docx';
import { saveAs } from 'file-saver';

async function getImageData(sourceUrl) {
  if (!sourceUrl) return null;
  try {
    let buffer = null;
    let extensionType = "png";

    if (sourceUrl.startsWith('data:')) {
      const mimeMatch = sourceUrl.match(/data:image\/([a-zA-Z+]+);base64,/);
      if (mimeMatch && mimeMatch[1]) {
        extensionType = mimeMatch[1] === 'jpeg' ? 'jpg' : mimeMatch[1];
      }
      const base64Content = sourceUrl.split(',')[1];
      const binaryString = window.atob(base64Content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      buffer = bytes.buffer;
    } else {
      const pageBase = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
      const targetUrl = sourceUrl.startsWith('http') ? sourceUrl : new URL(sourceUrl, pageBase).href;
      const urlClean = targetUrl.split('?')[0].split('#')[0];
      const detectedExt = urlClean.substring(urlClean.lastIndexOf('.') + 1).toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(detectedExt)) {
        extensionType = detectedExt === 'jpeg' ? 'jpg' : detectedExt;
      }
      const response = await fetch(targetUrl);
      if (!response.ok) throw new Error(`Asset not found at: ${targetUrl}`);
      const blob = await response.blob();
      buffer = await blob.arrayBuffer();
    }
    return { buffer, extensionType };
  } catch (error) {
    console.warn("Skipping logo image extraction for DOCX build line:", error.message);
    return null;
  }
}

export async function exportToDOCX(formData, filename = 'assignment-cover') {
  const {
    studentName, rollNumber, classSemester, groupDepartment, 
    assignmentTitle, subjectName, subjectCode, submissionDate, 
    teacherName, teacherDesignation, teacherDepartment,
    institutionName, institutionAddress, theme, template, institution, customLogo
  } = formData;

  const primaryColor = theme?.primary?.replace('#', '') || '1a3a5c';
  const accentColor = theme?.accent?.replace('#', '') || 'c8a96a';

  // Compact line spacings to prevent 2-page spill
  const makeTextRun = (text, opts = {}) => new TextRun({
    text: text || '',
    bold: opts.bold || false,
    italics: opts.italic || false,
    size: opts.size || 24, // Optimized standard base font
    color: opts.color || '111111',
    font: 'Times New Roman'
  });

  const makePara = (text, opts = {}) => new Paragraph({
    children: [makeTextRun(text, opts)],
    alignment: opts.align || AlignmentType.CENTER,
    spacing: { before: opts.before || 80, after: opts.after || 80, line: 240 }
  });

  const makeBoxField = (label, val) => [
    new Paragraph({
      children: [new TextRun({ text: label.toUpperCase(), size: 16, bold: true, color: '666666', font: 'Times New Roman' })],
      spacing: { before: 40, after: 10 }
    }),
    new Paragraph({
      children: [new TextRun({ text: val || '—', size: 24, bold: true, color: '111111', font: 'Times New Roman' })],
      spacing: { before: 0, after: 60 }
    })
  ];

  const makeHorizontalLine = (colorHex, thickness = 12) => new Paragraph({
    text: "",
    spacing: { before: 120, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: thickness, color: colorHex, space: 1 } }
  });

  let logoResult = null;
  let targetLogoUrl = customLogo || institution?.logo;
  if (targetLogoUrl) {
    logoResult = await getImageData(targetLogoUrl);
  }

  const makeLogoImageRun = () => {
    if (!logoResult || !logoResult.buffer) return new TextRun("");
    return new ImageRun({
      data: logoResult.buffer,
      type: logoResult.extensionType,
      transformation: { width: 90, height: 90 }
    });
  };

  let elementsStack = [];

  // Reduced structural layouts block sizes
  if (template !== 'split' && template !== 'modern') {
    elementsStack.push(makeHorizontalLine(primaryColor, 24));
    elementsStack.push(makeHorizontalLine(accentColor, 12));
  }

  if (template === 'split') {
    elementsStack.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                shading: { fill: primaryColor, type: ShadingType.CLEAR, color: "auto" },
                margins: { top: 600, bottom: 600, left: 600, right: 600 },
                children: [
                  makePara(institutionName || 'Institution Name', { bold: true, size: 44, color: 'FFFFFF' }),
                  makePara(institutionAddress || 'Institution Address', { size: 24, color: 'E2E8F0', after: 300 }),
                  makePara('ASSIGNMENT', { bold: true, size: 22, color: accentColor, before: 100 }),
                  makePara(assignmentTitle || 'Assignment Title', { bold: true, size: 48, color: 'FFFFFF' }),
                  makePara(`${subjectName || ''}${subjectCode ? ` (${subjectCode})` : ''}`, { italic: true, size: 28, color: 'FFFFFF' })
                ]
              })
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { before: 300 } })
    );

    if (logoResult) {
      elementsStack.push(new Paragraph({ children: [makeLogoImageRun()], alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 } }));
    }
  } else if (template === 'modern') {
    if (logoResult) {
      elementsStack.push(new Paragraph({ children: [makeLogoImageRun()], alignment: AlignmentType.LEFT, spacing: { before: 100, after: 150 } }));
    }
    elementsStack.push(
      makePara(institutionName || 'Institution Name', { bold: true, size: 40, color: primaryColor, align: AlignmentType.LEFT }),
      makePara(institutionAddress || 'Institution Address', { size: 24, color: '4A5568', align: AlignmentType.LEFT, after: 400 }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { left: { style: BorderStyle.SINGLE, size: 48, color: primaryColor }, top: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE } },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                margins: { left: 300, top: 200, bottom: 200 },
                children: [
                  makePara('COURSE ASSIGNMENT', { bold: true, size: 20, color: accentColor, align: AlignmentType.LEFT }),
                  makePara(assignmentTitle || 'Assignment Title', { bold: true, size: 48, color: '000000', align: AlignmentType.LEFT }),
                  makePara(`${subjectName || ''}${subjectCode ? ` · ${subjectCode}` : ''}`, { italic: true, size: 28, color: '2D3748', align: AlignmentType.LEFT })
                ]
              })
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { before: 400 } })
    );
  } else {
    if (logoResult) {
      elementsStack.push(new Paragraph({ children: [makeLogoImageRun()], alignment: AlignmentType.CENTER, spacing: { before: 100, after: 200 } }));
    }
    elementsStack.push(
      makePara(institutionName || 'Institution Name', { bold: true, size: 44, color: primaryColor }),
      makePara(institutionAddress || 'Institution Address', { size: 24, color: '4A5568', after: 250 }),
      makeHorizontalLine(accentColor, 8),
      new Paragraph({ spacing: { before: 200 } }),
      makePara('ASSIGNMENT ON', { bold: true, size: 20, color: accentColor }),
      makePara(assignmentTitle || 'Assignment Title', { bold: true, size: 48, color: '000000' }),
      makePara(`${subjectName || ''}${subjectCode ? ` (${subjectCode})` : ''}`, { italic: true, size: 28, color: '2D3748', after: 400 })
    );
  }

  // Info Column Cards Configuration
  let leftBoxChildren = [
    new Paragraph({
      children: [new TextRun({ text: "SUBMITTED BY", bold: true, size: 22, color: primaryColor, font: 'Times New Roman' })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: accentColor, space: 4 } },
      spacing: { after: 150 }
    })
  ];
  if (studentName) leftBoxChildren.push(...makeBoxField('Student Name', studentName));
  if (rollNumber) leftBoxChildren.push(...makeBoxField('Roll Number', rollNumber));
  if (classSemester) leftBoxChildren.push(...makeBoxField('Class', classSemester));
  if (groupDepartment) leftBoxChildren.push(...makeBoxField('Group', groupDepartment));

  let rightBoxChildren = [
    new Paragraph({
      children: [new TextRun({ text: "SUBMITTED TO", bold: true, size: 22, color: primaryColor, font: 'Times New Roman' })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: accentColor, space: 4 } },
      spacing: { after: 150 }
    })
  ];
  if (teacherName) rightBoxChildren.push(...makeBoxField('Teacher Name', teacherName));
  if (teacherDesignation) rightBoxChildren.push(...makeBoxField('Designation', teacherDesignation));
  if (teacherDepartment) rightBoxChildren.push(...makeBoxField('Department', teacherDepartment));

  const cardBorders = {
    top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' }
  };

  const infoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 47, type: WidthType.PERCENTAGE },
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR, color: 'auto' },
            borders: cardBorders,
            margins: { top: 250, bottom: 250, left: 300, right: 300 },
            children: leftBoxChildren
          }),
          new TableCell({ width: { size: 6, type: WidthType.PERCENTAGE }, children: [new Paragraph("")] }),
          new TableCell({
            width: { size: 47, type: WidthType.PERCENTAGE },
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR, color: 'auto' },
            borders: cardBorders,
            margins: { top: 250, bottom: 250, left: 300, right: 300 },
            children: rightBoxChildren
          })
        ]
      })
    ]
  });

  elementsStack.push(infoTable, new Paragraph({ spacing: { before: 400 } }));

  const cleanDate = submissionDate
    ? new Date(submissionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  elementsStack.push(
    makePara('DATE OF SUBMISSION', { size: 18, color: '4A5568', align: AlignmentType.CENTER, before: 300 }),
    makePara(cleanDate, { bold: true, size: 28, color: primaryColor, align: AlignmentType.CENTER })
  );

  if (template !== 'split' && template !== 'modern') {
    elementsStack.push(
      new Paragraph({ spacing: { before: 200 } }),
      makeHorizontalLine(accentColor, 8),
      makeHorizontalLine(primaryColor, 20)
    );
  }

  const docConfig = {
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          size: { width: 12240, height: 15840 }
        }
      },
      children: elementsStack
    }]
  };

  if (template === 'bordered') {
    docConfig.sections[0].properties.page.borders = {
      top: { style: BorderStyle.SINGLE, size: 16, color: primaryColor, space: 16 },
      bottom: { style: BorderStyle.SINGLE, size: 16, color: primaryColor, space: 16 },
      left: { style: BorderStyle.SINGLE, size: 16, color: primaryColor, space: 16 },
      right: { style: BorderStyle.SINGLE, size: 16, color: primaryColor, space: 16 }
    };
  }

  const doc = new Document(docConfig);
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${sanitizeFilename(filename)}.docx`);
}

function sanitizeFilename(name) {
  return (name || 'assignment-cover')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() || 'assignment-cover';
}