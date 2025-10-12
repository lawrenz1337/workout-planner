/** @format */

import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTemplates, useDeleteTemplate } from "../hooks/useTemplates";

export default function WorkoutsPage() {
  const { user } = useAuth();
  const { data: templates = [], isLoading } = useTemplates(user?.id);
  const deleteTemplateMutation = useDeleteTemplate(user?.id || "");

  const handleDeleteTemplate = async (
    templateId: string,
    templateName: string,
  ) => {
    if (!confirm(`Delete "${templateName}"? This cannot be undone.`)) return;

    try {
      await deleteTemplateMutation.mutateAsync(templateId);
    } catch (error) {
      console.error("Failed to delete template:", error);
      alert("Failed to delete template");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl font-mono text-teal-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 font-mono">
            My Workouts
          </h2>
          <p className="text-gray-400 font-sans">
            Start from a saved template or create a new workout
          </p>
        </div>
        <Link
          to="/workouts/new"
          className="px-4 py-2 bg-transparent hover:bg-gray-800 text-teal-400 font-mono text-sm transition-colors border-2 border-teal-400 hover:border-teal-300"
        >
          + New Workout
        </Link>
      </div>

      {templates.length > 0 ? (
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-3 font-mono flex items-center gap-2">
            <span>💾</span>
            <span>Saved Templates</span>
            <span className="text-sm text-gray-400">({templates.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border-2 border-white hover:border-teal-400 p-4 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-mono font-bold text-white text-lg mb-1">
                      {template.name}
                    </h4>
                    <p className="text-xs text-gray-400 font-mono">
                      {template.duration_minutes} min
                    </p>
                  </div>
                  <span className="bg-teal-400 text-black px-2 py-1 text-xs font-mono">
                    {template.type}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to="/workouts/active"
                    state={{ templateId: template.id }}
                    className="flex-1 active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-sm bg-black border-2 border-white cursor-pointer select-none"
                  >
                    🏃 Start Workout
                  </Link>
                  <button
                    onClick={() =>
                      handleDeleteTemplate(template.id, template.name)
                    }
                    disabled={deleteTemplateMutation.isPending}
                    className="px-3 py-2 bg-transparent hover:bg-red-900/30 text-red-500 font-bold transition-all border-2 border-red-500 hover:border-red-400 font-mono text-sm disabled:opacity-50"
                    title="Delete template"
                  >
                    {deleteTemplateMutation.isPending ? "..." : "✕"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-600 p-8 text-center">
          <p className="text-lg md:text-xl font-mono text-gray-400 mb-2">
            No templates yet
          </p>
          <p className="text-sm text-gray-500 font-sans mb-4">
            Generate a workout and save it as a template for quick access
          </p>
          <Link
            to="/workouts/new"
            className="inline-block w-fit active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-base bg-black border-2 border-white cursor-pointer select-none"
          >
            Create First Workout
          </Link>
        </div>
      )}
    </div>
  );
}
