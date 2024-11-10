'use client'

import { useState } from 'react'
import { PlusCircle, Trash2, Upload, User, Phone, FileText, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Provider {
  name: string
  role: string
  phoneNumber: string
}

export default function PatientInfoPage() {
  const [patientName, setPatientName] = useState('')
  const [patientPhoneNumber, setPatientPhoneNumber] = useState('')
  const [treatmentPlan, setTreatmentPlan] = useState<File | null>(null)
  const [providers, setProviders] = useState<Provider[]>([{ name: '', role: '', phoneNumber: '' }])

  const handleAddProvider = () => {
    setProviders([...providers, { name: '', role: '', phoneNumber: '' }])
  }

  const handleRemoveProvider = (index: number) => {
    const newProviders = providers.filter((_, i) => i !== index)
    setProviders(newProviders)
  }

  const handleProviderChange = (index: number, field: keyof Provider, value: string) => {
    const newProviders = [...providers]
    newProviders[index][field] = value
    setProviders(newProviders)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log({ patientName, patientPhoneNumber, treatmentPlan, providers })
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">Intake A New Patient</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-6 h-6 mr-2" />
                Patient Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                  placeholder="Enter patient's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientPhoneNumber">Patient Phone Number</Label>
                <Input
                  id="patientPhoneNumber"
                  type="tel"
                  value={patientPhoneNumber}
                  onChange={(e) => setPatientPhoneNumber(e.target.value)}
                  required
                  placeholder="Enter patient's phone number"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-6 h-6 mr-2" />
                Exit Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="treatmentPlan">Upload Exit Plan (PDF)</Label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="treatmentPlan" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                  </div>
                  <Input
                    id="treatmentPlan"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setTreatmentPlan(e.target.files?.[0] || null)}
                    required
                    className="hidden"
                  />
                </label>
              </div>
              {treatmentPlan && (
                <p className="text-sm text-muted-foreground">File selected: {treatmentPlan.name}</p>
              )}
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Providers
              </div>
              <Button onClick={handleAddProvider} variant="outline" size="sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Provider
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {providers.map((provider, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`providerName${index}`}>Name</Label>
                          <Input
                            id={`providerName${index}`}
                            value={provider.name}
                            onChange={(e) => handleProviderChange(index, 'name', e.target.value)}
                            required
                            placeholder="Provider's name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`providerRole${index}`}>Role</Label>
                          <Input
                            id={`providerRole${index}`}
                            value={provider.role}
                            onChange={(e) => handleProviderChange(index, 'role', e.target.value)}
                            required
                            placeholder="Provider's role"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`providerPhoneNumber${index}`}>Phone Number</Label>
                          <Input
                            id={`providerPhoneNumber${index}`}
                            type="tel"
                            value={provider.phoneNumber}
                            onChange={(e) => handleProviderChange(index, 'phoneNumber', e.target.value)}
                            required
                            placeholder="Provider's phone number"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveProvider(index)}
                        disabled={providers.length === 1}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Provider
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <div className="flex justify-center">
          <Button type="submit" size="lg">
            Submit Patient Information
          </Button>
        </div>
      </form>
    </div>
  )
}