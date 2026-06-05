import { parseCookies } from 'nookies';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
export const APP_AUTH_COOKIE = 'nooneurose_auth';
export const APP_USER_NAME_COOKIE = 'nooneurose_user_name';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const authHeaders = () => {
  const cookies = parseCookies(); 
  
  const token = cookies[APP_AUTH_COOKIE]; 

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export interface JwtPayload {
	id?: number;
};

export const lastChatIdKey = 'lastChatId';