export interface CalendarEvent {
    title: string;
    location?: string;
    time: string;
    type: "appointment" | "medication";
    status?: "not taken" | "completed" | "missed" | "cancelled";
  }
  
  export interface CalendarDay {
    date: number;
    isSelected?: boolean;
    hasEvent?: boolean;
  }
  
  export interface CalendarData {
    month: string;
    days: CalendarDay[];
    events: CalendarEvent[];
  }