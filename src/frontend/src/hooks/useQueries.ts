import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Lesson, UserProfile } from '../backend';

export function useGetAllLessons() {
  const { actor, isFetching } = useActor();

  return useQuery<Lesson[]>({
    queryKey: ['lessons'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLessons();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLesson(lessonId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Lesson | null>({
    queryKey: ['lesson', lessonId?.toString()],
    queryFn: async () => {
      if (!actor || !lessonId) return null;
      try {
        return await actor.getLesson(lessonId);
      } catch (error) {
        console.error('Error fetching lesson:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!lessonId,
  });
}

export function useCreateLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      video,
      creditCost
    }: {
      title: string;
      description: string;
      video: Uint8Array;
      creditCost: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createLesson(title, description, video, creditCost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
    onError: (error: any) => {
      console.error('Create lesson error:', error);
      throw error;
    }
  });
}

export function useCompleteLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeLesson(lessonId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
    onError: (error: any) => {
      console.error('Complete lesson error:', error);
      throw error;
    }
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

