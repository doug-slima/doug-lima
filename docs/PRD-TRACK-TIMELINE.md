# PRD — Track Timeline (Etapa 2)

> Sessão 3 · 29 mai 2026
> Referência: docs/SESSION-HANDOFF-PORTFOLIO.md

---

## 0. Regras invioláveis

Leia esta seção inteira antes de tocar em qualquer arquivo.

### 0.1 Arquivos que NÃO devem ser alterados

- `app/components/Header.tsx` — NÃO ALTERAR. O header já está correto.
- `app/components/PageLayout.tsx` — NÃO ALTERAR. Os paddings globais já estão corretos.
- `app/page.tsx` — NÃO ALTERAR (exceto para extrair o blur overlay para componente, substituindo o JSX inline por `<BlurOverlay />`; o resultado visual deve ser idêntico).
- `app/globals.css` — NÃO ALTERAR.
- `app/layout.tsx` — NÃO ALTERAR.

### 0.2 Espaçamentos que já estão corretos e não devem mudar

- Distância do topo da viewport até o lettering "doug_lima.": **~80px** (controlado pelo `pt-[112px]` do PageLayout — NÃO MEXER)
- Padding horizontal: **168px** (`px-[10.5rem]`) — NÃO MEXER
- Monograma: **80px** do bottom da viewport — NÃO MEXER

### 0.3 Procedimento obrigatório

1. Fazer `git stash` ou criar branch antes de começar
2. Ler TODOS os arquivos listados na seção 7 antes de escrever código
3. Após cada tarefa, verificar que a home (`/`) continua idêntica
4. Se algo quebrar, `git checkout` para restaurar — não tentar consertar em cima

---

## 1. Contexto

A página `/track` tem duas colunas:

- **Coluna esquerda (sticky):** bio, subtítulo, tag "swipe-up", monograma — IMPLEMENTADA na Etapa 1, funciona corretamente
- **Coluna direita (scrollável):** timeline de carreira — A IMPLEMENTAR nesta etapa

As duas colunas são **estruturas completamente independentes** em termos de padding e posicionamento.

---

## 2. Arquitetura das duas colunas

### Coluna esquerda (bio)

- `position: sticky`, `top: 0`
- Flex column com `justify-between`, `h-screen`
- Largura: `w-fit` / `w-max` (determinada pelo conteúdo da bio)
- `flex-shrink-0`
- Padding bottom próprio: **80px** (distância até o monograma)
- Herda os paddings do PageLayout normalmente

### Coluna direita (timeline)

- `flex-1`, `ml-[80px]` (gap fixo de 80px da coluna esquerda)
- **SEM padding-top próprio** — a timeline começa do topo da viewport e passa por trás do header/blur
- **SEM padding-bottom próprio** — a timeline vai até a base da viewport
- Scrolla naturalmente com a página

**IMPORTANTE:** O PageLayout aplica `pt-[112px]` e `pb-[80px]` ao container. A coluna da timeline NÃO deve herdar esses paddings verticais. Resolver isso **dentro de `app/track/page.tsx`** — por exemplo, com margin negativo na coluna direita (`-mt-[112px] -mb-[80px]`) ou outra técnica. NÃO modificar o PageLayout.

---

## 3. BlurOverlay — componente compartilhado

### 3.1 O que é

O blur overlay é um gradiente que faz o conteúdo desaparecer suavemente ao scrollar por trás do header. Hoje existe inline na home (`app/page.tsx`). Precisa ser extraído para componente reutilizável.

### 3.2 Arquivo

`app/components/BlurOverlay.tsx`

### 3.3 Spec

```tsx
// Extrair exatamente este JSX da home:
<div
  className="absolute top-0 left-0 right-0 h-[280px] z-10 pointer-events-none"
  style={{
    background: "linear-gradient(to bottom, #F9F9F2 0%, #F9F9F2 65%, rgba(249,249,242,0) 100%)",
  }}
/>
```

### 3.4 Ações

1. Criar `BlurOverlay.tsx` com o JSX acima
2. Na home (`app/page.tsx`): substituir o JSX inline por `<BlurOverlay />` — resultado visual DEVE ser idêntico
3. Na track (`app/track/page.tsx`): adicionar `<BlurOverlay />` para que a timeline desapareça suavemente ao scrollar por trás do header

### 3.5 Verificação

Após a substituição, abrir a home e confirmar visualmente que o blur sobre o mosaico está idêntico ao que era antes.

---

## 4. Componente TimelineBlock

### 4.1 Arquivo

`app/components/TimelineBlock.tsx`

