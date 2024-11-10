"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface ModuleType {
  title: string;
  description: string;
}

export const moduleTypes: Record<string, ModuleType> = {
  outreach_check: {
    title: "Outreach Check",
    description:
      "You can use this module to check if the patient was able to make contact with another person or organization",
  },
  drug_survey: {
    title: "Drug Usage Survey",
    description: "Assess recent drug use patterns and risk levels",
  },
  // Add more module types as needed
};

interface ModulePopupProps {
  isOpen: boolean;
  onClose: () => void;
  module: {
    id: string;
    module_type: string;
    inputs: Record<string, any>;
    outputs: Record<string, any>;
    rationale: string;
    transcript: string;
  };
  onSave: (
    moduleId: string,
    updatedInputs: Record<string, any>,
    updatedRationale: string
  ) => void;
}

export default function ModulePopup({
  isOpen,
  onClose,
  module,
  onSave,
}: ModulePopupProps) {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [rationale, setRationale] = useState("");
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
    onSave(module.id, inputs, rationale);
    setIsDirty(false);
  };

  const moduleTypeInfo = moduleTypes[module.module_type] || {
    title: module.module_type,
    description: "Configure module settings and view results",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-6 py-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-primary">
              {moduleTypeInfo.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              What does this module do?
            </p>
            <p className="text-md">
              {moduleTypeInfo.description}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <ScrollArea className="max-h-[calc(100vh-8rem)]">
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <div className="space-y-6 md:col-span-2">
              <div className="rounded-lg border bg-card p-4">
                <Label htmlFor="rationale" className="text-base font-semibold">
                  Rationale
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
                        {key
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
            <div ml="auto">
              {isDirty && (
                <Button size="sm" onClick={handleSave} className="h-8">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
