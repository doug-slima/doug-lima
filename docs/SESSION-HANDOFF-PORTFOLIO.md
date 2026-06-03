# SESSION HANDOFF — douglima.work Portfolio

> Documento de contexto para continuidade entre sessões.
> Última atualização: 03 jun 2026 — Sessão 11 (extração de componentes, design system, a11y, PasswordGate) ✅

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
| `surface-tag` | `#F0EEE5` | Background de inputs |
| `text-muted` | `#A6AA97` | Botão de seção inativo (Playground ↔ Selected Works) |

Sem dark mode.

---

## 5. Fontes

| Fonte | Peso | Uso | Carregamento |
|---|---|---|---|
| **Geist** | Light (300) | Bio, textos de destaque — 40pt | `next/font/google`, var `--font-geist-var` |
| **Geist** | Semibold (600) | Ano na timeline, label do projeto no carrossel |  |
| **Geist** | Light (300) | Cargo na timeline — 24pt, nome do projeto no carrossel — 24pt |  |
| **Fenix** | Regular (400) | Navegação, seletores, labels, tags — 24pt | `next/font/google`, var `--font-fenix-var` |

Logo "doug_lima." é SVG, não fonte.

---

## 6. Assets

**IMPORTANTE:** todos os assets globais estão em `public/assets/home/` (não `public/assets/` raiz).

| Arquivo | Tipo | Uso |
|---|---|---|
| `home/doug-lima-lettering.svg` | SVG | Logo "doug_lima." no header — estado default |
| `home/doug-lima-lettering-hover.svg` | SVG | Logo "doug_lima." no header — estado hover |
| `home/dl-monogram.svg` | SVG | Monograma decorativo (88×103px) no rodapé das páginas |
| `home/mosaic-home-bg.png` | PNG | Imagem de fundo animada (mosaico pixelado) — apenas na home |
| `home/avatar-doug.png` | PNG | Avatar pixel art no footer da home — estado default |
| `home/avatar-doug-hi.png` | PNG | Avatar pixel art no footer da home — estado hover |
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

- Logo SVG clicável (volta para `/`) com **hover swap**: default → `doug-lima-lettering.svg`, hover → `doug-lima-lettering-hover.svg`. Implementado com `group`/`group-hover`.
- Nav usa `NavSelector` com `variant="pill"` e `direction="row"`
- Logo altura fixada em `h-[32px] w-auto`

**REGRA:** Não alterar este arquivo sem necessidade clara.

### 7.2 `app/components/NavSelector.tsx`

Componente compartilhado de seletores de navegação. Suporta duas variantes e duas orientações.

**Props:**
```ts
items: { label: string; active: boolean; href?: string; onClick?: () => void }[]
variant?: "pill" | "underline"   // default: "pill"
direction?: "row" | "col"        // default: "row"
gap?: number                     // default: 8px
className?: string
```

**Variante `"pill"`** (header):
- Default: `text-text-default`, sem fundo, sem borda
- Hover: fundo `#EAFBAB`, ring `#AEE000`, texto `#3B4028`
- Active: ring `#3B4028`, texto `#3B4028`, sem fundo
- Altura: 32px, `rounded-full`, `px-4`, `font-fenix text-[24px]`

**Variante `"underline"`** (craft vertical):
- Default: `text-text-default`
- Hover: `text-text-active` + underline
- Active: `text-text-active` + underline permanente
- `font-fenix text-[24px]`

Itens com `href` renderizam como `<Link>`. Itens com `onClick` renderizam como `<button>`.

### 7.3 `app/components/PageLayout.tsx`

Encapsula padrões de layout compartilhados:

- Renderiza `Header.tsx`
- Aplica `pt-20 pb-20 px-[10.5rem]`
- Footer com `items-center justify-between`: monograma (esquerda) + `footerContent` (direita)
- Suporte a `backgroundLayers` (para mosaico da home)

**Usado em:** `app/page.tsx` (home). Track e Craft NÃO usam PageLayout.

### 7.4 `app/components/BlurOverlay.tsx`

Gradiente de fade `#F9F9F2 → transparente`, altura 185px:
- Solid zone: 0–120px (cobre header + área de segurança)
- Fade zone: 120–185px

### 7.5 `app/components/ScrollColumn.tsx`

Scroll container com BlurOverlay embutido. Props: `ref`, `className`, `style`, `children`.

### 7.6 `app/components/TimelineBlock.tsx`

Bloco individual da timeline de carreira.

```
| year (Geist SemiBold 24px) | 24px gap | text-content (hug) | flex-1 gutter | logo (220px) |
```

Exporta tipos `TimelineEntry` e `TimelineLine`.
Estilos de linha: `light` | `bold` | `serif`.

### 7.7 `app/hooks/useSplitLayout.ts`

Hook que encapsula toda a lógica do padrão split layout. Reutilizado por /track e /craft.

```ts
const { refs, state, scrollToTop } = useSplitLayout(resetDeps?);
// refs: rightColRef, leftContentRef, firstItemRef, lastItemRef
// state: atEnd, paddingTop, paddingBottom, rightColLeft
```

