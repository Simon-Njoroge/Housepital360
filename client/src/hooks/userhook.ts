import {
  useAllItems,
  useItemById,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
} from "@/utils/hookClient";
import type { TUser } from "@/types/types";
import { getAllUsers,getUserById,createUser,updateUser,deleteUser } from "@/data/userapi";

export const useAllUsers = () =>
  useAllItems<TUser>(["allUsers"], getAllUsers);

export const useUserById = (id: string) =>
  useItemById<TUser>(["user"], getUserById, id);

export const useAddUser = () =>
  useAddItem<TUser>(["allUsers"], createUser);

export const useUpdateUserById = () =>
  useUpdateItem<TUser>(["allUsers"], updateUser);

export const useDeleteUserById = () =>
  useDeleteItem(["allUsers"], deleteUser);