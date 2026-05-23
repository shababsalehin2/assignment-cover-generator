import { useState, useCallback, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import {
  GraduationCap, User, BookOpen, FileText, Building2,
  ChevronDown, ChevronUp, RefreshCcw, Save, Upload,
  Eye, EyeOff, Info, X
} from 'lucide-react';

import InstitutionSelector from './components/InstitutionSelector';
import CoverPreview from './components/CoverPreview';
import TemplateSelector from './components/TemplateSelector';
import ExportButtons from './components/ExportButtons';
import ThemeSwitcher from './components/ThemeSwitcher';
import { institutions } from './data/institutions';
import { colorThemes, coverTemplates, fontOptions } from './data/themes';
import { useLocalStorage } from './hooks/useLocalStorage';
import clsx from 'clsx';

const STORAGE_KEY = 'acg_form_data';

const defaultValues = {
  studentName: '',
  rollNumber: '',
  classSemester: '',
  groupDepartment: '',
  assignmentTitle: '',
  subjectName: '',
  subjectCode: '',
  submissionDate: '',
  teacherName: '',
  teacherDesignation: '',
  teacherDepartment: '',
  institutionName: '',
  institutionAddress: '',
};

function FormSection({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card overflow-hidden animate-fade-in">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-surface-800 transition-colors duration-100"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-950 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
          </div>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && (
        <div className="px-5 pb-4 pt-1 border-t border-gray-100 dark:border-gray-800 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

function Field({ label, error, children, required }) {
  return (
    <div>
      <label className="label">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <Info className="w-3 h-3" /> {error.message}
        </p>
      )}
    </div>
  );
}

function PreviewPanel({ formData, template, theme, font, selectedInstitutionId, customLogo }) {
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 32;
        const pageWidth = 794;
        const newScale = Math.min(containerWidth / pageWidth, 1);
        setScale(newScale);
      }
    };
    updateScale();
    const obs = new ResizeObserver(updateScale);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full p-4 flex justify-center">
      <div
        style={{
          width: `${794 * scale}px`,
          height: `${1123 * scale}px`,
          position: 'relative',
        }}
      >
        <div
          id="cover-page-capture" 
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: '794px',
            height: '1123px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
            background: '#ffffff',
            borderRadius: '4px',
            overflow: 'hidden'
          }}
        >
          <CoverPreview
            data={formData}
            template={template}
            theme={theme}
            font={font}
            institutionId={selectedInstitutionId}
            customLogo={customLogo}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [savedData, setSavedData] = useLocalStorage(STORAGE_KEY, null);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(null);
  const [customLogo, setCustomLogo] = useState(null);
  const [template, setTemplate] = useState('classic');
  const [theme, setTheme] = useState(colorThemes[0]);
  const [font, setFont] = useState(fontOptions[0]);
  const [showPreview, setShowPreview] = useState(false);
  const [institutionError, setInstitutionError] = useState('');

  const {
    register, handleSubmit, watch, reset, trigger, formState: { errors }
  } = useForm({
    defaultValues: savedData || defaultValues,
    mode: 'onChange'
  });

  const formValues = watch();

  const institution = institutions.find(i => i.id === selectedInstitutionId);
  const formData = {
    ...formValues,
    institutionName: selectedInstitutionId === 'custom'
      ? formValues.institutionName
      : (institution?.name || formValues.institutionName || ''),
    institutionAddress: selectedInstitutionId === 'custom'
      ? formValues.institutionAddress
      : (institution?.address || formValues.institutionAddress || ''),
  };

  const handleInstitutionSelect = (inst) => {
    setSelectedInstitutionId(inst.id);
    setInstitutionError('');
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setCustomLogo(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSavedData(formValues);
    toast.success('Form data saved!');
  };

  const handleReset = () => {
    reset(defaultValues);
    setSelectedInstitutionId(null);
    setCustomLogo(null);
    setSavedData(null);
    setInstitutionError('');
    toast.success('Form reset!');
  };

  // Enforces data validation and returns a clear falsy/truthy value to stop downloading
  const validateFormRequirements = async () => {
    let isValid = true;
    
    if (!selectedInstitutionId) {
      setInstitutionError('Please select an institution');
      isValid = false;
    }

    const formValidated = await trigger([
      'assignmentTitle',
      'subjectName',
      'submissionDate',
      'studentName',
      'rollNumber',
      'classSemester',
      'teacherName'
    ]);

    if (selectedInstitutionId === 'custom' && !formValues.institutionName) {
      isValid = false;
    }

    if (!formValidated || !isValid) {
      toast.error('Cannot download! Please fill out all mandatory fields.');
      return false; // Crucial: Halts the download callback
    }
    
    return true; 
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'font-body text-sm font-medium',
          style: { borderRadius: '12px', maxWidth: '360px' }
        }}
      />

      <header className="sticky top-0 z-40 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <GraduationCap className="w-4.5 h-4.5 text-white" />
            </div>
            {/* <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
              Assignment Cover Generator | Developed by <a href="https://www.instagram.com/shabab._salehin/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-600 transition-colors">Shabab Salehin</a>
            </h1> */}
            <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
              Assignment Cover Generator | Developed by{" "}
              
              <a
                href="https://www.instagram.com/shabab._salehin/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "underline",
                  color: "#ffd700",
                  fontWeight: "900",
                  animation: "sharpBlink 0.8s infinite",
                }}
              >
                Shabab Salehin
              </a>

              <style>
                {`
                  @keyframes sharpBlink {
                    0%, 100% {
                      color: #ffd700;
                      text-shadow:
                        0 0 2px #ff0000,
                        0 0 4px #ff4500;
                      transform: scale(1);
                    }

                    50% {
                      color: #ff2d2d;
                      text-shadow:
                        0 0 1px #ffff00;
                      transform: scale(1.03);
                    }
                  }
                `}
              </style>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden btn-secondary py-2 px-3 text-xs"
            >
              {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden xs:inline">{showPreview ? 'Hide' : 'Preview'}</span>
            </button>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">
          
          {/* Left Input Form Column */}
          <div className={clsx('flex-none w-full lg:w-[420px] xl:w-[460px] space-y-3', showPreview && 'hidden lg:block')}>
            <form onSubmit={(e) => e.preventDefault()} noValidate>
              
              <FormSection title="Institution" icon={Building2}>
                <div className="space-y-3 pt-2">
                  <Field label="Select Institution" error={institutionError ? { message: institutionError } : null} required>
                    <InstitutionSelector
                      value={selectedInstitutionId}
                      onChange={handleInstitutionSelect}
                      error={!!institutionError}
                    />
                  </Field>

                  {selectedInstitutionId === 'custom' && (
                    <div className="space-y-3 animate-slide-up">
                      <Field label="Institution Name" error={errors.institutionName} required>
                        <input
                          {...register('institutionName', { required: 'Institution name is required' })}
                          className={clsx('input-field', errors.institutionName && 'error')}
                          placeholder="e.g. M.D.C Model School and College"
                        />
                      </Field>
                      <Field label="Institution Address" error={errors.institutionAddress}>
                        <input
                          {...register('institutionAddress')}
                          className="input-field"
                          placeholder="e.g. Pallabi, Mirpur-12, Dhaka"
                        />
                      </Field>
                      <Field label="Institution Logo">
                        <div className="flex items-center gap-3">
                          <label className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-primary-400 transition-colors bg-gray-50 dark:bg-surface-800 text-sm text-gray-500">
                            <Upload className="w-4 h-4" />
                            <span className="truncate">{customLogo ? 'Logo uploaded ✓' : 'Upload logo (max 2MB)'}</span>
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                          </label>
                          {customLogo && (
                            <button type="button" onClick={() => setCustomLogo(null)} className="text-red-400 hover:text-red-600 p-1">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </Field>
                    </div>
                  )}
                </div>
              </FormSection>

              <FormSection title="Assignment Details" icon={BookOpen}>
                <div className="space-y-3 pt-2">
                  <Field label="Assignment Title" error={errors.assignmentTitle} required>
                    <input
                      {...register('assignmentTitle', { required: 'Assignment title is required' })}
                      className={clsx('input-field', errors.assignmentTitle && 'error')}
                      placeholder="e.g. Types of Cybercrime: Definition & Examples"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Subject Name" error={errors.subjectName} required>
                      <input
                        {...register('subjectName', { required: 'Subject name is required' })}
                        className={clsx('input-field', errors.subjectName && 'error')}
                        placeholder="e.g. ICT"
                      />
                    </Field>
                    <Field label="Subject Code" error={errors.subjectCode}>
                      <input
                        {...register('subjectCode')}
                        className="input-field"
                        placeholder="e.g. 154"
                      />
                    </Field>
                  </div>
                  <Field label="Submission Date" error={errors.submissionDate} required>
                    <input
                      type="date"
                      {...register('submissionDate', { required: 'Submission date is required' })}
                      className={clsx('input-field', errors.submissionDate && 'error')}
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection title="Student Information" icon={User}>
                <div className="space-y-3 pt-2">
                  <Field label="Student Name" error={errors.studentName} required>
                    <input
                      {...register('studentName', { required: 'Student name is required' })}
                      className={clsx('input-field', errors.studentName && 'error')}
                      placeholder="e.g. Mr. XYZ"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Roll Number" error={errors.rollNumber} required>
                      <input
                        {...register('rollNumber', { required: 'Roll number is required' })}
                        className={clsx('input-field', errors.rollNumber && 'error')}
                        placeholder="e.g. 67"
                      />
                    </Field>
                    <Field label="Class" error={errors.classSemester} required>
                      <input
                        {...register('classSemester', { required: 'Class is required' })}
                        className={clsx('input-field', errors.classSemester && 'error')}
                        placeholder="e.g. Class 10 / College - 1st Year"
                      />
                    </Field>
                  </div>
                  <Field label="Group" error={errors.groupDepartment}>
                    <input
                      {...register('groupDepartment')}
                      className="input-field"
                      placeholder="e.g. Science / Business Studies/ Humanities"
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection title="Submitted To" icon={GraduationCap}>
                <div className="space-y-3 pt-2">
                  <Field label="Teacher Name" error={errors.teacherName} required>
                    <input
                      {...register('teacherName', { required: 'Teacher name is required' })}
                      className={clsx('input-field', errors.teacherName && 'error')}
                      placeholder="e.g. Shabab Salehin"
                    />
                  </Field>
                  <Field label="Designation" error={errors.teacherDesignation}>
                    <input
                      {...register('teacherDesignation')}
                      className="input-field"
                      placeholder="e.g. Lecturer"
                    />
                  </Field>
                  <Field label="Department" error={errors.teacherDepartment}>
                    <input
                      {...register('teacherDepartment')}
                      className="input-field"
                      placeholder="e.g. Department of ICT"
                    />
                  </Field>
                </div>
              </FormSection>

              <div className="card p-4 space-y-3">
                <div className="flex gap-2">
                  <button type="button" onClick={handleSave} className="btn-secondary flex-1 justify-center text-xs">
                    <Save className="w-3.5 h-3.5" /> Save Progress
                  </button>
                  <button type="button" onClick={handleReset} className="btn-danger flex-none px-3 text-xs">
                    <RefreshCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Live Preview Column */}
          <div className={clsx('flex-1 min-w-0 space-y-3', !showPreview && 'hidden lg:block')}>
            <div className="card p-5 hidden xl:block">
              <TemplateSelector
                selectedTemplate={template} onTemplateChange={setTemplate}
                selectedTheme={theme} onThemeChange={setTheme}
                selectedFont={font} onFontChange={setFont}
              />
            </div>

            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Live Preview</span>
                  <span className="text-xs text-gray-400 bg-gray-100 dark:bg-surface-800 px-2 py-0.5 rounded">Large Layout Print-Ready</span>
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-surface-800 min-h-[500px] flex items-center justify-center">
                <PreviewPanel
                  formData={formData} template={template} theme={theme}
                  font={font} selectedInstitutionId={selectedInstitutionId} customLogo={customLogo}
                />
              </div>
            </div>

            <div className="card p-4">
              <ExportButtons
                formData={formData} theme={theme} template={template}
                institutionId={selectedInstitutionId} customLogo={customLogo}
                onBeforeDownload={validateFormRequirements}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}