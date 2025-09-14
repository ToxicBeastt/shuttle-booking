import { create } from 'zustand';

export interface Shuttle {
  id: string;
  operator: string;
  origin: string;
  destination: string;
  price: number;
  departures: string[];
  date: string;
}

export interface SearchCriteria {
  origin?: string;
  destination?: string;
  operator?: string;
  departureTime?: string;
  minPrice?: number;
  maxPrice?: number;
  date?: string;
}

export interface FormData {
  name?: string;
  origin?: string;
  destination?: string;
  departureDate?: string;
}

interface ShuttleState {
  shuttles: Shuttle[];
  searchCriteria: SearchCriteria | null;
  filteredShuttles: Shuttle[];
  isLoading: boolean;
  error: any;
  formData: FormData | null;
  setShuttles: (shuttles: Shuttle[]) => void;
  setSearchCriteria: (criteria: SearchCriteria | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: any) => void;
  setFormData: (formData: FormData | null) => void;
  search: (criteria: SearchCriteria) => void;
  resetSearch: () => void;
}

export const useShuttleStore = create<ShuttleState>((set, get) => ({
  shuttles: [],
  searchCriteria: null,
  filteredShuttles: [],
  isLoading: false,
  error: null,
  formData: null,
  setShuttles: (shuttles) => {
    set({ shuttles });
    const { searchCriteria } = get();
    if (searchCriteria) {
      // re-apply search with loaded data
      const filtered = shuttles.filter(shuttle => {
        if (searchCriteria.origin && shuttle.origin !== searchCriteria.origin) return false;
        if (searchCriteria.destination && shuttle.destination !== searchCriteria.destination) return false;
        if (searchCriteria.operator && shuttle.operator !== searchCriteria.operator) return false;
        if (searchCriteria.departureTime && !shuttle.departures.includes(searchCriteria.departureTime)) return false;
        if (searchCriteria.minPrice !== undefined && shuttle.price < searchCriteria.minPrice) return false;
        if (searchCriteria.maxPrice !== undefined && shuttle.price > searchCriteria.maxPrice) return false;
        if (searchCriteria.date && shuttle.date !== searchCriteria.date) return false;
        return true;
      });
      set({ filteredShuttles: filtered });
    } else {
      set({ filteredShuttles: shuttles });
    }
  },
  setSearchCriteria: (criteria) => set({ searchCriteria: criteria }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setFormData: (formData) => set({ formData }),
  search: (criteria) => {
    const { shuttles } = get();
    const filtered = shuttles.filter(shuttle => {
      if (criteria.origin && shuttle.origin !== criteria.origin) return false;
      if (criteria.destination && shuttle.destination !== criteria.destination) return false;
      if (criteria.operator && shuttle.operator !== criteria.operator) return false;
      if (criteria.departureTime && !shuttle.departures.includes(criteria.departureTime)) return false;
      if (criteria.minPrice !== undefined && shuttle.price < criteria.minPrice) return false;
      if (criteria.maxPrice !== undefined && shuttle.price > criteria.maxPrice) return false;
      if (criteria.date && shuttle.date !== criteria.date) return false;
      return true;
    });
    set({ searchCriteria: criteria, filteredShuttles: filtered });
  },
  resetSearch: () => {
    const { shuttles } = get();
    set({ searchCriteria: null, filteredShuttles: shuttles });
  },
}));
