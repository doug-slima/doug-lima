# SESSION HANDOFF — douglima.work Portfolio

> Documento de contexto para continuidade entre sessões.
> Última atualização: 30 mai 2026 — Sessão 5 (Craft: Selected Works password gate ✅ + asset paths corrigidos)

---

## 1. Visão geral do projeto

Portfolio pessoal de **Douglas Lima** — product designer em transição para código.
Site mínimo, estático, com personalidade forte e paleta terrosa.

**Stack:** Next.js 16.2.6 (App Router) + React 19.2.4 + Tailwind CSS v4 + TypeScript
**Deploy:** Vercel (auto-deploy via push na `main`)
**Domínio:** douglima.work (Cloudflare DNS, propagado)
**Repo:** `~/Projects/doug-lima` → github.com/doug-slima/doug-lima
**Vercel URL:** doug-lima-de6h6xbu0-doug-slimas-projects.vercel.app

---

## 2. Infraestrutura configurada

| Item | Status | Detalhes |
|---|---|---|
| Repo GitHub | OK | `doug-slima/doug-lima`, branch `main` |
| Vercel | OK | Hobby plan, auto-deploy na `main` |
| Domínio GoDaddy | OK | `douglima.work` comprado, sem add-ons |
| Cloudflare DNS | OK | Nameservers: `brenda.ns.cloudflare.com` + `zod.ns.cloudflare.com` |
| Domínio na Vercel | OK | `douglima.work` + `www.douglima.work` configurados |
| Email personalizado | PENDENTE | Cloudflare Email Routing: `hello@douglima.work` → Gmail. Configurar após site pronto. |
| 2FA Vercel | OK | Configurado |
| Variável de ambiente NDA | OK | `NDA_PASSWORD=dvault` em `.env.local`. Adicionar no painel da Vercel antes do deploy. |

---

## 3. Estrutura de rotas

```
/              → Home (IMPLEMENTADA ✅)
/track         → Bio + timeline de carreira (IMPLEMENTADA ✅)
/craft         → Playground (✅) + Selected Works password gate (✅) — dados reais PENDENTE
```

---

## 4. Paleta de cores

| Token | Hex | Uso |
|---|---|---|
| `bg-base` | `#F9F9F2` | Background geral do site |
| `text-default` | `#5F6A50` | Texto padrão, links inativos, ícones |
| `text-active` | `#3B4028` | Texto selecionado/ativo, hovers |
| `surface-tag` | `#F0EEE5` | Background da tag "swipe-up" / "back to top" / input de senha |
| `text-muted` | `#A6AA97` | Botão de seção inativo (Playground ↔ Selected Works) |

Sem dark mode.

---

## 5. Fontes

| Fonte | Peso | Uso | Carregamento |
|---|---|---|---|
| **Geist** | Light (300) | Bio, textos de destaque — 40pt | `next/font/google`, var `--font-geist-var` |
| **Geist** | Semibold (600) | Ano na timeline, label do projeto no carrossel, primeira palavra da tag | |
| **Geist** | Light (300) | Cargo na timeline — 24pt, nome do projeto no carrossel — 24pt, tag — 14pt | |
| **Fenix** | Regular (400) | Navegação, subtítulos, labels, seletor de projetos — 20pt | `next/font/google`, var `--font-fenix-var` |

Logo "doug_lima." é SVG, não fonte.

---

## 6. Assets

**IMPORTANTE:** todos os assets globais estão em `public/assets/home/` (não `public/assets/` raiz).

| Arquivo | Tipo | Uso |
|---|---|---|
| `home/doug-lima-lettering.svg` | SVG | Logo "doug_lima." no header |
| `home/dl-monogram.svg` | SVG | Monograma decorativo (88px de largura) |
| `home/mosaic-home-bg.png` | PNG | Imagem de fundo animada (mosaico pixelado) — apenas na home |
| `home/doug-pixelart.png` | PNG | Pixel art decorativa no footer da home (h-10) |
| `home/substack-logo.png` | PNG | Ícone Substack no footer da home (h-7) |
| `home/linkedin-logo.png` | PNG | Ícone LinkedIn no footer da home (h-7) |

