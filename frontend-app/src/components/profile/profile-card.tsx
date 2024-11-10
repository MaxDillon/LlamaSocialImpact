'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { CalendarView } from "@/components/calendar/calendar-view"
import { CalendarData, CalendarEvent } from "@/types/calendar"
import { PhoneIcon } from "@heroicons/react/24/solid"

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

interface ProfileCardProps extends ProfileData {
  onUpdateStatus: (eventIndex: number, newStatus: CalendarEvent['status']) => void;
}

export function ProfileCard({ onUpdateStatus, ...props }: ProfileCardProps) {
  const formattedHeight = props.measurementUnit === 'metric' ? `${props.height}cm` : `${Math.floor(props.height / 2.54 / 12)}' ${Math.round(props.height / 2.54 % 12)}"`
  const formattedWeight = props.measurementUnit === 'metric' ? `${props.weight}kg` : `${Math.round(props.weight * 2.2)}lb`

  return (
    <Card className="w-full max-w-md bg-gray-800/50 text-white border-0 relative">
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={props.avatarUrl} />
            <AvatarFallback>{props.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold">{props.name}</h2>
            <div className="flex items-center justify-center text-gray-400 mt-1">
              <span>{props.age} years old</span>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{props.location}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between w-full px-4 py-2 mt-4">
            <StatItem label="Blood" value={props.bloodType} />
            <StatItem label="Height" value={formattedHeight} />
            <StatItem label="Weight" value={formattedWeight} />
          </div>
        </div>

        <CalendarView 
          month={props.calendarData.month}
          days={props.calendarData.days}
          events={props.calendarData.events}
        />
      </CardContent>
      
      <button 
        className="absolute top-4 left-4 p-3 bg-yellow-400/80 hover:bg-yellow-500/90 
          rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        onClick={() => console.log(`Initiating call with ${props.name}`)}
      >
        <PhoneIcon className="h-5 w-5 text-white" />
      </button>
    </Card>
  )
}