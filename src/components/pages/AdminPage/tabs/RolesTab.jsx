import { useState, useMemo } from 'react';
import { FiSearch, FiShield, FiUser, FiAlertTriangle } from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';
import { db } from '../../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function RolesTab({ users, setUsers }) {
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [confirmRole, setConfirmRole] = useState(null); // { user, newRole }
  const [successMsg, setSuccessMsg] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return users.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleRoleChange = async () => {
    if (!confirmRole) return;
    const { user: u, newRole } = confirmRole;
    setLoadingId(u.id);
    try {
      await updateDoc(doc(db, 'users', u.id), { role: newRole });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x));
      setSuccessMsg(`${u.name || u.email} — ${newRole === 'admin' ? "Admin tayinlandi ✓" : "Adminlikdan chiqarildi ✓"}`);
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      console.error('Role update error:', err);
    } finally {
      setLoadingId(null);
      setConfirmRole(null);
    }
  };

  return (
    <div className="adm-roles-tab">
      {/* Warning banner */}
      <div className="adm-roles-warning">
        <FiAlertTriangle size={18} />
        <div>
          <strong>Ehtiyot bo'ling!</strong> Bu bo'lim orqali foydalanuvchilarga Admin huquqini berasiz.
          Admin barcha ma'lumotlarga kirish imkoniga ega bo'ladi. Faqat ishonchli odamlarni tayinlang.
        </div>
      </div>

      {/* Search */}
      <div className="adm-roles-search-section">
        <h3 className="adm-roles-heading">Foydalanuvchini qidirish</h3>
        <p className="adm-roles-desc">Ism yoki email orqali foydalanuvchini toping va admin huquqini boshqaring.</p>
        <div className="adm-roles-search-wrap">
          <FiSearch size={18} className="adm-roles-search-icon" />
          <input
            className="adm-roles-search-input"
            placeholder="Ism yoki email kiriting..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="adm-roles-success">
          <FiShield size={16} /> {successMsg}
        </div>
      )}

      {/* Results */}
      {search.trim() && (
        <div className="adm-roles-results">
          {filtered.length === 0 ? (
            <div className="adm-roles-empty">
              Hech qanday foydalanuvchi topilmadi. Boshqa so'z kiriting.
            </div>
          ) : (
            filtered.map(u => {
              const isAdmin = (u.role || 'user') === 'admin';
              return (
                <div key={u.id} className={`adm-role-card ${isAdmin ? 'adm-role-card--admin' : ''}`}>
                  <div className="adm-role-card-left">
                    <div className={`adm-avatar ${isAdmin ? 'adm-avatar--admin' : ''}`}>
                      {u.photoURL
                        ? <img src={u.photoURL} alt="av" />
                        : <span>{(u.name?.[0] || 'U').toUpperCase()}</span>
                      }
                    </div>
                    <div className="adm-role-card-info">
                      <span className="adm-role-card-name">{u.name || 'Nomsiz'}</span>
                      <span className="adm-role-card-email">{u.email}</span>
                    </div>
                    <span className={`adm-role-badge ${isAdmin ? 'adm-role-badge--admin' : 'adm-role-badge--user'}`}>
                      {isAdmin ? <MdAdminPanelSettings size={13} /> : <FiUser size={13} />}
                      {isAdmin ? 'Admin' : 'User'}
                    </span>
                  </div>
                  <button
                    className={`adm-role-action-btn ${isAdmin ? 'adm-role-action-btn--remove' : 'adm-role-action-btn--grant'}`}
                    onClick={() => setConfirmRole({ user: u, newRole: isAdmin ? 'user' : 'admin' })}
                    disabled={loadingId === u.id}
                  >
                    <FiShield size={15} />
                    {loadingId === u.id ? 'Bajarilmoqda...' : isAdmin ? 'Adminlikdan chiqarish' : 'Admin tayinlash'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {!search.trim() && (
        <div className="adm-roles-placeholder">
          <FiShield size={48} />
          <p>Foydalanuvchini topish uchun yuqoridagi qidiruv maydoniga ism yoki emailini kiriting.</p>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmRole && (
        <div className="adm-modal-overlay" onClick={() => setConfirmRole(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className={`adm-modal-icon ${confirmRole.newRole === 'admin' ? 'adm-modal-icon--grant' : ''}`}>
              <FiShield size={28} />
            </div>
            <h3>
              {confirmRole.newRole === 'admin' ? 'Admin tayinlash' : 'Adminlikdan chiqarish'}
            </h3>
            <p>
              <strong>{confirmRole.user.name || confirmRole.user.email}</strong>{' '}
              {confirmRole.newRole === 'admin'
                ? "ni Admin sifatida tayinlashni tasdiqlaysizmi? U barcha admin funksiyalariga kirish imkoniga ega bo'ladi."
                : "ni Adminlikdan chiqarishni tasdiqlaysizmi? U oddiy foydalanuvchiga aylanadi."}
            </p>
            <div className="adm-modal-actions">
              <button className="adm-modal-cancel" onClick={() => setConfirmRole(null)}>Bekor qilish</button>
              <button
                className={`adm-modal-confirm ${confirmRole.newRole === 'admin' ? 'adm-modal-confirm--grant' : ''}`}
                onClick={handleRoleChange}
                disabled={loadingId === confirmRole.user.id}
              >
                {loadingId === confirmRole.user.id ? 'Bajarilmoqda...' : 'Tasdiqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