**`atEnd`:** detectado via **IntersectionObserver** no `lastItemRef` dentro do scroll container. `atEnd = true` assim que o último item começa a aparecer no viewport (não quando chega ao fim do scroll). Quando o item sai do viewport (scroll de volta ao topo), `atEnd` volta para `false`.

**`resetDeps`:** quando mudam, reseta scroll + `atEnd` + recria o observer. Track passa `[]`, craft passa `[activeProject]`.

### 7.8 `app/craft/ProjectCarousel.tsx`

Coluna direita da /craft. Recebe o projeto ativo e os refs do hook. *(inalterado — ver sessão 5)*

### 7.9 `app/craft/ProjectSelector.tsx`

Seletor vertical em 50vh. Usa `NavSelector` com `variant="underline"`, `direction="col"`, `gap={16}`.

Posição: `absolute left-[10.5rem] top-1/2 -translate-y-1/2`.

### 7.10 `app/craft/data.ts` e `app/craft/actions.ts`

*(inalterados — ver sessão 5)*

### 7.11 `app/components/Header.tsx` — comportamento mobile (atualizado sessão 9)

O `Header` é **um componente único** para todas as páginas. Internamente renderiza dois elementos distintos por breakpoint:

```tsx
// Mobile: fixed no topo, com fundo sólido + gradiente
<div className="md:hidden fixed top-0 left-0 right-0 z-40 pointer-events-none">
  <div className="pointer-events-auto bg-bg-base px-10 pt-10">
    <header className="flex items-start justify-between py-6">
      <LogoAndNav />
    </header>
  </div>
  <div style={{ height: "24px", background: "linear-gradient(#F9F9F2 → transparent)" }} />
</div>

// Desktop: in-flow, posicionado pelo layout da página
<header className="hidden md:flex items-start justify-between">
  <LogoAndNav />
</header>
```

**Alturas mobile:**
- `pt-10` = 40px
- `py-6` top = 24px + img 32px + bottom 24px = 80px
- **Total sólido = 120px**
- Gradiente = 24px
- **Total visual = 144px**

**Conteúdo nas páginas mobile:** usar `pt-[144px]` no content div. Craft usa `pt-[156px]` (12px extra de respiro abaixo do header).

**`StickyHeader.tsx` foi deletado na sessão 9.** Não recriar — toda a lógica está dentro do `Header`.

**REGRA:** Não adicionar wrappers nem lógica de header fora do próprio `Header.tsx`. O componente é auto-suficiente.

### 7.12 `app/components/Monogram.tsx` (novo — sessão 11)

Componente do monograma decorativo `dl-monogram.svg`.

**Props:**
```ts
size?: "sm" | "lg"   // default: "lg". sm = w-[88px] (desktop), lg = w-[104px] (mobile)
className?: string
```

`aria-hidden="true"` — puramente decorativo, sem texto alt.

Usado em: `PageLayout` (home, via `className="h-[104px] md:w-[88px] md:h-auto"`), `craft/page.tsx` (mobile `size="lg"`, desktop `size="sm"`), `track/page.tsx` (mobile e desktop).

### 7.13 `app/components/BackToTopButton.tsx` (novo — sessão 11)

Botão "Back to top" fixo no rodapé. **Mobile only** (`md:hidden`).

**Props:** `paddingBottom: number`, `zIndex?: number` (default 30).

Container com `pointer-events: none` + botão com `pointer-events: auto` — padrão para não bloquear elementos abaixo. Spring animation `control-bar-enter` na entrada.

| Página | paddingBottom | Alinhamento |
|---|---|---|
| `/craft` | 169px | Centro do monograma após salto do card (104px) |
| `/track` | 73px | Centro do monograma no rodapé |

### 7.14 `app/components/ControlPill.tsx` (novo — sessão 11)

Tag swipe/back-to-top do **desktop**. Encapsula o padrão descrito na seção 8.

**Props:** `atEnd: boolean`, `onScrollToTop: () => void`.

- `atEnd=false`: exibe "swipe-up to see more" (decorativo, `cursor-default`)
- `atEnd=true`: exibe botão clicável "back to top" com hover state

Usado em `/craft` e `/track` na posição `absolute bottom-[104px] right-[88px] z-20 pointer-events-auto`.

### 7.15 `app/craft/SectionDropdown.tsx` (novo — sessão 11)

Dropdown de seleção de seção (Playground / Selected Works). **Mobile only.**

Estado interno: `isOpen`, `containerRef`, `triggerRef`. Fecha ao clicar fora. `close()` retorna foco ao trigger (a11y).

A11y: `aria-expanded`, `aria-haspopup="listbox"`, `role="listbox"`, `role="option"`.

### 7.16 `app/craft/PrevNextBar.tsx` (novo — sessão 11)

Bar fixa no rodapé de navegação entre projetos. **Mobile only** (`md:hidden`).

`z-[20]` — atrás do card (`z-30`). Sempre presente no DOM, revelada visualmente quando o card faz `translateY(-104px)`.

Padding: `pt-[24px] pb-[calc(24px + env(safe-area-inset-bottom))]` — safe area para iOS.

