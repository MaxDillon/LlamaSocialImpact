import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Module } from "./use-patient-checkups";

export const useUpdateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (module: Module) => {
      const response = await fetch(`/api/modules/${module.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(module),
      });

      if (!response.ok) throw new Error("Failed to update module");
      return response.json();
    },
    // Invalidate relevant queries after successful update
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["modules", variables.id] });
      // If you're showing this in a patient's checkups list, you might want to invalidate that too
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};
