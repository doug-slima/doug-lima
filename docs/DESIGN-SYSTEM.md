# Design System — douglima.work

> Documento vivo de arquitetura de UI, componentes, tokens e princípios de qualidade.
> Última atualização: 03 jun 2026

---

## 1. Filosofia

**Um componente é um contrato.** Define a aparência, o comportamento e a API de um elemento de UI de forma que qualquer page possa consumi-lo sem saber como ele funciona por dentro. Editar um componente propaga a mudança em todos os lugares — esse é o valor central.

**Regras de extração:**
- Extrai quando o padrão se repete em 2+ lugares (risco de inconsistência)
- Extrai quando o bloco ultrapassa ~50 linhas numa page (legibilidade)
- Mantém inline quando é genuinamente único e simples

---

## 2. Tokens de Design

Definidos em `app/globals.css` via `@theme`. Usar sempre o token — nunca o valor bruto em className.

### 2.1 Cores

| Token Tailwind | Variável CSS | Valor | Uso |
|---|---|---|---|
| `bg-bg-base` | `--color-bg-base` | `#F9F9F2` | Background geral |
| `text-text-default` | `--color-text-default` | `#5F6A50` | Texto padrão, ícones |
| `text-text-active` | `--color-text-active` | `#3B4028` | Texto ativo, hovers |
| `bg-surface-tag` | `--color-surface-tag` | `#F0EEE5` | Background de inputs |
| `text-text-muted` | `--color-text-muted` | `#A6AA97` | Texto inativo |

**Valores não-tokenizados (usar via inline style — não adicionar ao tema ainda):**

| Valor | Uso |
|---|---|
| `#313621` | Background dark (craft mobile outer/footer) |
| `#121210` | Background pill Prev/Next |
| `#FAFAF5` | Texto sobre fundos dark |
| `#F6F3E6` | Surface pill de controles (back to top, contact) |
| `#D0D1B3` | Border pill de controles |
| `#AFB4A7` | Border dropdown/ring |
| `#A6AA74` | Cor swipe indicator (opacidade 20%) |
| `#C7FF04` | Pill ativa no NavSelector |
| `#E8E9D9` | Hover pill NavSelector |
| `#DEDDCE` | Ring hover pill NavSelector |

### 2.2 Tipografia

| Font | Peso | Classe Tailwind | Uso |
|---|---|---|---|
| Geist | Light (300) | `font-geist font-light` | Bio text, label de cargo |
| Geist | Medium (500) | `font-geist font-medium` | Ano na timeline mobile |
| Geist | Semibold (600) | `font-geist font-semibold` | Label projeto, ano desktop |
| Fenix | Regular (400) | `font-fenix` | Nav, seletores, tags, labels |

**Escala de tamanhos em uso:**

| Tamanho | Contexto |
|---|---|
| `text-[18px]` | Tags mobile (back to top, prev/next, contact pills) |
| `text-[20px]` | Info block projeto, nav desktop label, swipe pill |
| `text-[24px]` | Nav header, seletores verticais, timeline desktop |
| `text-[28px]` | Bio mobile ("Curious Designer", "20 years...") |
| `text-[40px]` | Bio desktop, seção switcher desktop |

### 2.3 Espaçamento

| Valor | Classe | Uso principal |
|---|---|---|
| 8px | `gap-2` / `px-2` | Gap interno de pills |
| 12px | `gap-3` / `px-3` | Gap entre imagens mobile |
| 16px | `gap-4` / `p-4` | Gap seletores verticais |
| 24px | `gap-6` / `px-6` | Padding interno tags, gap timeline |
| 32px | `px-8` / `pb-8` | Padding base mobile |
| 40px | `px-10` / `pt-10` | Padding lateral mobile, pt header |
| 80px | `pt-20` / `pb-20` | Padding vertical desktop |
| 168px | `px-[10.5rem]` | Padding lateral desktop |

### 2.4 Raios de borda

| Valor | Uso |
|---|---|
| `rounded-full` | Todos os pills e tags |
| `rounded-xl` | Dropdown |
| `rounded-b-[24px]` | Card do carrossel mobile (apenas base) |
| `rounded-lg` | Inputs, fallback de logo |

### 2.5 Animações

Definidas em `globals.css`:

| Nome | Duração | Easing | Uso |
|---|---|---|---|
| `control-bar-enter` | 0.5s | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Entrada do back to top (spring) |
| `mosaic-scroll` | 120s | `linear infinite` | Background animado da home |

Transformação do card reveal (craft mobile):
- `transform: translateY(-104px)`, `transition: 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)`

---

## 3. Inventário de Componentes

### 3.1 Componentes extraídos ✅

