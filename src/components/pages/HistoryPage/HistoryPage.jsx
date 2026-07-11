import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineTrash } from "react-icons/hi";
import { MdRocketLaunch, MdTrendingUp, MdOutlineHistory } from "react-icons/md";
import { RiSparklingLine } from "react-icons/ri";
import { db } from "../../../firebase";
import { collection, doc, deleteDoc, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import Loader from "../../Loader/Loader";
import "./HistoryPage.css";

export default function HistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchHistory = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users", user.uid, "analyses"));
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setHistory(items);
      } catch (error) {
        console.error("Error fetching analysis history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
  };

  const confirmDeleteAction = async () => {
    if (!user?.uid || !itemToDelete) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "analyses", itemToDelete));
      setHistory(prev => prev.filter(item => item.id !== itemToDelete));
    } catch (err) {
      console.error("Error deleting analysis:", err);
    } finally {
      setItemToDelete(null);
    }
  };

  const handleView = (item) => {
    navigate("/results", { state: item });
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "#10B981";
    if (score >= 50) return "#F59E0B";
    return "#EF4444";
  };

  const stats = useMemo(() => {
    if (!history.length) return { highPotential: 0, avgViability: 0 };
    const highPotential = history.filter(h => h.result?.viabilityScore >= 75).length;
    const totalScore = history.reduce((acc, h) => acc + (h.result?.viabilityScore || 0), 0);
    const avgViability = Math.round(totalScore / history.length);
    return { highPotential, avgViability };
  }, [history]);

  return (
    <div className="hp-page">
      <div className="hp-container">

        {/* Header */}
        <div className="hp-header">
          <div className="hp-header-left">
            <div className="hp-title-row">
              <MdOutlineHistory size={32} className="hp-title-icon" />
              <h1 className="hp-title">{t("analysisHistory")}</h1>
            </div>
            <p className="hp-subtitle">{t("historySubtitle")}</p>
          </div>
          <button className="hp-new-btn" onClick={() => navigate("/analyze")}>
            <RiSparklingLine size={16} /> {t("newAnalysis")}
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <Loader fullScreen={false} message={t("loadingHistory") || "Tarix yuklanmoqda..."} />
          </div>
        ) : (
          <>
            {/* Stats Row */}
            {history.length > 0 && (
              <div className="hp-stats-row">
                <div className="hp-stat-card">
                  <span className="hp-stat-value">{history.length}</span>
                  <span className="hp-stat-label">{t("totalAnalyses")}</span>
                </div>
                <div className="hp-stat-card">
                  <span className="hp-stat-value" style={{ color: "#10B981" }}>
                    {stats.highPotential}
                  </span>
                  <span className="hp-stat-label">{t("highPotential")}</span>
                </div>
                <div className="hp-stat-card">
                  <span className="hp-stat-value" style={{ color: "#7C3AED" }}>
                    {stats.avgViability}
                  </span>
                  <span className="hp-stat-label">{t("avgViability")}</span>
                </div>
              </div>
            )}

            {/* History Grid or Empty State */}
            {history.length === 0 ? (
              <div className="hp-empty">
                <div className="hp-empty-icon">
                  <MdRocketLaunch size={48} />
                </div>
                <h2 className="hp-empty-title">{t("noAnalysesYet")}</h2>
                <p className="hp-empty-desc">{t("noAnalysesDesc")}</p>
                <button className="hp-new-btn" onClick={() => navigate("/analyze")}>
                  <RiSparklingLine size={16} /> {t("startFirstAnalysis")}
                </button>
              </div>
            ) : (
              <div className="hp-grid">
                {history.map((item) => (
                  <div key={item.id} className="hp-card">
                    {/* Card Top */}
                    <div className="hp-card-top">
                      <div className="hp-card-info">
                        <h3 className="hp-card-title">{item.formData.startupName}</h3>
                        <p className="hp-card-oneliner">{item.formData.oneLiner || item.formData.industry}</p>
                      </div>
                      <div
                        className="hp-score-ring"
                        style={{ "--score-color": getScoreColor(item.result?.viabilityScore || 0) }}
                      >
                        <span className="hp-score-num">{item.result?.viabilityScore || 0}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="hp-card-tags">
                      {item.formData.industry && (
                        <span className="hp-tag">{item.formData.industry}</span>
                      )}
                      <span
                        className="hp-tag-badge"
                        style={{ 
                          color: getScoreColor(item.result?.viabilityScore || 0), 
                          borderColor: getScoreColor(item.result?.viabilityScore || 0) + "40" 
                        }}
                      >
                        {item.result?.viabilityLabel}
                      </span>
                    </div>

                    {/* Quick Metrics */}
                    <div className="hp-card-metrics">
                      <div className="hp-mini-metric">
                        <span className="hp-mini-label">{t("marketSize") || "Market"}</span>
                        <span className="hp-mini-value">{item.result?.marketSize}</span>
                      </div>
                      <div className="hp-mini-metric">
                        <span className="hp-mini-label">{t("competition") || "Competition"}</span>
                        <span className="hp-mini-value">{item.result?.competition}</span>
                      </div>
                      <div className="hp-mini-metric">
                        <span className="hp-mini-label">{t("trendScore") || "Trend"}</span>
                        <span className="hp-mini-value">{item.result?.trendScore}</span>
                      </div>
                    </div>

                    {/* Date */}
                    <p className="hp-card-date">{t("analyzedDate")}: {item.analyzedAt}</p>

                    {/* Actions */}
                    <div className="hp-card-actions">
                      <button className="hp-view-btn" onClick={() => handleView(item)}>
                        <MdTrendingUp size={15} /> {t("viewReport")}
                      </button>
                      <button className="hp-delete-btn" onClick={() => handleDeleteClick(item.id)} aria-label={t("deleteAnalysis") || "Delete analysis"}>
                        <HiOutlineTrash size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="hp-modal-overlay" onClick={() => setItemToDelete(null)}>
          <div className="hp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hp-modal-icon">
              <HiOutlineTrash size={32} />
            </div>
            <h3 className="hp-modal-title">
              {t("confirmDeletion") || "Confirm Deletion"}
            </h3>
            <p className="hp-modal-text">
              {t("confirmDeleteDesc") || "Are you sure you want to delete this analysis report? This action cannot be undone."}
            </p>
            <div className="hp-modal-actions">
              <button className="hp-modal-cancel" onClick={() => setItemToDelete(null)}>
                {t("cancelBtn") || "Cancel"}
              </button>
              <button className="hp-modal-confirm" onClick={confirmDeleteAction}>
                {t("deleteBtn") || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