Logos das empresas para a timeline em `public/assets/companies-page-track/`:
livework, itaú, unifei, ifood, kyvo, ied, hash, aprender-design, olist, mercado-livre, klauvi, espm.

Assets do Playground em `public/assets/playground-works/`:

| Pasta | Logo | Imagens |
|---|---|---|
| `Agroprop/` | `agroprop-logo.png` | `agroprop-1.png` a `agroprop-12.png` |
| `LFC/` | `LFC-logo.png` | `LFC-1.png` a `LFC-14.png` |
| `Proxy/` | `proxy-logo.png` | `proxy-1.png` a `proxy-9.png` (última: hug height) |
| `Purple/` | `purple-logo.png` | `purple-1.png` a `purple-6.png` |

Assets do Selected Works: **PENDENTE** — criar pasta `public/assets/selected-works/` com subpastas por projeto, mesmo padrão do Playground. Doug exporta do Figma, Claude Code popula o `data.ts`.

---

## 7. Componentes implementados

### 7.1 `app/components/Header.tsx`

Componente reutilizável para todas as páginas.

- Logo SVG clicável (volta para `/`) — caminho: `/assets/home/doug-lima-lettering.svg`
- Nav com dois links: `craft` e `track`
- Usa `usePathname()` para estado ativo
- Default: sem underline, `#5F6A50` / Hover: underline + `#3B4028` / Active: underline permanente

**REGRA:** Não alterar este arquivo sem necessidade clara.

### 7.2 `app/components/PageLayout.tsx`

Encapsula padrões de layout compartilhados:

- Renderiza `Header.tsx`
- Aplica `pt-20 pb-20 px-[10.5rem]`
- Footer opcional com monograma + `footerContent` — monograma: `/assets/home/dl-monogram.svg`
- Suporte a `backgroundLayers` (para mosaico da home)

**Usado em:** `app/page.tsx` (home). Track e Craft NÃO usam PageLayout.

### 7.3 `app/components/BlurOverlay.tsx`

Gradiente de fade `#F9F9F2 → transparente`, altura 185px:
- Solid zone: 0–120px (cobre header + área de segurança)
- Fade zone: 120–185px

Usado de duas formas:
- Home: `absolute top-0 left-0 right-0` via `backgroundLayers` no PageLayout
- ScrollColumn: `sticky top-0 w-full` (baked in — ver 7.4)

### 7.4 `app/components/ScrollColumn.tsx`

Scroll container com BlurOverlay embutido. Props: `ref`, `className`, `style`, `children`.

```tsx
<div ref={ref} className={`overflow-y-auto ${className}`} style={style}>
  <BlurOverlay className="sticky top-0 w-full" />
  {children}
</div>
```

Usado nas páginas com o padrão split layout (track, craft).

### 7.5 `app/components/TimelineBlock.tsx`

Bloco individual da timeline de carreira.

```
| year (Geist SemiBold 24px) | 24px gap | text-content (hug) | flex-1 gutter | logo (220px) |
```

Exporta tipos `TimelineEntry` e `TimelineLine`.

Estilos de linha: `light` (Geist Light 24px) | `bold` (Geist SemiBold 24px) | `serif` (Fenix 24px).

### 7.6 `app/hooks/useSplitLayout.ts`

Hook que encapsula toda a lógica do padrão split layout. **Reutilizado por /track e /craft.**

```ts
const { refs, state, scrollToTop } = useSplitLayout(resetDeps?);
// refs: rightColRef, leftContentRef, firstItemRef, lastItemRef
// state: atEnd, paddingTop, paddingBottom, rightColLeft
```

**O que faz:**
- Mede `leftContentRef.getBoundingClientRect().right + 80px` → posiciona coluna direita
- Calcula `paddingTop` para que o centro do primeiro item fique em 50vh
- Calcula `paddingBottom` para que o centro do último item fique em 50vh no scroll final
- Scroll listener para detectar `atEnd`
- `resetDeps` (opcional): quando mudam, reseta scroll + `atEnd` + re-mede. Usado na /craft com `[activeProject]`.

### 7.7 `app/craft/ProjectCarousel.tsx`