Este componente será reutilizado em `/craft` no futuro — construir de forma genérica.

### 4.2 Tipos

```typescript
type TimelineLine = {
  text: string
  style: 'light' | 'bold' | 'serif'
}

type TimelineEntry = {
  year: string
  lines: TimelineLine[]
  logo: {
    src: string
    alt: string
  }
}
```

### 4.3 Layout de cada bloco

Flex row com **`items-center`** — ano, texto e logo ficam **sempre centralizados verticalmente** entre si, independente do número de linhas do texto.

```
| ano | 24px | texto (hug) | flex-1 (gutter auto) | logo (220px fixo) |
```

**Filho 1 — Ano:**
- Geist Semibold, 24px, cor `#5F6A50`
- `flex-shrink-0`

**Filho 2 — Texto do cargo:**
- `margin-left: 24px`
- `flex-shrink-0`, `w-fit`
- Cada linha é um elemento block (não inline) — empilhadas verticalmente
- Estilos por linha:
  - `'light'`: font Geist, weight 300 (Light), 24px, cor `#5F6A50`
  - `'bold'`: font Geist, weight 600 (Semibold), 24px, cor `#5F6A50`
  - `'serif'`: font Fenix, weight 400 (Regular), 24px, cor `#5F6A50`

**Gutter:** `flex-1` — espaço auto entre texto e logo

**Filho 3 — Logo:**
- Largura fixa: `w-[220px]`, `flex-shrink-0`
- `<Image>` (next/image) ou `<img>` com `object-contain`
- A altura natural do logo determina a altura visual do bloco

### 4.4 Os 3 padrões de texto

**Padrão 1 — Uma linha (cargo simples):**
Ano e cargo na mesma baseline.
```
2011   Service Designer                              [logo]
```

**Padrão 2 — Duas linhas (cargo composto):**
Ano centralizado verticalmente com o bloco de 2 linhas.
```
       Service Designer
2017   & Researcher                                   [logo]
```
Ambas linhas em style `'light'`.

**Padrão 3 — Três linhas (acadêmico/docência):**
Ano centralizado verticalmente com o bloco de 3 linhas (alinha visualmente com a linha do meio).
```
       Master's Degree in          ← style 'light'  (Geist Light)
2014   Technology & Society        ← style 'bold'   (Geist Semibold)
       Unifei/MG                   ← style 'serif'  (Fenix Regular)
```

### 4.5 Espaçamento entre blocos

**344px** de distância vertical entre blocos. Aplicar como `gap-[344px]` no container pai (não como margin no componente).

---

## 5. Dados da timeline

Logos em: `public/assets/companies-page-track/{empresa}-logo.png`

### Array completo (13 entradas, em ordem cronológica):

```typescript
const timelineData: TimelineEntry[] = [
  {
    year: "2011",
    lines: [{ text: "Service Designer", style: "light" }],
    logo: { src: "/assets/companies-page-track/livework-logo.png", alt: "Livework" },
  },
  {
    year: "2012",
    lines: [{ text: "Service Designer", style: "light" }],
    logo: { src: "/assets/companies-page-track/itau-logo.png", alt: "Itaú" },
  },
  {
    year: "2014",
    lines: [
      { text: "Master's Degree in", style: "light" },
      { text: "Technology & Society", style: "bold" },
      { text: "Unifei/MG", style: "serif" },
    ],
    logo: { src: "/assets/companies-page-track/unifei-logo.png", alt: "Unifei" },
  },
  {
    year: "2017",
    lines: [
      { text: "Service Designer", style: "light" },
      { text: "& Researcher", style: "light" },
    ],
    logo: { src: "/assets/companies-page-track/livework-logo.png", alt: "Livework" },
  },
  {
    year: "2018",
    lines: [{ text: "UX Researcher", style: "light" }],
    logo: { src: "/assets/companies-page-track/ifood-logo.png", alt: "iFood" },
  },
  {
    year: "2018",
    lines: [{ text: "Design Lead", style: "light" }],
    logo: { src: "/assets/companies-page-track/kyvo-logo.png", alt: "Kyvo" },
  },
  {
    year: "2019",
    lines: [
      { text: "Teacher", style: "light" },
      { text: "Future Studies", style: "bold" },
      { text: "IED/SP", style: "serif" },
    ],
    logo: { src: "/assets/companies-page-track/ied-logo.png", alt: "IED" },
  },
  {
    year: "2019",
    lines: [{ text: "Design Lead", style: "light" }],
    logo: { src: "/assets/companies-page-track/hash-logo.png", alt: "Hash" },
  },
  {
    year: "2020",
    lines: [
      { text: "Teacher", style: "light" },
      { text: "Base/Exploratory Research", style: "bold" },
      { text: "Aprender Design", style: "serif" },
    ],
    logo: { src: "/assets/companies-page-track/aprender-design-logo.png", alt: "Aprender Design" },
  },
  {
    year: "2021",
    lines: [{ text: "Design Manager", style: "light" }],
    logo: { src: "/assets/companies-page-track/olist-logo.png", alt: "Olist" },
  },
  {
    year: "2022",
    lines: [{ text: "Design Expert", style: "light" }],
    logo: { src: "/assets/companies-page-track/mercado-livre-logo.png", alt: "Mercado Livre" },
  },
  {
    year: "2024",
    lines: [{ text: "Founding Designer", style: "light" }],
    logo: { src: "/assets/companies-page-track/klauvi-logo.png", alt: "Klauvi" },
  },
  {
    year: "2024",
    lines: [
      { text: "Teacher", style: "light" },
      { text: "AI Augmented Design", style: "bold" },
      { text: "ESPM/SP", style: "serif" },
    ],
    logo: { src: "/assets/companies-page-track/espm-logo.png", alt: "ESPM" },
  },
];
```

