import { NextResponse } from 'next/server';

import { getCandidate, updateCandidate } from '@/lib/mock-db';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const candidate = getCandidate(id);

  if (!candidate) {
    return NextResponse.json({ message: 'Candidato no encontrado.' }, { status: 404 });
  }

  return NextResponse.json(candidate);
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = await request.json();
  const candidate = updateCandidate(id, payload);

  if (!candidate) {
    return NextResponse.json({ message: 'Candidato no encontrado.' }, { status: 404 });
  }

  return NextResponse.json(candidate);
}

export async function PATCH(request: Request, context: RouteContext) {
  return PUT(request, context);
}