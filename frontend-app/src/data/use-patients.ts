import { useQuery } from '@tanstack/react-query';

interface Patient {
  id: string;
  name: string;
  phone: string;
  plan_text: string | null;
}

export const usePatients = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await fetch('/api/patients/');
      if (!response.ok) throw new Error('Failed to fetch patients');
      return response.json() as Promise<Patient[]>;
    },
  });
};