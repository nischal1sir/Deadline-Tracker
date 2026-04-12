"use client";
import { useState } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import styles from "./CreateProjectModal.module.css";

export default function CreateProjectModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [milestones, setMilestones] = useState([{ title: "", targetDate: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addMilestone = () => {
    setMilestones((prev) => [...prev, { title: "", targetDate: "" }]);
  };

  const removeMilestone = (i) => {
    setMilestones((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateMilestone = (i, field, value) => {
    setMilestones((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) { setError("Goal title is required."); return; }
    if (milestones.some((m) => !m.title.trim() || !m.targetDate)) {
      setError("All milestones must have a title and deadline.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), milestones }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project.");
      onCreate(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>New Goal</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Goal Title *</label>
            <input
              className="glass-input"
              placeholder="e.g. Software Engineering Coursework"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              className={`glass-input ${styles.textarea}`}
              placeholder="Optional notes about this goal…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className={styles.milestonesSection}>
            <div className={styles.sectionHeader}>
              <label className={styles.label}>Milestones *</label>
              <button type="button" className={styles.addBtn} onClick={addMilestone}>
                <Plus size={14} /> Add
              </button>
            </div>

            {milestones.map((m, i) => (
              <div key={i} className={styles.milestoneRow}>
                <span className={styles.milestoneNum}>{i + 1}</span>
                <input
                  className={`glass-input ${styles.milestoneTitle}`}
                  placeholder={`Milestone ${i + 1} title`}
                  value={m.title}
                  onChange={(e) => updateMilestone(i, "title", e.target.value)}
                />
                <input
                  className={`glass-input ${styles.milestoneDate}`}
                  type="datetime-local"
                  value={m.targetDate}
                  onChange={(e) => updateMilestone(i, "targetDate", e.target.value)}
                />
                {milestones.length > 1 && (
                  <button type="button" className={styles.removeBtn} onClick={() => removeMilestone(i)}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.footer}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <Loader2 size={18} className={styles.spin} /> : "Create Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