Coluna direita da /craft. Recebe o projeto ativo e os refs do hook.

Props: `project`, `rightColRef`, `firstItemRef`, `lastItemRef`, `rightColLeft`, `paddingTop`, `paddingBottom`.

Estrutura interna:
- **Info block** (144px): label Geist Semibold 24pt + nome Geist Light 24pt à esquerda; logo 400px à direita
- **Image displays**: altura 527px (ou `h-auto` se `project.hugLast = true` no último item), gap 80px entre si
- Fallback `lastItemRef` quando projeto não tem imagens

### 7.8 `app/craft/ProjectSelector.tsx`

Seletor vertical de projetos em 50vh. Mesmo estilo do Header nav (Fenix 20px, underline no ativo).

Props: `projects`, `activeProject`, `onSelect`.

Posição: `absolute left-[10.5rem] top-1/2 -translate-y-1/2`. Gap entre itens: 16px.

### 7.9 `app/craft/data.ts`

Tipos `Section` e `Project` + dados `craftProjects` para Playground e Selected Works.

Para adicionar projetos ao Selected Works: preencher o array `"selected-works"` neste arquivo com o mesmo padrão do Playground.

### 7.10 `app/craft/actions.ts`

Server Action para verificação de senha NDA.

```ts
"use server";
export async function verifyPassword(pwd: string): Promise<boolean> {
  return pwd === process.env.NDA_PASSWORD;
}
```

### 7.11 `app/craft/PasswordGate.tsx`

Arquivo existe mas **não é utilizado** — a lógica foi incorporada inline em `page.tsx` para simplificar o controle de estado. Pode ser deletado ou ignorado.

---

## 8. Padrão Split Layout (track + craft)

O padrão de duas colunas usado na `/track` e `/craft`.

### Estrutura

```
<div bg-bg-base h-screen overflow-hidden relative>

  {/* Coluna direita — absoluta, full height, scroll interno */}
  <ScrollColumn
    ref={rightColRef}
    className="absolute inset-y-0 right-0 z-0"
    style={{ left: `${rightColLeft}px` }}   ← medido dinamicamente
  >
    <div flex-col gap-[Xpx] pr-[10.5rem]
      style={{ paddingTop, paddingBottom }}  ← calculados pelo hook
    >
      <div ref={firstItemRef}>primeiro item</div>
      ...itens do meio...
      <div ref={lastItemRef}>último item</div>
    </div>
  </ScrollColumn>

  {/* Coluna esquerda — z-10, pointer-events-none no wrapper */}
  <div pointer-events-none relative z-10 px-[10.5rem] pt-20 pb-20 h-full flex-col>
    <div pointer-events-auto><Header /></div>
    <div ref={leftContentRef} pointer-events-auto flex-1 w-fit flex-col justify-between>
      {/* Topo: bio/menu de seções */}
      {/* Rodapé: tag (swipe-up ↔ back to top ↑) + monograma */}
    </div>
    {/* Label/seletor central — absolute top-1/2 -translate-y-1/2, pixel-perfect em 50vh */}
  </div>

</div>
```

### Regras de posicionamento

| Elemento | Posição |
|---|---|
| Header | `pt-20` = 80px do topo |
| BlurOverlay | 185px, sticky top-0 na scroll column. Solid 0–120px, fade 120–185px |
| Gap coluna esquerda → direita | 80px (calculado dinamicamente via `leftContentRef`) |
| Primeiro item | Centro em 50vh via `paddingTop = 50vh - 185px - height/2` |
| Último item | Centro em 50vh via `paddingBottom = 50vh - height/2` |
| Label/seletor central | `absolute top-1/2 -translate-y-1/2` = 50vh exato |
| Tag "swipe-up/back to top" | Rodapé da coluna esquerda, `justify-between` com monograma |
| Monograma | Rodapé da coluna esquerda |

### Tag de navegação

- Default: `swipe-up to see more` (div, não clicável)
- Fim do scroll (`atEnd = true`): `back to top ↑` (button, clica → scroll suave ao topo)
- Ícone arrow-up: SVG 16×14px, `stroke="currentColor"` = `#5F6A50`
- Altura: 40px, padding horizontal: 18px, pill (border-radius 9999px), bg: `surface-tag`
- "back" em `font-semibold`, "to top" em `font-light`, gap-[6px] entre os elementos

