export enum LogType {
  NURSING = 'NURSING',
  BOTTLE = 'BOTTLE',
  PUMP = 'PUMP',
  DIAPER = 'DIAPER',
}

export enum BottleSubType {
  FORMULA = 'FORMULA',
  BREAST_MILK = 'BREAST_MILK',
}

export enum DiaperSubType {
  WET = 'WET',
  DIRTY = 'DIRTY',
  BOTH = 'BOTH',
}

export type Side = 'LEFT' | 'RIGHT';

export interface Log {
  id: string;
  created_at: string; // ISO String
  type: LogType;
  sub_type?: string; // BottleSubType | DiaperSubType
  side?: Side; // Starting side for nursing
  amount_ml?: number;
  amount_ml_left?: number;
  amount_ml_right?: number;
  duration_seconds?: number; // Total nursing duration
  notes?: string;
}

// For the UI state when creating a log
export interface LogDraft {
  type: LogType;
  sub_type?: string;
  side?: Side;
  amount_ml?: number;
  amount_ml_left?: number;
  amount_ml_right?: number;
  duration_seconds?: number;
  notes?: string;
  timestamp: Date;
}