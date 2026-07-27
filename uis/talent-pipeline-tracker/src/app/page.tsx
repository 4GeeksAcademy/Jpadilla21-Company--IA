'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getCandidateById,
  patchCandidate,
  updateCandidate,
  getCandidateNotes,
  addCandidateNote,
  deleteCandidateNote,
} from '../services/api';
import { Candidate, Note } from '../types/candidate';
import Link from 'next/link';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [newNoteText, setNewNoteText] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<Partial<Candidate>>({});

  const loadData = async () => {
    try {
      setLoading(true);
      const [candData, notesData] = await Promise.all([
        getCandidateById(id),
        getCandidateNotes(id),
      ]);
      setCandidate(candData);
      setEditFormData(candData);
      setNotes(notesData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const updated = await patchCandidate(id, { status: newStatus });
      setCandidate(updated);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar el estado');
    }
  };

  const handleStageChange = async (newStage: string) => {
    try {
      const updated = await patchCandidate(id, { stage: newStage });
      setCandidate(updated);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar la etapa');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    try {
      await addCandidateNote(id, newNoteText);
      setNewNoteText('');
      const updatedNotes = await getCandidateNotes(id);
      setNotes(updatedNotes);
    } catch (err: any) {
      alert(err.message || 'Error al añadir la nota');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      await deleteCandidateNote(id, noteId);
      setNotes(notes.filter((n) => n.id !== noteId));
    } catch (err: any) {
      alert(err.message || 'Error al eliminar la nota');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateCandidate(id, editFormData);
      setCandidate(updated);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar candidato');
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Cargando detalle...</div>;
  if (error || !candidate)
    return (
      <div className="p-10 text-center">
        <div className="text-red-600 mb-4">{error || 'Candidato no encontrado'}</div>
        <Link href="/" className="text-teal-600 underline font-medium">
          Volver al listado
        </Link>
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/" className="text-sm font-medium text-teal-600 hover:text-teal-800">
            &larr; Volver al Pipeline
          </Link>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1.5 rounded-lg font-medium transition"
          >
            {isEditing ? 'Cancelar Edición' : 'Editar Datos'}
          </button>
        </div>

        {/* Formulario de Edición o Tarjeta de Datos */}
        {isEditing ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Editar Candidatura</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={editFormData.full_name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Puesto</label>
                <input
                  type="text"
                  value={editFormData.position || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{candidate.full_name}</h1>
                <p className="text-slate-600 font-medium">{candidate.position}</p>
              </div>
              <div className="flex gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Estado</label>
                  <select
                    value={candidate.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-blue-50 text-blue-800 font-semibold"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Etapa</label>
                  <select
                    value={candidate.stage}
                    onChange={(e) => handleStageChange(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-purple-50 text-purple-800 font-semibold"
                  >
                    <option value="Sourcing">Sourcing</option>
                    <option value="Screening">Screening</option>
                    <option value="Technical">Technical</option>
                    <option value="Final">Final</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4 text-sm">
              <div>
                <span className="block text-slate-400 text-xs uppercase">Email</span>
                <span className="text-slate-800">{candidate.email}</span>
              </div>
              <div>
                <span className="block text-slate-400 text-xs uppercase">Teléfono</span>
                <span className="text-slate-800">{candidate.phone || 'No especificado'}</span>
              </div>
              <div>
                <span className="block text-slate-400 text-xs uppercase">Años de Experiencia</span>
                <span className="text-slate-800">{candidate.experience_years ?? 'N/A'}</span>
              </div>
              <div>
                <span className="block text-slate-400 text-xs uppercase">LinkedIn</span>
                {candidate.linkedin ? (
                  <a href={candidate.linkedin} target="_blank" rel="noreferrer" className="text-teal-600 underline">
                    Ver perfil
                  </a>
                ) : (
                  <span className="text-slate-800">N/A</span>
                )}
              </div>
              <div>
                <span className="block text-slate-400 text-xs uppercase">Enlace al CV</span>
                {candidate.cv_url ? (
                  <a href={candidate.cv_url} target="_blank" rel="noreferrer" className="text-teal-600 underline">
                    Ver CV
                  </a>
                ) : (
                  <span className="text-slate-800">N/A</span>
                )}
              </div>
              <div>
                <span className="block text-slate-400 text-xs uppercase">Fecha de Aplicación</span>
                <span className="text-slate-800">
                  {candidate.created_at ? new Date(candidate.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Sección de Notas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Notas Internas</h3>

          <form onSubmit={handleAddNote} className="mb-6 flex gap-3">
            <input
              type="text"
              placeholder="Escribe una nota interna sobre el candidato..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Añadir Nota
            </button>
          </form>

          <div className="space-y-3">
            {notes.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No hay notas registradas para este candidato.</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-start gap-4">
                  <p className="text-sm text-slate-800">{note.text}</p>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium shrink-0"
                  >
                    Eliminar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}