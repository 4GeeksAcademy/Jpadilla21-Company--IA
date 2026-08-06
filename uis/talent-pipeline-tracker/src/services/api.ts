import { Candidate, Note } from '../types/candidate';

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || 'Error al conectar con la API');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function getCandidates(): Promise<Candidate[]> {
  return request<Candidate[]>('/api/candidates', { cache: 'no-store' });
}

export async function getCandidateById(id: string | number): Promise<Candidate> {
  return request<Candidate>(`/api/candidates/${id}`, { cache: 'no-store' });
}

export async function createCandidate(data: Omit<Candidate, 'id'>): Promise<Candidate> {
  return request<Candidate>('/api/candidates', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCandidate(id: number | string, data: Partial<Candidate>): Promise<Candidate> {
  return request<Candidate>(`/api/candidates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function patchCandidate(id: number | string, data: { status?: string; stage?: string }): Promise<Candidate> {
  return request<Candidate>(`/api/candidates/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function getCandidateNotes(id: string | number): Promise<Note[]> {
  return request<Note[]>(`/api/candidates/${id}/notes`, { cache: 'no-store' });
}

export async function addCandidateNote(id: string | number, text: string): Promise<Note> {
  return request<Note>(`/api/candidates/${id}/notes`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function deleteCandidateNote(id: string | number, noteId: number): Promise<void> {
  return request<void>(`/api/candidates/${id}/notes/${noteId}`, {
    method: 'DELETE',
  });
}