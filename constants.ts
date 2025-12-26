import { VaccineTemplate, Challenge, ChallengeCategory } from './types';

export const VACCINES_DB: VaccineTemplate[] = [
  { id: 1, name: 'BCG', daysFromBirth: 0, description: 'Formas graves de tuberculose.' },
  { id: 2, name: 'Hepatite B', daysFromBirth: 0, description: 'Ao nascer.' },
  { id: 3, name: 'Penta (1ª dose)', daysFromBirth: 60, description: 'Difteria, Tétano, Coqueluche...' },
  { id: 4, name: 'VIP (1ª dose)', daysFromBirth: 60, description: 'Poliomielite inativada.' },
  { id: 5, name: 'Pneumocócica 10 (1ª)', daysFromBirth: 60, description: 'Pneumonia, otite, meningite.' },
  { id: 6, name: 'Rotavírus (1ª dose)', daysFromBirth: 60, description: 'Diarreia por rotavírus.' },
  { id: 7, name: 'Meningocócica C (1ª)', daysFromBirth: 90, description: 'Meningite C.' },
  { id: 8, name: 'Penta (2ª dose)', daysFromBirth: 120, description: 'Reforço imunológico.' },
  { id: 9, name: 'VIP (2ª dose)', daysFromBirth: 120, description: 'Reforço poliomielite.' },
  { id: 10, name: 'Febre Amarela', daysFromBirth: 270, description: 'Aos 9 meses.' },
  { id: 11, name: 'Tríplice Viral', daysFromBirth: 365, description: 'Sarampo, Caxumba, Rubéola.' },
];

export const CHALLENGES_DB: Challenge[] = [
  { id: 1, title: 'Olho no olho', description: 'Segure o bebê a 30cm do rosto e converse sorrindo.', category: 'afeto', minAgeWeeks: 0, maxAgeWeeks: 12, durationMinutes: 5, xpReward: 10 },
  { id: 2, title: 'Massagem suave', description: 'Faça movimentos suaves nas perninhas após o banho.', category: 'motor', minAgeWeeks: 0, maxAgeWeeks: 24, durationMinutes: 5, xpReward: 15 },
  { id: 3, title: 'Barriguinha para baixo', description: 'Coloque o bebê de bruços no seu peito por 2 min (Tummy Time).', category: 'motor', minAgeWeeks: 0, maxAgeWeeks: 12, durationMinutes: 2, xpReward: 20 },
  { id: 4, title: 'Sons suaves', description: 'Use um chocalho suave de um lado para o outro para ele acompanhar.', category: 'cognitivo', minAgeWeeks: 2, maxAgeWeeks: 12, durationMinutes: 3, xpReward: 10 },
  { id: 5, title: 'Pele a pele', description: 'Fique 5 minutos com o bebê apenas de fralda no seu colo.', category: 'afeto', minAgeWeeks: 0, maxAgeWeeks: 12, durationMinutes: 5, xpReward: 15 },
  { id: 6, title: 'Cuidado materno', description: 'Tire 5 minutos para beber um copo d\'água e respirar fundo.', category: 'saude_mae', minAgeWeeks: 0, maxAgeWeeks: 100, durationMinutes: 5, xpReward: 50 },
  { id: 7, title: 'Seguindo a luz', description: 'Use uma lanterna fraca em ambiente penumbra para ele seguir com o olhar.', category: 'cognitivo', minAgeWeeks: 4, maxAgeWeeks: 16, durationMinutes: 3, xpReward: 15 },
  { id: 8, title: 'Bicicletinha', description: 'Movimente as pernas do bebê como se pedalasse para aliviar gases.', category: 'motor', minAgeWeeks: 2, maxAgeWeeks: 24, durationMinutes: 5, xpReward: 10 },
  { id: 9, title: 'Conversa', description: 'Imite os sons que o bebê faz (Gugu-Dada) respondendo a ele.', category: 'cognitivo', minAgeWeeks: 8, maxAgeWeeks: 30, durationMinutes: 5, xpReward: 10 },
  { id: 10, title: 'Texturas', description: 'Passe tecidos diferentes (algodão, seda) na mãozinha dele.', category: 'motor', minAgeWeeks: 8, maxAgeWeeks: 20, durationMinutes: 3, xpReward: 15 },
];

export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  motor: 'Motor',
  cognitivo: 'Cognitivo',
  nutricao: 'Nutrição',
  sono: 'Sono',
  afeto: 'Afeto',
  saude_mae: 'Mamãe',
};
