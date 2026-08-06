import { NextResponse } from 'next/server';

import { deleteNote } from '@/lib/mock-db';

type RouteContext = {
  params: Promise<{
    id: string;
    noteId: string;
  }>;
};

export async function DELETE(_: Request, context: RouteContext) {
  const { id, noteId } = await context.params;
  const deleted = deleteNote(id, noteId);

  if (!deleted) {
    return NextResponse.json({ message: 'Nota o candidato no encontrado.' }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}