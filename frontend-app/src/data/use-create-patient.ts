// useCreatePatient.ts
import { Provider } from '@/app/intake/patient-form';
import { useMutation } from '@tanstack/react-query';


interface CreatePatientParams {
  clientName: string;
  clientPhoneNumber: string;
  treatmentPlan: File;
  providers: Provider[];
}

interface CreatePatientResponse {
  id: string;
  plan_text: string;
}

export const useCreatePatient = () => {
  return useMutation({
    mutationFn: async ({
      clientName,
      clientPhoneNumber,
      treatmentPlan,
      providers,
    }: CreatePatientParams) => {
      const formData = new FormData();
      formData.append('plan_pdf', treatmentPlan);
      formData.append('name', clientName);
      formData.append('phone', clientPhoneNumber);
      // Adding providers as a JSON string since we're using multipart/form-data
      formData.append('providers', JSON.stringify(providers));
      
      const response = await fetch(`/api/patients/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create patient');
      }

      return response.json() as Promise<CreatePatientResponse>;
    },
  });
};