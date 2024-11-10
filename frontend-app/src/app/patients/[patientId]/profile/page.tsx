"use client";
import { Module, usePatientCheckups } from "@/data/use-patient-checkups";
import { useParams } from "next/navigation";
import PatientCheckups from "./patient-checkups";
import ModulePopup from "../../module-popup";
import { useState } from "react";
import { useUpdateModule } from "@/data/use-update-module";

export default function PatientPage() {
  const { patientId } = useParams();
  const { data: patientCheckups, isLoading } = usePatientCheckups(
    patientId as string
  );

  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const handleModuleClick = (module: Module) => {
    setSelectedModule(module);
  };

  const handleClosePopup = () => {
    setSelectedModule(null);
  };
  const { mutate: updateModule, isPending } = useUpdateModule();

  const handleSaveModule = (module: Module) => {
    // Handle saving the updated module inputs
    console.log("Saving module", module);
    updateModule(module);
  };

  return (
    <>
      {patientCheckups && <PatientCheckups patientId={patientId as string} onModuleClick={handleModuleClick}/>}
      {selectedModule && (
        <ModulePopup
          isOpen={!!selectedModule}
          onClose={handleClosePopup}
          module={selectedModule}
          onSave={handleSaveModule}
          isSaving={isPending}
        />
      )}
    </>
  );
}
