/** @format */

import { Link } from "react-router-dom";
import { PersonalRecord } from "../../types/enhanced-types";

interface PersonalRecordsPreviewProps {
  personalRecords: PersonalRecord[];
}

export default function PersonalRecordsPreview({
  personalRecords,
}: PersonalRecordsPreviewProps) {
  const recentPRs = personalRecords
    .sort(
      (a, b) =>
        new Date(b.achieved_at).getTime() - new Date(a.achieved_at).getTime(),
    )
    .slice(0, 3);

  if (recentPRs.length === 0) {
    return null;
  }

  return (
    <div className="border-2 border-yellow-400 p-4 md:p-6 bg-yellow-400/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-mono font-bold text-yellow-400">
          🏆 Recent Personal Records
        </h3>
        <Link
          to="/progress"
          className="text-xs md:text-sm text-yellow-400 hover:text-yellow-300 font-mono"
        >
          View All →
        </Link>
      </div>

      <div className="space-y-2">
        {recentPRs.map((pr) => (
          <div
            key={pr.id}
            className="flex items-center justify-between border-b border-yellow-400/30 pb-2 last:border-0 last:pb-0"
          >
            <div className="flex-1">
              <p className="font-mono text-white text-sm font-bold">
                {pr.exercise?.name}
              </p>
              <p className="text-xs text-gray-400 font-sans">
                {new Date(pr.achieved_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-yellow-400 font-bold text-sm md:text-base">
                {pr.value}
                {pr.record_type === "max_weight" && " kg"}
                {pr.record_type === "max_duration" && "s"}
                {pr.record_type === "max_reps" && " reps"}
              </p>
              <p className="text-xs text-gray-400 font-mono">
                {pr.record_type.replace("_", " ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
