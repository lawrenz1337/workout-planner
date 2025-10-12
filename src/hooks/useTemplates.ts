/** @format */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import {
  fetchUserTemplates,
  fetchTemplateDetails,
  saveAsTemplate as saveTemplateService,
  deleteTemplate as deleteTemplateService,
  templateToGeneratedWorkout,
} from "../services/templateService";
import { GeneratedWorkout } from "../types/workout-service";

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch all templates for a user
 */
export function useTemplates(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.templates.all(userId || ""),
    queryFn: () => fetchUserTemplates(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}

/**
 * Hook to fetch a single template with full exercise details
 */
export function useTemplateDetails(templateId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.templates.detail(templateId || ""),
    queryFn: () => fetchTemplateDetails(templateId!),
    enabled: !!templateId,
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
  });
}

/**
 * Hook to load a template and convert it to GeneratedWorkout format
 * This is used when starting a workout from a template
 */
export function useLoadTemplate(templateId: string | undefined) {
  const {
    data: template,
    isLoading,
    error,
    isError,
  } = useTemplateDetails(templateId);

  // Convert template to GeneratedWorkout if available
  const workout = template ? templateToGeneratedWorkout(template) : null;

  return {
    workout,
    isLoading,
    error,
    isError,
  };
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Hook to save a workout as a template
 * Automatically invalidates the templates list on success
 */
export function useSaveTemplate(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      generatedWorkout,
      templateName,
    }: {
      generatedWorkout: GeneratedWorkout;
      templateName: string;
    }) => saveTemplateService(userId, generatedWorkout, templateName),
    onSuccess: () => {
      // Invalidate templates list to trigger refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.templates.all(userId),
      });
    },
  });
}

/**
 * Hook to delete a template
 * Automatically invalidates the templates list on success
 */
export function useDeleteTemplate(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: string) =>
      deleteTemplateService(templateId, userId),
    onSuccess: (_, templateId) => {
      // Invalidate templates list to trigger refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.templates.all(userId),
      });

      // Also invalidate the specific template detail if it's cached
      queryClient.invalidateQueries({
        queryKey: queryKeys.templates.detail(templateId),
      });
    },
  });
}
