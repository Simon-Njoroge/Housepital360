import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {QueryKey,UseQueryResult,UseMutationResult} from "@tanstack/react-query";

// Generic fetch all hook
export function useAllItems<T>(
  queryKey: QueryKey,
  fetchFn: (...args: any[]) => Promise<T[]>,
  params?: any[]
): UseQueryResult<T[], Error> {
  return useQuery({
    queryKey: [queryKey, ...(params || [])],
    queryFn: () => fetchFn(...(params || [])),
  });
}

// Generic fetch by ID hook
export function useItemById<T>(
  queryKey: QueryKey,
  fetchFn: (id: string | number) => Promise<T>,
  id: string | number
): UseQueryResult<T, Error> {
  return useQuery({
    queryKey: [queryKey, id],
    queryFn: () => fetchFn(id),
    enabled: !!id,
  });
}

// Generic add item hook
export function useAddItem<T>(
  queryKey: QueryKey,
  addFn: (data: Partial<T>) => Promise<T>
): UseMutationResult<T, Error, Partial<T>> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
}

// Generic update item hook
export function useUpdateItem<T>(
  queryKey: QueryKey,
  updateFn: (id: string | number, data: Partial<T>) => Promise<T>
): UseMutationResult<T, Error, { id: string | number; data: Partial<T> }> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
}

// Generic delete item hook
export function useDeleteItem(
  queryKey: QueryKey,
  deleteFn: (id: string | number) => Promise<void>
): UseMutationResult<void, Error, string | number> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
}