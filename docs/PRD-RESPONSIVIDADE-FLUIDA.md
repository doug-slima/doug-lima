# PRD — Responsividade Fluida da UI

> Criado: 04 jun 2026 — Sessão 21  
> Status: **pronto para execução**  
> Viewport mínimo suportado: **375px** (iPhone 12/13/14)  
> Abordagem: **fluid (`clamp`) + CSS custom property para cascade automático**

---

## 1. Contexto e Problema

A UI atual usa dois estados fixos: `md:` para desktop (≥768px) e valores hardcoded para mobile. Dentro da faixa mobile (375px–767px) os elementos têm tamanhos absolutamente fixos — qualquer viewport fora da faixa testada pode causar overflow no header ou conteúdo mal posicionado.

O problema mais crítico é o **cascade do header**: a altura do header (logo + padding) determina o `padding-top` do conteúdo em 3 páginas (craft, track, home). Se qualquer valor do header mudar, 3+ arquivos precisam ser atualizados manualmente e em sincronia.

---

## 2. Objetivos

1. **Cascade automático** — `--header-h` como CSS custom property: muda o header, todo o conteúdo acompanha.
2. **Fluid scaling** — logo, pills e tipografia principal escalam com `clamp()` entre 375px e 767px.
3. **Sem overflow no header** — logo + pills cabem na mesma linha em qualquer viewport ≥375px.
4. **Zero regressões desktop** — todas as mudanças ficam dentro do contexto `md:hidden` (mobile).

---

## 3. Decisões técnicas

| Decisão | Escolha | Motivo |
|---|---|---|
| Abordagem | `clamp()` + CSS custom property | Escala contínua, sem jumps; cascade em uma variável |
| Viewport mínimo | 375px | iPhone 12/13/14 padrão |
| Viewport máximo mobile | 767px | breakpoint `md:` já lida com ≥768px |
| Layout do header | logo + pills na mesma linha | Com fluid sizing, caberão em 375px |
| Padding lateral | `px-10` permanece fixo | 295px de conteúdo a 375px é suficiente para todos os elementos |
| Escopo | Header, cascade, tipografia principal | Consistência em todo o portfolio |

---

## 4. Valores fluid — cálculos

### 4.1 Logo e pills (altura)

| Viewport | Atual (fixo) | Fluid |
|---|---|---|
| 375px | 32px | **28px** |
| 390px | 32px | ~29px |
| 430px | 32px | **32px** |
| ≥768px | 40px | 40px (inalterado) |

**Fórmula:** `clamp(28px, 7.5vw, 32px)`

Verificação:
- `7.5vw × 375px = 28.1px` → clamped a **28px** ✓
- `7.5vw × 390px = 29.3px` ✓
- `7.5vw × 430px = 32.3px` → clamped a **32px** ✓

---

### 4.2 CSS custom property `--header-h`

Altura visual do header mobile = `pt-10`(40) + logo + `pb-6`(24) + gradiente(24)

Com logo fluid:
```
--header-h = 40 + clamp(28, 7.5vw, 32) + 24 + 24
           = clamp(116px, calc(88px + 7.5vw), 120px)
```

| Viewport | `--header-h` |
|---|---|
| 375px | 116px |
| 390px | ~117px |
| 430px | 120px |

---

### 4.3 Content padding-top por página

| Página | Atual | Com cascade |
|---|---|---|
| Craft (mobile card) | `pt-[120px]` | `var(--header-h)` |
| Track (mobile content) | `pt-[144px]` | `calc(var(--header-h) + 24px)` |
| Home (mobile content) | `pt-[144px]` | `calc(var(--header-h) + 24px)` |

O `+ 24px` extra em Track e Home é respiro intencional (decisão da sessão 8, não mexer).

---

### 4.4 Tipografia principal

