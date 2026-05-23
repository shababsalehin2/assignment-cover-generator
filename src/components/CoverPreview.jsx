// src/components/CoverPreview.jsx
import { institutions } from '../data/institutions';

/** Returns the image src to use for a logo, or null for text badge fallback */
function getLogoSrc(institution, customLogo) {
  if (customLogo) return customLogo;
  if (institution?.logo) {
    return institution.logo.startsWith('/')
      ? `${import.meta.env.BASE_URL || '/'}${institution.logo.substring(1)}`.replace(/\/\/+/g, '/')
      : institution.logo;
  }
  return null;
}

/** Inline logo element for use inside the A4 canvas */
function LogoBlock({ institution, customLogo, size = 95, primary }) {
  const src = getLogoSrc(institution, customLogo);
  if (src) {
    return (
      <img
        src={src}
        alt="logo"
        style={{ width: size, height: size, objectFit: 'contain', borderRadius: '6px' }}
        onError={(e) => {
          console.warn("Failed to load logo image path:", src);
          e.target.style.display = 'none';
        }}
      />
    );
  }
  if (institution) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '8px',
        background: institution.logoBg, color: institution.logoColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: '700', fontSize: size > 80 ? '18px' : '14px',
        border: `2px solid ${institution.logoColor}30`, flexShrink: 0
      }}>
        {institution.shortName}
      </div>
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '8px',
      background: '#f0f4ff', color: primary || '#4f46e5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: '700', fontSize: '20px', border: `2px solid ${(primary || '#4f46e5')}30`
    }}>
      INST
    </div>
  );
}

