import { createContext } from 'react';

interface TimeContextValue {
  getCurrentTime: (timezone: string) => Date;
}

export const TimeContext = createContext<TimeContextValue | null>(null);