| Elemento | Atual | Fluid | Arquivos |
|---|---|---|---|
| Taglines home + track | `text-[28px]` | `clamp(24px, 6.5vw, 28px)` | `app/page.tsx`, `app/track/page.tsx` |
| Pills header (Craft/Track text) | `text-[18px]` | permanece | — |
| Project pills (NavSelector) | `text-[18px]` | permanece | — |
| Info block craft | `text-[20px]` | permanece | — |
| Timeline mobile | `text-[18px]` | permanece | — |

Verificação tagline:
- `6.5vw × 375px = 24.4px` → clamped a **24px** ✓
- `6.5vw × 430px = 27.95px` → clamped a **28px** ✓

---

## 5. Arquivos afetados

| Arquivo | Mudança | Prioridade |
|---|---|---|
| `app/globals.css` | Adicionar `--header-h` em `:root` | Essencial |
| `app/components/Header.tsx` | Logo + pills height fluid | Essencial |
| `app/craft/page.tsx` | `pt-[120px]` → `var(--header-h)` via inline style (mobile) | Essencial |
| `app/track/page.tsx` | `pt-[144px]` → `calc(var(--header-h) + 24px)` via inline style (mobile) | Essencial |
| `app/components/PageLayout.tsx` | Idem — ler antes de editar, estrutura não revisada recentemente | Essencial |
| `app/page.tsx` | Tagline `text-[28px]` → `clamp(24px,6.5vw,28px)` | Enhancement |
| `app/track/page.tsx` | Tagline `text-[28px]` → `clamp(24px,6.5vw,28px)` | Enhancement |

---

## 6. Tarefas atômicas

### Tarefa 1 — CSS custom property `--header-h`

**Arquivo:** `app/globals.css`

Adicionar em `:root` (ou após os tokens de cor existentes):

```css
--header-h: clamp(116px, calc(88px + 7.5vw), 120px);
```

**Validação:** DevTools → Inspecionar `<html>` ou `<body>` → confirmar que `--header-h` está definida com valor correto em 375px (`116px`), 390px (`~117px`) e 430px (`120px`).

---

### Tarefa 2 — Logo e pills fluid no Header

**Arquivo:** `app/components/Header.tsx`

Mudanças em `PageNav()`:

1. Ambas as `<img>` do logo:
   - De: `h-[32px] md:h-[40px]`
   - Para: `h-[clamp(28px,7.5vw,32px)] md:h-[40px]`

2. `NavSelector` (Craft/Track):
   - De: `pillHeight="h-[32px] md:h-[40px]"`
   - Para: `pillHeight="h-[clamp(28px,7.5vw,32px)] md:h-[40px]"`

3. `textSize` permanece: `text-[18px] md:text-[24px]` — não alterar.

**Validação:** Screenshots do header em 375px, 390px e 430px — logo + pills na mesma linha, sem overflow horizontal, com variação de altura visível entre os viewports.

---

### Tarefa 3 — Cascade craft mobile

**Arquivo:** `app/craft/page.tsx`

No mobile layout, dentro do `<div` do card (classe `px-10 pt-[120px] pb-8`):
- Remover `pt-[120px]`
- Adicionar `style={{ paddingTop: "var(--header-h)" }}` (merge com outros estilos inline existentes se houver)

**Validação:** Conteúdo do card (SectionDropdown) começa imediatamente abaixo do header em 375px e 430px sem gap visível nem sobreposição.

---

### Tarefa 4 — Cascade track mobile

**Arquivo:** `app/track/page.tsx`

No mobile layout, div de conteúdo (classe `px-10 pt-[144px] pb-10`):
- Remover `pt-[144px]`
- Adicionar `style={{ paddingTop: "calc(var(--header-h) + 24px)" }}`

**Validação:** Tagline "20 years across..." começa com 24px de respiro abaixo do gradiente do header em 375px e 430px.

---

### Tarefa 5 — Cascade home mobile

**Arquivo:** `app/components/PageLayout.tsx`

