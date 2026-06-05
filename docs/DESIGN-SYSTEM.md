# Design System — douglima.work

> Documento vivo de arquitetura de UI, componentes, tokens e princípios de qualidade.
> Última atualização: 05 jun 2026 — Sessão 23 (AsciiShader — bg animado home; header transparente na home)

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
| `text-[clamp(28px,7.5vw,32px)]` | Bio mobile ("Curious Designer", "20 years...") — fluid 28px@375px→32px@430px |
| `text-[40px]` | Bio desktop, seção switcher desktop |

### 2.3 Espaçamento

| Valor | Classe | Uso principal |
|---|---|---|
| 8px | `gap-2` / `px-2` | Gap interno de pills |
| 12px | `gap-3` / `px-3` | Gap entre imagens mobile |
| 16px | `gap-4` / `p-4` | Gap seletores verticais |
| 24px | `gap-6` / `px-6` | Padding interno tags, gap timeline |
| 32px | `px-8` | Padding lateral mobile (conteúdo e header) |
| 12px (móvel) → 13-15px fluid | `px-[clamp(12px,3.5vw,20px)]` | Padding lateral pills mobile |
| 44px | `pt-[44px]` | Padding superior header mobile |
| 72px | `px-[72px]` | Padding lateral header, footer, home desktop |
| 80px | `pt-20` / `pb-20` | Padding vertical desktop (footer `py-20`) |
| 168px | `px-[10.5rem]` | Padding lateral craft desktop content |
| 300px | `px-[300px]` | Padding lateral track desktop content |

### 2.4 Raios de borda

| Valor | Uso |
|---|---|
| `rounded-full` | Todos os pills e tags |
| `rounded-xl` | Dropdown |
| `rounded-b-[24px]` | Card do carrossel mobile (apenas base) |
| `rounded-lg` | Inputs, fallback de logo |

### 2.5 CSS Custom Properties

Definidas em `app/globals.css` fora do `@theme`:

| Propriedade | Mobile | Desktop (≥768px) | Uso |
|---|---|---|---|
| `--header-h` | `clamp(108px, calc(80px + 7.5vw), 112px)` | `72px` | Padding-top do conteúdo mobile — cascade automático |

**Classe `.page-content-pt`** (em `globals.css`):
```css
.page-content-pt { padding-top: var(--header-h); }
@media (min-width: 768px) { .page-content-pt { padding-top: 72px; } }
```
Usada em `PageLayout` para garantir que o desktop receba `72px` explícito independente da resolução da CSS variable.

---

### 2.6 Animações

Definidas em `globals.css`:

| Nome | Duração | Easing | Uso |
|---|---|---|---|
| `control-bar-enter` | 0.5s | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Entrada do back to top mobile (spring) |
| `monogram-enter` | 0.6s | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrada do monograma no footer desktop (scale 0.82→1 + opacity 0→1) |
| `mosaic-scroll` | 120s | `linear infinite` | ⚠️ DEPRECATED — substituído por `AsciiShader` |

Transformação do card reveal (craft mobile):
- CSS class `.card-reveal` em `globals.css` (afetada por `prefers-reduced-motion`)
- `transform: translateY(-104px)`, `transition: 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)`

---

## 3. Inventário de Componentes

### 3.1 Componentes ativos ✅

| Nome semântico | Arquivo | Props principais | Usado em |
|---|---|---|---|
| `Header` | `components/Header.tsx` | `block2?` | craft, track, home (via PageLayout) |
| `NavSelector` | `components/NavSelector.tsx` | `items`, `variant`, `gap`, `textSize`, `pillHeight` | Header, craft mobile |
| `PageLayout` | `components/PageLayout.tsx` | `children`, `outerClassName`, `footerContent`, `backgroundLayers` | home |
| `PageFooter` | `components/PageFooter.tsx` | `variant?`, `scrollRef?`, `center?`, `right` | craft desktop, track desktop, home (via PageLayout) |
| `BlurOverlay` | `components/BlurOverlay.tsx` | `height?`, `solidUntil?` | craft, track (não usado na home — ver §4.1) |
| `AsciiShader` | `components/AsciiShader.tsx` | `config`, `svgScale?`, `theme?`, `svgPath?`, `svgWidth?`, `svgHeight?`, `colorFn?` | home (substitui MosaicBackground) |
| `TimelineBlock` | `components/TimelineBlock.tsx` | `year`, `lines`, `logo` | track desktop |
| `MosaicBackground` | `components/MosaicBackground.tsx` | — | ⚠️ DEPRECATED — substituído por `AsciiShader` |
| `Monogram` | `components/Monogram.tsx` | `widthClass`, `className?` | craft mobile, track mobile, home (via PageFooter) |
| `BackToTopButton` | `components/BackToTopButton.tsx` | `paddingBottom`, `zIndex?` | craft mobile |
| `ContactButton` | `components/ContactButton.tsx` | — | home |
| `SectionDropdown` | `craft/SectionDropdown.tsx` | `activeSection`, `onSectionChange` | craft (mobile e desktop — componente unificado com matchMedia interno) |
| `PrevNextBar` | `craft/PrevNextBar.tsx` | `onPrev`, `onNext` | craft mobile |
| `TimelineItem` | `components/TimelineItem.tsx` | `entry` (TimelineEntry) | track mobile |
| `PasswordGate` | `craft/PasswordGate.tsx` | `value`, `onChange`, `onSubmit`, `onCancel`, `error` | craft (mobile e desktop) |