### 7.17 `app/components/TimelineItem.tsx` (novo — sessão 11)

Row individual da timeline mobile (`/track`). Encapsula:
- Logo sizing logic (3-way conditional por nome da empresa — herdado de `TimelineBlock`)
- Alinhamento do ano: `items-start` padrão, `items-center` para Teacher / Master's Degree

### 7.18 `app/craft/PasswordGate.tsx` (reescrito — sessão 11)

**Hierarquia interna:** `PasswordGate` > `PasswordDisplay` > `PasswordInput`

- **`PasswordGate`:** overlay `fixed inset-0 z-50`, backdrop blur 16px + `WebkitBackdropFilter` (Safari), `backgroundColor: "rgba(243, 242, 230, 0.25)"`
- **`PasswordDisplay`:** heading `clamp(24px, 4vw, 32px)`, body `clamp(20px, 3vw, 24px)`, input, erro, botão cancel com fonte Fenix
- **`PasswordInput`:** `type="password"`, `autoFocus`, `aria-label="NDA password"`, Enter submete

Pressionar Escape no `craft/page.tsx` fecha o gate via `keydown` listener. Backdrop blur requer conteúdo por trás — garantido pela transparência do `backgroundColor`.

---

## 8. Padrão Split Layout (track + craft)

### Estrutura

```
<div bg-bg-base h-dvh overflow-hidden relative>

  {/* Coluna direita — scroll interno */}
  <ScrollColumn ref={rightColRef} absolute inset-y-0 right-0 z-0
    style={{ left: rightColLeft }}>
    <div flex-col gap-[Xpx] pr-[10.5rem] style={{ paddingTop, paddingBottom }}>
      <div ref={firstItemRef}>primeiro item</div>
      ...
      <div ref={lastItemRef}>último item</div>
    </div>
  </ScrollColumn>

  {/* Coluna esquerda — z-10, pointer-events-none no wrapper */}
  <div pointer-events-none relative z-10 px-[10.5rem] pt-20 pb-20 h-full flex-col>
    <Header />
    <div ref={leftContentRef} flex-1 w-fit flex-col justify-between>
      {/* Topo: bio/menu de seções */}
      {/* Rodapé: monograma */}
    </div>
    {/* Label/seletor central — absolute top-1/2 -translate-y-1/2 */}
  </div>

  {/* Tag swipe/back-to-top — absolute, sobrepõe módulo direito */}
  <div absolute bottom-[104px] right-[88px] z-20 pointer-events-auto>
    {atEnd ? <button back-to-top /> : <div swipe-up />}
  </div>

</div>
```

### Tag swipe / back-to-top

Posição: `absolute bottom-[104px] right-[88px] z-20` — centro vertical alinhado matematicamente com o centro do monograma (monograma: 103px altura, base em `pb-20` = 80px → centro em 131.5px → tag 56px → `bottom = 103.5px ≈ 104px`).

**Swipe-up** (default):
- 56px altura, `rounded-full`, `px-6`
- Surface: `bg-[#A6AA74]/20` (cor `#A6AA74`, opacidade 20%)
- Fenix 20pt, `text-[#3B4028]`
- Não clicável (`cursor-default`)

**Back to top** (quando `atEnd = true`):
- Mesma base do swipe
- Hover: `bg-[#F6F3E6]` sólido + `ring-1 ring-[#DEDDCE]`
- `pl-6 pr-5 gap-2` (padding assimétrico + gap para ícone)
- Ícone: `<ArrowUp size={20} />` da Phosphor Icons
- Clique → `scrollToTop()` (scroll suave ao topo)

### Rodapé (módulo esquerdo)

O monograma `dl-monogram.svg` (`w-[88px]`, altura natural 103px) fica no rodapé do `leftContentRef` via `justify-between`. A tag swipe/back é independente e posicionada absolutamente à direita.

### Regras de posicionamento

| Elemento | Posição |
|---|---|
| Header | `pt-20` = 80px do topo |
| BlurOverlay | 185px, sticky top-0 na scroll column |
| Gap coluna esquerda → direita | 80px (via `leftContentRef`) |
| Primeiro item | Centro em 50vh via `paddingTop` |
| Último item | Centro em 50vh via `paddingBottom` |
| Label/seletor central | `absolute top-1/2 -translate-y-1/2` |
| Tag swipe/back | `absolute bottom-[104px] right-[88px]` |
| Monograma | Rodapé do `leftContentRef`, `w-[88px]` |

---

## 9. Página: Home (`/`)

- 100vh, sem scroll
- Tagline: "Curious Designer" — Geist Light **28pt mobile / 40pt desktop**, no fluxo normal do conteúdo (não absoluto). Mobile: posição logo abaixo da header (`pt-[144px]`), sem centering vertical.
- Mosaico animado: `mosaic-home-bg.png`, `w-[1272px]`, alinhado à direita
- BlurOverlay absolute sobre o mosaico (z-10)

**Footer:** `items-center justify-between`
- Esquerda: monograma
- Direita: **tag de contato** (pill)

