"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, LogOut, Target, RefreshCw } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import CreateProjectModal from "@/components/CreateProjectModal";
import styles from "./page.module.css";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProjects();
      fetchQuote();
    }
  }, [status]);

  const fetchQuote = async () => {
    try {
      const res = await fetch("https://dummyjson.com/quotes/random");
      const data = await res.json();
      setQuote(data);
    } catch {}
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {}
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Background orbs */}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />

      {/* Navbar */}
      <nav className={`${styles.nav} glass`}>
        <div className={styles.navBrand}>
          <div className={styles.navIcon}><Target size={18} /></div>
          <span className={`${styles.navTitle} text-gradient`}>MilestoneTracker</span>
        </div>
        <div className={styles.navRight}>
          <span className={styles.userName}>👋 {session?.user?.name || session?.user?.email}</span>
          <button className="btn-secondary" onClick={() => signOut({ callbackUrl: "/auth" })} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className={styles.main}>
        {/* Quote Section */}
        {quote && (
          <div className={`${styles.quoteCard} glass fade-in`}>
            <p className={styles.quoteText}>"{quote.quote}"</p>
            <p className={styles.quoteAuthor}>— {quote.author}</p>
          </div>
        )}

        {/* Page header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Your Goals & Milestones</h1>
            <p className={styles.pageSubtitle}>Track multiple projects and their real-time countdowns simultaneously.</p>
          </div>
          <div className={styles.headerActions}>
            <button className="btn-secondary" onClick={fetchProjects} title="Refresh" style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1rem", fontSize: "0.875rem" }}>
              <RefreshCw size={15} />
            </button>
            <button
              className="btn-primary"
              onClick={() => setShowModal(true)}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Plus size={18} /> New Goal
            </button>
          </div>
        </div>

        {/* Projects grid */}
        {loading ? (
          <div className={styles.loadingGrid}>
            {[1,2].map(i => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : projects.length === 0 ? (
          <div className={`${styles.empty} glass`}>
            <div className={styles.emptyIcon}>🎯</div>
            <h3 className={styles.emptyTitle}>No goals yet</h3>
            <p className={styles.emptyText}>Create your first goal and break it down into milestones to start tracking your progress.</p>
            <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Plus size={18} /> Create First Goal
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
