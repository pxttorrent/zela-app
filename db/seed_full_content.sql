-- Limpar templates antigos para evitar duplicação
TRUNCATE TABLE vaccine_templates CASCADE;
TRUNCATE TABLE challenge_templates CASCADE;

-- ==========================================
-- 1. VACINAS DO SUS (PNI - Brasil)
-- ==========================================

INSERT INTO vaccine_templates (name, days_from_birth, description) VALUES
-- Ao Nascer
('BCG', 0, 'Protege contra formas graves de tuberculose. Dose única.'),
('Hepatite B', 0, 'Primeira dose ao nascer.'),

-- 2 Meses
('Penta (1ª dose)', 60, 'Difteria, Tétano, Coqueluche, Haemophilus B e Hepatite B.'),
('VIP (1ª dose)', 60, 'Poliomielite inativada (paralisia infantil).'),
('Pneumocócica 10 (1ª dose)', 60, 'Protege contra pneumonia, otite e meningite.'),
('Rotavírus (1ª dose)', 60, 'Protege contra diarreia grave por rotavírus.'),

-- 3 Meses
('Meningocócica C (1ª dose)', 90, 'Protege contra meningite C.'),

-- 4 Meses
('Penta (2ª dose)', 120, 'Reforço da proteção pentavalente.'),
('VIP (2ª dose)', 120, 'Reforço contra pólio.'),
('Pneumocócica 10 (2ª dose)', 120, 'Reforço pneumo.'),
('Rotavírus (2ª dose)', 120, 'Segunda dose rotavírus.'),

-- 5 Meses
('Meningocócica C (2ª dose)', 150, 'Reforço meningo C.'),

-- 6 Meses
('Penta (3ª dose)', 180, 'Última dose do esquema primário.'),
('VIP (3ª dose)', 180, 'Última dose do esquema primário.'),

-- 9 Meses
('Febre Amarela', 270, 'Dose inicial (varia por região, mas recomendada nacionalmente).'),

-- 12 Meses (1 Ano)
('Tríplice Viral (1ª dose)', 365, 'Sarampo, Caxumba e Rubéola.'),
('Pneumocócica 10 (Reforço)', 365, 'Reforço anual.'),
('Meningocócica C (Reforço)', 365, 'Reforço anual.'),

-- 15 Meses
('DTP (1º Reforço)', 450, 'Difteria, Tétano e Coqueluche.'),
('VOP (1º Reforço)', 450, 'Pólio oral (gotinha).'),
('Hepatite A', 450, 'Dose única.'),
('Tetraviral', 450, 'Sarampo, Caxumba, Rubéola e Varicela.'),

-- 4 Anos
('DTP (2º Reforço)', 1460, 'Segundo reforço DTP.'),
('VOP (2º Reforço)', 1460, 'Segundo reforço Pólio.'),
('Varicela', 1460, 'Dose isolada de varicela (catapora).'),
('Febre Amarela (Reforço)', 1460, 'Reforço aos 4 anos.');


-- ==========================================
-- 2. MISSÕES PEDIÁTRICAS (Por Categoria)
-- ==========================================

-- Categoria: SLEEP (Sono)
INSERT INTO challenge_templates (category, min_age_weeks, max_age_weeks, title, description, xp_base) VALUES
('sleep', 0, 8, 'Ambiente de Caverna', 'Mantenha o quarto totalmente escuro durante a noite para estimular melatonina.', 50),
('sleep', 0, 12, 'Ruído Branco', 'Use som de chuva ou útero para acalmar o bebê durante o sono.', 30),
('sleep', 0, 16, 'Ritual do Sono', 'Banho, massagem e pijama sempre na mesma ordem antes de dormir.', 100),
('sleep', 4, 24, 'Soneca Monitorada', 'Tente colocar o bebê no berço ainda sonolento, mas acordado.', 50),
('sleep', 8, 20, 'Diferenciar Dia e Noite', 'Durante o dia, mantenha a casa com luz natural e barulhos normais.', 40),
('sleep', 12, 52, 'Janela de Sono', 'Observe os sinais de sono (coçar olho) e coloque para dormir antes da exaustão.', 50),
('sleep', 24, 100, 'Objeto de Apego', 'Introduza uma naninha segura para associação de sono.', 60),
('sleep', 12, 24, 'Desmame Noturno Suave', 'Tente acalmar sem oferecer o peito imediatamente se não for hora da mamada.', 80),
('sleep', 0, 12, 'Charutinho Seguro', 'Use o swaddle (cueiro) para evitar o reflexo de moro.', 40),
('sleep', 52, 156, 'Rotina Visual', 'Crie um cartaz com desenhos da rotina da noite para a criança seguir.', 100);