**Tag de contato:**
- 56px altura, `rounded-full`, `pl-6 pr-5`
- Default surface: `bg-[#F3F2E6]`
- Hover (tag inteira): `bg-[#F6F3E6]` + `ring-1 ring-[#DEDDCE]`
- Conteúdo: email (click-to-copy) + substack link + linkedin link + avatar
- **Avatar:** `group/avatar` — hover especificamente no avatar troca `avatar-doug.png` → `avatar-doug-hi.png`

---

## 10. Página: Track (`/track`) ✅ COMPLETA

- **Ordem da timeline:** reversa — mais recente primeiro (2026 → 2011). Array em `page.tsx` declarado nessa ordem.
- **"a few steps:":** `font-fenix text-[24px]` — mesmo tamanho dos seletores verticais da /craft.
- *(tag swipe/back reposicionada — ver seção 8)*

### Mobile layout

- Container: `px-10 pt-[144px] pb-10 flex flex-col`
- Timeline: `-mx-2` (32px lateral padding), `gap-6` (24px entre ano e título)
- Item row: `items-center`, `minHeight: "112px"` via inline style
- **Alinhamento do ano:** para itens com cargos simples (não-Teacher, não-Master's Degree): `items-start` no sub-container ano+texto (topo do ano alinha com topo do título). Teacher e Master's Degree: `items-center` (permanecem centralizados).
- **Tamanhos de logo:** `w-[68px] h-auto` para ESPM, Olist, IED, Kyvo, iFood, Livework (largura fixa no iFood como referência); `max-h-[40px]` para Mercado Livre; `max-h-[48px]` para Klauvi, Aprender Design, Hash, Unifei, Itaú; `max-h-[36px]` padrão para os demais.
- **Back to top (mobile):** componente `BackToTopButton` com `paddingBottom={73}`. Aparece via **scroll listener** (`window.scrollY + innerHeight >= scrollHeight - 10`), estado `atBottom`. Mesmo spring animation (`control-bar-enter`). `timelineRef` e `IntersectionObserver` foram removidos na sessão 11.

---

## 11. Página: Craft (`/craft`)

*(estrutura desktop inalterada — tag swipe/back reposicionada, ProjectSelector usa NavSelector underline, ver seções 7 e 8)*

### Password Gate (Selected Works) ✅ IMPLEMENTADO

*(inalterado — ver sessão 5)*

### Mobile layout (atualizado sessão 10)

**Estrutura geral:**
```
outer div (bg #313621, sem padding extra)
  └── card div (bg-base, rounded-b-[24px], zIndex: 30, translateY spring)
        └── Header (fixed, z-40)
        └── content (px-10 pt-[156px] pb-8)
              └── dropdown seção
              └── pills seletores (ref={pillsRef})
              └── info block (h: 120px)
              └── imagens (gap-3, -mx-7 → 12px lateral)
              └── monograma (w-104px, mt-8, pb-8)
footer div (bg #313621, fixed bottom-0, z-[20])  ← ATRÁS do card
  └── pill Prev/Next (mx-10, h-[56px], bg #121210, shadow)
```

**Comportamento do card:**
- Card tem `zIndex: 30` — cobre o footer (z-[20]) enquanto o usuário scrola
- Scroll listener detecta `scrollY + innerHeight >= scrollHeight - 10`
- Quando atingido: `translateY(-104px)` com `cubic-bezier(0.34, 1.56, 0.64, 1)` — "pulinho" revela o footer
- Ao rolar de volta: card retorna à posição original

**Footer Prev/Next:**
- `fixed bottom-0`, `bg-[#313621]`, `z-[20]` (atrás do card)
- Padding: `pt-[24px] pb-[24px]`
- Pill: `mx-10 h-[56px] rounded-full bg-[#121210]`, `boxShadow: "0px 16px 48px -8px rgba(12,12,13,0.50)"`
- Texto/ícone: `#FAFAF5`
- Sempre visível (não precisa de scroll trigger)

**Back to top:**
- Componente `BackToTopButton` com `paddingBottom={169}` e `zIndex={40}`
- `paddingBottom: "169px"` — alinha centro vertical com o monograma após o salto do card
- Cálculo: `pb-8 (32px) + monograma_center (61px) + card_jump (104px) - button_half (28px) = 169px`
- Aparece quando `footerRevealed = true` — **mesmo scroll listener** que aciona o salto do card. `pillsRef` e `IntersectionObserver` foram removidos na sessão 11.
- Spring animation: `control-bar-enter`

**Info block:**
- Container: `h: 120px` via inline style
- Logo: `h-[56px] w-auto` (altura fixa 56px, largura proporcional — garante consistência visual independente da proporção do asset)

**Carousel de imagens:**
- Lateral padding: 12px (`-mx-7` dentro de `px-10`)
- Gap entre imagens: 12px (`gap-3`)

---

## 12. Pendências finais

- [x] **Responsivo mobile — Home, Track, Craft** ← feito na sessão 8
- [x] **Mobile polish — Header unificado, control bar craft, carousel, mosaic** ← feito na sessão 9
- [x] **Mobile polish — Track timeline, craft footer reveal, home tagline** ← feito na sessão 10
- [x] **Deploy publicado** ← sessão 9 — `douglima.work` no ar
- [x] **Extração de componentes, design system, a11y, PasswordGate** ← feito na sessão 11
- [ ] **Pass de consistência desktop** ← próxima sessão — revisar desktop contra padrões mobile e DS/DX da sessão 11
- [ ] **Selected Works — dados reais** — Doug exporta assets, Claude Code popula `data.ts`
- [ ] **Variável `NDA_PASSWORD` na Vercel** — adicionar no painel antes do deploy (`dvault`)
- [ ] Meta tags (og:image, description, favicon)
- [ ] Transições entre páginas
- [ ] Cloudflare Email Routing (`hello@douglima.work` → Gmail)

---

## 13. Workflow estabelecido

1. **Planejamento e refinamento visual** → Claude.ai
2. **Specs e interações** → documentadas em PRDs (pasta `docs/`)
3. **Execução de código** → Claude Code (Sonnet 4.6)
4. **Validação visual** → Doug roda `npm run dev`, envia screenshots, ajustamos
5. **Assets** → Doug exporta do Figma para `public/assets/`, Claude Code consome

---

## 14. Arquivos do projeto (atualizado — sessão 11)

```
doug-lima/
├── .env.local                        # NDA_PASSWORD=dvault (não commitado)
├── app/
│   ├── components/
│   │   ├── Header.tsx                # Logo + nav — mobile: fixed+gradiente; desktop: in-flow
│   │   ├── MosaicBackground.tsx      # Mosaico animado — inline styles críticos, .mosaic-container no CSS
│   │   ├── NavSelector.tsx           # Seletor reutilizável: variant pill|underline, direction row|col
│   │   ├── PageLayout.tsx            # Layout padrão: usa Monogram, pt-[144px] mobile / pt-20 desktop
│   │   ├── BlurOverlay.tsx           # Gradiente fade 185px (desktop scroll columns)
│   │   ├── ScrollColumn.tsx          # overflow-y-auto + BlurOverlay embutido
│   │   ├── TimelineBlock.tsx         # Bloco da timeline desktop (ano | texto | logo)
│   │   ├── TimelineItem.tsx          # Row da timeline mobile — logo sizing + alinhamento encapsulados
│   │   ├── Monogram.tsx              # Monograma DL svg — size sm (88px) / lg (104px), aria-hidden
│   │   ├── BackToTopButton.tsx       # Botão back to top mobile — pointer-events pass-through, spring anim
│   │   └── ControlPill.tsx           # Tag swipe/back-to-top desktop — atEnd toggle
│   ├── hooks/
│   │   └── useSplitLayout.ts         # Hook split layout — IntersectionObserver p/ atEnd
│   ├── track/
│   │   └── page.tsx                  # Track completa ✅ — usa TimelineItem, BackToTopButton, ControlPill
│   ├── craft/
│   │   ├── actions.ts                # Server Action: verifyPassword
│   │   ├── data.ts                   # Tipos + dados dos projetos
│   │   ├── ProjectCarousel.tsx       # Coluna direita: info block + image displays
│   │   ├── ProjectSelector.tsx       # Seletor vertical — usa NavSelector underline
│   │   ├── SectionDropdown.tsx       # Dropdown mobile Playground/Selected Works — a11y + focus return
│   │   ├── PrevNextBar.tsx           # Bar Prev/Next mobile — z-20, safe-area-inset-bottom
│   │   ├── PasswordGate.tsx          # Modal NDA — backdrop blur, PasswordDisplay, PasswordInput
│   │   └── page.tsx                  # Craft: Playground ✅ / Selected Works gate ✅ / dados PENDENTE
│   ├── globals.css                   # Cores, fontes, keyframes, prefers-reduced-motion
│   ├── layout.tsx                    # Geist + Fenix, metadata
│   └── page.tsx                      # Home ✅
├── docs/
│   ├── SESSION-HANDOFF-PORTFOLIO.md  # Este arquivo
│   ├── DESIGN-SYSTEM.md              # Tokens, inventário de componentes (15), specs, arquitetura mobile/desktop
│   ├── BEST-PRACTICES.md             # DX, a11y, responsividade, performance, Tailwind v4 pitfalls
│   ├── PRD-SELECTED-WORKS.md         # Dados + assets para Selected Works
│   ├── PRD-CRAFT-PASSWORD.md         # PRD do password gate (referência histórica)
│   ├── PRD-HOME.md
│   ├── PRD-TRACK.md
│   └── PRD-TRACK-TIMELINE.md
├── public/
│   └── assets/
│       ├── home/                     # Assets globais (lettering x2, monograma, mosaico, avatares, etc.)
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
- **IntersectionObserver não detecta elementos de altura zero.** Solução inicial: scroll event listener. Solução atual (sessão 6): IntersectionObserver com `root` = scroll container.
- **Centramento 50vh com `paddingTop/Bottom` calculado por JS.**
- **Label central pixel-perfect:** usar `absolute top-1/2 -translate-y-1/2`.

### Sessão 4
- **Switcher isolado vs. scroll contínuo:** na /craft cada projeto é uma "ilha". Implementado via `resetDeps` no `useSplitLayout`.
- **`hugLast` flag no projeto:** `h-auto` só no último image-display.
- **Phosphor Icons (`@phosphor-icons/react`):** instalado. Usar `<ArrowRight>`, `<ArrowUp>` etc.
- **Componentização da /craft:** `data.ts`, `ProjectCarousel.tsx`, `ProjectSelector.tsx`.

### Sessão 5
- **`backdropFilter` requer conteúdo por trás para funcionar.**
- **`WebkitBackdropFilter` obrigatório para Safari.**
- **Auth sem cookie = puro estado React.**
- **Caminhos de assets:** todos em `public/assets/home/`.

### Sessão 6
- **`group`/`group-hover` nomeados** (`group/avatar`, `group/tag`): permitem hover isolado em elementos específicos dentro de um container sem afetar outros. Essencial para o avatar swap dentro da tag de contato.
- **IntersectionObserver no `lastItemRef`** com `root = rightColRef`: detecta quando o último item COMEÇA a aparecer, não quando o scroll chega ao fim. Fundido com o reset effect para evitar mismatch de tamanho de deps no hot reload do React.
- **Alinhamento vertical entre módulos independentes:** para alinhar o centro da tag com o centro do monograma (em colunas diferentes), calcular: `bottom = pb + monogram_height/2 - tag_height/2`. Com monograma 103px e `pb-20` (80px): `bottom = 104px`.
- **Componente com variantes (`variant` prop):** padrão para estender um componente sem duplicar código. `NavSelector` suporta `"pill"` e `"underline"` via prop, mantendo a mesma API base.
- **`mix-blend-mode: multiply`** no background da tag não funcionou bem para este caso — a superfície com opacidade (`bg-[#A6AA74]/20`) foi a solução correta e mais simples.
- **Hot reload + `useEffect` deps:** trocar `[]` por `resetDeps` em um effect existente causa erro de tamanho de array no hot reload. Solução: fundir o effect problemático com outro que já usa `resetDeps`.

### Sessão 7
- **Ordem de dados em arrays:** a ordem de exibição do carrossel segue exatamente a ordem de declaração do array em `page.tsx`. Para inverter a timeline, basta reordenar o array — não há lógica de sort automático.
- **Consistência de font sizes:** elementos visuais análogos em páginas diferentes (label lateral da /track e seletores verticais da /craft) devem usar o mesmo tamanho de fonte. Ambos em `font-fenix text-[24px]`.

### Sessão 8 — Mobile (craft + track)

#### ✅ O que foi implementado
- **`h-dvh` obrigatório no mobile:** `h-screen` = 100vh não adapta ao browser chrome do iOS (Chrome/Safari). `h-dvh` = 100dvh adapta. Usar sempre `h-dvh` em containers de altura total.
- **`MosaicBackground` isolado com inline styles:** Tailwind purga classes arbitrárias (`w-[1272px]`, `left-[Xpx]`) quando o bundle é regenerado por mudanças não relacionadas. Solução permanente: extrair para componente com **todos os estilos críticos como `React.CSSProperties` inline**. Positioning responsivo via `.mosaic-container` (named class em globals.css). Nunca usar classes Tailwind arbitrárias para este componente.
- **Mobile section dropdown (craft):** trigger `invisible` (ocupa espaço no layout), dropdown com `position: absolute; top: -20px; left: -20px` para alinhar o texto do painel com o texto do trigger. `z-20` no wrapper, `z-30` no painel. Click-outside handler via `useEffect` + `mousedown`.
- **Pills de projeto unificadas com NavSelector:** mesma API, mesma variante `"pill"`. `direction="row"`, `gap={8}`.
- **Scroll full-bleed em pills:** para scroll horizontal que extrapola o padding do pai, usar `-mx-10 px-10` no container de scroll. O `-mx-[padding]` cancela o padding do pai e `px-[padding]` recoloca como internal padding, permitindo scroll até a borda da tela.
- **`StickyHeader` component:** ver seção 7.11.

#### ❌ Erros cometidos — NÃO repetir

1. **Não ler `PageLayout` antes de calcular altura do header.**
   - Erro: assumi que a altura do header era só `py-6 + img = 80px`, ignorando o `pt-10` do container em `PageLayout`.
   - Correto: o header visual na home começa a 40px do topo (pt-10 do container). `StickyHeader` deve replicar esse `pt-10`. Total sólido = **120px**.

2. **Gradiente sobrepondo conteúdo.**
   - Erro: definir `pt-[120px]` no content div enquanto o gradiente de 80px começava em 120px — o dropdown ficava dentro da zona do fade.
   - Correto: `pt` do content = header sólido (120px) + gradiente (80px) = **`pt-[200px]`**.

3. **Tailwind class `h-[64px]` sendo purgada no gradiente.**
   - Erro: usar `className="h-16"` (ou `h-[64px]`) em elemento crítico.
   - Correto: usar `style={{ height: "80px" }}` inline para o div do gradiente.

4. **`bg-transparent` em className de button sobrepondo `bg-[#C7FF04]`.**
   - Erro: a classe `bg-transparent` estava sendo adicionada ao className do button ativo via `border-0 py-0 cursor-pointer text-left`, e como `bg-transparent` vem depois de `bg-[#C7FF04]` no bundle CSS, ela vencia.
   - Correto: aplicar cor de fundo ativa via inline style — `style={item.active && variant === "pill" ? { backgroundColor: "#C7FF04" } : undefined}`. Inline style sempre vence qualquer classe Tailwind.

5. **Inventar gradiente sem checar o que já existia.**
   - Erro: criei múltiplas versões de gradiente no `StickyHeader` sem antes verificar como `BlurOverlay` funciona.
   - Correto: ler `BlurOverlay.tsx` primeiro. O gradiente correto é `linear-gradient(to bottom, #F9F9F2 0%, rgba(249,249,242,0) 100%)`.

6. **`pointer-events-none` no wrapper do gradiente sem restaurar no conteúdo.**
   - Erro: marcar o outer fixed div como `pointer-events-none` sem marcar o header interno como `pointer-events-auto` — resultado: header iclicável.
   - Correto: `pointer-events-none` no outer wrapper, `pointer-events-auto` no div do header sólido.

### Sessão 9 — Mobile polish (Header unificado, craft control bar, carousel, mosaic)

#### ✅ O que foi implementado

- **`Header` auto-suficiente:** mobile (fixed + gradiente) e desktop (in-flow) dentro do mesmo componente. `StickyHeader.tsx` deletado. Nunca recriar wrapper externo de header.
- **Gradiente do header reduzido:** 80px → 24px. `pt` das páginas: 200px → 144px (craft: 156px com 12px de respiro).
- **Mosaic centralizado:** `top: "50%"` + `transform: "translateY(-50%)"` no container. Sem `height: "100%"`. Animação 240s → 120s.
- **Tagline home centralizada no mobile:** `absolute top-1/2 -translate-y-1/2` (dentro do container `relative h-full`). Desktop restaurado com `md:static md:translate-y-0`.
- **Backdrop blur removido** do overlay de contato mobile (home).
- **Craft carousel mobile:** padding lateral 20px (`-mx-5` dentro de `px-10`), gap 20px, imagens com `h-auto` (height natural pela proporção).
- **Craft control bar:** `fixed bottom-0`, pills Prev/Next + Back to top, estilo idêntico às tags de contato da home (`backgroundColor: "#F6F3E6"`, `border: "1px solid #D0D1B3"`, `boxShadow`). Aparece via `IntersectionObserver` nas pills (`rootMargin: "-144px 0px 0px 0px"`).
- **Spring animation na control bar:** `@keyframes control-bar-enter` + `cubic-bezier(0.34, 1.56, 0.64, 1)` — efeito de quicar ao aparecer.
- **Branch `feat/mobile` deletada:** estava totalmente contida na `main`.

#### ❌ Erros cometidos — NÃO repetir

1. **`top: "50%"` sem `transform: "translateY(-50%)"` no mosaic.**
   - Erro: joguei o topo da imagem para o centro da tela em vez de centralizar a imagem.
   - Correto: sempre usar os dois juntos para centralizar um elemento.

2. **`ring-1` + inline `style={{ boxShadow }}` — conflito.**
   - Erro: `ring` em Tailwind é implementado via `box-shadow`. Ao adicionar `boxShadow` inline, o ring some porque inline style sobrescreve.
   - Correto: usar `border: "1px solid #D0D1B3"` inline ao invés de `ring`, e adicionar `boxShadow` separadamente. Os dois convivem sem conflito.

3. **z-index do dropdown: tentativas desnecessariamente complexas.**
   - Tentativas: `z-50` via classe condicional (purgado pelo Tailwind), `z-[9999]` inline (passava por cima do header ao rolar), `position: fixed` com ref para medir trigger (complexidade desnecessária).
   - Correto: `z-index: 30` (abaixo do header z-40) + posicionar o conteúdo do dropdown abaixo da zona do gradiente. O header não sobrepõe porque o dropdown começa depois do gradiente, e ao rolar passa atrás do header naturalmente.

4. **Alterar padding do dropdown sem ter sido solicitado.**
   - Erro: ao reposicionar o painel (`top: 0`), mudei o padding interno do botão sem pedido.
   - Regra: só alterar o que foi explicitamente pedido. Mudanças não solicitadas geram regressões visuais e frustração.

5. **Duas fontes de verdade para o espaçamento do header.**
   - Erro: `pt-10` estava no wrapper (`StickyHeader`) e no container (`PageLayout`), criando dois padrões incompatíveis.
   - Correto: o espaçamento pertence ao `Header` — um componente, uma responsabilidade.

### Sessão 10 — Mobile polish (track timeline, craft footer reveal, home tagline)

#### ✅ O que foi implementado

- **Track timeline mobile:** `TimelineItem` rows com `minHeight: "112px"`, logos com sizing 3-way conditional, alinhamento do ano `items-start` / `items-center` por tipo de entrada.
- **Craft footer reveal:** card `translateY(-104px)` com spring ao atingir o fim da página. Footer Prev/Next (`z-20`) sempre presente, revelado pelo salto do card (`z-30`).
- **Home tagline mobile:** `font-geist font-light text-[28px]` no mobile, `text-[40px]` no desktop.
- **Back to top craft:** `paddingBottom: 169px`, alinhamento calculado com o monograma após o salto do card.

### Sessão 11 — Extração de componentes, design system, a11y, PasswordGate

#### ✅ O que foi implementado

- **6 novos componentes extraídos:** `Monogram`, `BackToTopButton`, `ControlPill`, `SectionDropdown`, `PrevNextBar`, `TimelineItem` (ver seção 7 para specs).
- **`PasswordGate` reescrito:** hierarquia `PasswordGate > PasswordDisplay > PasswordInput`, com backdrop blur, clamp typography, autoFocus e a11y.
- **`craft/page.tsx` refatorado:** 427 → ~180 linhas. Toda lógica de componente saiu para os arquivos dedicados.
- **`track/page.tsx` refatorado:** 278 → ~175 linhas. `timelineRef`, `useRef`, `ArrowUp` removidos.
- **Trigger Back to top unificado:** de IntersectionObserver nas pills → scroll listener `window.scrollY + innerHeight >= scrollHeight - 10`. Estado único `footerRevealed` / `atBottom` controla tanto o salto do card (craft) quanto o BackToTopButton.
- **Logo anchor por altura:** `h-[56px] w-auto` no info block do craft mobile — altura fixa independente da proporção do asset.
- **`prefers-reduced-motion`:** `globals.css` desativa `control-bar-enter` e todas as transitions/animations (`0.01ms !important`).
- **`env(safe-area-inset-bottom)`:** aplicado via `calc()` em `PrevNextBar` e `BackToTopButton`.
- **Focus return no SectionDropdown:** `triggerRef.current?.focus()` no `close()`.
- **`docs/DESIGN-SYSTEM.md`:** tokens, inventário de 15 componentes, specs, arquitetura mobile/desktop, princípios de qualidade.
- **`docs/BEST-PRACTICES.md`:** DX, design system, a11y, responsividade, performance, Tailwind v4 pitfalls, git workflow.

#### ❌ Erros cometidos — NÃO repetir

1. **`Write` sem `Read` prévio causa erro "File has not been read yet."**
   - Regra: sempre usar `Read` antes de `Write`. Para modificações pontuais, preferir `Edit` (não requer Read prévio).

2. **Diagnóstico incompleto de pointer events.**
   - Erro: ao investigar Prev/Next não clicáveis, primeiro tentei corrigir o handler sem examinar o DOM. O problema era o container do `BackToTopButton` (`pointer-events: auto`, full-width, 225px de altura) bloqueando eventos.
   - Correto: investigar a hierarquia de z-index e pointer-events antes de assumir que o bug é no handler.

3. **Importação órfã após refatoração.**
   - Erro: após remover `timelineRef`, o import `useRef` ficou sem uso em `track/page.tsx`.
   - Regra: ao remover uso de uma importação, checar e remover o import junto.

---

## 16. Próxima sessão — Pass de consistência desktop

**Objetivo:** revisar todas as páginas desktop contra os padrões mobile e diretrizes de DS/DX estabelecidos na sessão 11.

### O que auditar

| Componente / área | O que verificar |
|---|---|
| `Header.tsx` | Focus management, a11y labels nos links de nav |
| `NavSelector.tsx` | Estados pill: default, hover, active — verificar em ambos breakpoints |
| `ControlPill.tsx` | Comportamento `atEnd` em /craft e /track, hover state |
| `PasswordGate.tsx` | Backdrop blur funciona em Safari (WebkitBackdropFilter), foco no input, Escape fecha |
| `ProjectCarousel.tsx` | Altura logo `h-[56px] w-auto` no desktop (info block) |
| `ProjectSelector.tsx` | Underline variant, gap={16}, alinhamento vertical com o bio |
| `Monogram.tsx` | `size="sm"` no desktop (w-[88px]) em craft e track |
| Section switcher desktop | Dois botões `ArrowRight` em craft — verificar hover/active, cores, tamanhos contra DS |
| Tokens de cor | Todos os valores hexadecimais inline correspondem aos tokens de `DESIGN-SYSTEM.md` |
| Tipografia | Tamanhos/pesos Geist e Fenix conforme specs do DS |
| Espaçamento | `px-[10.5rem]`, `pt-20`, `pb-20` consistentes entre /home, /track, /craft |
| Animações | `prefers-reduced-motion` respeitado nas transições desktop (card translateY, ControlPill hover) |
| Focus rings | Todos os elementos interativos têm foco visível no desktop |

### Referências para a sessão

- `docs/DESIGN-SYSTEM.md` — tokens, specs completas de todos os componentes, arquitetura
- `docs/BEST-PRACTICES.md` — a11y checklist, responsividade, Tailwind v4 pitfalls
- Seção 8 deste documento — especificações do split layout desktop
