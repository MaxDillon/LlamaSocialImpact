"use client";
import { Module, usePatientCheckups } from "@/data/use-patient-checkups";
import { useParams } from "next/navigation";
import PatientCheckups from "./patient-checkups";
import ModulePopup from "../../module-popup";
import { useState } from "react";

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

  const handleSaveModule = (moduleId: string, updatedInputs: Record<string, any>) => {
    // Handle saving the updated module inputs
    console.log("Saving module", moduleId, updatedInputs);
    // You would typically make an API call here to update the module
    // Then close the popup or update the local state
    handleClosePopup();
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
        />
      )}
    </>
  );
}