-- Categoria: FEEDING (Alimentação)
INSERT INTO challenge_templates (category, min_age_weeks, max_age_weeks, title, description, xp_base) VALUES
('feeding', 0, 24, 'Pega Correta', 'Verifique se os lábios estão virados para fora (boca de peixinho).', 50),
('feeding', 0, 24, 'Contato Pele a Pele', 'Amamente ou dê a mamadeira encostando a pele do bebê na sua.', 40),
('feeding', 24, 30, 'Primeira Papinha', 'Ofereça um legume amassado (ex: cenoura) sem sal.', 100),
('feeding', 24, 36, 'Exploração Sensorial', 'Deixe o bebê tocar e sujar as mãos com a comida (BLW).', 50),
('feeding', 24, 48, 'Oferta de Água', 'Ofereça água filtrada várias vezes ao dia entre as refeições.', 30),
('feeding', 26, 40, 'Sem Distrações', 'Alimente o bebê sem TV ou celular ligado por perto.', 60),
('feeding', 30, 52, 'Copo Aberto', 'Treine beber no copinho aberto com pequena quantidade de água.', 70),
('feeding', 40, 60, 'Pincer Grasp (Pinça)', 'Ofereça pedaços pequenos (ex: ervilha, milho) para treino de pinça.', 50),
('feeding', 52, 100, 'Comer em Família', 'Faça pelo menos uma refeição com todos sentados à mesa.', 80),
('feeding', 52, 156, 'Cozinhar Juntos', 'Deixe a criança ajudar a lavar uma fruta ou misturar algo simples.', 90);

-- Categoria: MOTOR (Desenvolvimento Motor)
INSERT INTO challenge_templates (category, min_age_weeks, max_age_weeks, title, description, xp_base) VALUES
('motor', 1, 12, 'Tummy Time Curto', 'Coloque o bebê de bruços por 1-2 minutos supervisionado.', 50),
('motor', 4, 16, 'Seguir o Objeto', 'Mova um brinquedo colorido lentamente de um lado para o outro.', 40),
('motor', 12, 24, 'Alcance Cruzado', 'Ofereça brinquedo no lado oposto para ele cruzar a linha média.', 60),
('motor', 16, 30, 'Rolar', 'Incentive o bebê a rolar colocando brinquedos fora do alcance.', 80),
('motor', 24, 40, 'Sentar com Apoio', 'Coloque almofadas ao redor e brinque com ele sentado.', 70),
('motor', 30, 50, 'Posição de Gatinho', 'Estimule a posição de quatro apoios para o engatinhar.', 80),
('motor', 40, 60, 'Escalar Obstáculos', 'Coloque travesseiros no chão para ele passar por cima.', 60),
('motor', 50, 70, 'Andar com Apoio', 'Deixe ele empurrar uma cadeira ou caixa pesada pela sala.', 90),
('motor', 60, 100, 'Encaixar Formas', 'Brinque com caixa de encaixe ou potes de diferentes tamanhos.', 50),
('motor', 70, 150, 'Chutar Bola', 'Incentive a criança a chutar uma bola parada.', 60);

-- Categoria: SPEECH (Fala e Comunicação)
INSERT INTO challenge_templates (category, min_age_weeks, max_age_weeks, title, description, xp_base) VALUES
('speech', 0, 12, 'Conversa de Bebê', 'Imite os sons que o bebê faz (balbucio) respondendo a ele.', 40),
('speech', 0, 24, 'Narração do Dia', 'Narre o que você está fazendo: "Agora a mamãe vai trocar a fralda".', 30),
('speech', 12, 36, 'Leitura Diária', 'Leia um livro infantil curto apontando para as figuras.', 60),
('speech', 24, 48, 'Cantar Músicas', 'Cante músicas com gestos (ex: Dona Aranha).', 50),
('speech', 30, 60, 'Nomear Objetos', 'Aponte e diga o nome de 5 objetos durante o passeio.', 40),
('speech', 40, 80, 'Esperar Resposta', 'Faça uma pergunta e espere 5 segundos pela reação dele.', 50),
('speech', 50, 100, 'Sons de Animais', 'Brinque de "Como faz a vaca?" e outros bichos.', 40),
('speech', 60, 120, 'Escolha Simples', 'Dê duas opções: "Quer a maçã ou a banana?" esperando a fala.', 60),
('speech', 70, 150, 'Contar Histórias', 'Peça para ele contar o que aconteceu no desenho ou no parquinho.', 80),
('speech', 80, 200, 'Rimando Palavras', 'Brinque de achar palavras que rimam (Gato, Pato, Mato).', 70);

-- Categoria: HEALTH (Saúde)
INSERT INTO challenge_templates (category, min_age_weeks, max_age_weeks, title, description, xp_base) VALUES
('health', 0, 4, 'Limpeza do Umbigo', 'Limpe o coto umbilical com álcool 70% a cada troca.', 50),
('health', 0, 12, 'Banho de Sol', '5-10 min de sol nas perninhas antes das 10h (vitamina D).', 40),
('health', 0, 24, 'Higiene Nasal', 'Lave o nariz com soro fisiológico para melhorar a respiração.', 30),
('health', 0, 100, 'Carteirinha em Dia', 'Verifique a próxima vacina e agende no posto.', 100),
('health', 24, 200, 'Escovação Divertida', 'Escove os dentinhos (ou gengiva) cantando uma música.', 50),
('health', 0, 200, 'Cortar Unhas', 'Corte as unhas enquanto ele dorme ou está calmo.', 40),
('health', 24, 200, 'Lavar Mãos', 'Ensine a lavar as mãos antes de comer.', 30),
('health', 0, 52, 'Massagem Shantala', 'Faça massagem para aliviar cólicas e relaxar.', 60),
('health', 12, 200, 'Hidratação da Pele', 'Passe hidratante apropriado após o banho.', 30),
('health', 0, 24, 'Arrotar', 'Coloque para arrotar após cada mamada para evitar gases.', 30);