### 3.2 Hooks ativos ✅

| Hook | Arquivo | Responsabilidade | Usado em |
|---|---|---|---|
| `useScrollParallax` | `hooks/useScrollParallax.ts` | Parallax scroll-driven em elemento in-flow | craft desktop, track desktop |

### 3.3 Deprecated ⚠️ (deletar na limpeza final)

| Arquivo | Motivo |
|---|---|
| `components/ScrollColumn.tsx` | Substituído por scroll container direto (`div absolute inset-0 overflow-y-auto`) |
| `components/ControlPill.tsx` | Substituído por `FooterBackToTop` (exportado de `PageFooter`) |
| `hooks/useSplitLayout.ts` | Substituído por arquitetura de scroll container |
| `hooks/useFooterAnimation.ts` | Substituído por `useScrollParallax` + footer inline |
| `craft/ProjectCarousel.tsx` | Conteúdo renderizado inline em `craft/page.tsx` |
| `craft/ProjectSelector.tsx` | Seletores migrados para o header via `block2` prop |

---

## 4. Specs de Componentes

### 4.1 `Header`

**Props:** `block2?: React.ReactNode` — bloco secundário abaixo do PageNav (craft only).

```
Mobile:  fixed top-0 z-40, px-8 (32px lateral), pt-[44px] (44px superior)
         Logo h-[clamp(28px,7.5vw,32px)] (fluid: 28px@375→32px@430) + pb-3 (12px) + gradiente 24px
         --header-h = clamp(108px, calc(80px + 7.5vw), 112px) → cascade automático
Desktop (via PageLayout): in-flow, padding-top via .page-content-pt = 72px
Desktop (craft/track): floating, pointer-events-none wrapper z-10, px-[72px] pt-[72px]
```

**Dois blocos:**
- **PageNav** (sempre presente): lettering SVG `h-[clamp(28px,7.5vw,32px)] md:h-[40px]` + NavSelector pills `h-[clamp(28px,7.5vw,32px)] md:h-[40px]` `px-[clamp(12px,3.5vw,20px)] md:px-5` `gap={12}`
- **block2** (opcional, craft desktop): `SectionDropdown` + NavSelector `text-[18px]`

#### Regras de transparência — home (`/`) only

O Header detecta a rota via `usePathname()` e aplica variantes exclusivas da home. Estas regras **não se propagam** para `/craft` ou `/track`.

| Elemento | Outras páginas | Home (`/`) |
|---|---|---|
| Mobile bg (`pointer-events-auto` div) | `bg-bg-base` | sem background (transparente) |
| Mobile blur gradient (24px abaixo do bg) | `linear-gradient(#F9F9F2 → transparent)` | não renderizado |

```tsx
// Header.tsx — padrão implementado
const isHome = pathname === "/"

// bg
<div className={`pointer-events-auto px-8 pt-[44px] ${isHome ? "" : "bg-bg-base"}`}>

// gradiente
{!isHome && <div style={{ height: "24px", background: "linear-gradient(...)" }} />}
```

**Motivação:** na home o `AsciiShader` cobre o fundo inteiro. O `bg-bg-base` e o gradiente opacariam o efeito. Nas outras páginas o header precisa de fundo para separar visualmente do conteúdo que scroll por baixo.

**BlurOverlay:** não é passado como `backgroundLayers` na home (`page.tsx`) pelo mesmo motivo — seria uma camada opaca sobre o shader. Craft e Track continuam a usá-lo normalmente.

