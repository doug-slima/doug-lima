# Best Practices — douglima.work

> Referência de princípios e diretrizes de engenharia adotados no projeto.
> Foco em DX, design system, a11y, responsividade e performance.
> Última atualização: 03 jun 2026

---

## 1. Arquitetura de Componentes & DX

### Quando extrair um componente

| Situação | Decisão |
|---|---|
| Padrão aparece em 2+ lugares | Extrai — risco de inconsistência |
| Arquivo de page ultrapassa ~300 linhas | Extrai — legibilidade |
| Bloco tem estado ou efeito próprio | Extrai — isolamento de responsabilidade |
| Bloco genuinamente único e simples | Mantém inline |

**Regra prática:** se você tiver que editar o mesmo visual em dois arquivos para fazer uma mudança, o padrão deveria ser um componente.

---

### Estrutura de pastas

```
app/
  components/          # componentes verdadeiramente compartilhados (3+ pages)
  hooks/               # hooks reutilizáveis
  craft/               # componentes específicos da feature craft
  track/               # componentes específicos da feature track (se necessário)
```

Colocalizar: componente + tipos + hook específico na mesma pasta de feature.
Centralizar: apenas o que é genuinamente transversal (`components/`, `hooks/`).

---

### Props API

**Discriminated unions para variantes mutuamente exclusivas:**
```typescript
// Ruim — aceita combinações inválidas
type ButtonProps = { label?: string; icon?: ReactNode; ariaLabel?: string };

// Bom — cada variante é um contrato fechado
type ButtonProps =
  | { variant: "text"; label: string }
  | { variant: "icon"; icon: ReactNode; ariaLabel: string };
```

**Props obrigatórias vs. opcionais:**
- Obrigatória: quando o componente não faz sentido sem ela
- Opcional com default: quando há um comportamento sensato sem ela
- Evitar: opcional sem default que gera `undefined` silencioso

**Naming de event handlers:** sempre `on` + substantivo + verbo (`onProjectChange`, `onScrollToTop`).

---

### Barrel exports (`index.ts`)

Para este projeto: **não usar**. O overhead de manutenção supera o benefício de import limpo numa base pequena. Importar diretamente do arquivo é mais explícito e mais fácil de rastrear.

---

### Server vs Client Components (Next.js App Router)

- Default: Server Component (sem `"use client"`)
- Adicionar `"use client"` **apenas** quando necessário: `useState`, `useEffect`, event handlers, browser APIs
- Empurrar a fronteira `"use client"` o mais fundo possível na árvore — componentes de layout e display podem permanecer server

**No contexto deste projeto:** quase tudo é interativo, então `"use client"` é a norma. Mas componentes puramente visuais sem estado (ex: `Monogram`, `TimelineBlock`) não precisam de `"use client"`.

---

## 2. Design System

### Hierarquia de tokens

```
Primitivo → Semântico → Componente

Primitivo:   valor bruto         #5F6A50
Semântico:   propósito           --color-text-default (= #5F6A50)
Componente:  uso específico      (ainda não definido neste projeto)
```

**Regra:** nunca usar valor bruto em `className`. Sempre via token Tailwind (`text-text-default`) ou inline style para valores que não têm token (`backgroundColor: "#313621"`).

---

### Gestão de variantes

**Para este projeto (poucos componentes, poucas variantes):** condicionais Tailwind são suficientes. Não adicionar CVA (class-variance-authority) — complexidade desnecessária.

**Se o projeto crescer:** CVA é a melhor opção. É ~1.6KB, type-safe e integra diretamente com Tailwind.

```typescript
// CVA — para referência futura
import { cva } from "class-variance-authority";

const pill = cva("h-[56px] rounded-full font-fenix flex items-center", {
  variants: {
    intent: {
      control: "bg-[#F6F3E6] border border-[#D0D1B3]",
      dark:    "bg-[#121210]",
      ghost:   "bg-[#A6AA74]/20",
    },
  },
});
```

---

### Escala de espaçamento (grid de 8px)

Este projeto usa uma grade base de 8px com ajustes de 4px para micro-escala:

| px | Tailwind | Uso |
|---|---|---|
| 4 | `gap-1` / `p-1` | micro-ajustes |
| 8 | `gap-2` / `p-2` | gap interno de pills |
| 12 | `gap-3` / `p-3` | gap entre imagens mobile |
| 16 | `gap-4` / `p-4` | gap seletores verticais |
| 20 | `gap-5` / `p-5` | padding horizontal de pills |
| 24 | `gap-6` / `p-6` | padding interno de tags, gap de timeline |
| 32 | `gap-8` / `p-8` | padding base |
| 40 | `gap-10` / `p-10` | padding lateral mobile |
| 80 | `gap-20` / `p-20` | padding vertical desktop |

---

### Documentação de componentes (sem Storybook)

Para projetos pequenos: TypeScript JSDoc + `DESIGN-SYSTEM.md`.

