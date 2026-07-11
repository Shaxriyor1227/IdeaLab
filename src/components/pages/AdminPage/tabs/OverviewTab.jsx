import { useMemo } from 'react';
import { FiUsers, FiActivity, FiTrendingUp, FiStar, FiClock, FiBarChart2 } from 'react-icons/fi';
import { MdRocketLaunch } from 'react-icons/md';

const INDUSTRY_COLORS = {
  'Technology': '#8b5cf6',
  'FinTech': '#3b82f6',
  'HealthTech': '#10b981',
  'EdTech': '#f59e0b',
  'E-commerce': '#ef4444',
  'SaaS': '#6366f1',
  'Other': '#6b7280',
};

function getColor(industry) {
  return INDUSTRY_COLORS[industry] || '#8b5cf6';
}

export default function OverviewTab({ users, allAnalyses }) {
  const stats = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeUsers = users.filter(u => {
      const lastSeen = u.lastSeen || u.createdAt;
      return lastSeen && new Date(lastSeen) >= sevenDaysAgo;
    }).length;

    const today = new Date().toDateString();
    const todayAnalyses = allAnalyses.filter(a => {
      return a.createdAt && new Date(a.createdAt).toDateString() === today;
    }).length;

    const scores = allAnalyses.map(a => a.result?.viabilityScore || 0).filter(s => s > 0);
    const avgScore = scores.length ? Math.round(scores.reduce((s, c) => s + c, 0) / scores.length) : 0;

    const highPotential = allAnalyses.filter(a => (a.result?.viabilityScore || 0) >= 75).length;
    const highPct = allAnalyses.length ? Math.round((highPotential / allAnalyses.length) * 100) : 0;

    // Industry breakdown
    const industryMap = {};
    allAnalyses.forEach(a => {
      const ind = a.formData?.industry || 'Other';
      industryMap[ind] = (industryMap[ind] || 0) + 1;
    });
    const industries = Object.entries(industryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count, pct: Math.round((count / allAnalyses.length) * 100) }));

    // Recent 5 analyses
    const recentAnalyses = [...allAnalyses]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);

    return { activeUsers, todayAnalyses, avgScore, highPct, highPotential, industries, recentAnalyses };
  }, [users, allAnalyses]);

  const statCards = [
    {
      icon: <FiUsers size={22} />,
      label: 'Jami foydalanuvchilar',
      value: users.length,
      sub: `${stats.activeUsers} ta so'nggi 7 kunda faol`,
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.12)',
    },
    {
      icon: <FiActivity size={22} />,
      label: 'Jami tahlillar',
      value: allAnalyses.length,
      sub: `Bugun ${stats.todayAnalyses} ta yangi`,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.12)',
    },
    {
      icon: <FiStar size={22} />,
      label: "O'rtacha viability score",
      value: stats.avgScore,
      sub: 'Barcha tahlillar bo\'yicha',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.12)',
    },
    {
      icon: <FiTrendingUp size={22} />,
      label: 'Yuqori salohiyat',
      value: `${stats.highPct}%`,
      sub: `${stats.highPotential} ta g'oya (75+ ball)`,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.12)',
    },
    {
      icon: <FiClock size={22} />,
      label: 'Faol foydalanuvchilar',
      value: stats.activeUsers,
      sub: "So'nggi 7 kun ichida",
      color: '#ec4899',
      bg: 'rgba(236,72,153,0.12)',
    },
    {
      icon: <FiBarChart2 size={22} />,
      label: "Bugungi tahlillar",
      value: stats.todayAnalyses,
      sub: "Bugun amalga oshirilgan",
      color: '#06b6d4',
      bg: 'rgba(6,182,212,0.12)',
    },
  ];

  return (
    <div className="adm-overview">
      {/* Stat Grid */}
      <div className="adm-stat-grid">
        {statCards.map((card, i) => (
          <div key={i} className="adm-stat-card" style={{ '--card-accent': card.color }}>
            <div className="adm-stat-icon" style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div className="adm-stat-body">
              <span className="adm-stat-value">{card.value}</span>
              <span className="adm-stat-label">{card.label}</span>
              <span className="adm-stat-sub">{card.sub}</span>
            </div>
            <div className="adm-stat-glow" style={{ background: card.bg }} />
          </div>
        ))}
      </div>

      <div className="adm-overview-bottom">
        {/* Industry Breakdown */}
        <div className="adm-panel">
          <h3 className="adm-panel-title">
            <FiBarChart2 size={18} /> Sohalar bo'yicha taqsimot
          </h3>
          {stats.industries.length === 0 ? (
            <div className="adm-empty-small">Hozircha ma'lumot yo'q</div>
          ) : (
            <div className="adm-industry-list">
              {stats.industries.map((ind) => (
                <div key={ind.name} className="adm-industry-row">
                  <div className="adm-industry-meta">
                    <span className="adm-industry-name">{ind.name}</span>
                    <span className="adm-industry-count">{ind.count} ta</span>
                  </div>
                  <div className="adm-bar-track">
                    <div
                      className="adm-bar-fill"
                      style={{ width: `${ind.pct}%`, background: getColor(ind.name) }}
                    />
                  </div>
                  <span className="adm-industry-pct">{ind.pct}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="adm-panel">
          <h3 className="adm-panel-title">
            <FiClock size={18} /> So'nggi tahlillar
          </h3>
          {stats.recentAnalyses.length === 0 ? (
            <div className="adm-empty-small">
              <MdRocketLaunch size={32} />
              <p>Hozircha tahlillar yo'q</p>
            </div>
          ) : (
            <div className="adm-activity-list">
              {stats.recentAnalyses.map((a, i) => {
                const score = a.result?.viabilityScore || 0;
                const scoreColor = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
                return (
                  <div key={i} className="adm-activity-row">
                    <div className="adm-activity-icon" style={{ color: scoreColor }}>
                      <MdRocketLaunch size={16} />
                    </div>
                    <div className="adm-activity-info">
                      <span className="adm-activity-name">{a.formData?.startupName || 'Nomsiz'}</span>
                      <span className="adm-activity-meta">
                        {a.formData?.industry || '—'} · {a.analyzedAt || '—'}
                      </span>
                    </div>
                    <div
                      className="adm-activity-score"
                      style={{ color: scoreColor, borderColor: scoreColor + '40' }}
                    >
                      {score}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
