/** @format */

import { EnhancedWorkout } from "../types/enhanced-types";

/**
 * Gets the start of the current week (Sunday at 00:00:00)
 */
export function getWeekStart(date: Date = new Date()): Date {
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

/**
 * Gets the start of the previous week
 */
export function getLastWeekStart(date: Date = new Date()): Date {
  const weekStart = getWeekStart(date);
  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  return lastWeekStart;
}

/**
 * Gets the start of the current month (1st at 00:00:00)
 */
export function getMonthStart(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Gets the start of today (00:00:00)
 */
export function getTodayStart(date: Date = new Date()): Date {
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Filters workouts that were completed within a date range
 */
export function filterWorkoutsByDateRange(
  workouts: EnhancedWorkout[],
  startDate: Date,
  endDate?: Date,
): EnhancedWorkout[] {
  return workouts.filter((w) => {
    if (!w.completed_at) return false;
    const workoutDate = new Date(w.completed_at);
    const afterStart = workoutDate >= startDate;
    const beforeEnd = endDate ? workoutDate < endDate : true;
    return afterStart && beforeEnd;
  });
}

/**
 * Gets workouts completed this week
 */
export function getThisWeekWorkouts(
  workouts: EnhancedWorkout[],
): EnhancedWorkout[] {
  return filterWorkoutsByDateRange(workouts, getWeekStart());
}

/**
 * Gets workouts completed last week
 */
export function getLastWeekWorkouts(
  workouts: EnhancedWorkout[],
): EnhancedWorkout[] {
  const weekStart = getWeekStart();
  const lastWeekStart = getLastWeekStart();
  return filterWorkoutsByDateRange(workouts, lastWeekStart, weekStart);
}

/**
 * Gets workouts completed this month
 */
export function getThisMonthWorkouts(
  workouts: EnhancedWorkout[],
): EnhancedWorkout[] {
  return filterWorkoutsByDateRange(workouts, getMonthStart());
}

/**
 * Gets workouts completed today
 */
export function getTodayWorkouts(
  workouts: EnhancedWorkout[],
): EnhancedWorkout[] {
  const today = getTodayStart();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return filterWorkoutsByDateRange(workouts, today, tomorrow);
}

/**
 * Calculates total duration in minutes from a list of workouts
 */
export function getTotalMinutes(workouts: EnhancedWorkout[]): number {
  return workouts.reduce((sum, w) => sum + w.duration_minutes, 0);
}

/**
 * Calculates total volume from a list of workouts
 */
export function getTotalVolume(workouts: EnhancedWorkout[]): number {
  return workouts.reduce((sum, w) => sum + (w.total_volume || 0), 0);
}

/**
 * Calculates number of days since a date
 */
export function getDaysSince(date: Date | string): number {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  return Math.floor(
    (Date.now() - targetDate.getTime()) / (1000 * 60 * 60 * 24),
  );
}

/**
 * Sorts workouts by completion date (most recent first)
 */
export function sortWorkoutsByDate(
  workouts: EnhancedWorkout[],
): EnhancedWorkout[] {
  return [...workouts].sort(
    (a, b) =>
      new Date(b.completed_at || b.date).getTime() -
      new Date(a.completed_at || a.date).getTime(),
  );
}

/**
 * Gets the most recent completed workout
 */
export function getLastWorkout(
  workouts: EnhancedWorkout[],
): EnhancedWorkout | undefined {
  return sortWorkoutsByDate(workouts.filter((w) => w.completed_at))[0];
}
