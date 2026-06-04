# SESSION HANDOFF — douglima.work Portfolio

> Documento de contexto para continuidade entre sessões.
> Última atualização: 03 jun 2026 — Sessão 15 (animação de saída scroll-driven, hook useFooterAnimation, componente PageFooter, refatoração completa da Track, padding lateral padronizado em 72px) ✅

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
/craft         → Playground (✅) + Selected Works password gate (✅) + dados reais (✅)
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

Assets do Selected Works: ✅ **Completo** — `public/assets/selected-works/` com subpastas `project-picking-handheld/` (9 imagens + logo) e `project-checkin-desktop/` (11 imagens + logo). `data.ts` populado com os dois projetos.

---

## 7. Componentes implementados

### 7.1 `app/components/Header.tsx`

Componente reutilizável para todas as páginas. **Atualizado sessão 14.**

**Nomenclatura interna:**
- `PageNav` (era `LogoAndNav`) — bloco superior: lettering SVG + pills Craft/Track
- `MenuNav` — bloco secundário opcional, passado via prop `menuNav?: React.ReactNode`

**Props:**
```ts
menuNav?: React.ReactNode  // se passado, renderiza abaixo do PageNav no desktop
```

**PageNav (desktop):**
- Lettering: `h-[40px] w-auto` (era 32px), hover swap via `group`/`group-hover`
- Pills: `NavSelector` com `pillHeight="h-[40px]"`, `gap={12}`, `px-5`
- Header element: `flex items-center justify-between` (era `items-start`)

**MenuNav (desktop, craft only):**
- Container: `pt-6 pb-2 flex items-start gap-6`
- Conteúdo: `SectionDropdownDesktop` + wrapper `h-[56px] flex items-center` com `NavSelector`
- O wrapper de 56px fixa o alinhamento vertical dos seletores no centro do trigger do dropdown — mesmo quando o dropdown abre e fica mais alto

**Mobile:** inalterado — fixed, `pt-10`, `py-6`, gradiente 24px

**REGRA:** `menuNav` só é usado pela craft. Home e track passam `<Header />` sem props.

### 7.2 `app/components/NavSelector.tsx`

Componente compartilhado de seletores de navegação. **Atualizado sessão 14.**

**Props:**
```ts
items: { label: string; active: boolean; href?: string; onClick?: () => void }[]
variant?: "pill" | "underline"                    // default: "pill"
direction?: "row" | "col"                          // default: "row"
gap?: number                                       // default: 8px
className?: string
textSize?: string                                  // default: "text-[20px] md:text-[24px]"
pillHeight?: string                                // default: "h-[32px]"
```

**Usos por contexto:**
| Contexto | textSize | pillHeight | gap |
|---|---|---|---|
| Header PageNav (craft/track selectors) | default | `h-[40px]` | 12 |
| Header MenuNav (project selectors) | `text-[18px]` | default `h-[32px]` | 8 |
| Mobile craft (project selectors) | default | default | 8 |

**Variante `"pill"`:**
- Active: `bg-[#C7FF04]` via inline style (não via classe Tailwind — garante precedência)
- Inactive hover: `bg-[#E8E9D9]`, ring remove, `text-text-active`
- `font-fenix`, `rounded-full`, `px-5`

**Variante `"underline"`:** `font-fenix text-[24px]`, underline permanente no ativo.

### 7.3 `app/components/PageLayout.tsx`

Encapsula padrões de layout compartilhados:

- Renderiza `Header.tsx`
- Aplica `pt-20 pb-20 px-[10.5rem]`
- Footer com `items-center justify-between`: monograma (esquerda) + `footerContent` (direita)
- Suporte a `backgroundLayers` (para mosaico da home)

**Usado em:** `app/page.tsx` (home). Track e Craft NÃO usam PageLayout.

### 7.4 `app/components/BlurOverlay.tsx`

Gradiente de fade `#F9F9F2 → transparente`. **Atualizado sessão 14 — altura e gradiente configuráveis.**

**Props:**
```ts
className?: string       // default: "absolute top-0 left-0 right-0"
height?: number          // default: 185
solidUntil?: string      // default: "65%"
```

**Valores por página:**
| Página | height | solidUntil | Motivo |
|---|---|---|---|
| track | 185 (default) | "65%" (default) | Header simples (~120px) |
| craft | 280 | "80%" | Header dois blocos (~208px) |

**Cálculo craft:** header = `pt-[72px]`(72) + PageNav(40) + `pt-6`(24) + dropdown(56) + `pb-2`(8) = **200px**. Blur 280px × 80% = 224px sólido (margem extra). Fade: 224→280px.

### 7.5 `app/components/ScrollColumn.tsx`

⚠️ **Não mais usado por craft ou track (sessão 15).** Ambas as páginas adotaram o padrão de scroll container direto (`div absolute inset-0 overflow-y-auto`). O arquivo existe mas pode ser deletado futuramente.

### 7.6 `app/components/TimelineBlock.tsx`

Bloco individual da timeline de carreira.

```
| year (Geist SemiBold 24px) | 24px gap | text-content (hug) | flex-1 gutter | logo (220px) |
```

Exporta tipos `TimelineEntry` e `TimelineLine`.
Estilos de linha: `light` | `bold` | `serif`.

### 7.7 `app/hooks/useSplitLayout.ts`

⚠️ **Não mais usado por craft ou track (sessão 15).** Substituído por `useFooterAnimation` (seção 7.20). O arquivo existe mas pode ser deletado futuramente.

### 7.8 `app/craft/ProjectCarousel.tsx`

⚠️ **Não mais usado (sessão 15).** A craft adotou o padrão de scroll container direto — o conteúdo é renderizado inline em `craft/page.tsx` sem delegar para `ProjectCarousel`. O arquivo existe mas pode ser deletado futuramente.

