"use client";
import { useState, useEffect } from "react";
import styles from "./MilestoneTracker.module.css";

function computeCountdown(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diffMs = target - now;

  if (diffMs <= 0) {
    return { years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, overdue: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const totalDays = Math.floor(totalHours / 24);
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const weeks = Math.floor(((totalDays % 365) % 30) / 7);
  const days = ((totalDays % 365) % 30) % 7;

  return { years, months, weeks, days, hours, minutes, seconds, overdue: false };
}

function TimeUnit({ value, label }) {
  return (
    <div className={styles.timeUnit}>
      <span className={styles.timeValue}>{String(value).padStart(2, "0")}</span>
      <span className={styles.timeLabel}>{label}</span>
    </div>
  );
}

export default function MilestoneTracker({ milestone, index }) {
  const [countdown, setCountdown] = useState(() => computeCountdown(milestone.targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(computeCountdown(milestone.targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [milestone.targetDate]);

  const targetDate = new Date(milestone.targetDate);
  const formattedDate = targetDate.toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className={`${styles.card} ${countdown.overdue ? styles.overdue : ""}`} style={{ animationDelay: `${index * 0.1}s` }}>
      <div className={styles.header}>
        <div className={styles.badge}>Milestone {index + 1}</div>
        <span className={styles.dueDate}>📅 {formattedDate}</span>
      </div>
      <h4 className={styles.title}>{milestone.title}</h4>

      {countdown.overdue ? (
        <div className={styles.overdueMsg}>⚠️ Deadline passed!</div>
      ) : (
        <div className={styles.timerGrid}>
          {countdown.years > 0 && <TimeUnit value={countdown.years} label="yrs" />}
          {(countdown.years > 0 || countdown.months > 0) && <TimeUnit value={countdown.months} label="mon" />}
          <TimeUnit value={countdown.weeks} label="wks" />
          <TimeUnit value={countdown.days} label="days" />
          <TimeUnit value={countdown.hours} label="hrs" />
          <TimeUnit value={countdown.minutes} label="min" />
          <TimeUnit value={countdown.seconds} label="sec" />
        </div>
      )}
    </div>
  );
}
