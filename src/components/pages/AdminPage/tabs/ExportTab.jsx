import { useState } from 'react';
import { FiDownload, FiFileText, FiUsers, FiBarChart2, FiCheckCircle } from 'react-icons/fi';
import { MdRocketLaunch } from 'react-icons/md';

function getScoreLabel(score) {
  if (score >= 90) return "A'lo";
  if (score >= 75) return 'Yuqori';
  if (score >= 50) return "O'rtacha";
  if (score >= 25) return 'Past';
  return 'Juda past';
}

function getScoreColor(score) {
  if (score >= 75) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('uz-UZ');
}

export default function ExportTab({ users, allAnalyses, userAnalysesCounts }) {
  const [exportType, setExportType] = useState('users'); // 'users' | 'analyses' | 'summary'
  const [printing, setPrinting] = useState(false);

  const avgScore = allAnalyses.length
    ? Math.round(allAnalyses.reduce((s, a) => s + (a.result?.viabilityScore || 0), 0) / allAnalyses.length)
    : 0;

  const highPotential = allAnalyses.filter(a => (a.result?.viabilityScore || 0) >= 75).length;

  const industryMap = {};
  allAnalyses.forEach(a => {
    const ind = a.formData?.industry || 'Other';
    industryMap[ind] = (industryMap[ind] || 0) + 1;
  });
  const topIndustry = Object.entries(industryMap).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 300);
  };

  return (
    <div className="adm-export-tab">
      {/* Export Type Selector */}
      <div className="adm-export-selector">
        <h3 className="adm-export-heading">Eksport turini tanlang</h3>
        <div className="adm-export-types">
          {[
            { key: 'summary', icon: <FiBarChart2 size={22} />, label: 'Umumiy hisobot', desc: 'Platforma statistikasi va ko\'rsatkichlar' },
            { key: 'users', icon: <FiUsers size={22} />, label: 'Foydalanuvchilar', desc: 'Barcha foydalanuvchilar ro\'yxati' },
            { key: 'analyses', icon: <MdRocketLaunch size={22} />, label: 'Tahlillar', desc: 'Barcha tahlillar ro\'yxati' },
          ].map(t => (
            <button
              key={t.key}
              className={`adm-export-type-card ${exportType === t.key ? 'adm-export-type-card--active' : ''}`}
              onClick={() => setExportType(t.key)}
            >
              <div className="adm-export-type-icon">{t.icon}</div>
              <div className="adm-export-type-text">
                <span className="adm-export-type-label">{t.label}</span>
                <span className="adm-export-type-desc">{t.desc}</span>
              </div>
              {exportType === t.key && <FiCheckCircle className="adm-export-type-check" size={18} />}
            </button>
          ))}
        </div>

        <button
          className="adm-export-pdf-btn"
          onClick={handlePrint}
          disabled={printing}
        >
          <FiDownload size={18} />
          {printing ? 'Tayyorlanmoqda...' : 'PDF sifatida yuklab olish'}
        </button>
      </div>

      {/* ====== PRINT AREA ====== */}
      <div className="adm-print-area" id="adm-print-area">

        {/* Summary Report */}
        {exportType === 'summary' && (
          <div className="adm-pdf-doc">
            <div className="adm-pdf-header">
              <div className="adm-pdf-logo">
                <MdRocketLaunch size={28} />
                <span>IdeaLab</span>
              </div>
              <div className="adm-pdf-meta">
                <span className="adm-pdf-title">Admin Umumiy Hisobot</span>
                <span className="adm-pdf-date">Sana: {new Date().toLocaleDateString('uz-UZ')}</span>
              </div>
            </div>

            <div className="adm-pdf-divider" />

            <h2 className="adm-pdf-section-title">Platform Ko'rsatkichlari</h2>
            <div className="adm-pdf-kpi-grid">
              {[
                { label: 'Jami foydalanuvchilar', value: users.length },
                { label: 'Jami tahlillar', value: allAnalyses.length },
                { label: "O'rtacha viability score", value: avgScore },
                { label: 'Yuqori salohiyat (75+)', value: highPotential },
                { label: 'Adminlar soni', value: users.filter(u => u.role === 'admin').length },
                { label: 'Eng mashhur soha', value: topIndustry },
              ].map(k => (
                <div key={k.label} className="adm-pdf-kpi">
                  <span className="adm-pdf-kpi-val">{k.value}</span>
                  <span className="adm-pdf-kpi-lbl">{k.label}</span>
                </div>
              ))}
            </div>

            <div className="adm-pdf-divider" />
            <h2 className="adm-pdf-section-title">Sohalar bo'yicha taqsimot</h2>
            <table className="adm-pdf-table">
              <thead>
                <tr>
                  <th>Soha</th>
                  <th>Tahlillar soni</th>
                  <th>Ulushi (%)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(industryMap)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, count]) => (
                    <tr key={name}>
                      <td>{name}</td>
                      <td>{count}</td>
                      <td>{Math.round((count / allAnalyses.length) * 100)}%</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>

            <div className="adm-pdf-footer">
              <span>IdeaLab Admin Panel — Maxfiy hujjat</span>
              <span>{new Date().toISOString()}</span>
            </div>
          </div>
        )}

        {/* Users Report */}
        {exportType === 'users' && (
          <div className="adm-pdf-doc">
            <div className="adm-pdf-header">
              <div className="adm-pdf-logo">
                <MdRocketLaunch size={28} />
                <span>IdeaLab</span>
              </div>
              <div className="adm-pdf-meta">
                <span className="adm-pdf-title">Foydalanuvchilar Hisoboti</span>
                <span className="adm-pdf-date">Sana: {new Date().toLocaleDateString('uz-UZ')} · Jami: {users.length} ta</span>
              </div>
            </div>
            <div className="adm-pdf-divider" />
            <table className="adm-pdf-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ism</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Tahlillar</th>
                  <th>Ro'yxatdan o'tgan</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id}>
                    <td>{i + 1}</td>
                    <td>{u.name || '—'}</td>
                    <td>{u.email || '—'}</td>
                    <td>{u.role || 'user'}</td>
                    <td>{userAnalysesCounts?.[u.id] || 0}</td>
                    <td>{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="adm-pdf-footer">
              <span>IdeaLab Admin Panel — Maxfiy hujjat</span>
              <span>{new Date().toISOString()}</span>
            </div>
          </div>
        )}

        {/* Analyses Report */}
        {exportType === 'analyses' && (
          <div className="adm-pdf-doc">
            <div className="adm-pdf-header">
              <div className="adm-pdf-logo">
                <MdRocketLaunch size={28} />
                <span>IdeaLab</span>
              </div>
              <div className="adm-pdf-meta">
                <span className="adm-pdf-title">Tahlillar Hisoboti</span>
                <span className="adm-pdf-date">Sana: {new Date().toLocaleDateString('uz-UZ')} · Jami: {allAnalyses.length} ta</span>
              </div>
            </div>
            <div className="adm-pdf-divider" />
            <table className="adm-pdf-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Startap nomi</th>
                  <th>Soha</th>
                  <th>Ball</th>
                  <th>Daraja</th>
                  <th>Bozor</th>
                  <th>Raqobat</th>
                  <th>Sana</th>
                </tr>
              </thead>
              <tbody>
                {[...allAnalyses]
                  .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                  .map((a, i) => {
                    const score = a.result?.viabilityScore || 0;
                    return (
                      <tr key={a.id || i}>
                        <td>{i + 1}</td>
                        <td>{a.formData?.startupName || '—'}</td>
                        <td>{a.formData?.industry || '—'}</td>
                        <td style={{ color: getScoreColor(score), fontWeight: 700 }}>{score}</td>
                        <td>{getScoreLabel(score)}</td>
                        <td>{a.result?.marketSize || '—'}</td>
                        <td>{a.result?.competition || '—'}</td>
                        <td>{a.analyzedAt || formatDate(a.createdAt)}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
            <div className="adm-pdf-footer">
              <span>IdeaLab Admin Panel — Maxfiy hujjat</span>
              <span>{new Date().toISOString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