1. Ler o arquivo inteiro antes de editar.
2. Localizar onde o `pt-[144px]` (ou equivalente) do conteúdo mobile está definido.
3. Aplicar `style={{ paddingTop: "calc(var(--header-h) + 24px)" }}` via inline style.

**Nota:** PageLayout não foi revisado desde as primeiras sessões — ler antes de editar para evitar regressões.

**Validação:** "Curious Designer" começa com 24px de respiro abaixo do gradiente do header em 375px e 430px.

---

### Tarefa 6 — Tagline fluid (Enhancement)

**Arquivos:** `app/page.tsx` · `app/track/page.tsx`

- Home tagline `"Curious Designer"`: `text-[28px]` → `text-[clamp(24px,6.5vw,28px)]`
- Track tagline `"20 years across..."`: `text-[28px]` → `text-[clamp(24px,6.5vw,28px)]`

**Validação:** Taglines leem-se bem a 375px (24px) e a 430px (28px). Verificar que as quebras de linha ficam naturais em ambos os tamanhos.

---

### Tarefa 7 — Auditoria visual final

Após as tarefas 1–6, abrir cada página no DevTools em 375px, 390px e 430px (responsive mode):

**Home:**
- [ ] Header: logo + pills na mesma linha, sem overflow
- [ ] Tagline: "Curious Designer" legível, bem posicionada abaixo do header
- [ ] ContactButton: painel abre e ancora corretamente
- [ ] Monograma: posicionado no rodapé

**Craft:**
- [ ] Header: Variant A (sem block2), sem overflow
- [ ] Card: SectionDropdown começa logo abaixo do header
- [ ] NavSelector: scroll horizontal funciona sem overflow
- [ ] Imagens: sem overflow lateral
- [ ] Card reveal + PrevNextBar: funcionando

**Track:**
- [ ] Header: Variant A, sem overflow
- [ ] Tagline: bem posicionada
- [ ] Timeline: linhas, logos e texto sem quebra
- [ ] Monograma: no rodapé
- [ ] BackToTopButton: aparece ao chegar no final

---

## 7. O que NÃO muda

- Todos os valores desktop (`md:` e divs `hidden md:block`) — zero toque
- `px-10` lateral — permanece fixo
- Texto `text-[18px]` dos pills, timeline e info block — já pequeno, não precisa de fluid
- Lógica de card reveal (`footerRevealed`, `translateY(-104px)`) — o `paddingBottom` do `BackToTopButton` em craft (`169px`) foi calculado a partir de valores que não mudam
- `useScrollParallax`, `PageFooter` desktop — fora do escopo mobile
- `BlurOverlay` — desktop only, não afetado

---

## 8. Ordem de execução recomendada

```
Tarefa 1 (globals.css)
  └─ Tarefa 2 (Header fluid) → validar header no browser
       └─ Tarefa 3 (craft cascade)
       └─ Tarefa 4 (track cascade)
       └─ Tarefa 5 (home cascade)
            └─ Tarefa 6 (taglines) — enhancement, pode ficar para depois
                 └─ Tarefa 7 (auditoria visual + screenshots)
```

Tarefas 3, 4 e 5 são independentes entre si — podem ser executadas em qualquer ordem após a Tarefa 2.

---

## 9. Referência rápida de valores

```
Logo mobile:     h-[clamp(28px,7.5vw,32px)] md:h-[40px]
Pills mobile:    pillHeight="h-[clamp(28px,7.5vw,32px)] md:h-[40px]"
--header-h:      clamp(116px, calc(88px + 7.5vw), 120px)

craft pt:        style={{ paddingTop: "var(--header-h)" }}
track pt:        style={{ paddingTop: "calc(var(--header-h) + 24px)" }}
home pt:         style={{ paddingTop: "calc(var(--header-h) + 24px)" }}

Tagline:         text-[clamp(24px,6.5vw,28px)]
```
