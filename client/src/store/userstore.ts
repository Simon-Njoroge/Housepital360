
import { useAllUsers, useUserById, useAddUser, useUpdateUserById, useDeleteUserById } from '@/hooks/userhook';
import type { TUser } from '@/types/types';
import { Store } from '@tanstack/store';
 
// store state type

type UserStoreType = {
  users: TUser[] | undefined;
  isLoading: boolean;
  error: string | null;
}

export const userStore = new Store<UserStoreType>({
  users: undefined, 
  isLoading: false,
  error: null,
});

//CRUD actions hooks

export function useUsersStoreActions(){
    const {data: users, isLoading, error,refetch} = useAllUsers();
    const addUserMutation = useAddUser();
    const updateUserMutation = useUpdateUserById();
    const deleteUserMutation = useDeleteUserById();

    // sync store state with query state
    userStore.setState({
        users,
        isLoading,
        error: error ? String(error) : null,
    });

    const getUserById = (id: string) => {
        return useUserById(id);
    };

    const addUser = async (user: Partial<TUser>) => {
        const newUser = await addUserMutation.mutateAsync(user);
        refetch();
        return newUser;
    };

    const updateUserById = async (id: string | number, user: Partial<TUser>) => {
        const updatedUser = await updateUserMutation.mutateAsync({id, data:user});
        refetch();
        return updatedUser;
    };
    const deleteUserById = async (id: string | number) => {
        await deleteUserMutation.mutateAsync(id);
        refetch();
    };
    return {
        users,
        isLoading,
        error,
        getUserById,
        addUser,
        updateUserById,
        deleteUserById,
    };  
}