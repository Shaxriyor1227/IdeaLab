import { useState, useMemo } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiTrash2, FiShield, FiUser } from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';
import { db } from '../../../../firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

const PAGE_SIZES = [10, 20, 50];

export default function UsersTab({ users, setUsers, userAnalysesCounts }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loadingId, setLoadingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    let list = [...users];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      );
    }
    if (roleFilter !== 'all') {
      list = list.filter(u => (u.role || 'user') === roleFilter);
    }
    return list;
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleRoleToggle = async (u) => {
    const newRole = (u.role || 'user') === 'admin' ? 'user' : 'admin';
    setLoadingId(u.id);
    try {
      await updateDoc(doc(db, 'users', u.id), { role: newRole });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x));
    } catch (err) {
      console.error('Role update error:', err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (userId) => {
    setLoadingId(userId);
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(prev => prev.filter(x => x.id !== userId));
    } catch (err) {
      console.error('Delete user error:', err);
    } finally {
      setLoadingId(null);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="adm-users-tab">
      {/* Toolbar */}
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <FiSearch className="adm-search-icon" size={16} />
          <input
            className="adm-search-input"
            placeholder="Ism yoki email bo'yicha qidirish..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="adm-filters">
          {['all', 'user', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => { setRoleFilter(r); setPage(1); }}
              className={`adm-filter-btn ${roleFilter === r ? 'adm-filter-btn--active' : ''}`}
            >
              {r === 'all' ? 'Barchasi' : r === 'admin' ? 'Admin' : "Foydalanuvchi"}
            </button>
          ))}
        </div>
        <div className="adm-page-size">
          <span>Ko'rsatish:</span>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="adm-select"
          >
            {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Stats summary */}
      <div className="adm-users-meta">
        <span>{filtered.length} ta foydalanuvchi topildi</span>
        <span>{users.filter(u => u.role === 'admin').length} ta admin</span>
      </div>

      {/* Table */}
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Foydalanuvchi</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Tahlillar</th>
              <th>Ro'yxatdan o'tgan</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="adm-table-empty">Hech narsa topilmadi</td>
              </tr>
            ) : paginated.map((u, idx) => {
              const isAdmin = (u.role || 'user') === 'admin';
              const analysesCount = userAnalysesCounts?.[u.id] || 0;
              return (
                <tr key={u.id} className={`adm-table-row ${isAdmin ? 'adm-table-row--admin' : ''}`}>
                  <td className="adm-table-num">{(page - 1) * pageSize + idx + 1}</td>
                  <td>
                    <div className="adm-user-cell">
                      <div className="adm-avatar">
                        {u.photoURL
                          ? <img src={u.photoURL} alt="av" />
                          : <span>{(u.name?.[0] || 'U').toUpperCase()}</span>
                        }
                      </div>
                      <span className="adm-user-name">{u.name || 'Nomsiz'}</span>
                    </div>
                  </td>
                  <td className="adm-email">{u.email || '—'}</td>
                  <td>
                    <span className={`adm-role-badge ${isAdmin ? 'adm-role-badge--admin' : 'adm-role-badge--user'}`}>
                      {isAdmin ? <MdAdminPanelSettings size={13} /> : <FiUser size={13} />}
                      {isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="adm-count">{analysesCount}</td>
                  <td className="adm-date">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('uz-UZ') : '—'}</td>
                  <td>
                    <div className="adm-actions">
                      <button
                        className={`adm-action-btn adm-action-role ${isAdmin ? 'adm-action-role--admin' : ''}`}
                        onClick={() => handleRoleToggle(u)}
                        disabled={loadingId === u.id}
                        title={isAdmin ? "Adminlikni olib tashlash" : "Admin qilish"}
                      >
                        <FiShield size={14} />
                        {loadingId === u.id ? '...' : isAdmin ? "Admindan chiqar" : "Admin qil"}
                      </button>
                      <button
                        className="adm-action-btn adm-action-delete"
                        onClick={() => setConfirmDelete(u)}
                        disabled={loadingId === u.id}
                        title="O'chirish"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="adm-pagination">
        <button
          className="adm-page-btn"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <FiChevronLeft size={16} />
        </button>
        <div className="adm-page-nums">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
            .reduce((acc, n, i, arr) => {
              if (i > 0 && n - arr[i - 1] > 1) acc.push('...');
              acc.push(n);
              return acc;
            }, [])
            .map((n, i) =>
              n === '...'
                ? <span key={`d${i}`} className="adm-page-dots">…</span>
                : <button
                    key={n}
                    className={`adm-page-num ${page === n ? 'adm-page-num--active' : ''}`}
                    onClick={() => setPage(n)}
                  >{n}</button>
            )
          }
        </div>
        <button
          className="adm-page-btn"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          <FiChevronRight size={16} />
        </button>
        <span className="adm-page-info">{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} / {filtered.length}</span>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="adm-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-icon">
              <FiTrash2 size={28} />
            </div>
            <h3>Foydalanuvchini o'chirish</h3>
            <p>
              <strong>{confirmDelete.name || confirmDelete.email}</strong> ni o'chirishni tasdiqlaysizmi?
              Bu amalni qaytarib bo'lmaydi.
            </p>
            <div className="adm-modal-actions">
              <button className="adm-modal-cancel" onClick={() => setConfirmDelete(null)}>Bekor qilish</button>
              <button
                className="adm-modal-confirm"
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={loadingId === confirmDelete.id}
              >
                {loadingId === confirmDelete.id ? 'O\'chirilmoqda...' : "O'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
