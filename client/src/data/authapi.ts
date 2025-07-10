// @/services/authService.ts
import Backend_url from "@/common/backendUrl";
import { apiClient } from "@/utils/apiClient";
import type { LoginPayload, ChangePasswordPayload, TAuthResponse } from "@/types/types";

// Login user
export const login = async (payload: LoginPayload): Promise<TAuthResponse> => {
  const res = await fetch(`${Backend_url}/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
  });

  const data = await res.json();

  if (!res.ok) {
    // Throw if response status is NOT OK
    throw new Error(data?.message || "Login failed");
  }

  return data; // This is of type TAuthResponse
};

// Change user password
export const changePassword = async ({
  userId,
  newPassword,
}: ChangePasswordPayload): Promise<{ message: string }> =>
  apiClient<{ message: string }>(
    `${Backend_url}/auth/change-password/${userId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ newPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
