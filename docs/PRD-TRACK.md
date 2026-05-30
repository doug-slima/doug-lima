# PRD — Track Page · douglima.work

> Documento de referência para execução via Claude Code.
> Fase 2 (track) do portfolio pessoal de Douglas Lima.
> Implementar em duas etapas: Etapa 1 (estrutura geral) → Etapa 2 (timeline de carreira).

---

## 1. Visão geral da página

Página `/track` — bio curta + timeline de carreira.
Scroll vertical. Sem mosaico animado. Layout de duas regiões: esquerda sticky (fixa), direita scrollável.

**Rota:** `app/track/page.tsx`
**Componentes reutilizados:** `Header.tsx` (já existente)

---

## 2. Assets disponíveis

Todos em `public/assets/` (mesmos da home, mais os logos de empresa que serão adicionados na Etapa 2):

| Arquivo | Tipo | Uso |
|---|---|---|
| `doug-lima-lettering.svg` | SVG | Logo no header (via `Header.tsx`) |
| `dl-monogram.svg` | SVG | Monograma no footer (canto inferior esquerdo) |
| `doug-pixelart.png` | PNG | Pixel art decorativa no footer |
| `substack-logo.png` | PNG | Ícone Substack no footer |
| `linkedin-logo.png` | PNG | Ícone LinkedIn no footer |

Logos das empresas (Etapa 2): a definir — serão adicionados em `public/assets/companies/`.

---

## 3. Fontes

Mesmas da home, já configuradas no `layout.tsx`:

| Fonte | Peso | Uso nesta página |
|---|---|---|
| **Geist** | Light (300) | Bio — 40pt |
| **Geist** | Semibold (600) | Ano na timeline — 24pt (Etapa 2) |
| **Geist** | Light (300) | Cargo na timeline — 24pt (Etapa 2) |
| **Fenix** | Regular (400) | "Here is a nut of my career:" — 20pt |
| **Geist** | Light (300) / Bold (600) | Tag "swipe-up" — 14pt |

---

## 4. Paleta de cores

Mesma da home:

| Token | Hex | Uso |
|---|---|---|
| `bg-base` | `#F9F9F2` | Background geral |
| `text-default` | `#5F6A50` | Texto padrão |
| `text-active` | `#3B4028` | Texto selecionado/ativo |
| `surface-tag` | `#F0EEE5` | Background da tag "swipe-up" |

---

## 5. Layout — Estrutura geral

Página com scroll vertical. **Sem mosaico, sem blur overlay.**

### Estrutura de colunas — valores fixos em px

NÃO usar percentuais. As larguras são fixas:

```
| Coluna esquerda (sticky)  | gap   | Coluna direita (scrollável)     |
|---------------------------|-------|---------------------------------|
| 244px                     | 80px  | restante da largura disponível  |
```

O wrapper externo deve ter os mesmos paddings da home:
- Padding top: 112px
- Padding bottom: 80px
- Padding horizontal: 168px (`px-[10.5rem]`)

### Coluna esquerda — sticky

- `width: 244px` (fixo, não flexível)
- `flex-shrink: 0`
- `position: sticky`
- `top: 0`
- `height: 100vh`
- `display: flex`, `flex-direction: column`, `justify-content: space-between`
- Contém dois blocos internos:
  - **Bloco de cima:** bio + subtítulo (crescem naturalmente)
  - **Bloco de baixo:** tag + monograma (ancorados no bottom)

### Coluna direita — scrollável

- `flex: 1` (ocupa o restante)
- `margin-left: 80px`
- Altura natural (cresce com o conteúdo da timeline)
- Na Etapa 1: renderizar apenas o sentinel placeholder

---

## 6. Elementos da página

### 6.1 Header

Usar `Header.tsx` existente — sem alterações.
O item "track" da nav aparece sublinhado e com cor `#3B4028` (estado ativo).
O `usePathname()` já trata isso automaticamente.

**Sem blur overlay nesta página.**

### 6.2 Bio — quebra de linha forçada

- Fonte: Geist Light 40pt
- Cor: `#5F6A50`
- Posição: topo da coluna esquerda, abaixo do header

**IMPORTANTE — a quebra de linha deve ser exatamente esta (usar `<br />` ou múltiplos blocos):**

```
I'm just another
curious Brazilian
designer trying
to find beauty
in the cracks.
```

A largura de 244px da coluna deve naturalmente produzir essa quebra com Geist Light 40pt. Se não produzir, forçar com `<br />`. O resultado visual deve ser idêntico ao wireframe.

### 6.3 Subtítulo da timeline — quebra de linha forçada

- Texto em duas linhas exatas:
  ```
  Here is a nut
  of my career:
  ```
- Fonte: Fenix Regular 20pt
- Cor: `#5F6A50`
- Forçar a quebra com `<br />` — o texto deve quebrar exatamente após "nut"

**Alinhamento vertical crítico:** a baseline do texto "Here is a nut / of my career:" deve alinhar com a baseline do primeiro item da timeline na coluna direita. Ambos começam na mesma altura.

### 6.4 Tag — "swipe-up to see more"

