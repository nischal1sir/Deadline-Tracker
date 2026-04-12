import Link from "next/link";
import { ArrowRight, Target, Clock, CalendarDays } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Background Orbs */}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />

      <div className={`${styles.content} fade-in`}>
        <h1 className={styles.title}>
          Master Your Timeline.<br />
          Achieve Every <span className="text-gradient">Milestone</span>.
        </h1>
        
        <p className={styles.subtitle}>
          The ultimate tracking dashboard designed to help you hit your goals. 
          Set your objective, break it down into milestones, and monitor every second passing.
        </p>

        <div className={styles.actions}>
          <Link href="/dashboard" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Start Tracking Free
            <ArrowRight size={20} />
          </Link>
          <Link href="/about" className="btn-secondary">
            How it works
          </Link>
        </div>

        {/* Feature Grid */}
        <div className={styles.features}>
          <div className={`glass ${styles.featureCard}`}>
            <div className={styles.iconWrapper1}>
              <Target size={24} />
            </div>
            <h3 className={styles.featureTitle}>Goal Hierarchies</h3>
            <p className={styles.featureDesc}>Organize coursework and massive projects into actionable, bite-sized milestones.</p>
          </div>
          <div className={`glass ${styles.featureCard}`}>
            <div className={styles.iconWrapper2}>
              <Clock size={24} />
            </div>
            <h3 className={styles.featureTitle}>Real-Time Precision</h3>
            <p className={styles.featureDesc}>Watch the years, months, weeks, days, and hours count down live.</p>
          </div>
          <div className={`glass ${styles.featureCard}`}>
            <div className={styles.iconWrapper3}>
              <CalendarDays size={24} />
            </div>
            <h3 className={styles.featureTitle}>Bird's Eye View</h3>
            <p className={styles.featureDesc}>See all your cascading deadlines on a single, stunning glassmorphism dashboard.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