---

## 9. Página: Home (`/`)

- 100vh, sem scroll
- Tagline: "Curious Designer" — Geist Light 40pt
- Mosaico animado: `mosaic-home-bg.png`, `w-[1272px]`, alinhado à direita
- BlurOverlay absolute sobre o mosaico (z-10)
- Footer: monograma (esquerda) + email click-to-copy + substack + linkedin + pixel art (direita)

---

## 10. Página: Track (`/track`) ✅ COMPLETA

### Bio (coluna esquerda, topo)

```
20 years across
Design, Experiences
and Technology.
```

Geist Light 40pt, `whitespace-nowrap` com `<br />` forçados.

### Label central

```
a few steps:
```

Fenix Regular 20pt. Posição: `absolute top-1/2 -translate-y-1/2 left-[10.5rem]` → 50vh exato.

### Timeline (coluna direita)

13 entradas de carreira (2011–2024). Gap entre blocos: `344px`.

---

## 11. Página: Craft (`/craft`)

### Estrutura de arquivos

```
app/craft/
├── actions.ts           → Server Action: verifyPassword(pwd) via process.env.NDA_PASSWORD
├── data.ts              → Section + Project types + craftProjects data
├── ProjectCarousel.tsx  → coluna direita: info block + image displays
├── ProjectSelector.tsx  → seletor vertical em 50vh (Fenix 20pt, estilo Header)
├── PasswordGate.tsx     → arquivo legado, NÃO utilizado (pode deletar)
└── page.tsx             → orquestra tudo: estado, password gate inline, split layout
```

### Coluna esquerda — menu de seções

Dois botões Geist Light 40pt, gap 20px:
- **Ativo:** ArrowRight (Phosphor Icons, 40px, `#3B4028`) + texto `text-text-active`
- **Inativo:** sem seta + `text-text-muted` (`#A6AA97`) + hover `text-text-default` + `transition-colors`
- Default ao entrar: Playground ativo
- Trocar seção → reseta para primeiro projeto da nova seção + pede senha novamente se for Selected Works

### Seletor vertical (50vh)

Fenix 20pt, gap 16px. Mesmo estilo do Header nav. `absolute top-1/2 -translate-y-1/2 left-[10.5rem]`.
- Ativo: `text-text-active` + underline
- Inativo: `text-text-default` + hover underline

### Carrossel de projetos (coluna direita)

Cada projeto é **isolado** — trocar de projeto no seletor reseta o scroll por completo (via `resetDeps` no hook).

**Info block** (144px, `firstItemRef`):
- Esquerda: label Geist Semibold 24pt + nome Geist Light 24pt (cor `text-default`)
- Direita: logo do projeto, max-width 400px

**Image displays** (gap 80px entre componentes):
- Altura padrão: **527px**
- Exceção `hugLast: true`: última imagem usa `h-auto` (abraça altura natural da imagem)
- Sem imagens: fallback `<div ref={lastItemRef} />` imediatamente após o info block

### Password Gate (Selected Works) ✅ IMPLEMENTADO

**Comportamento:**
- Ao clicar em "Selected Works": exibe overlay com campo de senha
- Ao sair da seção (clicar "Playground", "cancel" ou ESC): `isAuthenticated` é resetado — próxima visita pede senha de novo
- Senha correta (`dvault`): `isAuthenticated = true`, overlay some, carrossel fica visível
- Senha errada: input limpa, mensagem "wrong password" (Geist Light 14pt, `text-text-muted`)

**Arquitetura do overlay:**
- O conteúdo da página (carrossel, seletor) SEMPRE renderiza — é necessário para o `backdropFilter` funcionar
- Overlay: `fixed inset-0 z-50 flex items-center justify-center`
- Fundo: `backgroundColor: "rgba(243, 242, 230, 0.25)"` + `backdropFilter: "blur(16px)"` + `WebkitBackdropFilter: "blur(16px)"` (Safari)

