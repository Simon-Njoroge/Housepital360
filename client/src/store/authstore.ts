import { Store } from "@tanstack/store";
import {jwtDecode} from "jwt-decode";

type TokenPayload = {
  userId: string;
  role: string;
  exp?: number;
};

function getTokenFromCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const cookieString = `; ${document.cookie}`;
  const parts = cookieString.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function getInitialAuthState(): { userId: string | null; role: string | null } {
  if (typeof document === "undefined") return { userId: null, role: null };

  const token = getTokenFromCookie("access_token"); // change name if needed
  if (!token) return { userId: null, role: null };

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return {
      userId: decoded.userId,
      role: decoded.role,
    };
  } catch (err) {
    console.error("Invalid JWT token:", err);
    return { userId: null, role: null };
  }
}

export const authStore = new Store(getInitialAuthState());

export function hydrateAuthStoreFromCookie() {
  if (typeof window === 'undefined') return;

  const token = getTokenFromCookie('access_token');
  if (!token) return;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    authStore.setState({
      userId: decoded.userId,
      role: decoded.role,
    });
    console.log('✅ Auth store hydrated from cookie:', decoded);
  } catch (err) {
    console.warn('❌ Failed to hydrate auth store from token:', err);
  }
}
