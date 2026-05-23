import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportToPDF(elementId, filename = 'assignment-cover') {
  const source = document.getElementById(elementId);
  if (!source) throw new Error(`Target capture element #${elementId} could not be resolved.`);

  // Setup isolated clean offscreen drawing workspace
  const offscreen = document.createElement('div');
  Object.assign(offscreen.style, {
    position:   'fixed',
    top:        '-9999px',
    left:       '-9999px',
    width:      '810px',  // Exact structural dimension bounds 
    height:     '1140px',
    overflow:   'visible',
    zIndex:     '-1',
    background: '#ffffff',
  });

  const clone = source.cloneNode(true);
  Object.assign(clone.style, {
    transform:       'none',
    transformOrigin: 'top left',
    width:           '810px',
    height:          '1140px',
    position:        'relative',
    overflow:        'visible',
    padding:         '10px' // Compensates edge alignments safely
  });

  // Scales text up to fill empty space and increases line separation metrics
  clone.style.fontSize = '1.22rem'; 
  clone.style.lineHeight = '1.65';

  clone.querySelectorAll('*').forEach(el => {
    if (el.style.overflow === 'hidden') {
      el.style.overflow = 'visible';
    }
    // Boost inner headers specifically to make them prominent
    if (el.classList.contains('text-3xl') || el.classList.contains('text-4xl') || el.style.fontSize === '2.25rem') {
      el.style.fontSize = '3.3rem';
      el.style.marginBottom = '1.5rem';
    }
  });

  offscreen.appendChild(clone);
  document.body.appendChild(offscreen);

  try {
    // Wait for the DOM clone styles to paint completely
    await new Promise(resolve => setTimeout(resolve, 300));

    const canvas = await html2canvas(offscreen, {
      scale:           3.0, // High density resolution capture
      useCORS:         true,
      allowTaint:      true,
      backgroundColor: '#ffffff',
      width:           810,
      height:          1140,
      windowWidth:     810,
      windowHeight:    1140,
      logging:         false,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit:        'mm',
      format:      'a4',
    });

    // Perfect A4 dimension assignment without unexpected clipping borders
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    pdf.save(`${sanitizeFilename(filename)}.pdf`);

  } finally {
    // Corrected here: explicit finally block so the node element is pulled out of memory safely
    if (document.body.contains(offscreen)) {
      document.body.removeChild(offscreen);
    }
  }
}

export function sanitizeFilename(name) {
  return (name || 'assignment-cover')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() || 'assignment-cover';
}