---

### 4.2 `NavSelector`

**Variant `"pill"`** (header + seletores de projeto):
- Altura configurável via `pillHeight` prop — default: `h-[32px]`; `h-[40px]` no PageNav do header
- `rounded-full`, `px-[clamp(12px,3.5vw,20px)] md:px-5` (fluid mobile, fixo desktop), `font-fenix`
- Ativa: `bg-[#C7FF04]` (via inline style — evita purge do Tailwind)
- Inativa hover: `bg-[#E8E9D9]`, `text-text-active`
- `textSize` prop — default: `text-[20px] md:text-[24px]`; `text-[18px]` nos seletores de projeto do block2

**Surface default na home (`/`):**
Pills inativas usam `bg-[#F9F9F2]` no estado default — necessário porque o canvas `AsciiShader` é transparente e as pills precisam de fundo opaco para legibilidade. Aplica-se a mobile e desktop. Os estados hover e active permanecem inalterados.

```
Default (home): bg-[#F9F9F2] + ring-inset ring-1 ring-[#AFB4A7]
Hover:          bg-[#E8E9D9] + ring-0
Active:         bg-[#C7FF04]
```

**Variant `"underline"`:**
- `font-fenix text-[24px]`
- Ativa: `underline decoration-text-active underline-offset-[3px]`

**Usos por contexto:**

| Contexto | textSize | pillHeight | gap |
|---|---|---|---|
| Header PageNav (Craft/Track) | default | `h-[clamp(28px,7.5vw,32px)] md:h-[40px]` | 12 |
| Header block2 (project selectors) | `text-[18px]` | default `h-[32px]` | 8 |
| Mobile craft (project selectors) | default | default | 8 |

---

### 4.3 `Monogram`

SVG decorativo `dl-monogram.svg`. Sempre `alt=""` + `aria-hidden="true"`.

Aceita `widthClass` (string de classe Tailwind, ex: `"w-[123px]"`) e `className?` para classes adicionais.

| widthClass | Uso |
|---|---|
| `w-[123px]` | Mobile (craft, track, home) |
| `w-[154px]` | Desktop via PageFooter (`md:w-[154px]`) |

---

### 4.4 `BackToTopButton` (craft mobile only)

Botão flutuante "back to top" para mobile.

```
fixed bottom-0 left-0 right-0, md:hidden
pointer-events: none no container, pointer-events: auto no botão

h-[56px] pl-6 pr-5 rounded-full
Surface: transparente, border: 1px solid #AFB4A7
Shadow: 0px 4px 12px -8px rgba(0,0,0,0.25)
Font: font-fenix text-[20px] text-text-default
Hover:  bg-[#E8E9D9], border-transparent
Active: bg-[#C7FF04], border-transparent
Animação: .control-bar-enter (spring entrance)
```

**Trigger:** scroll listener `scrollY + innerHeight >= scrollHeight − 10` → `footerRevealed`.

---

### 4.5 `ControlPill` ⚠️ DEPRECATED

Substituído por `FooterBackToTop` (exportado de `PageFooter`). Arquivo pode ser deletado.

---

### 4.6 `PageFooter` (desktop)

Footer unificado. `forwardRef` — ref passada para `useScrollParallax`.

```
Variant "floating" (legado — mantido mas não usado nas pages atuais):
  absolute bottom-0 left-0 right-0 z-20 bg-bg-base
  grid grid-cols-3 items-center px-[72px] py-20
  onWheel forwarding para scrollRef
  Slots: Monogram (esq) | center? (centro) | right (dir)

Variant "inline" (craft desktop + track desktop):
  bg-bg-base
  grid grid-cols-3 items-center px-[72px] py-20
  In-flow dentro do scroll container, sem z-index
  Slots: Monogram (esq) | center? (centro) | right (dir)

Variant "static" (home via PageLayout):
  mt-auto flex items-center justify-between
  Slots: Monogram (esq) | right (dir)
  Sem onWheel, sem animação
```

**`FooterBackToTop`** (exportado de `PageFooter.tsx`):
```
h-[56px] pl-6 pr-5 rounded-full
Font: font-fenix text-[20px] text-text-default
Default: border border-[#AFB4A7], sem fundo
Hover:   bg-[#E8E9D9], border-transparent
Active:  bg-[#C7FF04], border-transparent
```

---

### 4.7 `ContactButton` (home)

