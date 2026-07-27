export interface Note {
  id: number;
  text: string;
  created_at?: string;
}

export interface Candidate {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  position: string;
  linkedin?: string;
  cv_url?: string;
  experience_years?: number;
  status: string; // Ej: Applied, Interviewing, Offered, Rejected
  stage: string;  // Ej: Sourcing, Screening, Technical, Final
  created_at?: string;
}