import { useMutation } from "@tanstack/react-query";
import { login, changePassword } from "@/data/authapi";
import type { LoginPayload, TAuthResponse, ChangePasswordPayload } from "@/types/types";

export const useLogin = () =>
  useMutation<TAuthResponse, Error, LoginPayload>({
    mutationFn: login,
  });

export const useChangePassword = () =>
  useMutation<{ message: string }, Error, ChangePasswordPayload>({
    mutationFn: changePassword,
  });
