/** @format */
import { supabase } from "../lib/supabase";
import { EnhancedExercise } from "../types";
import { useQuery } from "@tanstack/react-query";

export function useExercises() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["exercises", { is_default: true }],
    queryFn: async (): Promise<EnhancedExercise[]> => {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("is_default", true)
        .order("category")
        .order("difficulty")
        .order("name");
      if (error) throw error;
      return data || [];
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  return {
    exercises: data ?? [],
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