- Props com JSDoc inline descrevem intenção, não implementação
- `DESIGN-SYSTEM.md` é a fonte de verdade para specs visuais e comportamentais
- Nomes semânticos eliminam a necessidade de comentar o "o quê" — só documentar o "porquê"

---

## 3. Acessibilidade (a11y)

### Touch targets (WCAG 2.5.5)

- **Mínimo:** 44×44 CSS pixels — inclui padding, não apenas o elemento visual
- **Neste projeto:** todos os botões mobile têm `h-[56px]` ✓
- **Exceções permitidas:** links inline em texto corrido

---

### ARIA essencial

**Em elementos interativos sem texto visível:**
```tsx
<button aria-label="Fechar menu">
  <XIcon />
</button>
```

**Em elementos que expandem/colapsam:**
```tsx
<button aria-expanded={isOpen} aria-haspopup="listbox">
  Playground
</button>
```

**Em elementos decorativos:**
```tsx
<img src="..." alt="" aria-hidden="true" />
```

**Em regiões de conteúdo dinâmico:**
```tsx
<div role="listbox">
  <button role="option" aria-selected={active}>...</button>
</div>
```

---

### Foco

**Ao abrir um overlay/modal:** mover foco para o primeiro elemento interativo ou para o botão de fechar.

**Ao fechar:** retornar foco ao elemento que abriu o overlay.

```typescript
const triggerRef = useRef<HTMLButtonElement>(null);
const firstFocusableRef = useRef<HTMLButtonElement>(null);

// Ao abrir
useEffect(() => {
  if (isOpen) firstFocusableRef.current?.focus();
}, [isOpen]);

// Ao fechar — chamar triggerRef.current?.focus() no handler de fechar
```

**No momento:** SectionDropdown e PasswordGate não retornam foco ao trigger. A implementar.

---

### `prefers-reduced-motion`

~70 milhões de pessoas têm distúrbios vestibulares que tornam animações de movimento problemáticas. A media query desabilita ou reduz animações para quem configurou essa preferência no sistema.

```css
@media (prefers-reduced-motion: reduce) {
  .control-bar-enter {
    animation: none;
    opacity: 1;
    transform: translateY(0);
  }
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

**Aplicado em:** `globals.css` ✓ (implementado após esta pesquisa)

---

### Safe area insets (iOS)

iPhones com notch e home indicator reduzem a área segura de interação. Sem compensação, botões fixed ficam parcialmente cobertos.

```css
/* Adicionar padding extra equivalente ao home indicator (~34px) */
padding-bottom: calc(24px + env(safe-area-inset-bottom));
```

**Aplica em:** `PrevNextBar` e `BackToTopButton`.

**Aplicado:** via `pb-safe` ou inline style com `env()` ✓ (implementado após esta pesquisa)

---

### Contraste de cores (WCAG AA)

| Combinação | Contraste | Status |
|---|---|---|
| `#5F6A50` (text-default) sobre `#F9F9F2` (bg-base) | ~4.6:1 | ✓ AA |
| `#3B4028` (text-active) sobre `#F9F9F2` | ~7.2:1 | ✓ AAA |
| `#FAFAF5` sobre `#121210` (PrevNextBar) | ~19.5:1 | ✓ AAA |
| `#5F6A50` sobre `#F6F3E6` (pills) | ~4.3:1 | ✓ AA (margem estreita) |
| `#A6AA97` (text-muted) sobre `#F9F9F2` | ~2.8:1 | ✗ Abaixo do AA |

**Nota:** `text-muted` é usado apenas para texto de suporte e estados desabilitados — verifique se há texto informacional crítico nessa cor.

---

## 4. Responsividade

### Mobile-first

Base styles sem prefixo = mobile. Prefixo `md:` = desktop (≥768px). Nunca o contrário.

```css
/* Certo */
.element { font-size: 28px; }
@media (min-width: 768px) { .element { font-size: 40px; } }

/* Errado */
.element { font-size: 40px; }
@media (max-width: 767px) { .element { font-size: 28px; } }
```

---

### Unidades de viewport

| Unidade | Comportamento | Quando usar |
|---|---|---|
| `vh` / `100vh` | Ignora chrome do browser — conteúdo some atrás da barra de endereço | Nunca em mobile |
| `dvh` / `100dvh` | Dinâmico — se ajusta quando toolbars aparecem/somem | Layouts full-height interativos ✓ |
| `svh` / `100svh` | Viewport mínima (toolbar sempre visível) | Quando não quer reflow |
| `lvh` / `100lvh` | Viewport máxima (toolbar retraída) | Hero estático |

**Neste projeto:** `h-dvh` em todos os containers full-height ✓

---

### CSS breakpoints vs. `useMediaQuery`

- **CSS (`md:`, `lg:`):** para layout, display, espaçamento — zero custo JS
- **`useMediaQuery` hook:** apenas para renderização condicional de componentes inteiros diferentes
- **Evitar:** lógica de negócio baseada em tamanho de tela no JS quando CSS resolve

---

### Scroll lateral full-bleed

Para um container com `px-10` que precisa de scroll horizontal até a borda:

