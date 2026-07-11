import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FiGrid, FiUsers, FiBarChart2, FiDownload, FiGlobe, FiLogOut, FiSettings, FiChevronUp } from 'react-icons/fi';
import { MdRocketLaunch, MdAdminPanelSettings } from 'react-icons/md';

import OverviewTab from './tabs/OverviewTab';
import UsersTab from './tabs/UsersTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import ExportTab from './tabs/ExportTab';
import RolesTab from './tabs/RolesTab';
import './AdminPage.css';

const TABS = [
  { key: 'overview', label: 'Umumiy ko\'rinish', icon: <FiGrid size={18} /> },
  { key: 'users', label: 'Foydalanuvchilar', icon: <FiUsers size={18} /> },
  { key: 'analytics', label: 'Tahlil', icon: <FiBarChart2 size={18} /> },
  { key: 'export', label: 'Eksport / PDF', icon: <FiDownload size={18} /> },
  { key: 'roles', label: 'Huquqlar', icon: <FiSettings size={18} />, secret: true },
];

export default function AdminPage() {
  const { user, isAuth, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [profileOpen, setProfileOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [allAnalyses, setAllAnalyses] = useState([]);
  const [userAnalysesCounts, setUserAnalysesCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    if (isAuth !== null && !isAdmin) {
      navigate('/');
      return;
    }

    const fetchAdminData = async () => {
      try {
        setLoadProgress(10);

        // 1. Fetch all users
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersList = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setUsers(usersList);
        setLoadProgress(30);

        // 2. Fetch all analyses for every user (optimized: parallel)
        const analysesResults = await Promise.all(
          usersList.map(async (u) => {
            const snap = await getDocs(collection(db, 'users', u.id, 'analyses'));
            const docs = snap.docs.map(d => ({ id: d.id, userId: u.id, userName: u.name, ...d.data() }));
            return { userId: u.id, count: snap.size, docs };
          })
        );
        setLoadProgress(80);

        const countsMap = {};
        const allDocs = [];
        analysesResults.forEach(r => {
          countsMap[r.userId] = r.count;
          allDocs.push(...r.docs);
        });

        setUserAnalysesCounts(countsMap);
        setAllAnalyses(allDocs);
        setLoadProgress(100);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin, isAuth, navigate]);

  // Loading screen
  if (loading) {
    return (
      <div className="adm-loading-screen">
        <div className="adm-loading-inner">
          <div className="adm-loading-logo">
            <MdRocketLaunch size={40} />
          </div>
          <h2>Admin Panel yuklanmoqda</h2>
          <div className="adm-progress-bar">
            <div className="adm-progress-fill" style={{ width: `${loadProgress}%` }} />
          </div>
          <p className="adm-loading-pct">{loadProgress}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-page">
      {/* ===== Sidebar ===== */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-top">
          <div className="adm-sidebar-logo" onClick={() => setActiveTab('overview')}>
            <MdRocketLaunch size={22} />
            <span>IdeaLab</span>
          </div>
          <div className="adm-sidebar-badge">
            <MdAdminPanelSettings size={14} />
            Admin Panel
          </div>
        </div>

        <nav className="adm-sidebar-nav">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`adm-nav-btn ${activeTab === tab.key ? 'adm-nav-btn--active' : ''} ${tab.secret ? 'adm-nav-btn--secret' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="adm-nav-icon">{tab.icon}</span>
              <span className="adm-nav-label">{tab.label}</span>
              {activeTab === tab.key && <div className="adm-nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <div 
            className="adm-sidebar-user" 
            onClick={() => setProfileOpen(!profileOpen)}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <div className="adm-sidebar-avatar">
              {user?.photoURL
                ? <img src={user.photoURL} alt="av" />
                : <span>{(user?.name?.[0] || 'A').toUpperCase()}</span>
              }
            </div>
            <div className="adm-sidebar-user-info">
              <span className="adm-sidebar-user-name">{user?.name}</span>
              <span className="adm-sidebar-user-role">Admin</span>
            </div>
            <FiChevronUp 
              size={16} 
              style={{ 
                marginLeft: 'auto', 
                color: '#6b7280', 
                transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }} 
            />

            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="adm-profile-dropdown" onClick={(e) => e.stopPropagation()}>
                <button className="adm-dropdown-item" onClick={() => navigate('/')}>
                  <FiGlobe size={16} />
                  <span>Asosiy saytga qaytish</span>
                </button>
                <button className="adm-dropdown-item" onClick={() => navigate('/settings')}>
                  <FiSettings size={16} />
                  <span>Sozlamalar</span>
                </button>
                <div className="adm-dropdown-divider" />
                <button 
                  className="adm-dropdown-item adm-dropdown-item--danger" 
                  onClick={() => {
                    logout();
                    navigate('/'); 
                  }}
                >
                  <FiLogOut size={16} />
                  <span>Chiqish</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="adm-main">
        {/* Header */}
        <div className="adm-main-header">
          <div className="adm-main-header-left">
            <h1 className="adm-main-title">{TABS.find(t => t.key === activeTab)?.label}</h1>
            <p className="adm-main-subtitle">
              {activeTab === 'overview' && `${users.length} ta foydalanuvchi · ${allAnalyses.length} ta tahlil`}
              {activeTab === 'users' && `Barcha foydalanuvchilarni boshqarish`}
              {activeTab === 'analytics' && `Platforma statistikasi va ko'rsatkichlari`}
              {activeTab === 'export' && `Hisobotlarni PDF sifatida eksport qilish`}
              {activeTab === 'roles' && `Foydalanuvchilarga admin huquqini berish yoki olib tashlash`}
            </p>
          </div>
          <div className="adm-header-stats">
            <div className="adm-header-stat">
              <span className="adm-header-stat-val">{users.length}</span>
              <span className="adm-header-stat-lbl">Foydalanuvchilar</span>
            </div>
            <div className="adm-header-divider" />
            <div className="adm-header-stat">
              <span className="adm-header-stat-val">{allAnalyses.length}</span>
              <span className="adm-header-stat-lbl">Tahlillar</span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="adm-tab-content">
          {activeTab === 'overview' && (
            <OverviewTab users={users} allAnalyses={allAnalyses} />
          )}
          {activeTab === 'users' && (
            <UsersTab
              users={users}
              setUsers={setUsers}
              userAnalysesCounts={userAnalysesCounts}
            />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsTab allAnalyses={allAnalyses} />
          )}
          {activeTab === 'export' && (
            <ExportTab
              users={users}
              allAnalyses={allAnalyses}
              userAnalysesCounts={userAnalysesCounts}
            />
          )}
          {activeTab === 'roles' && (
            <RolesTab users={users} setUsers={setUsers} />
          )}
        </div>
      </main>
    </div>
  );
}