**Estrutura visual:**
- Altura: 40px
- Padding horizontal: 18px
- Background: `#F0EEE5`
- Border-radius: 9999px (pill)
- Fonte: Geist 14pt, cor `#5F6A50`
- Largura: `width: fit-content` (hug — ajusta ao texto, não estica)
- Tipografia interna: `"swipe-up"` em font-weight 600, `" to see more"` em font-weight 300
- Sem borda, sem sombra

**Posição no bloco de baixo da coluna esquerda:**
- Gap entre a tag e o monograma abaixo: **40px**
- O monograma fica a **80px** do bottom da página (padding bottom do wrapper)

**Comportamento — dois estados:**

Estado inicial (default):
- Texto: `"swipe-up to see more"`
- `cursor: default` — não é clicável

Estado final (usuário chegou ao fim da timeline):
- Texto muda para: `"back to top"` ("back to top" todo em font-weight 300, "back" em font-weight 600 — seguir o mesmo padrão de destaque da primeira palavra)
- `cursor: pointer` — vira clicável
- Ao clicar: scroll suave até o topo (`window.scrollTo({ top: 0, behavior: 'smooth' })`)

**Detecção do fim do scroll:**
- `IntersectionObserver` no elemento sentinel no fim da coluna direita
- Quando entrar no viewport → estado final
- Quando sair do viewport → estado inicial
- Na Etapa 1: criar `<div id="timeline-end" />` no fim da coluna direita

### 6.5 Footer

Posicionado dentro do bloco de baixo da coluna esquerda, abaixo do monograma.

**Monograma:**
- Arquivo: `dl-monogram.svg`
- Decorativo, sem interação
- Distância da tag (acima): 40px
- Distância do bottom da página: 80px (controlado pelo padding bottom do wrapper)

**Contato (abaixo do monograma):**
- Email: `hello@douglima.work` — click-to-copy ("copied!" por 2 segundos)
- Ícone Substack → `https://substack.com/@douglima` (nova aba)
- Ícone LinkedIn → `https://www.linkedin.com/in/dougslima/?locale=en` (nova aba)
- Pixel art: `doug-pixelart.png` — decorativo
- Fonte: Fenix Regular 18pt, cor `#5F6A50`

**Ordem:** email → substack → linkedin → pixel art

---

## 7. Specs da timeline (Etapa 2 — referência antecipada)

Documentado aqui para que a estrutura da coluna direita já preveja esses valores.

### Cada bloco da timeline contém:

```
| Texto (hug content)      | gutter auto | Logo (220px fixo) |
|---------------------------|-------------|---------------------|
| [ano]  [cargo]           |             | [logo empresa]      |
```

- Texto do ano: Geist Semibold 24pt, cor `#5F6A50`
- Texto do cargo: Geist Light 24pt, cor `#5F6A50`
- Gap entre ano e cargo: 24px (horizontal, mesma baseline)
- Div do logo: largura fixa 220px, alinhado à direita
- Gutter entre texto e logo: auto (estica para preencher)
- Distância entre blocos: 344px (vertical, entre um item e o próximo)

### Alinhamento vertical

O primeiro bloco da timeline deve estar verticalmente alinhado com o texto "Here is a nut / of my career:" da coluna esquerda.

---

## 8. Camadas (z-index)

```
z-0  — background (cor sólida, sem mosaico)
z-20 — conteúdo (header, colunas, footer)
```

---

## 9. Etapa 1 — Checklist de implementação (estrutura geral)

- [ ] Criar `app/track/page.tsx`
- [ ] Importar e renderizar `Header.tsx`
- [ ] Wrapper: `flex flex-row items-start`, paddings `pt-28 pb-20 px-[10.5rem]`
- [ ] Coluna esquerda: `w-[244px] flex-shrink-0 sticky top-0 h-screen flex flex-col justify-between`
- [ ] Bio: Geist Light 40pt, quebra de linha exata conforme spec (5 linhas)
- [ ] Subtítulo: Fenix Regular 20pt, quebra exata "Here is a nut\nof my career:"
- [ ] Tag: pill `w-fit`, h-[40px], px-[18px], rounded-full, bg `#F0EEE5`, Geist 14pt
- [ ] Tag: dois estados via IntersectionObserver (swipe-up ↔ back to top)
- [ ] Gap tag → monograma: 40px
- [ ] Monograma + footer: email click-to-copy + ícones sociais + pixel art
- [ ] Coluna direita: `flex-1 ml-[80px]`, sentinel `<div id="timeline-end" />`
- [ ] Verificar "track" sublinhado na nav
- [ ] Testar no browser

---

## 10. Etapa 2 — Timeline de carreira (próxima sessão)

A implementar após validação visual da Etapa 1.
Dados completos (empresas, cargos, anos, logos) serão fornecidos antes da Etapa 2.
Specs visuais já documentadas na Seção 7.

---

## 11. O que NÃO fazer nesta fase

- Não adicionar mosaico animado — esta página não tem
- Não adicionar blur overlay — não há mosaico
- Não implementar responsivo (fase 5)
- Não criar a timeline ainda (Etapa 2)
- Não alterar `Header.tsx` — reutilizar como está
- Não adicionar animações de entrada ou transição entre páginas
- Não usar percentuais para largura das colunas — valores fixos em px
