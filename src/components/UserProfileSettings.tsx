/** @format */

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  ActivityLevel,
  Sex,
  Equipment,
  ExerciseDifficulty,
} from "../types/enhanced-types";
import { getEquipmentDisplayName } from "../types/exercise";
import { useUserPreferences } from "../hooks/useUserPreferences";

interface UserProfileSettingsProps {
  userId: string;
}

export default function UserProfileSettings({
  userId,
}: UserProfileSettingsProps) {
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [weightKg, setWeightKg] = useState<number | undefined>();
  const [heightCm, setHeightCm] = useState<number | undefined>();
  const [age, setAge] = useState<number | undefined>();
  const [sex, setSex] = useState<Sex | undefined>();
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([
    Equipment.BODYWEIGHT_ONLY,
  ]);
  const [defaultDifficulty, setDefaultDifficulty] =
    useState<ExerciseDifficulty>(ExerciseDifficulty.INTERMEDIATE);
  const [defaultWorkoutDuration, setDefaultWorkoutDuration] = useState(30);
  const [defaultRest, setDefaultRest] = useState(60);

  const equipmentOptions: Equipment[] = [
    Equipment.BODYWEIGHT_ONLY,
    Equipment.PULL_UP_BAR,
    Equipment.PARALLETTES,
    Equipment.DIP_BARS,
    Equipment.RINGS,
    Equipment.RESISTANCE_BANDS,
    Equipment.WALL,
    Equipment.BENCH,
    Equipment.AB_ROLLER,
    Equipment.JUMP_ROPE,
    Equipment.YOGA_MAT,
    Equipment.BARBELL,
    Equipment.DUMBBELLS,
    Equipment.KETTLEBELL,
  ];

  const { preferences, loading, refetch } = useUserPreferences(userId);

  useEffect(() => {
    if (preferences) {
      setWeightKg(preferences.weight_kg);
      setHeightCm(preferences.height_cm);
      setAge(preferences.age);
      setSex(preferences.sex);
      setActivityLevel(preferences.activity_level || "moderate");
      setSelectedEquipment(
        preferences.available_equipment || [Equipment.BODYWEIGHT_ONLY]
      );
      setDefaultDifficulty(preferences.difficulty_level);
      setDefaultWorkoutDuration(preferences.default_workout_duration);
      setDefaultRest(preferences.default_rest_between_sets);
    }
  }, [preferences]);

  const toggleEquipment = (equip: Equipment) => {
    setSelectedEquipment((prev) =>
      prev.includes(equip) ? prev.filter((e) => e !== equip) : [...prev, equip]
    );
  };

  const calculateBMR = (): number | null => {
    if (!weightKg || !heightCm || !age || !sex) return null;

    // Mifflin-St Jeor Equation
    const bmr =
      sex === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    return Math.round(bmr);
  };

  const calculateTDEE = (): number | null => {
    const bmr = calculateBMR();
    if (!bmr) return null;

    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
    };

    return Math.round(bmr * activityMultipliers[activityLevel]);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage("");

    try {
      const updates = {
        user_id: userId,
        weight_kg: weightKg,
        height_cm: heightCm,
        age: age,
        sex: sex,
        activity_level: activityLevel,
        available_equipment: selectedEquipment,
        difficulty_level: defaultDifficulty,
        default_workout_duration: defaultWorkoutDuration,
        default_rest_between_sets: defaultRest,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("user_preferences")
        .upsert(updates, { onConflict: "user_id" });

      if (error) throw error;

      refetch();

      setSuccessMessage("✓ Settings saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl font-mono text-teal-400">Loading...</div>
      </div>
    );
  }

  const bmr = calculateBMR();
  const tdee = calculateTDEE();

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-teal-400 text-black px-4 py-3 font-mono">
          {successMessage}
        </div>
      )}

      {/* Body Metrics Section */}
      <div className="border-2 border-white p-6">
        <h3 className="text-xl font-bold mb-4 font-mono text-teal-400">
          Body Metrics
        </h3>
        <p className="text-sm text-gray-400 mb-6 font-sans">
          Used for accurate calorie calculations during workouts
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weight */}
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weightKg || ""}
              onChange={(e) => setWeightKg(Number(e.target.value) || undefined)}
              placeholder="70"
              className="w-full bg-black text-white border-2 border-white px-4 py-2 font-mono focus:border-teal-400 focus:outline-none"
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              value={heightCm || ""}
              onChange={(e) => setHeightCm(Number(e.target.value) || undefined)}
              placeholder="175"
              className="w-full bg-black text-white border-2 border-white px-4 py-2 font-mono focus:border-teal-400 focus:outline-none"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">
              Age (years)
            </label>
            <input
              type="number"
              value={age || ""}
              onChange={(e) => setAge(Number(e.target.value) || undefined)}
              placeholder="25"
              className="w-full bg-black text-white border-2 border-white px-4 py-2 font-mono focus:border-teal-400 focus:outline-none"
            />
          </div>

          {/* Sex */}
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">
              Biological Sex
            </label>
            <select
              value={sex || ""}
              onChange={(e) => setSex(e.target.value as Sex)}
              className="w-full bg-black text-white border-2 border-white px-4 py-2 font-mono focus:border-teal-400 focus:outline-none"
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Activity Level */}
        <div className="mt-4">
          <label className="block text-sm font-mono text-gray-400 mb-2">
            Activity Level (outside of workouts)
          </label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
            className="w-full bg-black text-white border-2 border-white px-4 py-2 font-mono focus:border-teal-400 focus:outline-none"
          >
            <option value="sedentary">Sedentary (little/no exercise)</option>
            <option value="light">Light (1-3 days/week)</option>
            <option value="moderate">Moderate (3-5 days/week)</option>
            <option value="very_active">Very Active (6-7 days/week)</option>
            <option value="extra_active">
              Extra Active (athlete/physical job)
            </option>
          </select>
        </div>

        {/* Calorie Calculations */}
        {bmr && tdee && (
          <div className="mt-6 p-4 bg-black border-2 border-teal-400">
            <p className="text-sm font-mono text-gray-400 mb-2">
              Your Daily Estimates:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 font-mono">BMR</p>
                <p className="text-2xl font-mono text-white">{bmr}</p>
                <p className="text-xs text-gray-400 font-sans">
                  calories/day at rest
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-mono">TDEE</p>
                <p className="text-2xl font-mono text-teal-400">{tdee}</p>
                <p className="text-xs text-gray-400 font-sans">
                  total calories/day
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Workout Preferences */}
      <div className="border-2 border-white p-6">
        <h3 className="text-xl font-bold mb-4 font-mono text-teal-400">
          Workout Preferences
        </h3>

        {/* Default Difficulty */}
        <div className="mb-4">
          <label className="block text-sm font-mono text-gray-400 mb-2">
            Default Difficulty Level
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDefaultDifficulty(ExerciseDifficulty.BEGINNER)}
              className={`px-4 py-2 font-mono text-sm transition-colors border-2 ${
                defaultDifficulty === ExerciseDifficulty.BEGINNER
                  ? "bg-teal-400 text-black border-teal-400"
                  : "bg-black text-white border-white hover:border-teal-400"
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() =>
                setDefaultDifficulty(ExerciseDifficulty.INTERMEDIATE)
              }
              className={`px-4 py-2 font-mono text-sm transition-colors border-2 ${
                defaultDifficulty === ExerciseDifficulty.INTERMEDIATE
                  ? "bg-teal-400 text-black border-teal-400"
                  : "bg-black text-white border-white hover:border-teal-400"
              }`}
            >
              Intermediate
            </button>
            <button
              onClick={() => setDefaultDifficulty(ExerciseDifficulty.ADVANCED)}
              className={`px-4 py-2 font-mono text-sm transition-colors border-2 ${
                defaultDifficulty === ExerciseDifficulty.ADVANCED
                  ? "bg-teal-400 text-black border-teal-400"
                  : "bg-black text-white border-white hover:border-teal-400"
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Default Workout Duration */}
        <div className="mb-4">
          <label className="block text-sm font-mono text-gray-400 mb-2">
            Default Workout Duration: {defaultWorkoutDuration} minutes
          </label>
          <input
            type="range"
            min="15"
            max="90"
            step="5"
            value={defaultWorkoutDuration}
            onChange={(e) => setDefaultWorkoutDuration(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-none"
          />
          <div className="flex justify-between text-xs text-gray-500 font-mono mt-1">
            <span>15 min</span>
            <span>90 min</span>
          </div>
        </div>

        {/* Default Rest Time */}
        <div className="mb-4">
          <label className="block text-sm font-mono text-gray-400 mb-2">
            Default Rest Between Sets: {defaultRest} seconds
          </label>
          <input
            type="range"
            min="30"
            max="180"
            step="15"
            value={defaultRest}
            onChange={(e) => setDefaultRest(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-none"
          />
          <div className="flex justify-between text-xs text-gray-500 font-mono mt-1">
            <span>30s</span>
            <span>3 min</span>
          </div>
        </div>
      </div>

      {/* Equipment */}
      <div className="border-2 border-white p-6">
        <h3 className="text-xl font-bold mb-4 font-mono text-teal-400">
          Available Equipment
        </h3>
        <p className="text-sm text-gray-400 mb-4 font-sans">
          Select all equipment you have access to. This will be used when
          generating workouts.
        </p>

        <div className="flex flex-wrap gap-2">
          {equipmentOptions.map((equip) => (
            <button
              key={equip}
              onClick={() => toggleEquipment(equip)}
              className={`px-4 py-2 font-mono text-sm transition-colors border-2 ${
                selectedEquipment.includes(equip)
                  ? "bg-teal-400 text-black border-teal-400"
                  : "bg-black text-white border-white hover:border-teal-400"
              }`}
            >
              {getEquipmentDisplayName(equip)}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-3 px-8 text-white font-mono text-lg bg-black border-2 border-white cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
