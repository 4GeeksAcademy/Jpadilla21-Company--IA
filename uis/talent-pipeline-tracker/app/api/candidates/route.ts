import { NextResponse } from 'next/server';

import { createCandidate, listCandidates } from '@/lib/mock-db';

export async function GET() {
  return NextResponse.json(listCandidates());
}

export async function POST(request: Request) {
  const payload = await request.json();

  if (!payload?.full_name || !payload?.email || !payload?.position) {
    return NextResponse.json(
      { message: 'Faltan campos obligatorios para crear la candidatura.' },
      { status: 400 },
    );
  }

  const candidate = createCandidate(payload);
  return NextResponse.json(candidate, { status: 201 });
}