import { Candidate, Note } from '../types/candidate';

type CandidateRecord = Candidate & {
  notes: Note[];
};

const initialCandidates: CandidateRecord[] = [
  {
    id: 101,
    full_name: 'Camila Torres',
    email: 'camila.torres@healthcore.test',
    phone: '+1 512 555 0101',
    position: 'Nurse Practitioner',
    linkedin: 'https://www.linkedin.com/in/camila-torres-healthcore',
    cv_url: 'https://example.com/cv/camila-torres',
    experience_years: 6,
    status: 'Interviewing',
    stage: 'Technical',
    created_at: '2026-07-15T14:30:00.000Z',
    notes: [
      {
        id: 1001,
        text: 'Buen fit para clínicas ambulatorias. Pendiente segunda entrevista con operaciones.',
        created_at: '2026-07-16T09:00:00.000Z',
      },
    ],
  },
  {
    id: 102,
    full_name: 'Miguel Andrade',
    email: 'miguel.andrade@healthcore.test',
    phone: '+1 786 555 0134',
    position: 'Front Desk Coordinator',
    linkedin: 'https://www.linkedin.com/in/miguel-andrade-ops',
    cv_url: 'https://example.com/cv/miguel-andrade',
    experience_years: 4,
    status: 'Applied',
    stage: 'Screening',
    created_at: '2026-07-18T10:00:00.000Z',
    notes: [],
  },
  {
    id: 103,
    full_name: 'Sofia Bennett',
    email: 'sofia.bennett@healthcore.test',
    phone: '+44 20 7946 0921',
    position: 'Clinical Operations Manager',
    linkedin: 'https://www.linkedin.com/in/sofia-bennett-clinical',
    cv_url: 'https://example.com/cv/sofia-bennett',
    experience_years: 9,
    status: 'Offered',
    stage: 'Final',
    created_at: '2026-07-10T16:45:00.000Z',
    notes: [
      {
        id: 1002,
        text: 'Referenciada por dirección regional UK. Expectativa salarial alineada.',
        created_at: '2026-07-22T13:15:00.000Z',
      },
    ],
  },
];

let candidates: CandidateRecord[] = structuredClone(initialCandidates);

const candidateWithoutNotes = (record: CandidateRecord): Candidate => {
  const { notes, ...candidate } = record;
  void notes;
  return candidate;
};

export function listCandidates(): Candidate[] {
  return candidates.map(candidateWithoutNotes);
}

export function getCandidate(id: string | number): Candidate | undefined {
  return listCandidates().find((candidate) => String(candidate.id) === String(id));
}

export function createCandidate(data: Omit<Candidate, 'id'>): Candidate {
  const candidate: CandidateRecord = {
    ...data,
    id: Date.now(),
    created_at: data.created_at ?? new Date().toISOString(),
    notes: [],
  };

  candidates = [candidate, ...candidates];
  return candidateWithoutNotes(candidate);
}

export function updateCandidate(id: string | number, data: Partial<Candidate>): Candidate | undefined {
  const index = candidates.findIndex((candidate) => String(candidate.id) === String(id));

  if (index === -1) {
    return undefined;
  }

  const current = candidates[index];
  const next: CandidateRecord = {
    ...current,
    ...data,
    id: current.id,
    notes: current.notes,
  };

  candidates[index] = next;
  return candidateWithoutNotes(next);
}

export function listNotes(candidateId: string | number): Note[] | undefined {
  const candidate = candidates.find((item) => String(item.id) === String(candidateId));
  return candidate?.notes;
}

export function addNote(candidateId: string | number, text: string): Note | undefined {
  const candidate = candidates.find((item) => String(item.id) === String(candidateId));

  if (!candidate) {
    return undefined;
  }

  const note: Note = {
    id: Date.now(),
    text,
    created_at: new Date().toISOString(),
  };

  candidate.notes = [note, ...candidate.notes];
  return note;
}

export function deleteNote(candidateId: string | number, noteId: string | number): boolean {
  const candidate = candidates.find((item) => String(item.id) === String(candidateId));

  if (!candidate) {
    return false;
  }

  const nextNotes = candidate.notes.filter((note) => String(note.id) !== String(noteId));

  if (nextNotes.length === candidate.notes.length) {
    return false;
  }

  candidate.notes = nextNotes;
  return true;
}