import { Candidate, Note } from '../types/candidate';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCandidates(): Promise<Candidate[]> {
  const res = await fetch(`${API_URL}/records`);
  if (!res.ok) throw new Error('Error al obtener las candidaturas');
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function getCandidateById(id: string): Promise<Candidate> {
  const res = await fetch(`${API_URL}/records/${id}`);
  if (!res.ok) throw new Error('Error al obtener el detalle del candidato');
  return res.json();
}

export async function createCandidate(data: Omit<Candidate, 'id'>): Promise<Candidate> {
  const res = await fetch(`${API_URL}/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al registrar la candidatura');
  return res.json();
}

export async function updateCandidate(id: number | string, data: Partial<Candidate>): Promise<Candidate> {
  const res = await fetch(`${API_URL}/records/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar la candidatura');
  return res.json();
}

export async function patchCandidate(id: number | string, data: { status?: string; stage?: string }): Promise<Candidate> {
  const res = await fetch(`${API_URL}/records/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar el estado o etapa');
  return res.json();
}

export async function getCandidateNotes(id: string): Promise<Note[]> {
  const res = await fetch(`${API_URL}/records/${id}/notes`);
  if (!res.ok) throw new Error('Error al obtener las notas');
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function addCandidateNote(id: string, text: string): Promise<Note> {
  const res = await fetch(`${API_URL}/records/${id}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Error al añadir la nota');
  return res.json();
}

export async function deleteCandidateNote(id: string, noteId: number): Promise<void> {
  const res = await fetch(`${API_URL}/records/${id}/notes/${noteId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar la nota');
}