/** @format */

import { User } from "@supabase/supabase-js";
import WorkoutHistory from "../components/WorkoutHistory";

interface ProgressPageProps {
  user: User;
}

export default function ProgressPage({ user }: ProgressPageProps) {
  return <WorkoutHistory userId={user.id} />;
}