Botão de contato autocontido. `position: relative` no container, `absolute bottom-0 right-0` no painel — ancoragem ao trigger sem coordenadas de viewport.

```
Trigger: w-[104px] h-[104px] rounded-full, bg-transparent
         md:hover:bg-[#E8E9D9] (desktop only)
         Avatar: h-[56px] w-[56px]
         Aberto: avatar-doug-hi.png, bg-[#C7FF04]

Backdrop: fixed inset-0 z-40, rgba(243,242,230,0.10)

Pills (LinkedIn, Substack, Email):
  w-fit h-[56px] px-5 rounded-full
  font-fenix text-[18px] text-text-default
  Default: bg-[#F9F9F2] + border border-[#AFB4A7] + shadow 0px 4px 12px -8px rgba(0,0,0,0.25)
  Hover:   bg-[#E8E9D9], border-transparent
  Active:  bg-[#C7FF04], border-transparent

  Nota: bg-[#F9F9F2] aplica-se a mobile e desktop — o painel de pills é o mesmo componente
  em ambos os breakpoints. O fundo opaco é necessário sobre o AsciiShader transparente.
```

**`w-fit` por pill:** cada botão hug seu próprio conteúdo, independente da largura dos outros.

**Focus management:** abre → foca LinkedIn (`firstPillRef`); fecha → retorna foco ao trigger (`triggerRef`).

---

### 4.8 `SectionDropdown` (craft — mobile e desktop unificado)

Dropdown de seleção de seção (Playground ↔ Selected Works). Um único componente para ambos os breakpoints — usa `matchMedia` internamente para adaptar alturas e raios.

```
Trigger height: 48px mobile / 56px desktop (TRIGGER_HEIGHT constante)
Open radius:    24px mobile / 28px desktop (OPEN_RADIUS = height / 2)

Pill escuro: bg-[#121210]
  Fechado: rounded-full
  Aberto:  border-radius = openRadius (proporcional à altura)
  Shadow aberto: 0px 4px 12px -8px rgba(0,0,0,0.25)

Trigger button: font-geist font-light text-[18px]
  Cor: #FAFAF5 default / #C7FF04 hover ou aberto
  Ícone: CaretRight (fechado) / CaretDown (aberto)

Opção alternativa: colapsa a height:0 quando fechada — mantém largura do container
  estável (sem resize ao abrir). paddingBottom: 0 fechado / 16px aberto.
  Cor: #FAFAF5 default / #C7FF04 hover
```

**Width equalization:** um `div` invisível `height:0; overflow:hidden` com o texto mais longo (`"Selected Works"`) sempre presente no DOM — garante que o container nunca mude de largura ao alternar opções.

**Outside click:** `mousedown` listener no `document`, removido quando `!isOpen`.

---

### 4.9 `PrevNextBar` (craft mobile footer)

Footer dark com controles de navegação entre projetos.

```
fixed bottom-0 left-0 right-0 z-[20]  ← ATRÁS do card (z-30)
bg: #313621
pt-[24px] pb-[24px]

Pill interna: mx-10 h-[56px] rounded-full bg-[#121210]
Shadow: 0px 16px 48px -8px rgba(12,12,13,0.50)

Botões: font-geist font-light text-[18px] text-[#FAFAF5] hover:text-[#C7FF04]
Ícones: CaretLeft / CaretRight size={18} — herdam cor via currentColor
```

**Comportamento:** fica permanentemente fixo abaixo do card. O card (z-30) o cobre visualmente até o reveal (`footerRevealed = true` + `translateY(-104px)` no card). Ao clicar Prev/Next: troca projeto, reseta scroll para topo, `footerRevealed = false`.

---

### 4.10 `TimelineItem` (track mobile)

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

### 4.11 `PasswordGate` (craft)

Modal de autenticação NDA. Renderizado inline na página (não usa `portal`).

```
Mobile: ocupa o espaço do card, centralizado verticalmente
Desktop: absolute inset-0, backdrop blur, z-30

Input: font-geist font-light text-[18px], bg-surface-tag rounded-lg
Botão submit: pill #121210, texto #FAFAF5, hover text-[#C7FF04]
Botão cancel: texto text-text-muted, hover text-text-default
Error state: texto vermelho abaixo do input
```

**Escape fecha** e volta para a seção "playground" (listener no `useEffect` da page).

---

### 4.12 `AsciiShader` (home background)

**Arquivo:** `components/AsciiShader.tsx`

