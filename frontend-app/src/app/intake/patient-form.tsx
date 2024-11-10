"use client";

import { useState } from "react";
import {
  PlusCircle,
  Trash2,
  Upload,
  User,
  Phone,
  FileText,
  Users,
} from "lucide-react";
import {getFormattedNumber, getMetadata, parsePhoneNumber, useMask} from "react-phone-hooks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatePatient } from "@/data/use-create-patient";
export interface Provider {
  name: string;
  role: string;
  phoneNumber: string;
}

export default function ClientInfoPage() {
  const [clientName, setClientName] = useState("");
  const [clientPhoneNumber, setClientPhoneNumber] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState<File | null>(null);
  const [providers, setProviders] = useState<Provider[]>([
    { name: "", role: "", phoneNumber: "" },
  ]);

  const handleAddProvider = () => {
    setProviders([...providers, { name: "", role: "", phoneNumber: "" }]);
  };

  const handleRemoveProvider = (index: number) => {
    const newProviders = providers.filter((_, i) => i !== index);
    setProviders(newProviders);
  };

  const handleProviderChange = (
    index: number,
    field: keyof Provider,
    value: string
  ) => {
    const newProviders = [...providers];
    newProviders[index][field] = value;
    setProviders(newProviders);
  };
  const { mutate: createPatient, isPending, error } = useCreatePatient();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!treatmentPlan) {
      alert("Please upload a treatment plan");
      return;
    }
    createPatient({ clientName, clientPhoneNumber, treatmentPlan, providers });
    console.log({ clientName, clientPhoneNumber, treatmentPlan, providers });
  };

  return (
    <div className="container mx-auto py-8 space-y-8 px-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Intake A New Client
      </h1>
      <h4 className="text-xl text-center mb-8">
        You'll be able to add the client's exit plan and providers here.
      </h4>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-6 h-6 mr-2" />
                Client Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  placeholder="Enter client's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPhoneNumber">Client Phone Number</Label>
                <Input
                  id="clientPhoneNumber"
                  type="tel"
                  value={clientPhoneNumber}
                  onChange={(e) => setClientPhoneNumber(e.target.value)}
                  required
                  placeholder="Enter client's phone number"

                  {...useMask("+1 (...) ... ....")}
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
                <label
                  htmlFor="treatmentPlan"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                  </div>
                  <Input
                    id="treatmentPlan"
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                      setTreatmentPlan(e.target.files?.[0] || null)
                    }
                    required
                    className="hidden"
                  />
                </label>
              </div>
              {treatmentPlan && (
                <p className="text-sm text-muted-foreground">
                  File selected: {treatmentPlan.name}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Care Providers
              </div>
              <Button onClick={handleAddProvider} variant="outline" size="sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Provider
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[200px] pr-4">
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
                            onChange={(e) =>
                              handleProviderChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            required
                            placeholder="Provider's name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`providerRole${index}`}>Role</Label>
                          <Select required>
                            <SelectTrigger
                              id={`providerRole${index}`}
                              value={provider.role}
                              onChange={(e) =>
                                handleProviderChange(
                                  index,
                                  "role",
                                  e.target.value
                                )
                              }
                            >
                              <SelectValue placeholder="Provider's role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="case_manager">
                                  Case Manager
                                </SelectItem>
                                <SelectItem value="primary_care">
                                  Primary Care Provider
                                </SelectItem>
                                <SelectItem value="mental_health">
                                  Mental Health Provider
                                </SelectItem>
                                <SelectItem value="housing_coordinator">
                                  Housing Coordinator
                                </SelectItem>
                                <SelectItem value="crisis_team">
                                  Crisis Team Member
                                </SelectItem>
                                <SelectItem value="shelter_staff">
                                  Shelter Staff
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`providerPhoneNumber${index}`}>
                            Phone Number
                          </Label>
                          <Input
                            {...useMask("+1 (...) ... ....")}
                            id={`providerPhoneNumber${index}`}
                            type="tel"
                            value={provider.phoneNumber}
                            onChange={(e) =>
                              handleProviderChange(
                                index,
                                "phoneNumber",
                                e.target.value
                              )
                            }
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
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-center">
          <Button type="submit" size="lg">
            Submit Client Information
          </Button>
        </div>
      </form>
    </div>
  );
}
