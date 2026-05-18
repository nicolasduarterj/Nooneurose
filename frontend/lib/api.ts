export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

export const lastChatIdKey = 'lastChatId';