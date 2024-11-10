import { ProfileCard } from "@/components/profile/profile-card"
import { ProfileData } from "@/types/profile"

const profiles: ProfileData[] = [
    {
      name: "Charles Robbie",
      age: 45,
      location: "San Francisco, USA",
      bloodType: "O+",
      height: 186,
      weight: 90.7,
      measurementUnit: "metric",
      avatarUrl: "/images/charles.webp",
      calendarData: {
        month: "November",
        days: [
          { date: 4 },
          { date: 5 },
          { date: 6, isSelected: true, hasEvent: true },
          { date: 7 },
          { date: 8, hasEvent: true },
          { date: 9 },
          { date: 10 },
        ],
        events: [
            {
            title: "Morning journaling",
            location: "Golden Gate Park",
            time: "07:00 AM",
            status: "completed",
            type: "appointment"
            },
            {
            title: "Homeless Shelter Resources",
            location: "Dok Tomm",
            time: "05:30 PM - 7:30 PM",
            type: "appointment",
            status: "missed"
          },
          {
            title: "Evening Medication",
            time: "07:00 PM",
            status: "not taken",
            type: "medication"
          }
        ]
      }
    },
    {
      name: "Sofia Calloway",
      age: 32,
      location: "New York, USA",
      bloodType: "A+",
      height: 170,
      weight: 65,
      measurementUnit: "metric",
      avatarUrl: "/images/sofia.webp",
      calendarData: {
        month: "November",
        days: [
          { date: 4 },
          { date: 5 },
          { date: 6, isSelected: true, hasEvent: true },
          { date: 7, hasEvent: true },
          { date: 8 },
          { date: 9 },
          { date: 10 },
        ],
        events: [
          {
            title: "Food Bank Resources",
            location: "4th Street Food Bank",
            time: "01:30 PM - 2:30 PM",
            type: "appointment",
            status: "completed"
          },
          {
            title: "Afternoon Medication",
            time: "02:00 PM",
            type: "medication",
            status: "completed"
          },
          {
            title: "Therapy Session",
            location: "Dr. Smith's Office",
            time: "04:00 PM - 5:00 PM",
            type: "appointment",
            status: "cancelled"
          }
        ]
      }
    }
  ]

export default function ProfilePage() {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-[#002062] to-[#143C78]">
      <div className="flex gap-4">  {/* Changed to flex with gap */}
        {profiles.map((profile) => (
          <div key={profile.name} className="max-w-md flex-1">
            <ProfileCard {...profile} />
          </div>
        ))}
      </div>
    </div>
  )
}