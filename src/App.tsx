import { useCallback, useEffect, useState } from 'react';
import type { Email, User } from './types';
import { connectSlack, getEmails, getMe, loginGoogle, logout } from './api';
import { Button, EmailTable } from './ui';
import Compose from './Compose';
type Tab = 'scheduled' | 'sent';
export default function App() {
  const [user, setUser] = useState<User | null>(null); const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>('scheduled'); const [rows, setRows] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false); const [open, setOpen] = useState(false); const [msg, setMsg] = useState('');
  const toast = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };
  useEffect(() => { getMe().then(u => { setUser(u); setReady(true); }); }, []);
  const load = useCallback(async () => {
    setLoading(true);
    try { setRows(await getEmails(tab)); } catch (e) { toast((e as Error).message); } finally { setLoading(false); }
  }, [tab]);
  useEffect(() => { if (user) load(); }, [user, load]);
  if (!ready) return null;
  if (!user) return (
    <div className="flex min-h-screen items-center justify-center"><div className="w-80 rounded-2xl bg-white p-8 text-center shadow">
      <h1 className="mb-1 text-2xl font-bold">Outbox</h1><p className="mb-6 text-sm text-slate-500">Schedule emails at scale</p>
      <Button onClick={loginGoogle} className="w-full">Continue with Google</Button></div></div>
  );
  return (
    <div className="mx-auto max-w-5xl p-4">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Outbox</h1>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={connectSlack}>Connect Slack</Button>
          <img src={user.avatar} alt="" className="h-9 w-9 rounded-full" />
          <div className="text-sm leading-tight"><div className="font-medium">{user.name}</div><div className="text-slate-500">{user.email}</div></div>
          <Button variant="ghost" onClick={logout}>Logout</Button></div></header>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1 rounded-lg bg-slate-200 p-1">
          {(['scheduled', 'sent'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize ${tab === t ? 'bg-white shadow' : 'text-slate-600'}`}>{t} Emails</button>))}</div>
        <Button onClick={() => setOpen(true)}>+ Compose New Email</Button></div>
      <div className="rounded-2xl bg-white shadow-sm">
        <EmailTable rows={rows} loading={loading} timeLabel={tab === 'sent' ? 'Sent time' : 'Scheduled time'}
          empty={tab === 'sent' ? 'No sent emails yet' : 'No scheduled emails. Compose one to get started.'} /></div>
      {open && <Compose onClose={() => setOpen(false)} onDone={load} toast={toast} />}
      {msg && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">{msg}</div>}
    </div>
  );
}
