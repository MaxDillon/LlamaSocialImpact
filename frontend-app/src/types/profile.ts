import { CalendarData } from './calendar';

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodType = typeof BLOOD_TYPES[number];
export type MeasurementUnit = 'metric' | 'imperial';

export interface ProfileData {
  name: string;
  age: number;
  location: string;
  bloodType: BloodType;
  height: number;
  weight: number;
  avatarUrl?: string;
  measurementUnit?: MeasurementUnit;
  calendarData: CalendarData;
}