### 7.9 `app/craft/ProjectSelector.tsx`

⚠️ **Não mais usado (sessão 14+15).** Os seletores de projeto estão no `MenuNav` do header. O arquivo pode ser deletado futuramente.

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

### 7.11b `app/craft/SectionDropdownDesktop.tsx` (novo — sessão 14)

Dropdown de seleção de seção para o desktop. Baseado no estilo do `PrevNextBar` mobile.

**Estados:**
| Estado | Surface | Texto trigger | Ícone |
|---|---|---|---|
| Default (fechado) | `#121210`, `rounded-full` | `#FAFAF5` | CaretRight |
| Hover | `#121210`, `rounded-full` | `#C7FF04` | CaretRight |
| Aberto | `#121210`, `rounded-[28px]` | `#C7FF04` | CaretDown |
| Hover na opção | trigger volta a `#FAFAF5` | opção em `#C7FF04` | — |

**Trick de largura fixa:** ambas as linhas (trigger + opção alternativa) são **sempre renderizadas** no DOM. A opção alternativa tem `height: 0; overflow: hidden; paddingBottom: 0` quando fechada — ocupa 0px vertical mas sua largura de texto ainda contribui para o `w-fit` do container flex-col. Resultado: o container nunca expande horizontalmente ao abrir.

**Shadow (estado aberto):** `0px 4px 12px -8px rgba(0,0,0,0.25)` — mesmo padrão do botão "Back to top".

**Dimensões:** `h-[56px]` no trigger, `pl-6 pr-6` (24px cada lado), `font-geist font-light text-[18px]`.

**Outside click:** `mousedown` listener no `document`, cancelado quando `!isOpen`.

### 7.12 `app/components/Monogram.tsx` (atualizado — sessão 14)

Componente do monograma decorativo `dl-monogram.svg`.

**Props:**
```ts
size?: "sm" | "md" | "lg" | "4xl"   // default: "lg"
className?: string
```

| Size | Width | Uso |
|---|---|---|
| `sm` | 88px | — |
| `md` | 100px | — |
| `lg` | 104px | Mobile (todas as páginas) |
| `4xl` | 164px | Desktop craft e track (no PageFooter) |

`aria-hidden="true"` — puramente decorativo.

**Desktop (craft + track):** renderizado dentro do `PageFooter` com `size="4xl"` e `className="monogram-enter"`. O footer é condicional ao `isFooterMounted` (gerenciado pelo hook `useFooterAnimation`). Animação `monogram-enter`: scale 0.82→1 + opacity 0→1, ease-out expo 0.6s.

### 7.13 `app/components/BackToTopButton.tsx` (novo — sessão 11)

Botão "Back to top" fixo no rodapé. **Mobile only** (`md:hidden`).

**Props:** `paddingBottom: number`, `zIndex?: number` (default 30).

Container com `pointer-events: none` + botão com `pointer-events: auto` — padrão para não bloquear elementos abaixo. Spring animation `control-bar-enter` na entrada.

| Página | paddingBottom | Alinhamento |
|---|---|---|
| `/craft` | 169px | Centro do monograma após salto do card (104px) |
| `/track` | 73px | Centro do monograma no rodapé |

### 7.14 `app/components/ControlPill.tsx` (novo — sessão 11)

⚠️ **Não mais usado (sessão 15).** O botão "Back to top" desktop foi substituído pelo `FooterBackToTop` dentro do `PageFooter`. O arquivo pode ser deletado futuramente.

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

### 7.19 `app/components/PageFooter.tsx` (novo — sessão 15)

Footer de página desktop. `forwardRef` — a ref é usada pelo `useFooterAnimation` para medir a altura e aplicar `transform`.

**Props:**
```ts
scrollRef: React.RefObject<HTMLDivElement | null>   // para onWheel forwarding
center?: React.ReactNode                            // slot central — Prev/Next na craft, vazio na track
right: React.ReactNode                              // slot direito — back to top, contact, etc.
```

**Layout:** `grid grid-cols-3 items-center px-[72px] py-20`. Esquerda: `<Monogram size="4xl" className="monogram-enter" />`. Centro: `{center}`. Direita: `flex justify-end`.

**`onWheel` forwarding:** o footer captura eventos de scroll e repassa ao scroll container:
```ts
onWheel={(e) => {
  const delta = e.deltaMode === 0 ? e.deltaY : e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY * window.innerHeight;
  scrollRef.current?.scrollBy({ top: delta });
}}
```
Necessário porque o footer (`pointer-events: auto`, `position: absolute bottom-0`) captura wheel events e sem forwarding o usuário não consegue rolar quando o ponteiro está sobre o footer.

**`absolute bottom-0 left-0 right-0 z-20 bg-bg-base`** — DOM antes do scroll container. Durante a saída, `footerEl.style.zIndex = "auto"` remove a vantagem z-20 e o scroll container (posterior no DOM) pinta por cima.

**Exporta também:** `FooterBackToTop` — botão "back to top" 3 estados:
- Default: `border border-[#AFB4A7]`, sem fundo
- Hover: `bg-[#E8E9D9]`, sem borda
- Active: `bg-[#C7FF04]`, sem borda

### 7.20 `app/hooks/useFooterAnimation.ts` (novo — sessão 15)

Hook que encapsula toda a lógica de entrada e saída do footer desktop.

**Props:**
```ts
scrollRef: React.RefObject<HTMLDivElement | null>
lastItemRef: React.RefObject<HTMLDivElement | null>
contentDivRef: React.RefObject<HTMLDivElement | null>
footerRef: React.RefObject<HTMLDivElement | null>
resetKey?: string   // mudanças resetam scroll + estado — ex.: activeProject na craft
```

