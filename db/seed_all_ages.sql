-- ==========================================
-- AJUSTES DE TABELA (Permitir NULL nas colunas legadas de semanas)
-- ==========================================
ALTER TABLE challenge_templates ALTER COLUMN min_age_weeks DROP NOT NULL;
ALTER TABLE challenge_templates ALTER COLUMN max_age_weeks DROP NOT NULL;

-- Ajustar milestone_templates sem dropar (preservar dados)
ALTER TABLE milestone_templates ADD COLUMN IF NOT EXISTS min_age_days INTEGER;
ALTER TABLE milestone_templates ADD COLUMN IF NOT EXISTS max_age_days INTEGER;
ALTER TABLE milestone_templates ADD COLUMN IF NOT EXISTS life_stage TEXT DEFAULT 'baby';

-- Permitir NULL nas colunas legadas de meses
ALTER TABLE milestone_templates ALTER COLUMN expected_age_months DROP NOT NULL;
ALTER TABLE milestone_templates ALTER COLUMN alert_age_months DROP NOT NULL;

-- Atualizar colunas novas com base nas antigas (se existirem) ou valores default

UPDATE milestone_templates SET 
  min_age_days = COALESCE(min_age_days, 0),
  max_age_days = COALESCE(max_age_days, 365),
  life_stage = COALESCE(life_stage, 'baby')
WHERE min_age_days IS NULL;

-- Garantir NOT NULL após update
ALTER TABLE milestone_templates ALTER COLUMN min_age_days SET NOT NULL;
ALTER TABLE milestone_templates ALTER COLUMN max_age_days SET NOT NULL;
ALTER TABLE milestone_templates ALTER COLUMN life_stage SET NOT NULL;

-- ==========================================
-- TRACKER TYPES POR FAIXA ETÁRIA
-- ==========================================

INSERT INTO tracker_types (code, label, icon, life_stages, sort_order) VALUES
-- Baby (0-1 ano)
('feed', 'Alimentação', '🍼', '{baby}', 1),
('diaper', 'Fralda', '🧷', '{baby,toddler}', 2),
('sleep', 'Sono', '😴', '{baby,toddler,kid,teen}', 3),
('tummy', 'Tempo de Barriga', '👶', '{baby}', 4),
('pump', 'Extração de Leite', '🥛', '{baby}', 5),
('bath', 'Banho', '🛁', '{baby,toddler}', 6),
('meds', 'Medicamentos', '💊', '{baby,toddler,kid,teen}', 7),
('symptom', 'Sintomas', '🤒', '{baby,toddler,kid,teen}', 8),

-- Toddler (1-3 anos)
('potty', 'Desfralde', '🚽', '{toddler}', 10),
('tantrum', 'Birras', '😤', '{toddler,kid}', 11),
('words', 'Palavras Novas', '🗣️', '{toddler}', 12),
('meal', 'Refeições', '🍽️', '{toddler,kid,teen}', 13),

-- Kid (3-12 anos)
('homework', 'Lição de Casa', '📚', '{kid,teen}', 20),
('chores', 'Tarefas Domésticas', '🧹', '{kid,teen}', 21),
('activity', 'Atividades Extra', '⚽', '{kid,teen}', 22),
('screen', 'Tempo de Tela', '📱', '{kid,teen}', 23),
('reading', 'Leitura', '📖', '{kid,teen}', 24),

-- Teen (12-18 anos)
('mood', 'Humor', '😊', '{teen}', 30),
('exercise', 'Exercício', '🏃', '{teen}', 31),
('social', 'Social', '👥', '{teen}', 32),
('study', 'Estudo', '📝', '{teen}', 33)
ON CONFLICT (code) DO UPDATE SET 
  life_stages = EXCLUDED.life_stages,
  label = EXCLUDED.label;

-- ==========================================
-- CATEGORIAS DE DESAFIOS EXPANDIDAS
-- ==========================================

INSERT INTO challenge_categories (code, label, icon, life_stages) VALUES
('motor', 'Motor', '🏃', '{baby,toddler,kid}'),
('cognitivo', 'Cognitivo', '🧠', '{baby,toddler,kid,teen}'),
('nutricao', 'Nutrição', '🥗', '{baby,toddler,kid,teen}'),
('sono', 'Sono', '💤', '{baby,toddler,kid,teen}'),
('afeto', 'Afeto/Vínculo', '❤️', '{baby,toddler,kid,teen}'),
('saude_mae', 'Saúde dos Pais', '🧘', '{baby,toddler,kid,teen}'),
('autonomia', 'Autonomia', '🎯', '{toddler,kid,teen}'),
('social', 'Socialização', '👥', '{toddler,kid,teen}'),
('escola', 'Escola', '📚', '{kid,teen}'),
('responsabilidade', 'Responsabilidade', '✅', '{kid,teen}'),
('comunicacao', 'Comunicação', '💬', '{teen}'),
('financeiro', 'Educação Financeira', '💰', '{kid,teen}'),
('emocional', 'Inteligência Emocional', '🧘', '{kid,teen}')
ON CONFLICT (code) DO UPDATE SET 
  life_stages = EXCLUDED.life_stages;

