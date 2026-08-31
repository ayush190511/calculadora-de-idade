# 🎂 Calculadora de Idade — Plataforma Online de Precisão Cronológica

[![Live Website](https://img.shields.io/badge/Website-calculadoradeidade.com-0070f3?style=for-the-badge&logo=vercel&logoColor=white)](https://calculadoradeidade.com)
[![Built with Astro](https://img.shields.io/badge/Astro-5.0-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

**[Calculadora de Idade (calculadoradeidade.com)](https://calculadoradeidade.com)** é uma aplicação web de alto desempenho, privativa e sem latência, desenvolvida para calcular com exatidão matemática a idade cronológica, tempo de vida em tempo real, idade gestacional e de bebês, intervalos entre datas, contagem regressiva para aposentadoria (INSS), idade canina e elegibilidade etária em concursos públicos e editais.

---

## 🌟 Visão Geral & Diferenciais

Calcular a idade exata pode parecer simples, mas variações de dias nos meses, anos bissextos (29 de fevereiro), fusos horários e regras específicas (como idade corrigida para prematuros e datas de corte de editais) exigem algoritmos precisos.

A **Calculadora de Idade** oferece ferramentas especializadas com design moderno, suporte a modo escuro/claro e funcionamento offline.

### 🔒 Padrão de Privacidade Total (100% Client-Side)
Todas as operações de cálculo de datas e horários são executadas **100% localmente no navegador do usuário via JavaScript**. As datas de nascimento inseridas **nunca são enviadas, registradas ou armazenadas** em servidores externos, garantindo conformidade com a LGPD e o RGPD.

---

## 🚀 Ferramentas & Calculadoras Disponíveis

### 1. ⚡ Calculadora de Idade Principal (`/`)
- **Idade Exata em Anos, Meses e Dias**: Decomposição cronológica detalhada ajustada a anos bissextos.
- **Relógio ao Vivo em Segundos**: Contador dinâmico atualizado segundo a segundo.
- **Estatísticas de Tempo de Vida**: Total de meses, semanas, dias, horas e contagem regressiva para o próximo aniversário.
- **Detecção de Fuso Horário**: Suporte a fusos horários do Brasil (Brasília, Manaus, Noronha, Acre), Portugal (Lisboa, Madeira, Açores), Angola (Luanda), Moçambique (Maputo) e Cabo Verde.
- **Resumo Copiável**: Botão para copiar o resumo da idade formatado para WhatsApp e redes sociais.

### 2. 👶 Calculadora de Idade Gestacional e do Bebê (`/calculadora-idade-gestacional`)
- **Idade em Semanas e Meses**: Cálculo exato para acompanhamento de curvas de crescimento e vacinação.
- **Idade Corrigida para Prematuros**: Desconto das semanas de prematuridade em relação a 40 semanas de gestação, essencial para avaliação de marcos motores até os 2 anos.
- **Próximo Mesversário**: Acompanhamento mensal da data de mesversário do bebê.

### 3. ⏳ Calculadora de Idade Entre Datas (`/calculadora-idade-entre-datas`)
- **Diferença Exata de Tempo**: Medição do intervalo entre duas datas com horas e minutos opcionais.
- **Totalizadores**: Exibição da duração total em dias, semanas, horas e minutos corridos.

### 4. 🏖️ Calculadora de Idade para Aposentadoria (`/calculadora-idade-aposentadoria`)
- **Regras de Idade Mínima**: Simulação com base nas idades padrão (62 anos para mulheres e 65 anos para homens no INSS) ou idade personalizada.
- **Progresso de Carreira**: Barra visual de percentual concluído do tempo de trabalho com base na idade de início da atividade profissional.
- **Contagem Regressiva**: Tempo restante exato em anos, meses e dias até a data da aposentadoria.

### 5. 🐶 Calculadora de Idade de Cachorro em Anos Humanos (`/calculadora-idade-cachorro`)
- **Padrão Veterinário AVMA**: Conversão por porte físico (pequeno, médio, grande e gigante), superando o mito da multiplicação direta por 7.
- **Fases da Vida & Sono**: Orientações sobre necessidades diárias de sono e cuidados nutricionais específicos por faixa etária.

### 6. 📋 Calculadora de Idade para Concursos Públicos (`/calculadora-idade-concursos`)
- **Data de Corte do Edital**: Cálculo da idade exata na data de inscrição ou posse fixada no edital.
- **Critérios de Elegibilidade**: Validação automática de idade mínima (18 ou 21 anos) e idade máxima, com opções de cotas e adaptações para PcD e militares.

---

## 🎯 Palavras-Chave Otimizadas para SEO

O projeto foi estruturado semântica e tecnicamente para rankear no topo do Google no Brasil e em países lusófonos para os seguintes termos:

- **Palavra-chave principal:** `calculadora de idade`
- **Palavras-chave de suporte:**
  - `quantos anos eu tenho`
  - `google quantos anos eu tenho`
  - `minha idade`
  - `calcular idade`
  - `calculadora idade`
  - `idade`
  - `calculo de idade`
  - `calculadora de idade gestacional`
  - `calculadora de idade entre datas`
  - `calculadora de idade corrigida`
  - `calculadora de idade atual`
  - `calculadora de idade e meses`

---

## 🌐 Estrutura Hreflang Internacional

Configurada para atender todos os mercados de língua portuguesa com marcação canônica e internacional:

```html
<html lang="pt-BR">
<link rel="alternate" hreflang="pt-BR" href="https://calculadoradeidade.com/" />
<link rel="alternate" hreflang="pt-PT" href="https://calculadoradeidade.com/" />
<link rel="alternate" hreflang="pt-AO" href="https://calculadoradeidade.com/" />
<link rel="alternate" hreflang="pt-MZ" href="https://calculadoradeidade.com/" />
<link rel="alternate" hreflang="pt" href="https://calculadoradeidade.com/" />
<link rel="alternate" hreflang="x-default" href="https://calculadoradeidade.com/" />
```

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** [Astro 5](https://astro.build) (Geração estática de alta velocidade e SEO nativo)
- **Componentes Interativos:** [React 19](https://react.dev)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com) com variáveis CSS para alternância de tema Claro/Escuro
- **Ícones:** [Lucide React](https://lucide.dev) & SVGs inline otimizados
- **Dados Estruturados:** JSON-LD Schema.org (`WebSite`, `SoftwareApplication`, `FAQPage` e `BreadcrumbList`)
- **TypeScript:** Tipagem estrita e validação de regras de negócios

---

## 📁 Estrutura de Diretórios

```text
calculadora_de_idade/
├── public/
│   ├── favicon.png
│   ├── robots.txt              # Regras de indexação e link para sitemap.xml
│   └── sitemap.xml             # Mapa do site com todas as rotas em português
├── src/
│   ├── components/
│   │   ├── Header.astro        # Cabeçalho com navegação e alternador de tema
│   │   ├── Footer.astro        # Rodapé institucional e botão voltar ao topo
│   │   ├── SEOContent.astro    # Guias SEO e perguntas frequentes com Schema FAQPage
│   │   ├── SEOSchema.astro     # Schemas estruturados JSON-LD
│   │   ├── DateInputField.tsx  # Campo de data DD/MM/AAAA com máscara e validação
│   │   ├── ContactForm.tsx     # Formulário de contato anti-spam
│   │   ├── OfflineBanner.tsx   # Alerta de funcionamento offline
│   │   └── modes/
│   │       ├── NormalAgeMode.tsx   # Calculadora de idade principal e relógio ao vivo
│   │       ├── BabyAgeMode.tsx     # Idade gestacional, bebês e idade corrigida
│   │       ├── DateDiffMode.tsx    # Calculadora de intervalo entre datas
│   │       ├── RetirementMode.tsx  # Calculadora de aposentadoria
│   │       ├── DogAgeMode.tsx      # Calculadora de idade de cachorro
│   │       └── UPSCMode.tsx        # Calculadora de concursos e editais
│   ├── lib/
│   │   ├── date-utils.ts           # Algoritmos matemáticos de calendário e datas
│   │   ├── concurso-calculator.ts  # Lógica de validação de editais
│   │   └── types.ts                # Interfaces e tipos TypeScript
│   ├── pages/
│   │   ├── index.astro                              # Página Inicial (/)
│   │   ├── calculadora-idade-gestacional.astro      # Idade Gestacional e Bebês
│   │   ├── calculadora-idade-entre-datas.astro      # Diferença Entre Datas
│   │   ├── calculadora-idade-aposentadoria.astro    # Aposentadoria
│   │   ├── calculadora-idade-cachorro.astro         # Idade Canina
│   │   ├── calculadora-idade-concursos.astro        # Concursos e Editais
│   │   ├── sobre.astro                              # Sobre Nós
│   │   ├── contato.astro                            # Fale Conosco
│   │   ├── politica-de-privacidade.astro            # Política de Privacidade (LGPD)
│   │   ├── termos-de-uso.astro                      # Termos de Uso
│   │   ├── 404.astro                                # Página Não Encontrada
│   │   └── 500.astro                                # Erro Interno
│   └── styles/
│       └── global.css          # Design System e temas Claro/Escuro
├── astro.config.mjs            # Configurações do Astro e redirecionamentos 301
├── package.json
└── tsconfig.json
```

---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos
- **Node.js**: `>= 22.12.0`
- **npm** ou gerenciador de pacotes equivalente

### Instalação

```bash
# Clone o repositório
git clone https://github.com/ayush190511/calculadora-de-idade.git

# Acesse a pasta do projeto
cd calculadora_de_idade

# Instale as dependências
npm install
```

### Comandos de Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento local
npm run dev

# Compilar para produção (build estático)
npm run build

# Visualizar o build de produção localmente
npm run preview
```

---

## 📄 Licença & Direitos

© 2026 **Calculadora de Idade** ([calculadoradeidade.com](https://calculadoradeidade.com)). Todos os direitos reservados.
