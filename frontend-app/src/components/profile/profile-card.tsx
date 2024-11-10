import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { CalendarView } from "@/components/calendar/calendar-view"
import { CalendarData } from "@/types/calendar"

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
type BloodType = typeof BLOOD_TYPES[number];
type MeasurementUnit = 'metric' | 'imperial';

interface ProfileData {
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

interface StatItemProps {
  label: string;
  value: string | number;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export function ProfileCard({ 
  name, 
  age, 
  location, 
  bloodType, 
  height, 
  weight, 
  avatarUrl,
  measurementUnit = 'metric',
  calendarData
}: ProfileData) {
  const formattedHeight = measurementUnit === 'metric' ? `${height}cm` : `${Math.floor(height / 2.54 / 12)}' ${Math.round(height / 2.54 % 12)}"`
  const formattedWeight = measurementUnit === 'metric' ? `${weight}kg` : `${Math.round(weight * 2.2)}lb`

  return (
    <Card className="w-full max-w-md bg-gray-800/50 text-white border-0">
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold">{name}</h2>
            <div className="flex items-center justify-center text-gray-400 mt-1">
              <span>{age} years old</span>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{location}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between w-full px-4 py-2 mt-4">
            <StatItem label="Blood" value={bloodType} />
            <StatItem label="Height" value={formattedHeight} />
            <StatItem label="Weight" value={formattedWeight} />
          </div>
        </div>

        <CalendarView 
          month={calendarData.month}
          days={calendarData.days}
          events={calendarData.events}
        />
      </CardContent>
    </Card>
  )
}