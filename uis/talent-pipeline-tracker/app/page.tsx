'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCandidates, createCandidate } from '@/services/api';
import { Candidate } from '@/types/candidate';
import Link from 'next/link';

export default function CandidatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    position: '',
    linkedin: '',
    cv_url: '',
    experience_years: 1,
    status: 'Applied',
    stage: 'Sourcing',
  });

  const search = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || '';
  const stageFilter = searchParams.get('stage') || '';

  const fetchList = async () => {
    try {
      setLoading(true);
      const data = await getCandidates();
      setCandidates(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('search', value);
    else params.delete('search');
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('status', value);
    else params.delete('status');
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleStageChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('stage', value);
    else params.delete('stage');
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.position) {
      setFormError('Por favor completa los campos obligatorios (Nombre, Email, Puesto)');
      return;
    }
    try {
      setFormError(null);
      await createCandidate(formData);
      setShowModal(false);
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        position: '',
        linkedin: '',
        cv_url: '',
        experience_years: 1,
        status: 'Applied',
        stage: 'Sourcing',
      });
      fetchList();
    } catch (err: any) {
      setFormError(err.message || 'Error al guardar la candidatura');
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? c.status === statusFilter : true;
    const matchesStage = stageFilter ? c.stage === stageFilter : true;
    return matchesSearch && matchesStatus && matchesStage;
  });

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
              HealthCore · People & Talent
            </span>
            <h1 className="text-3xl font-bold text-slate-900 mt-2">Pipeline de Candidaturas</h1>
            <p className="text-slate-600">Gestión de procesos de selección y contratación clínica y administrativa.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
          >
            + Nueva Candidatura
          </button>
        </header>

        {/* Filtros y Búsqueda */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            defaultValue={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Todos los Estados</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select
            value={stageFilter}
            onChange={(e) => handleStageChange(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Todas las Etapas</option>
            <option value="Sourcing">Sourcing</option>
            <option value="Screening">Screening</option>
            <option value="Technical">Technical</option>
            <option value="Final">Final</option>
          </select>
        </div>

        {/* Estados de Carga, Error o Listado */}
        {loading && <div className="text-center py-12 text-slate-500">Cargando candidaturas...</div>}
        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 mb-6">{error}</div>}

        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                  <th className="p-4">Nombre Completo</th>
                  <th className="p-4">Puesto</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Etapa</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No se encontraron candidaturas.
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-medium text-slate-900">
                        <div>{c.full_name}</div>
                        <div className="text-xs text-slate-500">{c.email}</div>
                      </td>
                      <td className="p-4 text-slate-600">{c.position}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700">
                          {c.stage}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/candidates/${c.id}`}
                          className="text-teal-600 hover:text-teal-800 font-medium text-sm"
                        >
                          Ver Detalle &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal para Registrar Nueva Candidatura */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Registrar Nueva Candidatura</h2>
              {formError && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{formError}</div>}
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Puesto *</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Estado</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offered">Offered</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Etapa</label>
                    <select
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="Sourcing">Sourcing</option>
                      <option value="Screening">Screening</option>
                      <option value="Technical">Technical</option>
                      <option value="Final">Final</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 font-medium"
                  >
                    Guardar Candidatura
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}