**Retorna:** `{ isFooterMounted, atEnd }`

**Comportamento:**
- `atEnd`: `lastEl.getBoundingClientRect().bottom <= container.getBoundingClientRect().bottom + 4`
- `isFooterMounted`: true quando `atEnd` é atingido pela primeira vez (ou após reset)
- **Antes do primeiro paint:** `useLayoutEffect` posiciona o footer em `translateY(footerHeight)` — footer invisível
- **Animação de entrada (ENTER):** `setTimeout(0)` → RAF com 600ms; scroll usa `easeOutBack` ("pulinho"); footer usa `easeOutQuint`. Ao terminar: `enterScrollTopRef.current = container.scrollTop`
- **Animação de saída (EXIT, scroll-driven):** âncora = `enterScrollTopRef` (scrollTop no fim do enter). A cada evento de scroll: `scrolledBack = Math.max(0, enterScrollTopRef - container.scrollTop)`. `newY = Math.min(scrolledBack * 0.6, footerHeight)` — parallax a 60% do scroll. Footer move com `translateY(newY)`. Quando `newY >= footerHeight`: footer desmontado, `isFooterMounted = false`.
- **z-index durante saída:** `footerEl.style.zIndex = "auto"` — scroll container posterior no DOM pinta por cima do footer

**Por que `enterScrollTopRef` e não `atEnd`:**
A animação de entrada rola o container `footerHeight` pixels além do threshold `atEnd`. Se a saída fosse anchorada no threshold (`atEnd`), o exit só começaria depois de `footerHeight` pixels de scroll-back — o carousel já estaria cobrindo o footer antes de ele começar a sair. Anchorar no scrollTop do fim do enter faz o exit começar imediatamente ao primeiro pixel de scroll-back.

### 7.18 `app/craft/PasswordGate.tsx` (reescrito — sessão 11)

**Hierarquia interna:** `PasswordGate` > `PasswordDisplay` > `PasswordInput`

- **`PasswordGate`:** overlay `fixed inset-0 z-50`, backdrop blur 16px + `WebkitBackdropFilter` (Safari), `backgroundColor: "rgba(243, 242, 230, 0.25)"`
- **`PasswordDisplay`:** heading `clamp(24px, 4vw, 32px)`, body `clamp(20px, 3vw, 24px)`, input, erro, botão cancel com fonte Fenix
- **`PasswordInput`:** `type="password"`, `autoFocus`, `aria-label="NDA password"`, Enter submete

Pressionar Escape no `craft/page.tsx` fecha o gate via `keydown` listener. Backdrop blur requer conteúdo por trás — garantido pela transparência do `backgroundColor`.

---

## 8. Padrão Content-Module + Footer (track + craft) — atualizado sessão 15

⚠️ **O split layout das sessões anteriores foi completamente substituído.** Craft e track agora usam um único scroll container full-width com floating header e PageFooter animado.

### Estrutura desktop

```
<div bg-bg-base h-dvh overflow-hidden relative>

  {/* 1. BlurOverlay — fades conteúdo que sobe atrás do header */}
  <BlurOverlay height={280} solidUntil="80%" />

  {/* 2. PageFooter — antes do scroll container no DOM (z-index trick) */}
  {isFooterMounted && (
    <PageFooter ref={footerRef} scrollRef={scrollRef} right={...} center={...} />
  )}

  {/* 3. Scroll container — full-screen */}
  <div ref={scrollRef} className="absolute inset-0 overflow-y-auto">
    <div ref={contentDivRef} className="px-[168px|10.5rem]" style={{ paddingTop: "280px" }}>
      ...conteúdo...
      <div ref={lastItemRef}>último item</div>
    </div>
  </div>

  {/* 4. Header flutuante — z-10, pointer-events-none no wrapper */}
  <div className="pointer-events-none absolute top-0 inset-x-0 z-10 px-[72px] pt-[72px]">
    <div className="pointer-events-auto">
      <Header menuNav={...} />
    </div>
  </div>

</div>
```

### Por que DOM order importa

O `PageFooter` fica **antes** do scroll container no DOM. Ambos têm `position: absolute bottom-0`. Em situação normal, o `z-20` do footer garante que ele fica acima do scroll container.

Durante a saída (exit animation): `footerEl.style.zIndex = "auto"` remove a vantagem z-20. O scroll container, sendo posterior no DOM e sem z-index explícito, pinta naturalmente por cima — efeito de carrossel passando sobre o footer.

### Scroll forwarding no footer

O `PageFooter` tem `onWheel` que repassa eventos ao `scrollRef`. Sem isso, o usuário não consegue rolar quando o ponteiro está sobre o footer (o footer captura os eventos por ter `pointer-events: auto`).

### Regras de posicionamento (atualizado sessão 15)

| Elemento | Track | Craft |
|---|---|---|
| Header `pt` (desktop) | `px-[72px] pt-[72px]` | `px-[72px] pt-[72px]` |
| Content `paddingTop` | `280px` | `280px` |
| Content `px` | `px-[168px]` | `px-[10.5rem]` |
| BlurOverlay height | 280px | 280px |
| BlurOverlay solidUntil | "80%" | "80%" |
| PageFooter center | — (vazio) | Prev/Next pill `w-[296px]` |
| PageFooter right | FooterBackToTop | FooterBackToTop |
| Footer `px` | `px-[72px]` | `px-[72px]` |

### Animação de entrada e saída

Ver seção 7.20 (`useFooterAnimation`) para documentação completa do comportamento.

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
- **"a few steps:" removido** — não faz mais parte da página.

### Desktop layout (atualizado sessão 15 — refatoração completa)

Adota o mesmo padrão de content-module + footer da Craft (seção 8).

