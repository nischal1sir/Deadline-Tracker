import { Target } from "lucide-react";
import AuthForm from "@/components/AuthForm";
import styles from "./page.module.css";

export const metadata = {
  title: "Sign In – MilestoneTracker",
  description: "Create an account or sign in to manage your goals and milestones.",
};

export default function AuthPage() {
  return (
    <main className={styles.main}>
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />

      <div className={`${styles.card} glass fade-in`}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Target size={24} />
          </div>
          <span className={`${styles.logoText} text-gradient`}>MilestoneTracker</span>
        </div>

        <h1 className={styles.heading}>Welcome Back</h1>
        <p className={styles.subheading}>Sign in to track your progress in real time.</p>

        <AuthForm />
      </div>
    </main>
  );
}
