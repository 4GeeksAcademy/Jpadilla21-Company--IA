import { NextResponse } from 'next/server';

import { addNote, listNotes } from '@/lib/mock-db';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const notes = listNotes(id);

  if (!notes) {
    return NextResponse.json({ message: 'Candidato no encontrado.' }, { status: 404 });
  }

  return NextResponse.json(notes);
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = await request.json();

  if (!payload?.text?.trim()) {
    return NextResponse.json({ message: 'La nota no puede estar vacía.' }, { status: 400 });
  }

  const note = addNote(id, payload.text.trim());

  if (!note) {
    return NextResponse.json({ message: 'Candidato no encontrado.' }, { status: 404 });
  }

  return NextResponse.json(note, { status: 201 });
}