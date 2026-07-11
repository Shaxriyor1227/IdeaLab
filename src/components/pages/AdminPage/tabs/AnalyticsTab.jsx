import { useMemo } from 'react';
import { FiTrendingUp, FiBarChart2, FiPieChart, FiTarget } from 'react-icons/fi';

const SCORE_BANDS = [
  { label: 'Juda past (0–24)', min: 0, max: 25, color: '#ef4444' },
  { label: "Past (25–49)", min: 25, max: 50, color: '#f97316' },
  { label: "O'rtacha (50–74)", min: 50, max: 75, color: '#f59e0b' },
  { label: "Yuqori (75–89)", min: 75, max: 90, color: '#10b981' },
  { label: "A'lo (90–100)", min: 90, max: 101, color: '#8b5cf6' },
];

const INDUSTRY_COLORS = [
  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899',
  '#06b6d4', '#84cc16', '#f97316', '#6366f1',
];

export default function AnalyticsTab({ allAnalyses }) {
  const data = useMemo(() => {
    // Score bands
    const bands = SCORE_BANDS.map(b => ({
      ...b,
      count: allAnalyses.filter(a => {
        const s = a.result?.viabilityScore || 0;
        return s >= b.min && s < b.max;
      }).length,
    }));
    const maxBand = Math.max(...bands.map(b => b.count), 1);

    // Industry breakdown
    const industryMap = {};
    allAnalyses.forEach(a => {
      const ind = a.formData?.industry || 'Other';
      industryMap[ind] = (industryMap[ind] || 0) + 1;
    });
    const industries = Object.entries(industryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count], i) => ({
        name,
        count,
        pct: allAnalyses.length ? Math.round((count / allAnalyses.length) * 100) : 0,
        color: INDUSTRY_COLORS[i % INDUSTRY_COLORS.length],
      }));
    const maxIndustry = Math.max(...industries.map(i => i.count), 1);

    // Competition breakdown
    const compMap = {};
    allAnalyses.forEach(a => {
      const c = a.result?.competition || 'Unknown';
      compMap[c] = (compMap[c] || 0) + 1;
    });
    const competitions = Object.entries(compMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        count,
        pct: allAnalyses.length ? Math.round((count / allAnalyses.length) * 100) : 0,
      }));

    // Market size breakdown
    const marketMap = {};
    allAnalyses.forEach(a => {
      const m = a.result?.marketSize || 'Unknown';
      marketMap[m] = (marketMap[m] || 0) + 1;
    });
    const markets = Object.entries(marketMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        count,
        pct: allAnalyses.length ? Math.round((count / allAnalyses.length) * 100) : 0,
      }));

    // Overall stats
    const scores = allAnalyses.map(a => a.result?.viabilityScore || 0).filter(s => s > 0);
    const avgScore = scores.length ? Math.round(scores.reduce((s, c) => s + c, 0) / scores.length) : 0;
    const minScore = scores.length ? Math.min(...scores) : 0;
    const maxScore = scores.length ? Math.max(...scores) : 0;

    return { bands, maxBand, industries, maxIndustry, competitions, markets, avgScore, minScore, maxScore };
  }, [allAnalyses]);

  if (allAnalyses.length === 0) {
    return (
      <div className="adm-analytics-empty">
        <FiBarChart2 size={48} />
        <h3>Hozircha ma'lumot yo'q</h3>
        <p>Tahlillar amalga oshirilgach, bu yerda statistika ko'rinadi.</p>
      </div>
    );
  }

  return (
    <div className="adm-analytics">
      {/* Top Stats */}
      <div className="adm-analytics-top">
        <div className="adm-analytics-kpi">
          <span className="adm-kpi-icon" style={{ color: '#8b5cf6' }}><FiTarget size={20} /></span>
          <span className="adm-kpi-value">{data.avgScore}</span>
          <span className="adm-kpi-label">O'rtacha ball</span>
        </div>
        <div className="adm-analytics-kpi">
          <span className="adm-kpi-icon" style={{ color: '#10b981' }}><FiTrendingUp size={20} /></span>
          <span className="adm-kpi-value">{data.maxScore}</span>
          <span className="adm-kpi-label">Eng yuqori ball</span>
        </div>
        <div className="adm-analytics-kpi">
          <span className="adm-kpi-icon" style={{ color: '#f59e0b' }}><FiBarChart2 size={20} /></span>
          <span className="adm-kpi-value">{allAnalyses.length}</span>
          <span className="adm-kpi-label">Jami tahlillar</span>
        </div>
        <div className="adm-analytics-kpi">
          <span className="adm-kpi-icon" style={{ color: '#3b82f6' }}><FiPieChart size={20} /></span>
          <span className="adm-kpi-value">{data.minScore}</span>
          <span className="adm-kpi-label">Eng past ball</span>
        </div>
      </div>

      <div className="adm-analytics-grid">
        {/* Viability Score Distribution */}
        <div className="adm-analytics-panel">
          <h3 className="adm-panel-title"><FiBarChart2 size={18} /> Viability Score taqsimoti</h3>
          <div className="adm-score-bars">
            {data.bands.map((b) => (
              <div key={b.label} className="adm-score-bar-row">
                <span className="adm-score-bar-label">{b.label}</span>
                <div className="adm-score-bar-track">
                  <div
                    className="adm-score-bar-fill"
                    style={{
                      width: `${(b.count / data.maxBand) * 100}%`,
                      background: b.color,
                    }}
                  />
                </div>
                <span className="adm-score-bar-count" style={{ color: b.color }}>{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Breakdown */}
        <div className="adm-analytics-panel">
          <h3 className="adm-panel-title"><FiPieChart size={18} /> Sohalar taqsimoti</h3>
          <div className="adm-industry-bars">
            {data.industries.map((ind) => (
              <div key={ind.name} className="adm-score-bar-row">
                <span className="adm-score-bar-label">{ind.name}</span>
                <div className="adm-score-bar-track">
                  <div
                    className="adm-score-bar-fill"
                    style={{
                      width: `${(ind.count / data.maxIndustry) * 100}%`,
                      background: ind.color,
                    }}
                  />
                </div>
                <span className="adm-score-bar-count" style={{ color: ind.color }}>{ind.count} ({ind.pct}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Competition Distribution */}
        <div className="adm-analytics-panel">
          <h3 className="adm-panel-title"><FiTrendingUp size={18} /> Raqobat darajasi</h3>
          {data.competitions.length === 0 ? (
            <div className="adm-empty-small">Ma'lumot yo'q</div>
          ) : (
            <div className="adm-pill-list">
              {data.competitions.map((c, i) => (
                <div key={c.name} className="adm-comp-row">
                  <div className="adm-comp-meta">
                    <span className="adm-comp-dot" style={{ background: INDUSTRY_COLORS[i] }} />
                    <span className="adm-comp-name">{c.name}</span>
                  </div>
                  <div className="adm-comp-bar-wrap">
                    <div className="adm-score-bar-track">
                      <div
                        className="adm-score-bar-fill"
                        style={{ width: `${c.pct}%`, background: INDUSTRY_COLORS[i] }}
                      />
                    </div>
                  </div>
                  <span className="adm-comp-pct">{c.pct}%</span>
                  <span className="adm-comp-count">({c.count})</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Market Size Distribution */}
        <div className="adm-analytics-panel">
          <h3 className="adm-panel-title"><FiTarget size={18} /> Bozor hajmi</h3>
          {data.markets.length === 0 ? (
            <div className="adm-empty-small">Ma'lumot yo'q</div>
          ) : (
            <div className="adm-pill-list">
              {data.markets.map((m, i) => (
                <div key={m.name} className="adm-comp-row">
                  <div className="adm-comp-meta">
                    <span className="adm-comp-dot" style={{ background: INDUSTRY_COLORS[i + 3] }} />
                    <span className="adm-comp-name">{m.name}</span>
                  </div>
                  <div className="adm-comp-bar-wrap">
                    <div className="adm-score-bar-track">
                      <div
                        className="adm-score-bar-fill"
                        style={{ width: `${m.pct}%`, background: INDUSTRY_COLORS[i + 3] }}
                      />
                    </div>
                  </div>
                  <span className="adm-comp-pct">{m.pct}%</span>
                  <span className="adm-comp-count">({m.count})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
