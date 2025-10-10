/** @format */

import { User } from "@supabase/supabase-js";
import WorkoutGenerator from "../components/WorkoutGenerator";

interface WorkoutGeneratorPageProps {
  user: User;
}

export default function WorkoutGeneratorPage({
  user,
}: WorkoutGeneratorPageProps) {
  return <WorkoutGenerator userId={user.id} />;
}
