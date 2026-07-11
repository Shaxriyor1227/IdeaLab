import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { FiUsers, FiActivity, FiDatabase } from 'react-icons/fi';
import './AdminPage.css';

export default function AdminPage() {
  const { user, isAuth, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalAnalyses: 0 });

  useEffect(() => {
    // If not admin, redirect to home
    if (isAuth !== null && !isAdmin) {
      navigate('/');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const usersSnap = await getDocs(query(collection(db, 'users'), limit(50)));
        const usersList = [];
        let totalAnalyses = 0;

        for (const userDoc of usersSnap.docs) {
          const userData = userDoc.data();
          usersList.push({ id: userDoc.id, ...userData });

          // Count analyses for each user
          const analysesSnap = await getDocs(collection(db, 'users', userDoc.id, 'analyses'));
          totalAnalyses += analysesSnap.size;
        }

        setUsers(usersList);
        setStats({
          totalUsers: usersSnap.size,
          totalAnalyses
        });
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin, isAuth, navigate]);

  if (loading) {
    return <div className="admin-loading">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="admin-subtitle">Welcome back, {user?.name}</p>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon"><FiUsers size={24} /></div>
            <div className="admin-stat-info">
              <span className="admin-stat-value">{stats.totalUsers}</span>
              <span className="admin-stat-label">Total Users</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <FiActivity size={24} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-value">{stats.totalAnalyses}</span>
              <span className="admin-stat-label">Total Analyses</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <FiDatabase size={24} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-value">System</span>
              <span className="admin-stat-label">All Systems Normal</span>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h2 className="admin-section-title">Recent Users</h2>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-avatar">
                          {u.photoURL ? <img src={u.photoURL} alt="avatar" /> : (u.name?.[0] || 'U').toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`admin-badge ${u.role === 'admin' ? 'admin-badge-admin' : 'admin-badge-user'}`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
