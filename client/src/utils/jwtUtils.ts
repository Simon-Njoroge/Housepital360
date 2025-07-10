
import {jwtDecode} from 'jwt-decode';

type TokenPayload = {
  userId: string;
  role: string;
  exp?: number;
};

export function getUserFromToken(token: string | null): TokenPayload | null {
  if (!token) return null;

  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
}