-- Categoria: BEHAVIOR (Comportamento)
INSERT INTO challenge_templates (category, min_age_weeks, max_age_weeks, title, description, xp_base) VALUES
('behavior', 50, 150, 'Nomear Emoção', 'Diga "Você está bravo porque o brinquedo caiu" para validar.', 60),
('behavior', 60, 200, 'Abraço de Acalmar', 'Ofereça um abraço quando a criança estiver chorando (co-regulação).', 50),
('behavior', 70, 200, 'Troca Positiva', 'Em vez de "Não mexa aí", diga "Mexa aqui neste brinquedo".', 50),
('behavior', 50, 150, 'Antecipação', 'Avise 5 min antes de acabar a brincadeira: "Está quase na hora do banho".', 40),
('behavior', 60, 200, 'Elogio Descritivo', 'Elogie o esforço: "Você guardou todos os blocos!", não só "Muito bem".', 50),
('behavior', 80, 200, 'Cantinho da Calma', 'Crie um espaço com almofadas para relaxar (não é castigo).', 70),
('behavior', 60, 200, 'Dar Escolhas', 'Deixe escolher entre duas roupas para sentir controle.', 40),
('behavior', 90, 250, 'Hora de Compartilhar', 'Brinque de "minha vez, sua vez" com um brinquedo.', 60),
('behavior', 50, 200, 'Rotina Visual', 'Mostre na agenda o que vai acontecer no dia para reduzir ansiedade.', 50),
('behavior', 100, 300, 'Respiração de Dragão', 'Ensine a respirar fundo e soltar o ar forte quando estiver bravo.', 80);

-- Categoria: POTTY (Desfralde)
INSERT INTO challenge_templates (category, min_age_weeks, max_age_weeks, title, description, xp_base) VALUES
('potty', 50, 100, 'Troca em Pé', 'Comece a trocar a fralda de xixi com a criança em pé.', 40),
('potty', 60, 120, 'Apresentar o Penico', 'Deixe o penico no banheiro para a criança se familiarizar.', 50),
('potty', 70, 130, 'História do Cocô', 'Leia livrinhos sobre desfralde para naturalizar o tema.', 40),
('potty', 80, 150, 'Tchau Cocô', 'Deixe a criança dar descarga e dar tchau para o cocô da fralda.', 50),
('potty', 90, 160, 'Sentar Vestido', 'Brinque de sentar no penico mesmo de roupa.', 30),
('potty', 100, 200, 'Hora do Xixi', 'Convide (sem forçar) para ir ao banheiro ao acordar.', 60),
('potty', 100, 200, 'Calcinha/Cueca', 'Compre roupa íntima de personagens que a criança goste.', 50),
('potty', 110, 250, 'Elogiar o Seco', 'Elogie quando a fralda estiver seca por muito tempo.', 40),
('potty', 120, 300, 'Xixi Sentado', 'Ensine meninos a fazer xixi sentado inicialmente.', 40),
('potty', 120, 300, 'Lavar Mãos Depois', 'Crie o hábito de lavar as mãos após usar o penico.', 30);

-- Categoria: SOCIAL (Socialização)
INSERT INTO challenge_templates (category, min_age_weeks, max_age_weeks, title, description, xp_base) VALUES
('social', 0, 12, 'Sorriso Social', 'Sorria sempre que o bebê olhar para você.', 40),
('social', 12, 40, 'Espelho, Espelho', 'Brinque com o bebê na frente do espelho.', 50),
('social', 24, 60, 'Esconde-Achou', 'Brinque de cobrir o rosto com uma fralda (Peek-a-boo).', 60),
('social', 40, 100, 'Dar Tchau', 'Incentive dar tchau com a mãozinha ao sair.', 50),
('social', 50, 150, 'Parquinho', 'Leve a criança para ver outras crianças brincando.', 70),
('social', 60, 200, 'Brincar de Faz de Conta', 'Faça comidinha ou dê banho na boneca juntos.', 60),
('social', 50, 150, 'Mandar Beijo', 'Ensine a mandar beijo para a vovó ou titia.', 40),
('social', 70, 200, 'Dividir Lanche', 'Incentive oferecer um pedaço da fruta para você.', 50),
('social', 80, 250, 'Cumprimentar', 'Ensine a dizer "Oi" ou "Bom dia" para o porteiro.', 40),
('social', 90, 300, 'Empatia', 'Se alguém chorar, explique: "Ele está triste, vamos fazer carinho?".', 80);
