'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react'
import { Module, usePatientCheckups } from '@/data/use-patient-checkups'
import { moduleTypes } from '../../module-popup'

export default function PatientCheckups({ patientId, onModuleClick }: { patientId: string, onModuleClick: (module: Module) => void }) {
  const { data: checkups, isLoading, error } = usePatientCheckups(patientId)

  if (isLoading) return <div className="text-center">Loading checkups...</div>
  if (error) return <div className="text-center text-red-500">Error loading checkups</div>
  if (!checkups || checkups.length === 0) return <div className="text-center">No checkups found</div>

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'pending':
        return <HelpCircle className="h-6 w-6 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="h-6 w-6 text-red-500" />
      default:
        return <HelpCircle className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full">
      <div className="container mx-auto p-4 space-y-8">
        {checkups.map((checkup) => (
          <Card key={checkup.id} className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Day {checkup.sequence_number} Checkup
              </CardTitle>
              <p className="text-muted-foreground">{new Date(checkup.scheduled_for).toLocaleDateString()}</p>
              <p className="mt-2 font-semibold">Description:</p>
              <p>{checkup.description}</p>
              <p className="mt-2 font-semibold">Goals:</p>
              <p>{checkup.goals}</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {checkup.modules.map((module) => (
                  <Card key={module.id} className="flex flex-col" onClick={() => onModuleClick(module)}>
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {moduleTypes[module.module_type].title}
                      </CardTitle>
                      {getStatusIcon(module.status)}
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">{module.rationale}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {Object.entries(module.inputs).map(([key, value]) => (
                          <Badge key={key} variant="secondary" className="text-xs" color={value ? 'success' : 'gray'}>
                            {key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())} {value ? `: ${value}` : '<not set>'}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}