| Nome semântico | Arquivo | Props principais | Usado em |
|---|---|---|---|
| `Header` | `components/Header.tsx` | — | craft, track, home (via PageLayout) |
| `NavSelector` | `components/NavSelector.tsx` | `items`, `variant`, `direction`, `gap` | Header, craft (pills + desktop selector) |
| `PageLayout` | `components/PageLayout.tsx` | `children`, `outerClassName`, `footerContent`, `backgroundLayers` | home |
| `BlurOverlay` | `components/BlurOverlay.tsx` | `className?` | ScrollColumn, home |
| `ScrollColumn` | `components/ScrollColumn.tsx` | `ref?`, `className?`, `style?`, `children` | craft desktop, track desktop |
| `TimelineBlock` | `components/TimelineBlock.tsx` | `year`, `lines`, `logo` | track desktop |
| `ProjectCarousel` | `craft/ProjectCarousel.tsx` | `project`, `rightColRef`, `firstItemRef`, `lastItemRef`, `rightColLeft`, `paddingTop`, `paddingBottom` | craft desktop |
| `ProjectSelector` | `craft/ProjectSelector.tsx` | `projects`, `activeProject`, `onSelect` | craft desktop |
| `MosaicBackground` | `components/MosaicBackground.tsx` | — | home |
| `Monogram` | `components/Monogram.tsx` | `size?: "sm" \| "lg"` | craft, track, home |
| `BackToTopButton` | `components/BackToTopButton.tsx` | `paddingBottom`, `zIndex?` | craft mobile, track mobile |
| `ControlPill` | `components/ControlPill.tsx` | `atEnd`, `onScrollToTop` | craft desktop, track desktop |
| `SectionDropdown` | `craft/SectionDropdown.tsx` | `activeSection`, `onSectionChange`, `isOpen`, `onOpen`, `onClose`, `containerRef` | craft mobile |
| `PrevNextBar` | `craft/PrevNextBar.tsx` | `onPrev`, `onNext`, `revealed` | craft mobile |
| `TimelineItem` | `components/TimelineItem.tsx` | `entry` (TimelineEntry) | track mobile |

### 3.2 Padrões a extrair (próximas iterações)

| Padrão | Onde está | Prioridade |
|---|---|---|
| `ProjectInfoBlock` | craft/page.tsx mobile + ProjectCarousel.tsx | Média |
| `ImageDisplay` | craft/page.tsx mobile + ProjectCarousel.tsx | Média |
| `ContactTag` | page.tsx (desktop pill + mobile overlay) | Baixa |

---

## 4. Specs de Componentes

### 4.1 `Header`

```
Mobile:  fixed top-0 z-40
         pt-10 (40px) → header py-6 (32px logo) → total sólido 120px → gradiente 24px = 144px total
Desktop: in-flow, flex items-start justify-between
```

**Regra:** `pt-[144px]` no content div das pages mobile. Craft usa `pt-[156px]` (12px extra).

---

### 4.2 `NavSelector`

**Variant `"pill"`** (header + seletores de projeto):
- 32px altura, `rounded-full`, `px-4`
- Mobile: `text-[20px]` / Desktop: `text-[24px]`
- Ativa: `bg-[#C7FF04]` (via inline style para evitar purge do Tailwind)
- Inativa: `ring-1 ring-[#AFB4A7]`, hover: `bg-[#E8E9D9]`

**Variant `"underline"`** (seletor vertical craft desktop):
- `font-fenix text-[24px]`
- Ativa: `underline decoration-text-active underline-offset-[3px]`

---

### 4.3 `Monogram`

SVG decorativo `dl-monogram.svg`.

| Size | Width | Height natural |
|---|---|---|
| `"sm"` (desktop) | `w-[88px]` | ~103px |
| `"lg"` (mobile) | `w-[104px]` | ~122px |

Sempre `alt=""` + `aria-hidden="true"` — elemento decorativo.

---

### 4.4 `BackToTopButton`

Tag mobile flutuante que aparece ao chegar no final do conteúdo.

```
fixed bottom-0 left-0 right-0
pointer-events: none no container (não bloquear elementos abaixo)
pointer-events: auto no botão

Estilo: h-[56px] px-5 rounded-full
Surface: #F6F3E6, border: 1px solid #D0D1B3
Shadow: 0px 4px 12px -8px rgba(0,0,0,0.25)
Font: font-fenix text-[18px] text-text-default
Animação: .control-bar-enter (spring entrance)
```

**Alinhamento (paddingBottom):** calculado para alinhar o centro vertical do botão com o centro do monograma.
- Track: `pb = 40(pb-10) + 61(monogram½) - 28(btn½) = 73px`
- Craft: `pb = 104(card jump) + 32(pb-8) + 61(monogram½) - 28(btn½) = 169px`

**Trigger:**
- Craft: mesmo que `footerRevealed` (scroll listener: `scrollY + innerHeight >= scrollHeight - 10`)
- Track: scroll listener igual

---

