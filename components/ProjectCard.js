"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Plus, Calendar } from "lucide-react";
import MilestoneTracker from "./MilestoneTracker";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project, onDelete }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.iconWrap}>
            <Calendar size={18} />
          </div>
          <div>
            <h3 className={styles.title}>{project.title}</h3>
            {project.description && (
              <p className={styles.description}>{project.description}</p>
            )}
          </div>
        </div>
        <div className={styles.actions}>
          <span className={styles.count}>{project.milestones.length} milestone{project.milestones.length !== 1 ? "s" : ""}</span>
          <button
            className={styles.iconBtn}
            onClick={() => onDelete(project.id)}
            title="Delete project"
          >
            <Trash2 size={16} />
          </button>
          <button
            className={styles.iconBtn}
            onClick={() => setExpanded((v) => !v)}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Milestones */}
      {expanded && (
        <div className={styles.milestones}>
          {project.milestones.length === 0 ? (
            <div className={styles.empty}>No milestones yet.</div>
          ) : (
            project.milestones.map((m, i) => (
              <MilestoneTracker key={m.id} milestone={m} index={i} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