Renderizador ASCII density-mapped com interactividade de mouse. Substitui `MosaicBackground` como background animado da home. Canvas 2D, sem WebGL.

#### Como funciona

```
1. Rasterização (init, uma vez):
   SVG path → canvas offscreen → pixel mask → amostragem por célula
   Cada célula acumula: density (pontos que caíram nela) + edgeFactor (dist. à borda)

2. Render por frame:
   brightness = density×0.5 + edgeFactor×0.3 + wave×waveIntensity×0.3
   alpha       = alphaDefault + (alphaActive − alphaDefault) × mouseInfluence
   char        = CHAR_RAMP[ floor(brightness × (len−1)) ]

3. Física (swipe rápido > speedThresh px/s):
   Chars próximos ao cursor "arrancam" com velocidade inicial, gravidade, drag e tumble
```

#### Scaling por breakpoint

```
Desktop (≥768px): scale = viewportWidth  / svgWidth   → shape preenche largura toda
Mobile  (<768px): scale = viewportHeight / svgHeight  → shape preenche altura toda
Ambos centrados: offsetX = (W − svgW×scale) / 2,  offsetY = (H − svgH×scale) / 2
Overflow cortado pelo overflow:hidden do container
```

#### Props

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `config` | `AsciiConfig` | — | Obrigatório. Usar `DEFAULT_CONFIG` exportado |
| `svgScale` | `number` | `1` | Multiplicador sobre o scale base de breakpoint |
| `theme` | `"light" \| "dark"` | `"dark"` | Controla `clearRect` vs `fillRect` de bg |
| `svgPath` | `string` | wordmark interno | Path SVG a rasterizar |
| `svgWidth` | `number` | `1441` | Largura do viewBox do SVG |
| `svgHeight` | `number` | `1024` | Altura do viewBox do SVG |
| `colorFn` | `(x,y,w,h) => "r,g,b"` | `() => "195,197,178"` | Cor dos chars como string `"r,g,b"`. Retorna sempre a mesma cor para mono; pode variar por posição para gradientes |

#### `DEFAULT_CONFIG`

| Chave | Valor | Efeito |
|---|---|---|
| `cellSize` | `16` | Tamanho de cada célula em px (aumentar = chars maiores, grid mais esparsa) |
| `speed` | `0.55` | Velocidade da onda de tempo |
| `waveFreq` | `1.8` | Frequência espacial da onda |
| `waveIntensity` | `1.2` | Amplitude da onda — controla quanto o flicker idle é visível |
| `mouseRadius` | `150` | Raio de influência do cursor (px) |
| `flickerRate` | `5` | Taxa de ciclo do noise estocástico (requer `noiseAmount > 0`) |
| `noiseAmount` | `0` | Intensidade de noise aleatório — 0 = desativado |
| `scanlines` | `0.46` | Opacidade das scanlines (estilo CRT). 0 = sem scanlines |
| `charSet` | `0` | `0` = `" .-+X#"` (minimal), `1` = `" ._-~:;=!*#$@"` (code), `2` = `" ░▒▓█"` (blocks) |

#### Controlo de alpha (light theme)

```
alphaDefault = 0.08 + brightness × 0.42   → idle, sem mouse: [0.08, 0.50]
alphaActive  = 0.20 + brightness × 0.75   → cursor próximo:  [0.20, 0.95]
alpha = alphaDefault + (alphaActive − alphaDefault) × mouseInfluence
```

#### Uso na home

```tsx
// app/page.tsx
<AsciiShader
  config={DEFAULT_CONFIG}
  theme="light"         // clearRect → canvas transparente
/>
```

Canvas tem `background: transparent` e `alpha: true` no context — o `bg-bg-base` do `PageLayout` aparece por baixo. Não usar `BlurOverlay` junto (cobriria o shader).

#### Backgrounds de legibilidade — home (`/`) only

Como o canvas é transparente, os elementos de conteúdo que ficam sobre o shader precisam de `bg-[#F9F9F2]` para manter legibilidade quando os chars animados passam por baixo. Regra: `w-fit` garante que o fundo só cobre a área do elemento, não a linha inteira.

| Elemento | Onde | Implementação |
|---|---|---|
| Logo (svg lettering) | `Header.tsx` → `PageNav` | `isHome` via `usePathname()` → `bg-[#F9F9F2]` no `<Link>` |
| "Curious Designer" | `page.tsx` | `w-fit bg-[#F9F9F2]` no `<div className="md:mt-8">` |
| Monograma | `PageFooter.tsx` → variant `"static"` | `<div className="w-fit bg-[#F9F9F2]">` wrapper em volta do `<Monogram>` |