### 4.5 `ControlPill` (desktop)

Pill no canto inferior direito do split layout (craft e track desktop).

```
absolute bottom-[104px] right-[88px] z-20 pointer-events-auto
h-[56px] rounded-full bg-[#A6AA74]/20
font-fenix text-[20px] text-[#3B4028]
```

**Estado `swipe-up`** (default): `px-6`, texto "swipe-up to see more", `cursor-default`
**Estado `back to top`** (atEnd): `pl-6 pr-5 gap-2`, hover surface + ring, `<ArrowUp size={20} />`

**Alinhamento:** `bottom-[104px]` = `pb-20(80px) + monogram½(103/2≈52px) - btn½(28px) ≈ 104px`

---

### 4.6 `SectionDropdown` (craft mobile)

Dropdown para troca de seção (Playground ↔ Selected Works).

```
Trigger: font-geist font-light text-[24px] text-text-active
         invisible quando aberto (mantém espaço no layout)

Panel:   absolute top: -20, left: -20, z-30
         bg: #F6F3E6, border: 1px solid #AFB4A7
         rounded-xl, shadow leve
         padding interno: 20px / 8px entre itens
```

Click-outside handler via `useEffect` + `mousedown` no `document`.

---

### 4.7 `PrevNextBar` (craft mobile footer)

Footer dark com controles de navegação entre projetos.

```
fixed bottom-0 left-0 right-0 z-[20]  ← ATRÁS do card (z-30)
bg: #313621
pt-[24px] pb-[24px]

Pill interna: mx-10 h-[56px] rounded-full bg-[#121210]
Shadow: 0px 16px 48px -8px rgba(12,12,13,0.50)

Botões: font-fenix text-[18px] color: #FAFAF5
Ícones: CaretLeft / CaretRight size={18}
```

**Comportamento:** fica permanentemente fixo abaixo do card. O card (z-30) o cobre visualmente até o reveal (`footerRevealed = true` + `translateY(-104px)` no card). Ao clicar Prev/Next: troca projeto, reseta scroll para topo, `footerRevealed = false`.

---

### 4.8 `TimelineItem` (track mobile)

Linha individual da timeline na versão mobile.

```
flex row, items-center, gap-6, py-4
border-b border-[#DEDDCE], minHeight: "112px"

Esquerda:
  Ano:   font-geist font-medium text-[18px], w-[40px], flex-shrink-0
  Texto: flex-col, font-geist (bold/light/serif conforme style), text-[18px]
  Alinhamento ano: items-start para cargos simples / items-center para Teacher e Master's Degree

Direita:
  Logo:  w-[72px] flex items-center justify-end
  Sizing por grupo:
    ESPM, Olist, IED, Kyvo, iFood, Livework → w-[68px] h-auto
    Klauvi, Aprender Design, Hash, Unifei, Itaú → max-h-[48px] object-contain
    Mercado Livre → max-h-[40px] object-contain
    Default → max-h-[36px] object-contain
```

---

## 5. Arquitetura Mobile — Craft (`/craft`)

```
<div bg-[#313621]>                           ← outer dark wrapper
  <div card: z-30, translateY spring>        ← CarouselCard
    <Header />                               ← fixo, z-40
    <div px-10 pt-[156px] pb-8>
      <SectionDropdown />                    ← dropdown de seção
      <NavSelector variant="pill" />         ← seletores de projeto (scroll horizontal)
      [ProjectInfoBlock]                     ← info block (label + logo)
      [CarouselImageList]                    ← lista de imagens
      <Monogram size="lg" />                 ← monograma decorativo
    </div>
  </div>
</div>

<BackToTopButton paddingBottom={169} />      ← z-40, pointer-events passthrough
<PrevNextBar onPrev onNext />               ← z-20, atrás do card
```

**Z-index hierarchy:**
- `z-40`: Header (fixed), BackToTopButton
- `z-30`: CarouselCard, dropdown panel
- `z-20`: PrevNextBar (footer), ControlPill (desktop)

**Card reveal:**
- Scroll listener: `scrollY + innerHeight >= scrollHeight - 10` → `footerRevealed`
- `footerRevealed = true` → `translateY(-104px)` → footer visível, BackToTopButton aparece

---

## 6. Arquitetura Mobile — Track (`/track`)

```
<div bg-bg-base min-h-screen>
  <Header />
  <div px-10 pt-[144px] pb-10>
    <p>"20 years across...">               ← bio, font-geist font-light text-[28px]
    <p>"a few steps:">                     ← label, font-fenix text-[20px]
    <div -mx-2 flex flex-col>
      {timeline.map(entry => <TimelineItem entry={entry} />)}
    </div>
    <Monogram size="lg" />
  </div>
</div>

<BackToTopButton paddingBottom={73} />      ← z-30, aparece no final do scroll
```

---

