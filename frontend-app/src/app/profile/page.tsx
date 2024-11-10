'use client'

import { useState } from "react"
import { ProfileCard } from "@/components/profile/profile-card"
import { ProfileData, RiskLevel } from "@/types/profile"
import { CalendarEvent } from "@/types/calendar"

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
      riskLevel: "high",
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
      riskLevel: "low",
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
    },
    {
      name: "Chris Anderson",
      age: 65,
      location: "Seattle, USA",
      bloodType: "B+",
      height: 175,
      weight: 78,
      measurementUnit: "metric",
      avatarUrl: "/images/chris.webp",
      riskLevel: "high",
      calendarData: {
        month: "November",
        days: [
          { date: 4 },
          { date: 5, hasEvent: true },
          { date: 6, hasEvent: true, isSelected: true },
          { date: 7, hasEvent: true },
          { date: 8 },
          { date: 9 },
          { date: 10 },
        ],
        events: [
          {
            title: "Mental Health Check-up",
            location: "Seattle Clinic",
            time: "10:00 AM",
            type: "appointment",
            status: "missed"
          },
          {
            title: "Evening Medication",
            time: "08:00 PM",
            type: "medication",
            status: "not taken"
          }
        ]
      }
    },
    {
      name: "Roger Jones",
      age: 40,
      location: "Los Angeles, USA",
      bloodType: "AB+",
      height: 182,
      weight: 85,
      measurementUnit: "metric",
      avatarUrl: "/images/roger.webp",
      riskLevel: "high",
      calendarData: {
        month: "November",
        days: [
          { date: 4 },
          { date: 5, hasEvent: true },
          { date: 6, isSelected: true },
          { date: 7, hasEvent: true },
          { date: 8 },
          { date: 9 },
          { date: 10, hasEvent: true },
        ],
        events: [
          {
            title: "Support Group Meeting",
            location: "Community Center",
            time: "11:00 AM",
            type: "appointment",
            status: "completed"
          },
          {
            title: "Daily Medication",
            time: "09:00 AM",
            type: "medication",
            status: "not taken"
          }
        ]
      }
    },
    {
      name: "Julius Matthew",
      age: 55,
      location: "San Francisco, USA", 
      bloodType: "O-",
      height: 178,
      weight: 82,
      measurementUnit: "metric",
      avatarUrl: "/images/julius.webp",
      riskLevel: "medium",
      calendarData: {
        month: "November",
        days: [
          { date: 4, hasEvent: true },
          { date: 5 },
          { date: 6, isSelected: true },
          { date: 7 },
          { date: 8, hasEvent: true },
          { date: 9 },
          { date: 10 }
        ],
        events: [
          {
            title: "Doctor's Appointment",
            location: "SF Medical Center",
            time: "10:30 AM",
            type: "appointment",
            status: "completed"
          },
          {
            title: "Blood Pressure Check",
            location: "Home",
            time: "06:00 PM",
            type: "appointment",
            status: "cancelled"
          }
        ]
      }
    },
    {
      name: "Brett Anderson",
      age: 38,
      location: "Chicago, USA",
      bloodType: "B+",
      height: 175,
      weight: 78,
      measurementUnit: "metric", 
      avatarUrl: "/images/brett.webp",
      riskLevel: "low",
      calendarData: {
        month: "November",
        days: [
          { date: 4 },
          { date: 5, hasEvent: true },
          { date: 6, isSelected: true },
          { date: 7 },
          { date: 8, hasEvent: true },
          { date: 9 },
          { date: 10 }
        ],
        events: [
          {
            title: "Therapy Session",
            location: "Wellness Center",
            time: "2:00 PM",
            type: "appointment",
            status: "completed"
          },
          {
            title: "Evening Medication",
            time: "8:00 PM",
            type: "medication", 
            status: "completed"
          }
        ]
      }
    }
]

export default function ProfilePage() {
  const [profilesState, setProfilesState] = useState(profiles)
  const [selectedProfile, setSelectedProfile] = useState<ProfileData | null>(null)

  const updateEventStatus = (profileName: string, eventIndex: number, newStatus: CalendarEvent['status']) => {
    setProfilesState(prevProfiles => 
      prevProfiles.map(profile => {
        if (profile.name === profileName) {
          const updatedEvents = [...profile.calendarData.events]
          updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], status: newStatus }
          return {
            ...profile,
            calendarData: {
              ...profile.calendarData,
              events: updatedEvents
            }
          }
        }
        return profile
      })
    )
  }

  const getRiskColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#002062] to-[#143C78]">
      <div className="flex">
        <div className="w-full max-w-4xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Clients</h2>
          <div className="space-y-4">
            {profilesState.map((profile) => (
              <div
                key={profile.name}
                onClick={() => setSelectedProfile(profile)}
                className={`
                  p-4 rounded-xl cursor-pointer transition-all flex items-center
                  ${profile.name === selectedProfile?.name ? 'bg-gray-700/50' : 'bg-gray-800/30 hover:bg-gray-700/40'}
                `}
              >
                <div className={`w-2 h-12 rounded-full mr-4 ${getRiskColor(profile.riskLevel)}`} />
                <div className="flex items-center gap-4">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-white font-medium">{profile.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {profile.age} years old • {profile.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[400px] fixed right-0 top-0 h-screen bg-gray-900/50 backdrop-blur-sm">
          {selectedProfile && (
            <div className="p-4">
              <ProfileCard 
                {...selectedProfile} 
                onUpdateStatus={(eventIndex, newStatus) => 
                  updateEventStatus(selectedProfile.name, eventIndex, newStatus)
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}