```tsx
// Header.tsx — PageNav
const isHome = pathname === "/"
<Link href="/" className={`group${isHome ? " bg-[#F9F9F2]" : ""}`}>

// page.tsx
<div className="md:mt-8 w-fit bg-[#F9F9F2]">
  <p>Curious<br/>Designer</p>
</div>

// PageFooter.tsx — static variant (home only)
<div className="w-fit bg-[#F9F9F2]">
  <Monogram widthClass="w-[123px] md:w-[154px]" />
</div>
```

**Por que só `"static"` no PageFooter:** as variantes `"inline"` e `"floating"` (craft e track) têm `bg-bg-base` no container — o monograma já tem fundo. Só a home usa `"static"` sem bg de container.

#### Para usar com novo SVG

```tsx
// 1. Colocar o SVG em public/assets/
// 2. Ler o conteúdo do atributo `d` do path principal
// 3. Passar via props:
<AsciiShader
  config={DEFAULT_CONFIG}
  theme="light"
  svgPath={meuPath}
  svgWidth={viewBoxWidth}
  svgHeight={viewBoxHeight}
/>
```

---

## 5. Hooks

### 5.1 `useScrollParallax`

**Arquivo:** `hooks/useScrollParallax.ts`

Parallax scroll-driven para elementos in-flow dentro de um scroll container customizado.

**Fórmula:** `translateY = factor × (scrollTop − scrollMax)` — sempre ≤ 0.

O elemento é puxado para acima da sua posição natural, de modo que:
- **Entrada** (scroll para baixo): aparece por trás do conteúdo acima antes do esperado
- **Saída** (scroll para cima): permanece visível mais tempo enquanto o conteúdo com z-index maior desce sobre ele

**Props:**

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `elementRef` | `RefObject<HTMLElement>` | — | Elemento que receberá o `translateY` |
| `scrollRef` | `RefObject<HTMLDivElement>` | — | Scroll container (fonte do evento) |
| `factor` | `number` | `0.4` | Intensidade: 0 = sem parallax, 1 = estático |
| `resetKey` | `string` | `""` | Resetar quando trocar projeto/seção |

**Responsabilidade do caller (z-index):**
```
scroll container:  isolation: isolate
conteúdo acima:    position: relative; z-index: 10
elemento parallax: sem z-index (z-auto — fica atrás do conteúdo)
```

---

## 6. Arquitetura Mobile — Craft (`/craft`)

```
<div bg-[#313621]>                           ← outer dark wrapper
  <Header />                                 ← fixo, z-40
  <div card: z-30, translateY spring>        ← card com card-reveal transition
    <div px-8 pb-8 style={paddingTop: "var(--header-h)"}>
      <SectionDropdown />                    ← dropdown de seção (matchMedia interno)
      <div -mx-8 px-8 overflow-x-auto>
        <NavSelector variant="pill" />       ← seletores de projeto (scroll horizontal)
      </div>
      {/* info block inline: h-[120px], logo h-[56px] w-auto */}
      {/* imagens inline: -mx-5, gap-3 → 12px nas laterais (alinhado com gap) */}
      <Monogram widthClass="w-[123px]" />   ← monograma decorativo
    </div>
  </div>
</div>

<BackToTopButton paddingBottom={180} zIndex={40} />  ← aparece quando footerRevealed
<PrevNextBar onPrev onNext />                        ← z-20, atrás do card
```

**Z-index hierarchy:**
- `z-40`: Header (fixed), BackToTopButton
- `z-30`: card do carrossel
- `z-20`: PrevNextBar (footer dark)

**Card reveal:**
- Scroll listener `window`: `scrollY + innerHeight >= scrollHeight − 10` → `footerRevealed`
- `footerRevealed = true` → `translateY(-104px)` → PrevNextBar visível, BackToTopButton aparece

---

## 7. Arquitetura Mobile — Track (`/track`)

```
<div bg-bg-base min-h-screen>
  <Header />
  <div px-8 pb-10 style={paddingTop: "var(--header-h)"}>
    <p>"20 years across...">               ← Geist Light text-[clamp(28px,7.5vw,32px)]
    <div flex flex-col>
      {timeline.map(entry => <TimelineItem entry={entry} />)}
    </div>
    <Monogram widthClass="w-[123px]" className="mt-12" />
  </div>
</div>
<BackToTopButton paddingBottom={73} />
```

