export type Status = 'scheduled' | 'sent' | 'failed';
export interface Email { id: string; to: string; subject: string; at: string; status: Status }
export interface User { name: string; email: string; avatar: string }
export interface SchedulePayload { subject: string; body: string; recipients: string[]; startTime: string; delaySec: number; hourlyLimit: number }
