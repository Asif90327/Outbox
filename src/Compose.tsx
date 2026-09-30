import { useState } from 'react';
import { Button, Field, Modal } from './ui';
import { schedule } from './api';
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const localNow = () => new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
export default function Compose({ onClose, onDone, toast }: { onClose: () => void; onDone: () => void; toast: (m: string) => void }) {
  const [subject, setSubject] = useState(''); const [body, setBody] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]); const [file, setFile] = useState('');
  const [start, setStart] = useState(localNow()); const [delay, setDelay] = useState(2); const [limit, setLimit] = useState(200);
  const [busy, setBusy] = useState(false);
  const onFile = async (f?: File) => {
    if (!f) return;
    setFile(f.name); setRecipients([...new Set((await f.text()).match(EMAIL_RE) ?? [])]);
  };
  const submit = async () => {
    if (!subject || !body || !recipients.length) return toast('Add subject, body and a lead file with emails');
    setBusy(true);
    try { await schedule({ subject, body, recipients, startTime: new Date(start).toISOString(), delaySec: delay, hourlyLimit: limit }); toast(`Scheduled ${recipients.length} emails`); onDone(); onClose(); }
    catch (e) { toast((e as Error).message); } finally { setBusy(false); }
  };
  return (
    <Modal title="Compose New Email" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
        <label className="block text-sm"><span className="mb-1 block font-medium">Body</span>
          <textarea rows={5} value={body} onChange={e => setBody(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" /></label>
        <label className="block cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 hover:border-emerald-500">
          {file ? <><b className="text-slate-800">{file}</b> — {recipients.length} email addresses detected</> : 'Upload CSV / text file of leads'}
          <input type="file" accept=".csv,.txt" hidden onChange={e => onFile(e.target.files?.[0])} /></label>
        <Field label="Start time" type="datetime-local" value={start} onChange={e => setStart(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Delay between emails (sec)" type="number" min={0} value={delay} onChange={e => setDelay(+e.target.value)} />
          <Field label="Hourly limit" type="number" min={1} value={limit} onChange={e => setLimit(+e.target.value)} /></div>
        <div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={submit} disabled={busy}>{busy ? 'Scheduling…' : 'Schedule'}</Button></div>
      </div></Modal>
  );
}
