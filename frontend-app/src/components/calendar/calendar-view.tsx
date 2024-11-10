import { MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"

interface CalendarDay {
  date: number
  isSelected?: boolean
  hasEvent?: boolean
}

interface Event {
  title: string
  location?: string
  time: string
  status?: 'pending' | 'completed' | 'not taken' | 'missed' | 'cancelled'
  type: 'appointment' | 'medication'
}

interface CalendarViewProps {
  month: string
  days: CalendarDay[]
  events: Event[]
  onUpdateStatus?: (eventIndex: number, newStatus: Event['status']) => void
}

export function CalendarView({ month, days, events, onUpdateStatus }: CalendarViewProps) {
  const weekDays = ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  const statusOptions = ['completed', 'not taken', 'missed', 'cancelled'] as const

  const getStatusColor = (status?: Event['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'not taken': return 'text-red-400'
      case 'missed': return 'text-red-500'
      case 'cancelled': return 'text-gray-400'
      default: return 'text-yellow-400'
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Calendar Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">{month} ▾</h3>
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-center">
          {weekDays.map((day) => (
            <div key={day} className="text-sm text-gray-400">
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <div
              key={index}
              className={`
                p-2 rounded-full text-sm
                ${day.isSelected ? 'bg-blue-600 text-white' : ''}
                ${day.hasEvent ? 'after:content-["•"] after:block after:text-blue-400' : ''}
                ${!day.isSelected ? 'text-gray-300' : ''}
              `}
            >
              {day.date}
            </div>
          ))}
        </div>
      </div>

      {/* Updated Events Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Upcoming</h3>
        <div className="space-y-3">
          {events.map((event, index) => (
            <Card key={index} className="bg-gray-800/50 border-0 p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-700/50 rounded-lg">
                  {event.type === 'appointment' ? '🔔' : '💊'}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="text-white font-medium">{event.title}</h4>
                    <span className={`text-sm ${getStatusColor(event.status)}`}>
                      {event.status || 'pending'}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center text-gray-400 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.location}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-400 text-sm">{event.time}</span>
                    {event.status && onUpdateStatus && (
                      <select
                        value={event.status}
                        onChange={(e) => onUpdateStatus(index, e.target.value as Event['status'])}
                        className="bg-gray-700 text-sm rounded px-2 py-1 border border-gray-600"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 