---

## 8. Arquitetura Desktop — Inline Footer + Parallax (craft + track)

Padrão adotado na sessão 17. O footer flutuante (`absolute bottom-0`) foi substituído por um footer **in-flow** dentro do scroll container, com parallax via `useScrollParallax`.

```
<div bg-bg-base h-dvh overflow-hidden relative>

  {/* 1. BlurOverlay — fades conteúdo que sobe atrás do header */}
  <BlurOverlay height={N} solidUntil="X%" />

  {/* 2. Scroll container — isolation: isolate para escopo de z-index */}
  <div ref={scrollRef} className="absolute inset-0 overflow-y-auto"
       style={{ isolation: "isolate" }}>

    {/* 3. Conteúdo principal — z-10 para ficar acima do footer no exit */}
    <div className="relative z-10 px-[N]" style={{ paddingTop: "Npx" }}>
      …conteúdo…
    </div>

    {/* 4. Footer in-flow — z-auto, fica atrás do conteúdo (z-10) */}
    <PageFooter ref={footerRef} variant="inline" center={...} right={...} />

  </div>

  {/* 5. Header flutuante — z-10 no contexto do outer container */}
  <div className="pointer-events-none absolute top-0 inset-x-0 z-10 px-[72px] pt-[72px]">
    <div className="pointer-events-auto">
      <Header block2={...} />
    </div>
  </div>

</div>
```

**Por que `isolation: isolate` no scroll container:**
Cria um stacking context isolado. O `z-10` do conteúdo e o `z-auto` do footer são avaliados apenas dentro desse contexto — não interferem com o header (z-10 no outer container) nem com outros elementos da página.

**Como o parallax cria o efeito "carrossel passa sobre o footer":**
- Footer com `translateY = factor × (scrollTop − scrollMax)` → sempre acima da posição natural
- Na saída (scroll para cima): footer sobe mais devagar que o carrossel
- Conteúdo principal (z-10) desce sobre o footer (z-auto) → efeito de sobreposição visual

**`useScrollParallax` no caller:**
```ts
useScrollParallax({ elementRef: footerRef, scrollRef, factor: 0.4, resetKey: activeProject });
```

### Valores por página

| Elemento | Track | Craft |
|---|---|---|
| Content `paddingTop` | `160px` | `200px` |
| Content `px` | `px-[300px]` | `px-[10.5rem]` |
| BlurOverlay `height` | 185 (default) | 280 |
| BlurOverlay `solidUntil` | "65%" (default) | "80%" |
| Header `block2` | — | SectionDropdown + NavSelector |
| Footer `center` | — | Prev/Next pill `w-[296px]` |
| Footer `right` | FooterBackToTop | FooterBackToTop |
| `resetKey` | — | `activeProject` |

---

## 9. Princípios de Qualidade

### 9.1 A11y (acessibilidade)

- **Touch targets:** mínimo 44×44px (WCAG 2.5.5). Todos os botões mobile têm `h-[56px]` ✓
- **Elementos decorativos:** sempre `alt=""` + `aria-hidden="true"` (monograma, avatar hover) ✓
- **`aria-expanded`:** em dropdowns (SectionDropdown) ✓
- **`aria-label`:** em icon-only inputs — `PasswordInput` tem `aria-label="NDA password"` ✓
- **`prefers-reduced-motion`:** em globals.css — desativa `control-bar-enter`, `.card-reveal` e todas as transitions/animations ✓
- **Foco ao fechar overlay:** `SectionDropdown.close()` retorna foco ao trigger via `triggerRef.current?.focus()` ✓
- **Focus rings:** `:focus-visible { outline: 2px solid #3B4028; outline-offset: 2px }` em globals.css ✓

### 9.2 Performance

- **Imagens:** usar `<img>` com path absoluto para assets estáticos em `public/`. `next/image` adiciona overhead desnecessário para assets que já estão otimizados manualmente.
- **Animações:** sempre `transform` e `opacity` — nunca `width`, `height`, `margin` (causam layout reflow)
- **Tailwind purge:** classes com valores arbitrários em template literals são purgadas. Usar inline `style` para valores dinâmicos ou condicionais.

### 9.3 Responsividade

