import { ReactNode } from 'react';
import type { Email } from './types';
export const Button = ({ variant = 'primary', className = '', ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }) => (
  <button {...p} className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${variant === 'primary' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'border border-slate-300 bg-white hover:bg-slate-100'} ${className}`} />
);
export const Field = ({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="block text-sm"><span className="mb-1 block font-medium">{label}</span>
    <input {...p} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" /></label>
);
export const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) => (
  <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
    <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700">✕</button></div>{children}</div></div>
);
const badge: Record<string, string> = { scheduled: 'bg-amber-100 text-amber-700', sent: 'bg-emerald-100 text-emerald-700', failed: 'bg-red-100 text-red-700' };
export const EmailTable = ({ rows, loading, timeLabel, empty }: { rows: Email[]; loading: boolean; timeLabel: string; empty: string }) => {
  if (loading) return <div className="space-y-2 p-4">{[0, 1, 2, 3].map(i => <div key={i} className="h-10 animate-pulse rounded bg-slate-100" />)}</div>;
  if (!rows.length) return <div className="p-16 text-center text-slate-500">{empty}</div>;
  return (
    <div className="overflow-x-auto"><table className="w-full text-left text-sm">
      <thead className="border-b bg-slate-50 text-slate-500"><tr>{['Email', 'Subject', timeLabel, 'Status'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
      <tbody>{rows.map(r => (
        <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50">
          <td className="px-4 py-3">{r.to}</td><td className="px-4 py-3">{r.subject}</td>
          <td className="px-4 py-3 whitespace-nowrap">{new Date(r.at).toLocaleString()}</td>
          <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge[r.status]}`}>{r.status}</span></td></tr>))}
      </tbody></table></div>
  );
};