-- ==========================================
-- MISSÕES PARA TODDLER (1-3 ANOS)
-- ==========================================

INSERT INTO challenge_templates (category, min_age_days, max_age_days, life_stage, title, description, xp_base) VALUES
-- Autonomia
('autonomia', 365, 730, 'toddler', 'Escolha da Roupa', 'Deixe seu filho escolher entre 2 opções de roupa hoje.', 30),
('autonomia', 365, 1095, 'toddler', 'Comer Sozinho', 'Ofereça uma refeição com colher/garfo para ele praticar.', 40),
('autonomia', 548, 1095, 'toddler', 'Guardar Brinquedos', 'Peça ajuda para guardar os brinquedos após brincar.', 35),
('autonomia', 730, 1095, 'toddler', 'Escovar Dentes', 'Supervisione enquanto ele tenta escovar os próprios dentes.', 30),

-- Motor
('motor', 365, 548, 'toddler', 'Primeiros Passos', 'Pratique caminhada segurando as mãozinhas.', 50),
('motor', 548, 1095, 'toddler', 'Subir Escadas', 'Ajude a subir/descer escadas com supervisão.', 40),
('motor', 365, 730, 'toddler', 'Empilhar Blocos', 'Brinque de empilhar blocos ou copos.', 30),
('motor', 730, 1095, 'toddler', 'Chutar Bola', 'Pratique chutar uma bola leve no quintal/sala.', 35),

-- Social
('social', 548, 1095, 'toddler', 'Brincadeira Compartilhada', 'Organize uma brincadeira com outra criança.', 45),
('social', 365, 1095, 'toddler', 'Tchau e Oi', 'Pratique acenar e cumprimentar pessoas.', 25),

-- Cognitivo
('cognitivo', 365, 730, 'toddler', 'Nomear Objetos', 'Aponte 5 objetos e diga o nome de cada um.', 30),
('cognitivo', 548, 1095, 'toddler', 'Cores e Formas', 'Brinque de identificar cores e formas básicas.', 35),
('cognitivo', 730, 1095, 'toddler', 'Quebra-Cabeça Simples', 'Monte um quebra-cabeça de 4-6 peças juntos.', 40);

-- ==========================================
-- MISSÕES PARA KID (3-12 ANOS)
-- ==========================================

INSERT INTO challenge_templates (category, min_age_days, max_age_days, life_stage, title, description, xp_base) VALUES
-- Responsabilidade
('responsabilidade', 1095, 2190, 'kid', 'Arrumar a Cama', 'Ensine e acompanhe a arrumar a cama pela manhã.', 30),
('responsabilidade', 1460, 4380, 'kid', 'Preparar Lanche', 'Ajude a preparar um lanche simples e saudável.', 40),
('responsabilidade', 1825, 4380, 'kid', 'Cuidar do Pet', 'Delegue uma tarefa do cuidado com animal de estimação.', 35),
('responsabilidade', 2190, 4380, 'kid', 'Organizar Mochila', 'Revise junto a organização da mochila escolar.', 30),

-- Escola
('escola', 1825, 4380, 'kid', 'Leitura em Voz Alta', 'Peça para ler um trecho de livro em voz alta.', 35),
('escola', 2190, 4380, 'kid', 'Revisar Matéria', 'Dedique 15min para revisar matéria da escola.', 40),
('escola', 1460, 4380, 'kid', 'Projeto Criativo', 'Faça um projeto de arte ou ciências juntos.', 50),

-- Social
('social', 1095, 4380, 'kid', 'Convidar Amigo', 'Organize uma visita de amigo ou ida ao parque.', 45),
('social', 1825, 4380, 'kid', 'Esporte em Grupo', 'Participe de atividade esportiva com outras crianças.', 50),

-- Emocional
('emocional', 1825, 4380, 'kid', 'Diário de Gratidão', 'Escreva ou desenhe 3 coisas pelas quais é grato.', 35),
('emocional', 2190, 4380, 'kid', 'Conversa sobre Sentimentos', 'Converse sobre como foi o dia e como se sentiu.', 40),

-- Financeiro
('financeiro', 2555, 4380, 'kid', 'Cofrinho', 'Separe uma moeda/valor para o cofrinho.', 30),
('financeiro', 2920, 4380, 'kid', 'Lista de Desejos', 'Faça uma lista de desejos com preços para planejar.', 35);