## 7. Arquitetura Desktop — Split Layout (craft + track)

```
<div h-dvh overflow-hidden relative>
  <ScrollColumn ref=rightColRef absolute inset-y-0 right-0 z-0>
    <div gap-[Xpx] pr-[10.5rem] paddingTop paddingBottom>
      <div ref=firstItemRef>…</div>
      …
      <div ref=lastItemRef>…</div>
    </div>
  </ScrollColumn>

  <div pointer-events-none z-10 px-[10.5rem] pt-20 pb-20 h-full flex-col>
    <Header />
    <div ref=leftContentRef flex-1 flex-col justify-between>
      {/* topo: bio / seção */}
      {/* base: Monogram size="sm" */}
    </div>
    {/* centro absoluto: label ou ProjectSelector */}
  </div>

  <ControlPill atEnd={atEnd} onScrollToTop={scrollToTop} />
</div>
```

---

## 8. Princípios de Qualidade

### 8.1 A11y (acessibilidade)

- **Touch targets:** mínimo 44×44px (WCAG 2.5.5). Todos os botões mobile têm `h-[56px]` ✓
- **Elementos decorativos:** sempre `alt=""` + `aria-hidden="true"` (monograma, avatar hover) ✓
- **`aria-expanded`:** em dropdowns (SectionDropdown) ✓
- **`aria-label`:** em icon-only inputs — `PasswordInput` tem `aria-label="NDA password"` ✓
- **`prefers-reduced-motion`:** em globals.css — desativa `control-bar-enter`, `.card-reveal` e todas as transitions/animations ✓
- **Foco ao fechar overlay:** `SectionDropdown.close()` retorna foco ao trigger via `triggerRef.current?.focus()` ✓
- **Focus rings:** `:focus-visible { outline: 2px solid #3B4028; outline-offset: 2px }` em globals.css ✓

### 8.2 Performance

- **Imagens:** usar `<img>` com path absoluto para assets estáticos em `public/`. `next/image` adiciona overhead desnecessário para assets que já estão otimizados manualmente.
- **Animações:** sempre `transform` e `opacity` — nunca `width`, `height`, `margin` (causam layout reflow)
- **Tailwind purge:** classes com valores arbitrários em template literals são purgadas. Usar inline `style` para valores dinâmicos ou condicionais.

### 8.3 Responsividade

- **Mobile-first:** base styles para mobile, `md:` override para desktop
- **Viewport height:** sempre `h-dvh` (não `h-screen`) para layouts full-height mobile — adapta ao chrome do browser iOS
- **Scroll lateral full-bleed:** `-mx-[padding] px-[padding]` no container filho para scroll até a borda do viewport

### 8.4 Manutenção

- **Inline style para valores críticos:** cores de background específicas da identidade dark (`#313621`, `#121210`) e box-shadows ficam em inline style — evita purge e centraliza no componente
- **Tailwind para spacing e layout:** `flex`, `grid`, `gap`, `p`, `m`, `rounded`, `text-*`, `font-*`
- **Token ou inline — nunca hardcoded em className arbitrário condicional:** ex: `${active ? "bg-[#C7FF04]" : ""}` é purgado. Usar `style={active ? { backgroundColor: "#C7FF04" } : undefined}`

---

## 9. Convenções de Nomenclatura

| Tipo | Convenção | Exemplo |
|---|---|---|
| Componente compartilhado | PascalCase | `BackToTopButton.tsx` |
| Componente de feature | PascalCase dentro de pasta de feature | `craft/SectionDropdown.tsx` |
| Hook | camelCase prefixado com `use` | `useSplitLayout.ts` |
| Tipo/interface | PascalCase | `TimelineEntry` |
| Constante de estilo | camelCase | `pillStyle` |
| Arquivo de dados | camelCase | `data.ts` |

---

## 10. Estrutura de Arquivos (atualizada)

```
app/
  components/
    BackToTopButton.tsx      ← novo
    BlurOverlay.tsx
    ControlPill.tsx          ← novo
    Header.tsx
    MosaicBackground.tsx
    Monogram.tsx             ← novo
    NavSelector.tsx
    PageLayout.tsx
    ScrollColumn.tsx
    TimelineBlock.tsx        ← desktop
    TimelineItem.tsx         ← novo (mobile)
  hooks/
    useSplitLayout.ts
  craft/
    PrevNextBar.tsx          ← novo
    SectionDropdown.tsx      ← novo
    ProjectCarousel.tsx
    ProjectSelector.tsx
    PasswordGate.tsx         ← reescrito sessão 11 — ativo
    actions.ts
    data.ts
    page.tsx
  track/
    page.tsx
  page.tsx
  globals.css
  layout.tsx
docs/
  DESIGN-SYSTEM.md           ← este arquivo
  SESSION-HANDOFF-PORTFOLIO.md
  PRD-*.md
```