```tsx
<div className="-mx-10 px-10 overflow-x-auto">
  {/* conteúdo vai até a borda do viewport */}
</div>
```

O `-mx-10` cancela o padding do pai. O `px-10` recoloca como padding interno. O scroll vai até a borda sem cortar conteúdo ✓

---

### `overscroll-behavior`

Evita que o scroll de um container pai dispare quando o container filho chega ao limite:

```css
.scroll-container {
  overscroll-behavior: contain;
}
```

**Aplicável em:** `ScrollColumn` (desktop) — evita rubber-banding indesejado.

---

## 5. Performance

### Imagens

**`<img>` vs `<Image>` (next/image):**

| Caso | Recomendação | Motivo |
|---|---|---|
| Assets estáticos em `public/` (logos, ícones, SVGs) | `<img>` | Já estão otimizados, next/image adiciona overhead sem ganho |
| Imagens de conteúdo dinâmico ou grandes (> 100KB) | `<Image>` com `sizes` prop | Geração automática de WebP/AVIF, lazy load, prevenção de CLS |

**Atenção:** `<Image>` sem a prop `sizes` correto usa 100vw como padrão — gera imagens enormes desnecessariamente.

```tsx
<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="..."
/>
```

---

### Fontes

- `next/font` faz subset automático do Google Fonts (reduz ~85% do peso)
- `display: swap` — mostra fallback imediatamente, troca quando a fonte carrega (melhor UX)
- `display: optional` — melhor performance, nunca troca se a fonte chegar tarde
- Fonts variáveis (variable fonts) reduzem 40–60% vs. static weights — Geist já é variável ✓

---

### Animações

**Regra de ouro:** animar apenas `transform` e `opacity`. Estas propriedades são compostas na GPU sem triggerar layout ou paint.

| Propriedade | Custo | Usar? |
|---|---|---|
| `transform`, `opacity` | GPU — sem reflow | ✓ Sempre |
| `color`, `background-color` | Paint | ✓ Com moderação |
| `width`, `height`, `margin`, `padding` | Layout + Paint + Composite | ✗ Evitar em animações |
| `top`, `left` (com `position`) | Layout + Paint + Composite | ✗ Usar `transform` no lugar |

**`will-change`:** só quando o profiler confirmar gargalo. Cria uma camada de composição — memória extra.

```css
/* Usar apenas se necessário após profiling */
.animated-card { will-change: transform; }
```

**Neste projeto:** o card reveal do craft usa `transform: translateY(-104px)` ✓ e a animação `control-bar-enter` usa `transform` + `opacity` ✓

---

### Bundle size — ícones

`@phosphor-icons/react` com tree-shaking importa apenas os ícones usados. Manter imports específicos:

```typescript
// Certo
import { ArrowUp, CaretLeft } from "@phosphor-icons/react";

// Errado — importa a biblioteca inteira
import * as Icons from "@phosphor-icons/react";
```

---

## 6. Tailwind v4 — Armadilhas

### Purge de classes arbitrárias em condicionais

Tailwind analisa o código estaticamente. Classes dentro de template literals condicionais são purgadas em produção.

```typescript
// ❌ Purgado — h-[240px] some em produção
className={`${active ? "h-[240px]" : ""}`}

// ✓ Seguro — inline style é avaliado em runtime
style={active ? { height: "240px" } : undefined}
```

**Regra:** valores dinâmicos → inline style. Valores estáticos → className.

---

### `ring` vs `border` + `boxShadow`

`ring` em Tailwind é implementado via `box-shadow`. Isso significa que `ring` e `style={{ boxShadow: "..." }}` no mesmo elemento se cancelam — o inline style sobrescreve o `box-shadow` do ring.

```typescript
// ❌ Ring some — inline boxShadow sobrescreve
className="ring-1 ring-[#DEDDCE]"
style={{ boxShadow: "0px 4px 12px ..." }}

// ✓ Ambos convivem
style={{
  border: "1px solid #DEDDCE",
  boxShadow: "0px 4px 12px ...",
}}
```

---

### Cor de fundo ativa via inline style

```typescript
// ❌ bg-transparent em className pode vencer bg-[#C7FF04] dependendo da ordem no bundle
className={`${active ? "bg-[#C7FF04]" : "bg-transparent"}`}

// ✓ Inline style sempre vence qualquer classe Tailwind
style={active ? { backgroundColor: "#C7FF04" } : undefined}
```

---

## 7. Git & Workflow

### Convenção de commits

```
feat:     nova funcionalidade
fix:      correção de bug
refactor: mudança de código sem alterar comportamento externo
docs:     só documentação
style:    formatação, sem mudança de lógica
chore:    configuração, deps, scripts
```

### Workflow estabelecido

1. Specs visuais → Claude.ai (exploração, ideação)
2. PRD ou specs → documentado em `docs/`
3. Implementação → Claude Code (Sonnet 4.6)
4. Validação → `npm run dev`, screenshots, iteração
5. Assets → Figma → `public/assets/`, Claude Code consome
6. Deploy → push na `main` → Vercel auto-deploy
