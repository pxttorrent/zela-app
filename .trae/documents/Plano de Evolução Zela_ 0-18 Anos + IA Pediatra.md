# Plano de Evolução: Zela App (Maternidade 0-18 Anos + IA Pediatra)

Este plano transforma o Zela de um app de recém-nascidos para uma plataforma completa de vida, integrando IA de ponta para suporte médico consultivo.

---

## 🚀 Parte 1: Expansão do Ciclo de Vida (0 a 18 anos)

Atualmente o Zela foca em "Semanas de Vida". Para suportar até a adolescência, mudaremos a arquitetura para "Fases de Desenvolvimento".

### Novas Fases & Funcionalidades
1.  **Toddlers (1 a 3 anos)**
    *   **Foco:** Desenvolvimento motor, fala, desfralde e autonomia.
    *   **Feature:** "Diário da Fala" (registrar primeiras palavras).
    *   **Trackers:** Monitoramento de birras (frequência/gatilhos) e Desfralde (sucessos/acidentes).
    *   **Vacinas:** Reforços e campanhas anuais.

2.  **Pré-Escolar (3 a 6 anos)**
    *   **Foco:** Socialização, alfabetização inicial e rotina escolar.
    *   **Feature:** "Agenda Escolar Digital" (integrar eventos da escola).
    *   **Missões:** Jogos educativos longe das telas, atividades de coordenação fina.

3.  **Escolar (6 a 12 anos)**
    *   **Foco:** Saúde emocional, bullying, puberdade precoce, uso de telas.
    *   **Feature:** "Controle Parental Zela" (Dicas de segurança digital e limites).
    *   **Saúde:** Curvas de crescimento (IMC) e saúde ocular.

4.  **Adolescência (12 a 18 anos)**
    *   **Foco:** Autonomia, saúde mental, educação sexual, orientação vocacional.
    *   **Feature:** "Espaço Teen" (O adolescente tem seu próprio login limitado para ver vacinas e dicas).
    *   **Privacidade:** Área segura para dúvidas íntimas via IA.

### 🛠 Alterações Técnicas Necessárias
*   **Banco de Dados:**
    *   Alterar `challenge_templates` para suportar `min_age_years` além de weeks.
    *   Criar tabela `milestones` (marcos de desenvolvimento) independente de desafios diários.
*   **Frontend:**
    *   Dashboard modular que muda o layout conforme a idade (ex: Remove tracker de mamada se > 2 anos).

---

## 🤖 Parte 2: Zela Pediatra (IA via WhatsApp + n8n)

Uma "Pediatra de Bolso" disponível 24/7 para tirar dúvidas, triar sintomas e acalmar pais, integrada ao histórico do bebê.

### Arquitetura da Solução

1.  **Canal (WhatsApp Business API):**
    *   Interface nativa e acessível.
    *   Uso da API oficial da Meta (ou Twilio/Waha para MVP).

2.  **Cérebro (n8n + LLM):**
    *   O **n8n** será o orquestrador que conecta o WhatsApp ao Banco de Dados e à IA.

### Fluxo de Trabalho (Workflow n8n)
1.  **Trigger:** Mensagem recebida no WhatsApp.
2.  **Identificação:** O n8n busca o número de telefone na tabela `users` do Zela.
    *   *Se não encontrar:* Responde "Olá, para acessar a Zela Pediatra, cadastre-se no app."
    *   *Se encontrar:* Busca o perfil do(s) filho(s) (Idade, Peso, Histórico recente).
3.  **Contextualização (RAG):**
    *   O sistema busca em uma base vetorial (Pinecone/Supabase Vector) protocolos oficiais da SBP (Sociedade Brasileira de Pediatria).
4.  **Geração de Resposta (GPT-4o ou Claude 3.5 Sonnet):**
    *   Prompt do Sistema: *"Você é a Dra. Zela, uma pediatra empática e baseada em evidências. O bebê é [Nome], tem [Idade]. O histórico mostra [Vacinas pendentes]. O usuário perguntou: [Pergunta]. Responda com base nos protocolos anexos. Em caso de emergência (febre alta, falta de ar), instrua ir ao PS imediatamente."*
5.  **Resposta:** Envia áudio ou texto para o usuário no WhatsApp.
6.  **Log:** Salva a interação na tabela `chat_logs` para auditoria médica.

---

## 🧠 Parte 3: Plano de Treinamento da IA (Safety & Accuracy)

Para garantir que a IA não alucine ou dê conselhos perigosos:

### Fase 1: Base de Conhecimento (Knowledge Base)
*   **Ingestão de Dados:**
    *   Diretrizes da SBP e AAP (American Academy of Pediatrics).
    *   Manuais de Vacinação do SUS.
    *   Bulários de medicamentos comuns (apenas para consulta de posologia padrão, nunca prescrever).

### Fase 2: Fine-Tuning & Guardrails
*   **Personalidade:** Treinar para ser acolhedora, não alarmista, mas firme em sinais de perigo.
*   **Guardrails (Regras de Bloqueio):**
    *   *Nunca* prescrever antibióticos ou tarja preta.
    *   *Sempre* identificar sinais de alerta (Red Flags): Febre > 39ºC, vômito persistente, letargia.
    *   Se detectar Red Flag -> Resposta Padrão de Emergência + Link para Google Maps "Hospitais Perto de Mim".

### Fase 3: Feedback Loop Humano (RLHF)
*   **Painel Médico:** Um pediatra real revisa aleatoriamente 50 conversas por semana.
*   **Botão de Denúncia:** No app, o usuário pode reportar "Resposta estranha".

---

## 📅 Roteiro de Implementação Técnica

### Semana 1: Estrutura & Banco de Dados
1.  Atualizar Schema para `milestones` e suporte a anos.
2.  Criar tabela `chat_logs` e `medical_docs`.

### Semana 2: Integração n8n (MVP)
1.  Subir instância n8n (Self-hosted ou Cloud).
2.  Conectar Postgres do Zela ao n8n.
3.  Criar fluxo simples: Recebe Zap -> Consulta Nome do Bebê -> Responde "Oi mãe do [Nome]".

### Semana 3: Inteligência (RAG)
1.  Configurar Vector Store (pgvector no próprio Postgres).
2.  Indexar PDFs da Sociedade Brasileira de Pediatria.
3.  Conectar OpenAI API no n8n com o contexto recuperado.

### Semana 4: Expansão App (Frontend)
1.  Criar seções "Criança" e "Adolescente" no Dashboard.
2.  Adicionar botão "Falar com Zela Pediatra" que abre o WhatsApp Deep Link.

Este plano posiciona o Zela não apenas como um app de registro, mas como uma **Healthtech completa de acompanhamento vitalício**.
