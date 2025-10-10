/** @format */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { EnhancedUserPreferences } from "../types/enhanced-types";

/**
 * Hook to fetch and cache user preferences
 */
export function useUserPreferences(userId: string | undefined) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user_preferences", userId],
    queryFn: async (): Promise<EnhancedUserPreferences | null> => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching user preferences:", error);
        return null;
      }

      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  return {
    preferences: data,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}