**UI do overlay:**
- Título: Fenix 32px, cor `#5F6A50` — "This section is protected by NDA"
- Subtítulo: Fenix 24px, cor `#5F6A50` — "please enter the password below:"
- Input: `w-[200px]`, `h` via `py-3`, bg `#F0EEE5`, borda `#A6AA74`, cor `#5F6A50`, text-center, outline none, focus:ring-0
- Cancel: Fenix 24px, `#5F6A50`, underline — chama `handleSectionChange("playground")`
- ESC: listener via `useEffect` → `handleSectionChange("playground")`

### Projetos implementados (Playground)

| Projeto | Label | Logo | Imagens |
|---|---|---|---|
| Agroprop | brand | agroprop-logo.png | 12 |
| LFC | brand | LFC-logo.png | 14 |
| Proxy | brand | proxy-logo.png | 9 (hugLast) |
| Purple | brand | purple-logo.png | 6 |

### Selected Works — dados PENDENTES (ver PRD-SELECTED-WORKS.md)

O gate de senha está funcionando. Falta:
1. Doug exportar assets do Figma → `public/assets/selected-works/<Projeto>/`
2. Preencher o array `craftProjects["selected-works"]` em `data.ts` com os projetos reais

---

## 12. Pendências finais (Sessão 6 — última)

- [ ] **Selected Works — dados reais** — Doug exporta assets, Claude Code popula `data.ts`
- [ ] **Variável `NDA_PASSWORD` na Vercel** — adicionar no painel antes do deploy (`dvault`)
- [ ] Responsivo (mobile/tablet)
- [ ] Meta tags (og:image, description, favicon)
- [ ] Transições entre páginas
- [ ] Cloudflare Email Routing (`hello@douglima.work` → Gmail)
- [ ] **git push + deploy final** ← etapa de fechamento

---

## 13. Workflow estabelecido

1. **Planejamento e refinamento visual** → Claude.ai
2. **Specs e interações** → documentadas em PRDs (pasta `docs/`)
3. **Execução de código** → Claude Code (Sonnet 4.6)
4. **Validação visual** → Doug roda `npm run dev`, envia screenshots, ajustamos
5. **Assets** → Doug exporta do Figma para `public/assets/`, Claude Code consome

---

## 14. Arquivos do projeto (atualizado — sessão 5)

```
doug-lima/
├── .env.local                        # NDA_PASSWORD=dvault (não commitado)
├── app/
│   ├── components/
│   │   ├── Header.tsx                # Logo + nav (reutilizável — NÃO alterar)
│   │   ├── PageLayout.tsx            # Layout padrão: paddings + header + monograma
│   │   ├── BlurOverlay.tsx           # Gradiente fade 185px
│   │   ├── ScrollColumn.tsx          # overflow-y-auto + BlurOverlay embutido
│   │   └── TimelineBlock.tsx         # Bloco da timeline (ano | texto | logo)
│   ├── hooks/
│   │   └── useSplitLayout.ts         # Hook split layout — track + craft (aceita resetDeps)
│   ├── track/
│   │   └── page.tsx                  # Track completa ✅
│   ├── craft/
│   │   ├── actions.ts                # Server Action: verifyPassword
│   │   ├── data.ts                   # Tipos + dados dos projetos
│   │   ├── ProjectCarousel.tsx       # Coluna direita: info block + image displays
│   │   ├── ProjectSelector.tsx       # Seletor vertical em 50vh
│   │   ├── PasswordGate.tsx          # LEGADO — não usado, pode deletar
│   │   └── page.tsx                  # Craft: Playground ✅ / Selected Works gate ✅ / dados PENDENTE
│   ├── globals.css                   # Cores, fontes, keyframes
│   ├── layout.tsx                    # Geist + Fenix, metadata
│   └── page.tsx                      # Home ✅
├── docs/
│   ├── SESSION-HANDOFF-PORTFOLIO.md  # Este arquivo
│   ├── PRD-SELECTED-WORKS.md         # Dados + assets para Selected Works
│   ├── PRD-CRAFT-PASSWORD.md         # PRD do password gate (referência histórica)
│   ├── PRD-HOME.md
│   ├── PRD-TRACK.md
│   └── PRD-TRACK-TIMELINE.md
├── public/
│   └── assets/
│       ├── home/                     # Assets globais (lettering, monograma, mosaico, etc.)
│       ├── companies-page-track/     # 12 logos da timeline
│       ├── playground-works/         # Agroprop, LFC, Proxy, Purple
│       └── selected-works/           # PENDENTE — criar após exportar do Figma
└── package.json
```