---

## 6. Integração na track page

### 6.1 Antes de começar

Restaurar o estado limpo da Etapa 1:

```bash
git log --oneline app/components/Header.tsx app/components/PageLayout.tsx
```

Se Header.tsx ou PageLayout.tsx foram alterados nesta sessão, reverter:

```bash
git checkout <commit-da-etapa-1> -- app/components/Header.tsx app/components/PageLayout.tsx
```

### 6.2 Coluna direita

Dentro de `app/track/page.tsx`, na coluna direita:

- Renderizar os 13 `TimelineBlock` em um container `flex flex-col gap-[344px]`
- O primeiro bloco da timeline alinha verticalmente com o subtítulo "Here is a nut / of my career:" da coluna esquerda
- A coluna direita deve compensar os paddings do PageLayout para ter padding-top e padding-bottom ZERO (usar margin negativo ou outra técnica — NÃO modificar o PageLayout)
- Adicionar `<BlurOverlay />` na track page para o fade suave no topo

### 6.3 Tag "swipe-up" — lógica de scroll

A tag pill na coluna esquerda já existe. Adicionar:

1. Elemento sentinel `<div id="timeline-end" />` após o último TimelineBlock
2. `IntersectionObserver` no sentinel:
   - Sentinel **fora** do viewport → texto: `"swipe-up to see more"` (não clicável)
   - Sentinel **dentro** do viewport → texto: `"back to top"` (clicável, scroll suave ao topo)

---

## 7. Arquivos a ler antes de codificar

Ler na seguinte ordem:

1. `docs/SESSION-HANDOFF-PORTFOLIO.md` — contexto geral do projeto
2. `app/components/PageLayout.tsx` — entender paddings globais
3. `app/components/Header.tsx` — entender posicionamento atual (NÃO ALTERAR)
4. `app/track/page.tsx` — estado atual da track (Etapa 1)
5. `app/page.tsx` — referência do blur overlay a ser extraído

---

## 8. Ordem de execução

1. **Restaurar** Header.tsx e PageLayout.tsx se foram alterados (seção 6.1)
2. **Verificar** home (`/`) — deve estar idêntica ao estado original
3. **Criar** `app/components/BlurOverlay.tsx` (seção 3)
4. **Substituir** blur inline na home por `<BlurOverlay />` — verificar home novamente
5. **Criar** `app/components/TimelineBlock.tsx` (seção 4)
6. **Integrar** timeline na track page (seção 6)
7. **Verificar** home final — deve estar idêntica
8. **Verificar** track — timeline scrollando, header intacto, coluna esquerda intacta

---

## 9. Learnings desta sessão (para não repetir)

- **NUNCA alterar Header.tsx ou PageLayout.tsx** para resolver problemas específicos de uma página. Overrides vão na page-level.
- **Paddings globais do PageLayout são corretos.** Se uma coluna precisa ignorá-los, compensar com margin negativo ou estrutura própria dentro da page.
- **A distância do topo da viewport até o "doug_lima." (~80px) é sagrada.** Qualquer mudança que altere esse valor está errada.
- **Coluna esquerda e coluna direita são independentes.** A timeline (direita) não herda, não depende e não é afetada pelos paddings da bio (esquerda).
- **Sempre verificar a home após qualquer mudança.** O blur overlay é compartilhado — qualquer alteração pode afetar ambas as páginas.
