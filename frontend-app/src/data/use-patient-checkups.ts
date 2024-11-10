import { useQuery } from "@tanstack/react-query";

export interface Module {
  id: string;
  module_type: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  rationale: string;
  transcript: string;
  status: string;
}
export interface Checkup {
  id: string;
  sequence_number: number;
  description: string;
  goals: string;
  scheduled_for: string;
  modules: Module[];
}

export const usePatientCheckups = (patientId?: string) => {
  return useQuery({
    queryKey: ["patients", patientId, "checkups"],
    queryFn: async () => {
      const response = await fetch(`/api/patients/${patientId}/checkups/`);
      if (!response.ok) throw new Error("Failed to fetch checkups");
      return response.json() as Promise<Checkup[]>;
    },
    enabled: !!patientId,
  });
};