- **Mobile-first:** base styles para mobile, `md:` override para desktop
- **Viewport height:** sempre `h-dvh` (não `h-screen`) para layouts full-height mobile — adapta ao chrome do browser iOS
- **Scroll lateral full-bleed:** `-mx-[padding] px-[padding]` no container filho para scroll até a borda do viewport
- **Fluid scaling com `clamp()`:** elementos mobile escalam suavemente entre 375px e 767px sem breakpoint jumps. Fórmula: `clamp(min, Nvw, max)` — min a 375px, max a 430-767px.
- **CSS custom property cascade `--header-h`:** altura do header mobile definida em `:root` como `clamp(108px, calc(80px + 7.5vw), 112px)`. Conteúdo usa `style={{ paddingTop: "var(--header-h)" }}` para cascade automático. Desktop override via `.page-content-pt` CSS class (72px explícito) e `@media (min-width: 768px)` no `:root`.
- **Padding lateral mobile `px-8`:** conteúdo e header usam 32px — valor consistente em todas as páginas. Desktop mantém `md:px-[72px]`.

### 9.4 Manutenção

- **Inline style para valores críticos:** cores de background específicas da identidade dark (`#313621`, `#121210`) e box-shadows ficam em inline style — evita purge e centraliza no componente
- **Tailwind para spacing e layout:** `flex`, `grid`, `gap`, `p`, `m`, `rounded`, `text-*`, `font-*`
- **Token ou inline — nunca hardcoded em className arbitrário condicional:** ex: `${active ? "bg-[#C7FF04]" : ""}` é purgado. Usar `style={active ? { backgroundColor: "#C7FF04" } : undefined}`

---

## 10. Convenções de Nomenclatura

| Tipo | Convenção | Exemplo |
|---|---|---|
| Componente compartilhado | PascalCase | `BackToTopButton.tsx` |
| Componente de feature | PascalCase dentro de pasta de feature | `craft/SectionDropdown.tsx` |
| Hook | camelCase prefixado com `use` | `useScrollParallax.ts` |
| Tipo/interface | PascalCase | `TimelineEntry` |
| Constante de estilo | camelCase | `pillStyle` |
| Arquivo de dados | camelCase | `data.ts` |

---

## 11. Estrutura de Arquivos (atualizada — sessão 17)

```
app/
  components/
    AsciiShader.tsx          ← home background — density-mapped ASCII + mouse physics
    BackToTopButton.tsx      ← mobile only (craft)
    BlurOverlay.tsx          ← height + solidUntil configuráveis (craft, track — não home)
    ContactButton.tsx        ← home footer
    ControlPill.tsx          ← ⚠️ DEPRECATED — deletar
    Header.tsx               ← PageNav + block2? prop; isHome → bg/gradiente transparente
    MosaicBackground.tsx     ← ⚠️ DEPRECATED — substituído por AsciiShader
    Monogram.tsx             ← widthClass prop
    NavSelector.tsx          ← variant pill|underline, textSize, pillHeight, gap
    PageFooter.tsx           ← variant floating|inline|static + FooterBackToTop export
    PageLayout.tsx           ← home only
    ScrollColumn.tsx         ← ⚠️ DEPRECATED — deletar
    TimelineBlock.tsx        ← desktop (ano | texto | logo 172px)
    TimelineItem.tsx         ← mobile (logo sizing + alinhamento encapsulados)
  hooks/
    useFooterAnimation.ts    ← ⚠️ DEPRECATED — substituído por useScrollParallax
    useScrollParallax.ts     ← parallax scroll-driven para footer inline
    useSplitLayout.ts        ← ⚠️ DEPRECATED — deletar
  craft/
    PasswordGate.tsx         ← modal NDA — backdrop blur, autoFocus, a11y
    PrevNextBar.tsx          ← mobile only, z-20
    ProjectCarousel.tsx      ← ⚠️ DEPRECATED — deletar
    ProjectSelector.tsx      ← ⚠️ DEPRECATED — deletar
    SectionDropdown.tsx      ← unificado mobile+desktop (matchMedia interno)
    actions.ts               ← Server Action: verifyPassword
    data.ts                  ← tipos + dados dos projetos
    page.tsx
  track/
    page.tsx
  page.tsx
  globals.css                ← tokens, keyframes: control-bar-enter, monogram-enter, card-reveal
  layout.tsx
docs/
  DESIGN-SYSTEM.md           ← este arquivo
  SESSION-HANDOFF-PORTFOLIO.md
  BEST-PRACTICES.md
  PRD-*.md
```