function PreviewClassic({ data, theme, font, institution, customLogo }) {
  const { primary, accent } = theme;
  const ff = font.family;
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div
      id="cover-preview"
      style={{
        width: '794px',
        height: '1123px',
        background: '#ffffff',
        fontFamily: ff,
        padding: '50px 60px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        position: 'relative',
        color: '#1a1a1a',
      }}
    >
      {/* Header section remains up top */}
      <div>
        <div style={{ height: '4px', background: primary, marginBottom: '4px', borderRadius: '2px' }} />
        <div style={{ height: '2px', background: accent, marginBottom: '20px', borderRadius: '1px' }} />

        {/* Institution Header */}
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <LogoBlock institution={institution} customLogo={customLogo} size={90} primary={primary} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: primary, letterSpacing: '0.5px', lineHeight: '1.2', marginBottom: '6px', textTransform: 'uppercase' }}>
            {data.institutionName || 'Institution Name'}
          </div>
          <div style={{ fontSize: '13px', color: '#555', fontWeight: '500' }}>
            {data.institutionAddress || 'Institution Address'}
          </div>
        </div>
        <div style={{ height: '1px', background: primary + '20', marginBottom: '15px' }} />
      </div>

      {/* Center Content Wrapper */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', transform: 'translateY(-20px)' }}>
        
        {/* Center Assignment Block */}
        <div style={{ textAlign: 'center', marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: '4px',
              background: primary + '10', color: primary, fontSize: '12px',
              fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase'
            }}>
              Assignment On
            </span>
          </div>

          <div style={{ padding: '0 20px', marginBottom: '8px' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#111', lineHeight: '1.25' }}>
              {data.assignmentTitle || 'Assignment Title'}
            </div>
          </div>

          <div style={{ height: '3px', background: accent, width: '60px', margin: '8px auto 16px', borderRadius: '1.5px' }} />

          <div>
            <span style={{ fontSize: '18px', color: '#333', fontWeight: '600' }}>
              Subject: <span style={{ fontStyle: 'italic', color: '#111' }}>{data.subjectName || 'Subject Name'}</span>
              {data.subjectCode ? ` (${data.subjectCode})` : ''}
            </span>
          </div>
        </div>

        {/* Info Grid Section with enlarged typography */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Submitted By */}
          <div style={{ padding: '22px', borderRadius: '8px', border: `1px solid ${primary}20`, background: primary + '02' }}>
            <div style={{
              fontSize: '15px', fontWeight: '800', color: primary,
              letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px',
              paddingBottom: '8px', borderBottom: `2px solid ${accent}`
            }}>
              Submitted By
            </div>
            <div>
              {[
                ['Name', data.studentName],
                ['Roll No.', data.rollNumber],
                ['Reg. No.', data.registrationNumber],
                ['Class', data.classSemester],
                ['Group', data.groupDepartment],
                ['Session', data.session],
              ].map(([label, val]) => val ? (
                <div key={label} style={{ marginBottom: '8px', display: 'grid', gridTemplateColumns: '110px 1fr', fontSize: '15px', lineHeight: '1.4' }}>
                  <span style={{ color: '#555', fontWeight: '600' }}>{label}:</span>
                  <span style={{ fontWeight: '700', color: '#111' }}>{val}</span>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Submitted To */}
          <div style={{ padding: '22px', borderRadius: '8px', border: `1px solid ${primary}20`, background: primary + '02' }}>
            <div style={{
              fontSize: '15px', fontWeight: '800', color: primary,
              letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px',
              paddingBottom: '8px', borderBottom: `2px solid ${accent}`
            }}>
              Submitted To
            </div>
            <div>
              {[
                ['Name', data.teacherName],
                ['Designation', data.teacherDesignation],
                ['Department', data.teacherDepartment],
              ].map(([label, val]) => val ? (
                <div key={label} style={{ marginBottom: '8px', display: 'grid', gridTemplateColumns: '110px 1fr', fontSize: '15px', lineHeight: '1.4' }}>
                  <span style={{ color: '#555', fontWeight: '600' }}>{label}:</span>
                  <span style={{ fontWeight: '700', color: '#111' }}>{val}</span>
                </div>
              ) : null)}
            </div>
          </div>
        </div>

      </div>

      {/* Footer pinned neatly at the bottom line */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{ height: '1px', background: primary + '20', marginBottom: '10px' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#666', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '2px', fontWeight: '600' }}>
            Date of Submission
          </div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: primary }}>
            {data.submissionDate
              ? new Date(data.submissionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
              : today}
          </div>
        </div>
        <div style={{ marginTop: '12px', height: '1.5px', background: accent }} />
        <div style={{ marginTop: '4px', height: '4px', background: primary, borderRadius: '1px' }} />
      </div>
    </div>
  );
}

function PreviewSplit({ data, theme, font, institution, customLogo }) {
  const { primary, accent } = theme;
  const ff = font.family;
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div
      id="cover-preview"
      style={{
        width: '794px',
        height: '1123px',
        background: '#fff',
        fontFamily: ff,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ background: primary, padding: '40px 50px 35px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '18px' }}>
          <div style={{ background: '#fff', borderRadius: '6px', padding: '4px', flexShrink: 0 }}>
            <LogoBlock institution={institution} customLogo={customLogo} size={75} primary={primary} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '800', lineHeight: '1.2', textTransform: 'uppercase' }}>
              {data.institutionName || 'Institution Name'}
            </div>
            <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '4px' }}>
              {data.institutionAddress || 'Address'}
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', marginBottom: '18px' }} />

        <div style={{ fontSize: '11px', opacity: 0.8, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700' }}>
          Assignment Topic
        </div>
        <div style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.25' }}>
          {data.assignmentTitle || 'Assignment Title'}
        </div>
        {(data.subjectName || data.subjectCode) && (
          <div style={{ marginTop: '8px', fontSize: '16px', opacity: 0.9, fontStyle: 'italic' }}>
            {data.subjectName}{data.subjectCode ? ` (${data.subjectCode})` : ''}
          </div>
        )}
      </div>

      <div style={{ height: '6px', background: accent }} />

      <div style={{ padding: '50px 50px 35px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', width: '100%' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: primary, letterSpacing: '1.5px', textTransform: 'uppercase', paddingBottom: '6px', borderBottom: `2px solid ${primary}`, marginBottom: '16px' }}>Submitted By</div>
              {[['Name', data.studentName], ['Roll No.', data.rollNumber], ['Reg. No.', data.registrationNumber], ['Class', data.classSemester], ['Group', data.groupDepartment], ['Session', data.session]].map(([l, v]) => v ? (
                <div key={l} style={{ marginBottom: '10px', fontSize: '15px' }}>
                  <div style={{ fontSize: '12px', color: '#777', fontWeight: '600' }}>{l}</div>
                  <div style={{ fontWeight: '700', color: '#222', marginTop: '2px' }}>{v}</div>
                </div>
              ) : null)}
            </div>

            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: primary, letterSpacing: '1.5px', textTransform: 'uppercase', paddingBottom: '6px', borderBottom: `2px solid ${primary}`, marginBottom: '16px' }}>Submitted To</div>
              {[['Name', data.teacherName], ['Designation', data.teacherDesignation], ['Department', data.teacherDepartment]].map(([l, v]) => v ? (
                <div key={l} style={{ marginBottom: '10px', fontSize: '15px' }}>
                  <div style={{ fontSize: '12px', color: '#777', fontWeight: '600' }}>{l}</div>
                  <div style={{ fontWeight: '700', color: '#222', marginTop: '2px' }}>{v}</div>
                </div>
              ) : null)}
            </div>
          </div>
        </div>

        <div style={{ paddingTop: '20px', borderTop: `1px solid ${primary}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Date of Submission</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: primary, marginTop: '2px' }}>
              {data.submissionDate ? new Date(data.submissionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : today}
            </div>
          </div>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: primary + '10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: primary + '50' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewBordered({ data, theme, font, institution, customLogo }) {
  const { primary, accent } = theme;
  const ff = font.family;
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div
      id="cover-preview"
      style={{
        width: '794px',
        height: '1123px',
        background: '#fff',
        fontFamily: ff,
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ border: `3px solid ${primary}`, padding: '12px', height: '1075px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        <div style={{ border: `1px solid ${accent}`, padding: '40px 35px', flex: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <LogoBlock institution={institution} customLogo={customLogo} size={80} primary={primary} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: primary, marginBottom: '4px', textTransform: 'uppercase', lineHeight: '1.2' }}>
              {data.institutionName || 'Institution Name'}
            </div>
            <div style={{ fontSize: '13px', color: '#555' }}>
              {data.institutionAddress || 'Institution Address'}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '40px' }}>
            <div style={{ textAlign: 'center', color: accent, fontSize: '12px', letterSpacing: '4px' }}>✦ ✦ ✦</div>

            <div style={{ textAlign: 'center', padding: '24px 16px', background: primary + '04', border: `1px solid ${primary}10`, borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: primary, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '700' }}>Assignment</div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: '#111', lineHeight: '1.25' }}>
                {data.assignmentTitle || 'Assignment Title'}
              </div>
              {(data.subjectName || data.subjectCode) && (
                <div style={{ fontSize: '16px', color: '#444', fontStyle: 'italic', marginTop: '8px' }}>
                  {data.subjectName}{data.subjectCode ? ` (${data.subjectCode})` : ''}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ padding: '18px', border: `1px solid ${primary}10`, borderRadius: '6px', background: '#fafafa' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: primary, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px', borderBottom: `1px solid ${accent}`, paddingBottom: '6px' }}>Submitted By</div>
                {[['Name', data.studentName], ['Roll', data.rollNumber], ['Reg. No.', data.registrationNumber], ['Class', data.classSemester], ['Group', data.groupDepartment], ['Session', data.session]].map(([l, v]) => v ? (
                  <div key={l} style={{ marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: '#666', fontSize: '12px', fontWeight: '600' }}>{l}: </span>
                    <span style={{ fontWeight: '700', color: '#222' }}>{v}</span>
                  </div>
                ) : null)}
              </div>
              <div style={{ padding: '18px', border: `1px solid ${primary}10`, borderRadius: '6px', background: '#fafafa' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: primary, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px', borderBottom: `1px solid ${accent}`, paddingBottom: '6px' }}>Submitted To</div>
                {[['Name', data.teacherName], ['Designation', data.teacherDesignation], ['Department', data.teacherDepartment]].map(([l, v]) => v ? (
                  <div key={l} style={{ marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: '#666', fontSize: '12px', fontWeight: '600' }}>{l}: </span>
                    <span style={{ fontWeight: '700', color: '#222' }}>{v}</span>
                  </div>
                ) : null)}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ textAlign: 'center', color: accent, fontSize: '12px', letterSpacing: '4px', marginBottom: '8px' }}>✦ ✦ ✦</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#777', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: '600' }}>Date of Submission</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: primary, marginTop: '2px' }}>
                {data.submissionDate ? new Date(data.submissionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : today}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function PreviewModern({ data, theme, font, institution, customLogo }) {
  const { primary, accent } = theme;
  const ff = font.family;
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div
      id="cover-preview"
      style={{
        width: '794px',
        height: '1123px',
        background: '#fafafa',
        fontFamily: ff,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ width: '10px', background: primary, flexShrink: 0 }} />
        <div style={{ flex: 1, padding: '50px 45px', display: 'flex', flexDirection: 'column', background: '#fff' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <LogoBlock institution={institution} customLogo={customLogo} size={75} primary={primary} />
            <div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: primary, lineHeight: '1.2', textTransform: 'uppercase' }}>
                {data.institutionName || 'Institution Name'}
              </div>
              <div style={{ fontSize: '13px', color: '#555', marginTop: '2px' }}>
                {data.institutionAddress || 'Institution Address'}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '50px' }}>
            <div>
              <div style={{ display: 'inline-block', background: primary, color: '#fff', padding: '4px 12px', borderRadius: '3px', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
                Assignment
              </div>
              <div style={{ fontSize: '34px', fontWeight: '800', color: '#0a0a0a', lineHeight: '1.2', marginBottom: '10px' }}>
                {data.assignmentTitle || 'Assignment Title'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '30px', height: '2px', background: accent }} />
                <span style={{ fontSize: '16px', color: '#333', fontWeight: '600' }}>
                  {data.subjectName || 'Subject Name'}
                  {data.subjectCode ? ` · ${data.subjectCode}` : ''}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', borderLeft: `4px solid ${primary}` }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: primary, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Submitted By</div>
                {[['Name', data.studentName], ['Roll', data.rollNumber], ['Reg. No.', data.registrationNumber], ['Class', data.classSemester], ['Group', data.groupDepartment], ['Session', data.session]].map(([l, v]) => v ? (
                  <div key={l} style={{ marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: '#777', fontSize: '12px' }}>{l}: </span>
                    <span style={{ fontWeight: '700', color: '#222' }}>{v}</span>
                  </div>
                ) : null)}
              </div>
              <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', borderLeft: `4px solid ${accent}` }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: primary, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Submitted To</div>
                {[['Name', data.teacherName], ['Designation', data.teacherDesignation], ['Department', data.teacherDepartment]].map(([l, v]) => v ? (
                  <div key={l} style={{ marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: '#777', fontSize: '12px' }}>{l}: </span>
                    <span style={{ fontWeight: '700', color: '#222' }}>{v}</span>
                  </div>
                ) : null)}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Date of Submission</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: primary, marginTop: '2px' }}>
                {data.submissionDate ? new Date(data.submissionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : today}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '2px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: primary }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accent }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: primary + '30' }} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: '8px', background: primary }} />
    </div>
  );
}

export default function CoverPreview({ data, template, theme, font, institutionId, customLogo }) {
  const institution = institutions.find(i => i.id === institutionId || i.id === parseInt(institutionId));
  const props = { data, theme, font, institution, customLogo };

  const templates = {
    classic: <PreviewClassic {...props} />,
    split: <PreviewSplit {...props} />,
    bordered: <PreviewBordered {...props} />,
    modern: <PreviewModern {...props} />,
  };

  return templates[template] || templates.classic;
}