import { create } from 'zustand';
import { Company, Staff } from '../constants/mockData';

interface AppState {
  // Companies
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
  addCompany: (company: Company) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  // Personnel
  personnel: Staff[];
  setPersonnel: (personnel: Staff[]) => void;
  addPersonnel: (person: Staff) => void;
  updatePersonnel: (id: string, person: Partial<Staff>) => void;
  deletePersonnel: (id: string) => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // Companies
  companies: [],
  setCompanies: (companies) => set({ companies }),
  addCompany: (company) => set((state) => ({ companies: [...state.companies, company] })),
  updateCompany: (id, company) =>
    set((state) => ({
      companies: state.companies.map((c) => (c.id === id ? { ...c, ...company } : c)),
    })),
  deleteCompany: (id) =>
    set((state) => ({
      companies: state.companies.filter((c) => c.id !== id),
    })),

  // Personnel
  personnel: [],
  setPersonnel: (personnel) => set({ personnel }),
  addPersonnel: (person) => set((state) => ({ personnel: [...state.personnel, person] })),
  updatePersonnel: (id, person) =>
    set((state) => ({
      personnel: state.personnel.map((p) => (p.id === id ? { ...p, ...person } : p)),
    })),
  deletePersonnel: (id) =>
    set((state) => ({
      personnel: state.personnel.filter((p) => p.id !== id),
    })),

  // UI State
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
