import type { Email, SchedulePayload, User } from './types';
// Set VITE_API_URL to use the real backend. Expected endpoints:
// GET /api/me, GET /auth/google, POST /auth/logout, GET /auth/slack, GET /api/emails?status=scheduled|sent, POST /api/schedule
const BASE = import.meta.env.VITE_API_URL as string | undefined;
const wait = (ms = 500) => new Promise(r => setTimeout(r, ms));
async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(BASE + path, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...init });
  if (!r.ok) throw new Error((await r.text()) || 'Request failed');
  return r.json();
}
let mock: Email[] = [];
const mockUser: User = { name: 'Asif', email: 'asif@example.com', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Asif' };
export const getMe = async (): Promise<User | null> =>
  BASE ? req<User>('/api/me').catch(() => null) : (await wait(200), localStorage.getItem('u') ? mockUser : null);
export const loginGoogle = () => { if (BASE) location.href = BASE + '/auth/google'; else { localStorage.setItem('u', '1'); location.reload(); } };
export const connectSlack = () => { if (BASE) location.href = BASE + '/auth/slack'; else alert('Slack OAuth runs via your backend.'); };
export const logout = async () => { if (BASE) await req('/auth/logout', { method: 'POST' }); localStorage.removeItem('u'); location.reload(); };
export async function getEmails(kind: 'scheduled' | 'sent'): Promise<Email[]> {
  if (BASE) return req<Email[]>(`/api/emails?status=${kind}`);
  await wait();
  const now = Date.now();
  const all = mock.map(e => (e.status === 'scheduled' && new Date(e.at).getTime() <= now ? { ...e, status: 'sent' as const } : e));
  return all.filter(e => (kind === 'sent' ? e.status !== 'scheduled' : e.status === 'scheduled'));
}
export async function schedule(p: SchedulePayload): Promise<void> {
  if (BASE) { await req('/api/schedule', { method: 'POST', body: JSON.stringify(p) }); return; }
  await wait();
  const t0 = new Date(p.startTime).getTime();
  p.recipients.forEach((to, i) => mock.push({ id: crypto.randomUUID(), to, subject: p.subject, at: new Date(t0 + i * p.delaySec * 1000).toISOString(), status: 'scheduled' }));
}
