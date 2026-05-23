import React, { useState } from 'react';
import { Download, FileCode, FileType } from 'lucide-react';
import { exportToPDF } from '../utils/exportPDF';
import { exportToDOCX } from '../utils/exportDOCX';
import toast from 'react-hot-toast';

export default function ExportButtons({ 
  formData, 
  theme, 
  template, 
  institutionId, 
  customLogo, 
  onBeforeDownload 
}) {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isDocxLoading, setIsDocxLoading] = useState(false);

  const filename = formData.assignmentTitle || 'assignment-cover';

  const handlePDFExport = async () => {
    // CRUCIAL: If validation returns false, do absolutely nothing.
    const isValid = await onBeforeDownload();
    if (!isValid) return; 

    setIsPdfLoading(true);
    const toastId = toast.loading('Generating print-ready PDF...');
    try {
      await exportToPDF('cover-page-capture', filename);
      toast.success('PDF downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate PDF.', { id: toastId });
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleDOCXExport = async () => {
    // CRUCIAL: Defend the DOCX downloader too.
    const isValid = await onBeforeDownload();
    if (!isValid) return;

    setIsDocxLoading(true);
    const toastId = toast.loading('Generating editable Word file...');
    try {
      await exportToDOCX({
        ...formData,
        theme,
        template,
        institutionId,
        customLogo
      }, filename);
      toast.success('Word document downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate Word document.', { id: toastId });
    } finally {
      setIsDocxLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <button
        type="button"
        disabled={isPdfLoading || isDocxLoading}
        onClick={handlePDFExport}
        className="flex-1 btn bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold shadow-md transition disabled:opacity-50"
      >
        <FileType className="w-5 h-5" />
        {isPdfLoading ? 'Processing...' : 'Download PDF'}
      </button>

      {/* <button
        type="button"
        disabled={isPdfLoading || isDocxLoading}
        onClick={handleDOCXExport}
        className="flex-1 btn bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold shadow-md transition disabled:opacity-50"
      >
        <FileCode className="w-5 h-5" />
        {isDocxLoading ? 'Processing...' : 'Download Word (DOCX)'}
      </button> */}
    </div>
  );
}