**Floating header:** `px-[72px] pt-[72px]`. `menuNav` com o texto "20 years across Design, Experiences and Technology." em Geist Light 40px, uma linha (`whitespace-nowrap`).

**Scroll container:** `absolute inset-0 overflow-y-auto`. Content div: `px-[168px]`, `paddingTop: "280px"`.

**Timeline:** `flex flex-col`. Cada item: `<div className="border-b border-[#DEDDCE] py-10">`. **Sem** `border-t` no primeiro item (removido por request). `lastItemRef` no último item.

**Footer:** `PageFooter` com `right={<FooterBackToTop />}` — sem slot `center` (sem Prev/Next na track).

**`useFooterAnimation`:** `resetKey` não é necessário (timeline não muda); sem `resetKey` prop.

### Mobile layout

- Container: `px-10 pt-[144px] pb-10 flex flex-col`
- Timeline: `-mx-2` (32px lateral padding), `gap-6` (24px entre ano e título)
- Item row: `items-center`, `minHeight: "112px"` via inline style
- **Alinhamento do ano:** para itens com cargos simples (não-Teacher, não-Master's Degree): `items-start` no sub-container ano+texto (topo do ano alinha com topo do título). Teacher e Master's Degree: `items-center` (permanecem centralizados).
- **Tamanhos de logo:** `w-[68px] h-auto` para ESPM, Olist, IED, Kyvo, iFood, Livework (largura fixa no iFood como referência); `max-h-[40px]` para Mercado Livre; `max-h-[48px]` para Klauvi, Aprender Design, Hash, Unifei, Itaú; `max-h-[36px]` padrão para os demais.
- **Back to top (mobile):** componente `BackToTopButton` com `paddingBottom={73}`. Aparece via **scroll listener** (`window.scrollY + innerHeight >= scrollHeight - 10`), estado `atBottom`. Mesmo spring animation (`control-bar-enter`). `timelineRef` e `IntersectionObserver` foram removidos na sessão 11.

---

## 11. Página: Craft (`/craft`)

*(estrutura desktop refatorada na sessão 15 — ver seção 8 para o novo padrão)*

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
- [x] **Pass de consistência desktop** ← feito na sessão 12
- [x] **Ajustes de componentes home + ContactButton** ← feito na sessão 13
- [x] **Novo header craft desktop + SectionDropdownDesktop + footer condicional** ← feito na sessão 14
- [x] **Refatorar módulo de conteúdo (craft + track)** ← feito na sessão 15
- [x] **Refatorar footer (craft + track)** ← feito na sessão 15 — `useFooterAnimation` + `PageFooter`
- [x] **Selected Works — dados reais** ← completo — `project-picking-handheld` (9 imgs) + `project-checkin-desktop` (11 imgs)

### Ajustes em andamento (batch atual)

- [x] **Unificar home footer com `PageFooter`** — componente único com variantes por página (ver seção 18)
- [ ] **Transições entre páginas** — ver seção 19 (em discussão)

### Depois dos ajustes (não bloqueia)

- [ ] **Pass de responsividade** — logo lettering mobile size, header height cascade (ver seção 16)
- [ ] **Variável `NDA_PASSWORD` na Vercel** — adicionar no painel antes do deploy (`dvault`)
- [ ] **Meta tags** (og:image, description, favicon)
- [ ] **Cloudflare Email Routing** (`hello@douglima.work` → Gmail)

### Limpeza final (executar junto, no fim de tudo)

- [ ] Deletar `app/components/ControlPill.tsx`
- [ ] Deletar `app/components/ScrollColumn.tsx`
- [ ] Deletar `app/hooks/useSplitLayout.ts`
- [ ] Deletar `app/craft/ProjectCarousel.tsx`
- [ ] Deletar `app/craft/ProjectSelector.tsx`
- [ ] Verificar imports órfãos após deleção (`grep -r "ControlPill\|ScrollColumn\|useSplitLayout\|ProjectCarousel\|ProjectSelector" app/`)

---

## 13. Workflow estabelecido

1. **Planejamento e refinamento visual** → Claude.ai
2. **Specs e interações** → documentadas em PRDs (pasta `docs/`)
3. **Execução de código** → Claude Code (Sonnet 4.6)
4. **Validação visual** → Doug roda `npm run dev`, envia screenshots, ajustamos
5. **Assets** → Doug exporta do Figma para `public/assets/`, Claude Code consome

---

## 14. Arquivos do projeto (atualizado — sessão 15)

```
doug-lima/
├── .env.local                        # NDA_PASSWORD=dvault (não commitado)
├── app/
│   ├── components/
│   │   ├── Header.tsx                # PageNav + menuNav? prop — mobile: fixed+gradiente; desktop: floating
│   │   ├── MosaicBackground.tsx      # Mosaico animado — inline styles críticos, .mosaic-container no CSS
│   │   ├── NavSelector.tsx           # Seletor: variant pill|underline, textSize, pillHeight, gap
│   │   ├── PageLayout.tsx            # Layout padrão: px-10 mobile / px-[72px] desktop (home only)
│   │   ├── PageFooter.tsx            # Footer desktop — forwardRef, onWheel forwarding, center+right slots
│   │   ├── BlurOverlay.tsx           # Gradiente fade configurável: height + solidUntil
│   │   ├── ScrollColumn.tsx          # ⚠️ Não usado — pode ser deletado futuramente
│   │   ├── TimelineBlock.tsx         # Bloco da timeline desktop (ano | texto | logo)
│   │   ├── TimelineItem.tsx          # Row da timeline mobile — logo sizing + alinhamento encapsulados
│   │   ├── ContactButton.tsx         # Botão de contato — overlay ancorado ao trigger, hover desktop, a11y
│   │   ├── Monogram.tsx              # Monograma DL svg — size sm(88)/md(100)/lg(104)/4xl(164)px, aria-hidden
│   │   ├── BackToTopButton.tsx       # Botão back to top mobile — pointer-events pass-through, spring anim
│   │   └── ControlPill.tsx           # ⚠️ Não usado — pode ser deletado futuramente
│   ├── hooks/
│   │   ├── useFooterAnimation.ts     # Hook: enter (easeOutBack+easeOutQuint) + exit scroll-driven 60%
│   │   └── useSplitLayout.ts         # ⚠️ Não usado — pode ser deletado futuramente
│   ├── track/
│   │   └── page.tsx                  # Track: floating header, scroll container, useFooterAnimation
│   ├── craft/
│   │   ├── actions.ts                # Server Action: verifyPassword
│   │   ├── data.ts                   # Tipos + dados dos projetos
│   │   ├── ProjectCarousel.tsx       # ⚠️ Não usado — pode ser deletado futuramente
│   │   ├── ProjectSelector.tsx       # ⚠️ Não usado — pode ser deletado futuramente
│   │   ├── SectionDropdown.tsx       # Dropdown mobile Playground/Selected Works — a11y + focus return
│   │   ├── SectionDropdownDesktop.tsx# Dropdown desktop — dark pill, width equalization, hover states
│   │   ├── PrevNextBar.tsx           # Bar Prev/Next mobile — z-20, safe-area-inset-bottom
│   │   ├── PasswordGate.tsx          # Modal NDA — backdrop blur, PasswordDisplay, PasswordInput
│   │   └── page.tsx                  # Craft: floating header, scroll container, useFooterAnimation, Prev/Next
│   ├── globals.css                   # Cores, fontes, keyframes: control-bar-enter, monogram-enter, card-reveal
│   ├── layout.tsx                    # Geist + Fenix, metadata
│   └── page.tsx                      # Home ✅
├── docs/
│   ├── SESSION-HANDOFF-PORTFOLIO.md  # Este arquivo
│   ├── DESIGN-SYSTEM.md              # Tokens, inventário de componentes, specs, arquitetura mobile/desktop
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

### Sessão 13 — Ajustes de componentes home + ContactButton

#### ✅ O que foi implementado

- **`ContactButton.tsx` extraído:** componente autocontido com estado próprio (`isOpen`, `copied`). Overlay ancorado ao trigger via `position: relative` no container + `absolute bottom-0 right-0` no painel — sem coordenadas hardcoded de viewport. Funciona em qualquer breakpoint.
- **Hover desktop no ContactButton:** `md:hover:bg-[#E8E9D9]` — mesma surface do hover das pills do NavSelector. Desktop-only via prefixo `md:`.
- **Focus management no ContactButton:** abre → foca LinkedIn (primeiro pill via `firstPillRef`); fecha → retorna foco ao trigger via `triggerRef`. Botão de fechar com `aria-label="Close contact menu"`.
- **`page.tsx` (home) virou Server Component:** toda lógica de estado movida para `ContactButton`. Arquivo reduzido para ~25 linhas sem `"use client"`.
- **Monogram: tamanhos `"md"` e `"4xl"` adicionados:** `sm`=88px / `md`=100px / `lg`=104px / `4xl`=160px. Desktop passou para `size="4xl"` (160px) em craft, track e home.
- **`PageLayout.tsx`:** className do Monogram simplificado de `h-[104px] md:w-[88px] md:h-auto` para `h-[104px] md:w-[160px] md:h-auto` — altura sempre proporcional ao SVG no desktop.

#### Decisão de arquitetura — posicionamento do overlay ContactButton

O overlay usava `fixed inset-0` com conteúdo em `bottom-10 right-10` (hardcoded). Isso desalinhava no desktop porque o botão vive em `px-[10.5rem] pb-20`. A solução correta é ancorar o painel ao próprio botão via relative/absolute — não às bordas da viewport. Isso elimina qualquer dependência de coordenadas do layout pai e garante alinhamento em qualquer breakpoint.

#### Decisão de estratégia — responsividade

Identificado que vários elementos têm tamanho fixo em ambos os breakpoints quando deveriam escalar:
- Logo lettering: `h-[32px]` fixo (SVG 164×32px natural)
- Monogram: lógica de sizing responsivo espalhada por className overrides

Decisão: terminar os ajustes de componentes desktop primeiro, depois executar um **pass de responsividade unificado** que trate todos os elementos de uma vez — evitando múltiplos cascades parciais.

---

### Sessão 12 — Pass de consistência desktop

#### ✅ O que foi implementado

- **`ProjectCarousel.tsx` logo:** `max-h-full max-w-full object-contain` → `h-[56px] w-auto object-contain`. Mobile e desktop agora usam o mesmo padrão de logo no info block.
- **`ControlPill.tsx` token:** `text-[#3B4028]` → `text-text-active` (2 ocorrências). Valor idêntico ao token — substituído para garantir consistência se o token mudar.
- **`.card-reveal` CSS class:** transition do card mobile (`craft/page.tsx`) movida de inline `style` para `globals.css`. Agora é afetada pelo `@media (prefers-reduced-motion: reduce)` que já aplica `transition-duration: 0.01ms !important`.
- **`:focus-visible` global:** adicionado em `globals.css` — `outline: 2px solid #3B4028; outline-offset: 2px`. Cobre todos os elementos interativos com uma regra centralizada, cor consistente com `text-text-active`.
- **`DESIGN-SYSTEM.md` atualizado:** 3 anotações obsoletas corrigidas (PasswordGate removido de "Padrões a extrair"; a11y checklist marcado como implementado; PasswordGate na estrutura de arquivos corrigido para "reescrito sessão 11 — ativo").

#### Resultado da auditoria desktop

A base desktop estava largamente consistente. Delta real encontrado: 2 correções de código (logo height + token), 2 melhorias de acessibilidade (focus rings + prefers-reduced-motion), 1 doc desatualizado.

| Área auditada | Resultado |
|---|---|
| Header — a11y, focus | OK — sem alterações |
| NavSelector — estados pill | OK — sem alterações |
| ControlPill — token, hover | ✅ corrigido token |
| PasswordGate — backdrop, focus, Escape | OK — sem alterações |
| ProjectCarousel — logo height | ✅ corrigido `h-[56px] w-auto` |
| ProjectSelector — underline, gap | OK — sem alterações |
| Monogram — size="sm" desktop | OK — sem alterações |
| Section switcher desktop | OK — sem alterações |
| Tokens de cor | ✅ corrigido ControlPill |
| Tipografia | OK — sem alterações |
| Espaçamento (`px-[10.5rem]`, pt/pb-20) | OK — sem alterações |
| Animações + prefers-reduced-motion | ✅ card-reveal class |
| Focus rings | ✅ :focus-visible global |

### Sessão 14 — Novo header craft desktop, SectionDropdownDesktop, footer condicional

#### ✅ O que foi implementado

- **`atEnd` via `getBoundingClientRect()`:** substituiu IntersectionObserver e `scrollTop+clientHeight` por `lastEl.getBoundingClientRect().bottom <= container.getBoundingClientRect().bottom + 4`. Único método que dispara exatamente quando o último elemento está visível dentro do container, independente do paddingBottom.
- **`monogram-enter` animation:** scale 0.82→1 + opacity 0→1, ease-out expo `cubic-bezier(0.16, 1, 0.3, 1)`, 0.6s. Monograma desktop (craft + track) agora é condicional ao `atEnd` e anima na entrada. Junto com o botão "Back to top" formam o "footer" do desktop.
- **`SectionDropdownDesktop.tsx` criado:** dropdown escuro para seleção de seção no desktop, baseado no estilo do PrevNextBar. Width equalization via renderização permanente das duas linhas (segunda tem `height:0` quando fechada). Hover states: trigger `#FAFAF5` → `#C7FF04`; opção alternativa `#FAFAF5` → `#C7FF04` + trigger reverte para `#FAFAF5`.
- **Header refatorado para dois blocos:** `LogoAndNav` → `PageNav`. Nova prop `menuNav?: React.ReactNode`. Desktop: `PageNav` (logo + craft/track) + `MenuNav` (dropdown + seletores de projeto). Wrapper `h-[56px] flex items-center` no NavSelector fixa alinhamento vertical independente do estado do dropdown.
- **`NavSelector` props `textSize` e `pillHeight`:** backward-compatible. `pillHeight="h-[40px]"` no header PageNav, `textSize="text-[18px]"` nos seletores de projeto do MenuNav.
- **Header PageNav ajustes visuais:** lettering `h-[40px]` (era 32px), pills `h-[40px]`, `px-5` (20px), `gap={12}`, `items-center` (era `items-start`). Labels capitalizados: "Craft", "Track".
- **`BlurOverlay` configurável:** `height` e `solidUntil` como props. Craft: `height=280, solidUntil="80%"`.
- **`ScrollColumn` e `ProjectCarousel` passam blur:** chain `blurHeight`/`blurSolidUntil` do `craft/page.tsx` até o `BlurOverlay`.
- **`useSplitLayout` aceita `blurHeight`:** track usa default 185, craft usa 224 (header dois blocos).
- **`pt-20` → `pt-[72px]`** em todas as páginas desktop (craft, track, PageLayout). Mudança estrutural global.
- **`ProjectSelector` removido do desktop craft:** seletores migram para o `MenuNav` no header.
- **Botão "Back to top" desktop:** `absolute bottom-[148px] right-[10.5rem]`, spring `control-bar-enter`. Aparece junto com o monograma quando `atEnd = true`.

#### ❌ Erros cometidos — NÃO repetir

1. **`BlurOverlay` não cobria o header de dois blocos.**
   - Erro: `h-[185px]` cobre o PageNav mas não o MenuNav (header total ~200px). Conteúdo do carrossel ficava visível atrás do segundo bloco.
   - Correto: calcular altura total do header (pt + PageNav + MenuNav) e configurar `blurHeight` e `blurSolidUntil` para cobrir completamente. Aumentar `blurHeight` no hook para reposicionar o primeiro item abaixo do header.

2. **`scrollTop + clientHeight >= scrollHeight - 10` dispara antes do fim.**
   - Causa: o `paddingBottom` adiciona espaço vazio abaixo do último item, então o scroll "termina" com o último item ainda centralizado na tela, não na borda inferior. O check de scrollHeight considera o padding — não a posição real do último elemento.
   - Correto: usar `getBoundingClientRect()` para medir posição real do elemento vs. container.

3. **`onScroll()` chamado imediatamente ao montar pode dar falso positivo.**
   - Risco: se o container não tem overflow (conteúdo curto), `scrollHeight === clientHeight`, e qualquer check de scroll imediato retorna true.
   - Correto: com `getBoundingClientRect()`, o último item estará abaixo do container no mount (scroll=0), então retorna false corretamente.

4. **Tentar suavizar o blur aumentando `blurHeight` total.**
   - Erro: aumentar de 280 para 360px para "mais fade" — resultou em degradação visual porque a zona sólida se estendia muito abaixo do header, criando um efeito de fundo sólido grande.
   - Correto: o fade suave é melhor controlado pela diferença entre `blurHeight` e a zona sólida (`solidUntil`). Manter `blurHeight` próximo ao necessário.

### Sessão 15 — Animação scroll-driven, useFooterAnimation, PageFooter, refatoração Track

#### ✅ O que foi implementado

- **Animação de saída scroll-driven:** substituiu a saída por `!atEnd` por uma saída contínua ancorada ao `enterScrollTopRef`. O footer começa a sair imediatamente ao primeiro pixel de scroll-back, a 60% da velocidade do scroll (parallax). O carousel passa sobre o footer enquanto o footer sai suavemente em paralelo.
- **`enterScrollTopRef` como âncora:** inicializado em `-1` (bloqueia exit durante enter). Setado para `container.scrollTop` exatamente quando a animação de entrada termina. Isso garante que o exit começa do ponto exato onde o enter terminou — não do threshold `atEnd` (que está `footerHeight` pixels antes).
- **DOM order z-index trick documentado:** footer antes do scroll container no DOM. Em condição normal, `z-20` garante visibilidade. Durante exit: `footerEl.style.zIndex = "auto"` remove a vantagem; o scroll container, posterior no DOM, pinta por cima.
- **`onWheel` forwarding no PageFooter:** sem isso, o usuário não consegue rolar quando o ponteiro está sobre o footer. Forwarding respeita `deltaMode` (pixel, line, page).
- **`useFooterAnimation` hook criado:** encapsula toda a lógica de enter + exit. Parâmetro `resetKey` para reset ao trocar de projeto na craft.
- **`PageFooter` componente criado:** `forwardRef`, slots `center?` e `right`, `onWheel` forwarding embutido, `grid grid-cols-3`, padding `px-[72px] py-20`.
- **`FooterBackToTop` extraído:** botão 3 estados (default/hover/active) exportado de `PageFooter.tsx`.
- **Craft refatorada:** removidos ~150 linhas de animation state/refs/effects. Substitui `useSplitLayout`, `ProjectCarousel`, `ScrollColumn` pelo novo padrão. Imagens: `className="w-full overflow-hidden"` (sem `rounded-lg`, sem `bg-surface-tag`).
- **Craft Prev/Next pill:** largura final `w-[296px]`, fonte Geist Light, hover `#C7FF04`.
- **Track completamente reescrita:** split layout → floating header + scroll container. "20 years across..." para o `menuNav` do header (40px, `whitespace-nowrap`). Timeline como scroll content com `border-b border-[#DEDDCE] py-10` entre itens (sem border-t no primeiro). `PageFooter` com só `FooterBackToTop`.
- **`PageLayout` padding:** `md:px-[10.5rem]` → `md:px-[72px]` — alinha com header e footer em todas as páginas.
- **Padrão sistêmico definido:** Header = Block 1 (Logo+Nav) + Block 2 opcional (menuNav). Footer = Monogram (esq) + center (opcional) + right. Todas as páginas compartilham este padrão.

#### ❌ Erros cometidos — NÃO repetir

1. **Exit anchorado ao threshold `atEnd` — timing errado.**
   - Causa: `atEnd` dispara quando `lastBottom <= containerBottom + 4`. Mas a animação de entrada rola o container `footerHeight` pixels além disso. Se a saída só começa quando `!atEnd`, significa que o usuário precisa rolar `footerHeight` pixels de volta antes de o footer começar a sair — o carousel já cobre o footer inteiro antes de ele se mover.
   - Correto: anchorar em `enterScrollTopRef` (scrollTop no fim do enter). Exit começa ao primeiro pixel de scroll-back.

2. **Bloco duplicado de footer JSX.**
   - Erro: ao mover o footer antes do scroll container no DOM para o z-index trick, o bloco antigo de JSX (após o scroll container) não foi removido. Resultado: dois footers renderizados.
   - Correto: ao mover JSX de posição, sempre remover o original.

3. **`Edit` falhou por string não encontrada após edição anterior.**
   - Causa: ao editar imports de um arquivo, o conteúdo mudou. Uma segunda edição com `old_string` copiado antes da primeira mudança não encontrou o texto.
   - Correto: ao fazer múltiplas edições sequenciais num arquivo, reler (com offset) a seção a ser editada em seguida para ter o texto atual.

#### Definições de design system desta sessão

- **Padrão sistêmico de Header:** Block 1 (Logo+Nav) sempre presente. Block 2 (`menuNav`) opcional, variável por página. Home: sem Block 2. Craft: dropdown + seletores. Track: texto "20 years across...".
- **Padrão sistêmico de Footer:** Monogram (esq, `size="4xl"`). Center opcional (Craft: Prev/Next). Right obrigatório (Craft + Track: back to top; Home: contato). Padding `px-[72px] py-20` em todas as páginas.
- **Padding lateral desktop padronizado:** `72px` em header, footer e content-module (onde aplicável). Eram `10.5rem` (168px) em algumas páginas.
- **Imagem containers na craft:** `w-full overflow-hidden` sem arredondamento e sem fundo — conteúdo transparente.
- **Prev/Next na craft:** pill escuro `bg-[#121210]`, `w-[296px]`, Geist Light 18px, hover `#C7FF04`, icons `CaretLeft`/`CaretRight` 18px.

---

## 16. Próxima sessão — Selected Works (dados reais)

**Objetivo:** garantir que todos os elementos e estruturas de layout escalem corretamente entre mobile e desktop, sem tamanhos fixos onde deveria haver responsividade.

### Racional

O projeto foi construído mobile-first e depois ajustado para desktop. Alguns elementos ficaram com tamanhos fixos em ambos os breakpoints — funcionam, mas não escalam. O pass de responsividade trata isso de forma unificada, evitando múltiplos cascades parciais.

### Elementos a auditar e ajustar

| Elemento | Estado atual | O que fazer |
|---|---|---|
| **Logo lettering** (`h-[32px] w-auto`) | Fixo em ambos os breakpoints | Escalar no mobile: `h-[24px] md:h-[32px]` ou `h-[28px] md:h-[32px]` |
| **Header height cascade** | Depende da altura do logo | Recalcular `pt-[144px]`/`pt-[156px]` após ajustar logo |
| **Monogram** | Sizes via prop + className overrides espalhados | Unificar: prop responsiva ou classes responsivas direto no componente |
| **NavSelector pill height** | `h-[32px]` fixo | Verificar se precisa escalar no mobile |
| **ControlPill** | Desktop only (split layout) | Sem pendência |
| **ContactButton** | Mesmo botão em ambos (by design) | Sem pendência |
| **BackToTopButton / PrevNextBar** | Mobile only (`md:hidden`) | Sem pendência |
| **Tipografia body** | `text-[28px] md:text-[40px]` | Já responsivo ✓ |
| **Espaçamento lateral** | `px-10 md:px-[10.5rem]` | Já responsivo ✓ |
| **Padding vertical** | `pb-10 md:pb-20` | Já responsivo ✓ |

### Ordem de execução recomendada

1. **Logo lettering** — decidir o valor mobile e aplicar em `Header.tsx`
2. **Header height** — recalcular e atualizar `pt-[144px]` em todas as páginas que usam o Header mobile
3. **Monogram** — decidir se o sizing responsivo vai via prop ou className, e unificar
4. **Revisão geral** — conferir no browser em 375px, 768px e 1280px

### Impacto do ajuste do logo

O header mobile atual:
```
pt-10 (40px) + py-6 top (24px) + logo h-[32px] + py-6 bottom (24px) = 120px sólido
120px sólido + 24px gradiente = 144px total → pt-[144px] nas páginas
Craft: pt-[144px] + 12px respiro = pt-[156px]
```

Se o logo mobile passar para `h-[24px]`:
```
40 + 24 + 24 + 24 = 112px sólido + 24px gradiente = 136px total → pt-[136px]
Craft: pt-[148px]
```

Se `h-[28px]`:
```
40 + 24 + 28 + 24 = 116px sólido + 24px gradiente = 140px total → pt-[140px]
Craft: pt-[152px]
```

**Arquivos afetados pelo cascade do logo:**
- `app/components/Header.tsx` — altura da img
- `app/craft/page.tsx` — `pt-[156px]` mobile
- `app/track/page.tsx` — `pt-[144px]` mobile (via classe direta)
- `app/components/PageLayout.tsx` — `pt-[144px]` mobile

### Referências

- `docs/BEST-PRACTICES.md` seção 4 — responsividade, mobile-first, unidades de viewport
- `app/components/Header.tsx` — estrutura do header mobile/desktop
- Seção 7.11 deste documento — alturas do header

---

## 18. Unificação do footer (home + craft + track) — batch atual

**Objetivo:** um único componente `PageFooter` com variante por contexto, eliminando o footer inline do `PageLayout`.

### Variantes

| Variante | Página | Comportamento |
|---|---|---|
| `"floating"` (default) | craft, track | `absolute bottom-0`, z-20, bg-base, forwardRef, onWheel forwarding, animado via `useFooterAnimation` |
| `"static"` | home | in-flow, sem position absolute, sem z-index, sem animação |

### Mudanças necessárias

1. **`PageFooter.tsx`:** aceitar `variant?: "floating" | "static"` (default `"floating"`). `scrollRef` vira opcional (só usado no floating). Quando `"static"`: remover `absolute bottom-0 left-0 right-0 z-20 bg-bg-base`, substituir por `mt-auto`.
2. **`PageLayout.tsx`:** remover o `<footer>` inline atual, usar `<PageFooter variant="static" right={footerContent} />`. Tornar `scrollRef` dispensável.
3. **Home (`page.tsx`):** continua usando `PageLayout` com `footerContent` — sem mudança na API da página.

### Consequências

- Monogram no home footer fica dentro do `PageFooter` como nos demais — consistência total.
- `PageLayout` fica mais limpo: só padding + Header + children + footer condicional.
- `FooterBackToTop` e qualquer slot futuro são reutilizáveis entre variantes.

---

## 19. Transições entre páginas — em discussão

**Status:** definição em progresso (sessão 16)

*(seção será preenchida após decisão de abordagem)*

---

## 17. ✅ Módulo de conteúdo + Footer (craft + track) — RESOLVIDO sessão 15

O split layout foi completamente substituído pelo padrão content-module + footer documentado na seção 8.

**craft/page.tsx desktop (atual):**
```
<div h-dvh overflow-hidden relative>
  <BlurOverlay height={280} solidUntil="80%" />
  {isFooterMounted && <PageFooter center={PrevNext} right={BackToTop} />}
  <div ref={scrollRef} absolute inset-0 overflow-y-auto>
    <div ref={contentDivRef} px-[10.5rem] paddingTop=280px>
      info block (h-[144px])
      images (mt-[80px], gap-[80px], lastItemRef no último)
    </div>
  </div>
  <div pointer-events-none absolute top-0 inset-x-0 z-10 px-[72px] pt-[72px]>
    <Header menuNav={SectionDropdownDesktop + NavSelector} />
  </div>
</div>
```

**track/page.tsx desktop (atual):**
```
<div h-dvh overflow-hidden relative>
  <BlurOverlay height={280} solidUntil="80%" />
  {isFooterMounted && <PageFooter right={BackToTop} />}
  <div ref={scrollRef} absolute inset-0 overflow-y-auto>
    <div ref={contentDivRef} px-[168px] paddingTop=280px>
      timeline (flex-col, border-b entre itens, lastItemRef no último)
    </div>
  </div>
  <div pointer-events-none absolute top-0 inset-x-0 z-10 px-[72px] pt-[72px]>
    <Header menuNav="20 years across..." />
  </div>
</div>
```