-- ==========================================
-- MISSÕES PARA TEEN (12-18 ANOS)
-- ==========================================

INSERT INTO challenge_templates (category, min_age_days, max_age_days, life_stage, title, description, xp_base) VALUES
-- Comunicação
('comunicacao', 4380, 6570, 'teen', 'Conversa sem Telas', 'Tenha uma conversa de 15min sem celular/TV.', 50),
('comunicacao', 4380, 6570, 'teen', 'Check-in Emocional', 'Pergunte como está se sentindo (de 1 a 10) e por quê.', 40),
('comunicacao', 4745, 6570, 'teen', 'Debate Saudável', 'Discuta um tema atual com respeito às opiniões.', 60),

-- Responsabilidade
('responsabilidade', 4380, 6570, 'teen', 'Gerenciar Agenda', 'Revise a agenda da semana e compromissos.', 35),
('responsabilidade', 4745, 6570, 'teen', 'Cozinhar Refeição', 'Prepare uma refeição completa para a família.', 70),
('responsabilidade', 5110, 6570, 'teen', 'Pesquisar Profissão', 'Pesquise sobre uma carreira de interesse.', 50),

-- Financeiro
('financeiro', 4380, 6570, 'teen', 'Orçamento Pessoal', 'Monte um orçamento do mês (mesada/renda).', 60),
('financeiro', 4745, 6570, 'teen', 'Comparar Preços', 'Compare preços antes de uma compra desejada.', 40),

-- Emocional
('emocional', 4380, 6570, 'teen', 'Meditação/Respiração', 'Pratique 5min de respiração consciente.', 35),
('emocional', 4380, 6570, 'teen', 'Journaling', 'Escreva sobre pensamentos e sentimentos do dia.', 45),
('emocional', 4745, 6570, 'teen', 'Definir Metas', 'Defina 3 metas para o mês e como alcançá-las.', 55),

-- Saúde
('sono', 4380, 6570, 'teen', 'Rotina de Sono', 'Mantenha horário de dormir consistente (variação <1h).', 40),
('nutricao', 4380, 6570, 'teen', 'Hidratação', 'Beba pelo menos 2L de água hoje.', 30),
('motor', 4380, 6570, 'teen', 'Exercício 30min', 'Faça 30min de atividade física.', 50);

-- ==========================================
-- MARCOS DE DESENVOLVIMENTO (MILESTONES)
-- ==========================================

INSERT INTO milestone_templates (title, description, category, min_age_days, max_age_days, life_stage) VALUES
-- Baby
('Primeiro sorriso social', 'Sorriu em resposta a você', 'social', 30, 90, 'baby'),
('Sustenta a cabeça', 'Consegue manter a cabeça firme', 'motor', 60, 120, 'baby'),
('Rola de barriga para cima', 'Consegue virar sozinho', 'motor', 90, 180, 'baby'),
('Senta sem apoio', 'Senta firme sem suporte', 'motor', 150, 270, 'baby'),
('Primeiras palavras', 'Disse mamã/papá com significado', 'cognitivo', 270, 450, 'baby'),
('Primeiros passos', 'Andou sozinho', 'motor', 270, 548, 'baby'),

-- Toddler
('Fala frases simples', '2-3 palavras juntas', 'cognitivo', 548, 730, 'toddler'),
('Corre com segurança', 'Corre sem cair frequentemente', 'motor', 548, 730, 'toddler'),
('Desfralde diurno', 'Usa penico/vaso durante o dia', 'autonomia', 730, 1095, 'toddler'),
('Desfralde noturno', 'Sem acidentes à noite', 'autonomia', 912, 1460, 'toddler'),
('Brinca de faz-de-conta', 'Imaginação em brincadeiras', 'cognitivo', 730, 1095, 'toddler'),

-- Kid
('Lê palavras simples', 'Reconhece e lê palavras', 'escola', 1460, 2190, 'kid'),
('Escreve o nome', 'Escreve o próprio nome', 'escola', 1460, 2190, 'kid'),
('Anda de bicicleta', 'Sem rodinhas', 'motor', 1460, 2555, 'kid'),
('Primeiro dente caiu', 'Troca de dentição', 'saude', 1825, 2555, 'kid'),
('Amizade consistente', 'Tem melhor amigo(a)', 'social', 1825, 3650, 'kid'),

-- Teen
('Puberdade iniciada', 'Sinais de desenvolvimento puberal', 'saude', 3285, 5110, 'teen'),
('Primeiro emprego/estágio', 'Experiência profissional', 'autonomia', 5475, 6570, 'teen'),
('Tirou carteira de motorista', 'CNH emitida', 'autonomia', 6570, 6935, 'teen');
