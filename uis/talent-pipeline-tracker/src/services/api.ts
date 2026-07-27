import { Candidate, Note } from '../types/candidate';

const STORAGE_KEY = 'talent_candidates';
const NOTES_STORAGE_KEY = 'talent_candidate_notes';

const getStoredCandidates = (): Candidate[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveStoredCandidates = (candidates: Candidate[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
};

const getStoredNotes = (): Record<string, Note[]> => {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(NOTES_STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

const saveStoredNotes = (notesMap: Record<string, Note[]>) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesMap));
};

export async function getCandidates(): Promise<Candidate[]> {
  return getStoredCandidates();
}

export async function getCandidateById(id: string | number): Promise<Candidate> {
  const candidates = getStoredCandidates();
  const candidate = candidates.find((c) => String(c.id) === String(id));
  if (!candidate) throw new Error('Candidato no encontrado');
  return candidate;
}

export async function createCandidate(data: Omit<Candidate, 'id'>): Promise<Candidate> {
  const candidates = getStoredCandidates();
  
  // Se usa Date.now() como número para cumplir con el tipo 'number' del id en Candidate
  const newCandidate = {
    ...data,
    id: Date.now(), 
    created_at: new Date().toISOString(),
  } as unknown as Candidate;
  
  candidates.push(newCandidate);
  saveStoredCandidates(candidates);
  return newCandidate;
}

export async function updateCandidate(id: number | string, data: Partial<Candidate>): Promise<Candidate> {
  const candidates = getStoredCandidates();
  const index = candidates.findIndex((c) => String(c.id) === String(id));
  
  if (index === -1) throw new Error('Candidatura no encontrada para actualizar');
  
  candidates[index] = { ...candidates[index], ...data };
  saveStoredCandidates(candidates);
  return candidates[index];
}

export async function patchCandidate(id: number | string, data: { status?: string; stage?: string }): Promise<Candidate> {
  return updateCandidate(id, data);
}

export async function getCandidateNotes(id: string | number): Promise<Note[]> {
  const notesMap = getStoredNotes();
  return notesMap[String(id)] || [];
}

export async function addCandidateNote(id: string | number, text: string): Promise<Note> {
  const notesMap = getStoredNotes();
  const stringId = String(id);
  const candidateNotes = notesMap[stringId] || [];
  
  const newNote: Note = {
    id: Date.now(),
    text,
    createdAt: new Date().toISOString(),
  } as unknown as Note;

  candidateNotes.push(newNote);
  notesMap[stringId] = candidateNotes;
  saveStoredNotes(notesMap);
  return newNote;
}

export async function deleteCandidateNote(id: string | number, noteId: number): Promise<void> {
  const notesMap = getStoredNotes();
  const stringId = String(id);
  const candidateNotes = notesMap[stringId] || [];
  
  notesMap[stringId] = candidateNotes.filter((n: any) => n.id !== noteId);
  saveStoredNotes(notesMap);
}