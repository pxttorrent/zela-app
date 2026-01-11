import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, Award, Syringe } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { api } from '../../api';
import { SimpleCharts } from '../features/SimpleCharts';
import { TrackerLog, GrowthLog, BabyData } from '../../types';

interface ReportsProps {
  trackers: TrackerLog[];
  growthLogs: GrowthLog[];
  baby: BabyData | null;
}

export const Reports: React.FC<ReportsProps> = ({ trackers, growthLogs, baby }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadSummary = async () => {
    if (!baby) return;
    setLoading(true);
    try {
      const data = await api.reports.getSummary(baby.id as any, selectedMonth, selectedYear);
      setSummary(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleExport = async () => {
    if (!baby) return;
    try {
      const blob = await api.reports.export(baby.id as any, 'csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zela-relatorio-${baby.name}.csv`;
      a.click();
    } catch (err) {
      console.error(err);
      alert('Erro ao exportar relatório');
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Relatórios</h1>
        <Button variant="outline" onClick={handleExport}>
          <Download size={18} className="mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Seletor de período */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Calendar size={20} className="text-slate-400" />
          <select 
            value={selectedMonth} 
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border border-slate-200"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2024, i).toLocaleString('pt-BR', { month: 'long' })}
              </option>
            ))}
          </select>
          <select 
            value={selectedYear} 
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border border-slate-200"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <Button onClick={loadSummary} disabled={loading}>
            {loading ? 'Carregando...' : 'Gerar Resumo'}
          </Button>
        </div>
      </Card>

      {summary && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-emerald-500" />
              <span className="font-semibold">Atividades</span>
            </div>
            <p className="text-3xl font-bold text-emerald-600">
              {summary.trackers.reduce((acc: number, t: any) => acc + Number(t.count), 0)}
            </p>
            <p className="text-sm text-slate-500">registros no mês</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Award className="text-amber-500" />
              <span className="font-semibold">Missões</span>
            </div>
            <p className="text-3xl font-bold text-amber-600">
              {summary.missions.total || 0}
            </p>
            <p className="text-sm text-slate-500">
              +{summary.missions.xp_total || 0} XP
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Syringe className="text-blue-500" />
              <span className="font-semibold">Vacinas</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {summary.vaccines}
            </p>
            <p className="text-sm text-slate-500">aplicadas</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎯</span>
              <span className="font-semibold">Marcos</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {summary.milestones.length}
            </p>
            <p className="text-sm text-slate-500">conquistados</p>
          </Card>
        </div>
      )}

      <Card className="p-6">
        <h2 className="font-bold mb-4">Gráficos de Crescimento</h2>
        <SimpleCharts trackers={trackers} growthLogs={growthLogs} />
      </Card>
    </div>
  );
};
