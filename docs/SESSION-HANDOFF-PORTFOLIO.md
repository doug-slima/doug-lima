# SESSION HANDOFF — douglima.work Portfolio

> Documento de contexto para continuidade entre sessões.
> Última atualização: 01 jun 2026 — Sessão 7 (correções pré-mobile: ordem da timeline, tamanho de font ✅)

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

---

## 8. Padrão Split Layout (track + craft)

### Estrutura

```
<div bg-bg-base h-screen overflow-hidden relative>

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
- Tagline: "Curious Designer" — Geist Light 40pt
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

---

## 11. Página: Craft (`/craft`)

*(estrutura inalterada — tag swipe/back reposicionada, ProjectSelector usa NavSelector underline, ver seções 7 e 8)*

### Password Gate (Selected Works) ✅ IMPLEMENTADO

*(inalterado — ver sessão 5)*

---

## 12. Pendências finais (Sessão 8 — próxima)

- [ ] **Responsivo (mobile/tablet)** ← próxima sessão, abrir branch `feat/mobile`
- [ ] **Selected Works — dados reais** — Doug exporta assets, Claude Code popula `data.ts`
- [ ] **Variável `NDA_PASSWORD` na Vercel** — adicionar no painel antes do deploy (`dvault`)
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

## 14. Arquivos do projeto (atualizado — sessão 6)

```
doug-lima/
├── .env.local                        # NDA_PASSWORD=dvault (não commitado)
├── app/
│   ├── components/
│   │   ├── Header.tsx                # Logo (hover swap) + NavSelector pill row
│   │   ├── NavSelector.tsx           # Seletor reutilizável: variant pill|underline, direction row|col
│   │   ├── PageLayout.tsx            # Layout padrão: paddings + header + footer items-center
│   │   ├── BlurOverlay.tsx           # Gradiente fade 185px
│   │   ├── ScrollColumn.tsx          # overflow-y-auto + BlurOverlay embutido
│   │   └── TimelineBlock.tsx         # Bloco da timeline (ano | texto | logo)
│   ├── hooks/
│   │   └── useSplitLayout.ts         # Hook split layout — IntersectionObserver p/ atEnd
│   ├── track/
│   │   └── page.tsx                  # Track completa ✅
│   ├── craft/
│   │   ├── actions.ts                # Server Action: verifyPassword
│   │   ├── data.ts                   # Tipos + dados dos projetos
│   │   ├── ProjectCarousel.tsx       # Coluna direita: info block + image displays
│   │   ├── ProjectSelector.tsx       # Seletor vertical — usa NavSelector underline
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