---

## 15. Learnings das sessões

### Sessão 2

- **Sticky column + paddings:** quando uma coluna sticky tem `h-screen` mas o wrapper tem padding top, o bottom ultrapassa o viewport. Replicar o padrão que já funciona, não calcular manualmente.
- **Font size vs. column width:** Geist Light a 40px não cabe em 244px por linha. Usar `w-fit` + `whitespace-nowrap` + `<br />` forçados.

### Sessão 3

- **`left-[Xpx]` hardcoded quebra quando o bio text é maior que o estimado.** Solução: `useLayoutEffect` mede `leftContentRef.getBoundingClientRect().right` e aplica + 80px via inline style.
- **IntersectionObserver não detecta elementos de altura zero.** Solução: scroll event listener com `Math.round(scrollTop + clientHeight) >= scrollHeight`.
- **Centramento 50vh com `paddingTop/Bottom` calculado por JS.** `paddingTop = 50vh - blurHeight - itemHeight/2`. `paddingBottom = 50vh - itemHeight/2`.
- **Label central pixel-perfect:** usar `absolute top-1/2 -translate-y-1/2` no wrapper `h-full relative`.

### Sessão 4

- **Switcher isolado vs. scroll contínuo:** na /craft cada projeto é uma "ilha" — trocar projeto reseta scroll completamente. Implementado via `resetDeps` no `useSplitLayout`.
- **`resetDeps` no hook:** `useLayoutEffect` + `useEffect` de reset ambos recebem `resetDeps` como dep array. `/track` passa `[]` (comportamento original inalterado). `/craft` passa `[activeProject]`.
- **`hugLast` flag no projeto:** quando a última imagem tem proporção diferente das demais, `hugLast: true` aplica `h-auto` só no último image-display, abraçando a altura natural da imagem.
- **Fallback `lastItemRef` para projetos sem imagens:** `{images.length === 0 && <div ref={lastItemRef} />}` garante que o hook sempre encontre `lastEl` e calcula os paddings corretamente.
- **Phosphor Icons (`@phosphor-icons/react`):** instalado. Usar `<ArrowRight size={40} color="#3B4028" weight="regular" />` para o ícone ativo nos botões de seção.
- **Componentização da /craft:** separar `data.ts` (tipos + dados), `ProjectCarousel.tsx` (coluna direita), `ProjectSelector.tsx` (seletor vertical). `page.tsx` fica com ~80 linhas e só orquestra estado.

### Sessão 5

- **`backdropFilter` requer conteúdo por trás para funcionar.** O overlay NDA não pode substituir o conteúdo — deve ficar em cima (`fixed inset-0 z-50`). O carrossel e seletor sempre renderizam; o gate é uma camada acima.
- **`WebkitBackdropFilter` obrigatório para Safari.** Sempre definir ambos: `backdropFilter` e `WebkitBackdropFilter`.
- **Auth sem cookie = puro estado React.** `isAuthenticated` é `useState(false)`. `handleSectionChange` reseta para `false` ao sair de Selected Works. Simples, sem necessidade de session/cookie.
- **ESC e cancel devem chamar `handleSectionChange("playground")`**, não `router.back()` — o usuário está na mesma página, não navegou para cá.
- **`cookies()` do `next/headers` é async no Next.js 15+** — se usar no futuro, sempre `await cookies()`.
- **Caminhos de assets:** todos os assets globais estão em `public/assets/home/`, não na raiz `public/assets/`. Arquivos movidos: `doug-lima-lettering.svg`, `dl-monogram.svg`, `mosaic-home-bg.png`, `substack-logo.png`, `linkedin-logo.png`, `doug-pixelart.png`. Atualizar em: `Header.tsx`, `PageLayout.tsx`, `page.tsx` (home), `craft/page.tsx`, `track/page.tsx`.
