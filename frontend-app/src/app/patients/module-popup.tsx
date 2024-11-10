"use client";

import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Module } from "@/data/use-patient-checkups";
import { DialogTitle } from "@radix-ui/react-dialog";

export interface ModuleType {
  title: string;
  description: string;
  inputs: Record<string, string>;
}

export const moduleTypes: Record<string, ModuleType> = {
  outreach_check: {
    title: "Confirm Outreach",
    description:
      "Alice will confirm if contact was made with another person or organization.",
    inputs: {
      phone_number: "Phone Number to Call",
    },
  },
  drug_survey: {
    title: "Drug Usage Survey",
    description: "Assess recent drug use patterns and risk levels",
    inputs: {
        maxAlertScore: "Maximum Score That Will Trigger a Call",
    },
  },
  phq_assessment: {
    title: "PHQ-2 Assessment",
    description:
      "Alice will evaluate the patient's current level of depression using PHQ-2 Guidelines",
    inputs: {
      maxAlertScore: "Maximum Safe Score",
    },
  },
  ipv_assessment: {
    title: "IPV Assessment",
    description: "Alice will evaluate signs of domestic violence using IPV/HITS Guidelines",
    inputs: {
        maxAlertScore: "Maximum Safe Score",
    },
  },
  // Add more module types as needed
};

interface ModulePopupProps {
  isOpen: boolean;
  onClose: () => void;
  module: Module;
  onSave: (module: Module) => void;
  isSaving: boolean;
}

export default function ModulePopup({
  isOpen,
  onClose,
  module,
  onSave,
  isSaving,
}: ModulePopupProps) {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [rationale, setRationale] = useState(module.rationale);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setInputs(module.inputs);
    setRationale(module.rationale);
    setIsDirty(false);
  }, [module]);

  const handleInputChange = (key: string, value: any) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleRationaleChange = (value: string) => {
    setRationale(value);
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave({
      ...module,
      inputs,
      rationale,
    });
    setIsDirty(false);
  };

  const moduleTypeInfo = moduleTypes[module.module_type] || {
    title: module.module_type,
    description: "Configure module settings and view results",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <DialogTitle>
          <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-6 py-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-primary">
                {moduleTypeInfo.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                What does this module do?
              </p>
              <p className="text-md">{moduleTypeInfo.description}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogTitle>
        <ScrollArea className="max-h-[calc(100vh-8rem)]">
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <div className="space-y-6 md:col-span-2">
              <div className="rounded-lg border bg-card p-4">
                <Label htmlFor="rationale" className="text-base font-semibold">
                  Details for outreach
                </Label>
                <Textarea
                  id="rationale"
                  value={rationale}
                  onChange={(e) => handleRationaleChange(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Inputs</h3>
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                  {Object.entries(inputs).map(([key, value]) => (
                    <div key={key}>
                      <Label htmlFor={key} className="text-sm font-medium">
                        {moduleTypeInfo.inputs[key] || key
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </Label>
                      {typeof value === "string" && value.length > 50 ? (
                        <Textarea
                          id={key}
                          value={value}
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          className="mt-1.5"
                        />
                      ) : (
                        <Input
                          id={key}
                          value={value}
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          className="mt-1.5"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Outputs</h3>
                <Separator className="my-4" />
                <div className="space-y-4">
                  {!module.outputs && <p>No outputs yet</p>}
                  {module.outputs &&
                    Object.entries(module.outputs).map(([key, value]) => (
                      <div key={key}>
                        <Label
                          htmlFor={`output-${key}`}
                          className="text-sm font-medium"
                        >
                          {key
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </Label>
                        <Input
                          id={`output-${key}`}
                          value={value}
                          readOnly
                          className={cn(
                            "mt-1.5",
                            "bg-muted",
                            typeof value === "number" &&
                              value > 7 &&
                              "border-red-500 bg-red-50",
                            typeof value === "number" &&
                              value <= 3 &&
                              "border-green-500 bg-green-50"
                          )}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold">Transcript</h3>
              <Separator className="my-4" />
              <div className="rounded-lg border bg-muted p-4">
                <pre className="text-sm whitespace-pre-wrap">
                  {module.transcript}
                </pre>
              </div>
            </div>
            <div className="ml-auto">
              {isDirty && !isSaving && (
                <Button size="sm" onClick={handleSave} className="h-8">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              )}
              {isSaving && (
                <Button disabled>
                  <Loader2 className="animate-spin" />
                  Please wait
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
