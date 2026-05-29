# PRD — Home Page · douglima.work

> Documento de referência para execução via Claude Code.
> Fase 0 (fundação) + Fase 1 (home) do portfolio pessoal de Douglas Lima.

---

## 1. Visão geral do projeto

Portfolio pessoal de Douglas Lima — product designer em transição para código.
Site mínimo, estático, com personalidade forte e paleta terrosa.

**Stack:** Next.js 15 (App Router) + Tailwind CSS + TypeScript
**Deploy:** Vercel (já configurado, auto-deploy via push na `main`)
**Domínio:** douglima.work (DNS propagando via Cloudflare)
**Repo:** `~/Projects/doug-lima`

---

## 2. Estrutura de rotas (site completo — contexto)

```
/                    → Home (esta fase)
/craft               → Trabalhos — Playground (público) + Selected Works (protegido)
/track               → Bio + timeline de carreira
```

Nesta fase, implementar apenas `/` (home). As outras rotas serão adicionadas em fases futuras. Não criar placeholders para elas.

---

## 3. Assets disponíveis

Todos em `public/assets/`:

| Arquivo | Tipo | Uso |
|---|---|---|
| `doug-lima-lettering.svg` | SVG | Logo "doug_lima." no header |
| `dl-monogram.svg` | SVG | Monograma no footer (canto inferior esquerdo) |
| `mosaic-home-bg.png` | PNG | Imagem de fundo animada (mosaico pixelado) |
| `doug-pixelart.png` | PNG | Pixel art decorativa no footer |
| `substack-logo.png` | PNG | Ícone Substack no footer |
| `linkedin-logo.png` | PNG | Ícone LinkedIn no footer |

---

## 4. Fontes

| Fonte | Source | Uso |
|---|---|---|
| **Geist** (Light, 300) | npm: `geist` | Tagline "Curious Designer" — 40pt |
| **Fenix** (Regular, 400) | Google Fonts | Navegação + footer — 18pt |

Configurar ambas no `layout.tsx` com `next/font`.

---

## 5. Paleta de cores

| Token | Hex | Uso |
|---|---|---|
| `bg-base` | `#F9F9F2` | Background geral do site |
| `text-default` | `#5F6A50` | Texto padrão, links inativos |
| `text-active` | `#3B4028` | Texto selecionado/ativo, hovers |

Sem dark mode. Essas três cores resolvem a home inteira.

---

## 6. Layout — Estrutura geral

A home ocupa **100vh** — sem scroll. Layout com CSS Grid ou Flexbox, posicionamento fixo.

### Spacing (em px no Figma — converter para rem no código)

| Região | Valor |
|---|---|
| Padding top | 112px |
| Padding bottom | 80px |
| Padding left | 80px (borda) + 88px (gutter) = conteúdo começa a 168px |
| Padding right | 88px (gutter) + 80px (borda) = conteúdo termina a 168px da borda |

**Nota:** esses valores são para desktop. Responsivo será tratado na fase de polish (Fase 5).

---

## 7. Elementos da home

### 7.1 Header

**Logo (canto superior esquerdo):**
- Arquivo: `doug-lima-lettering.svg`
- É SVG inline ou `<img>`, não texto
- Clicável — volta para `/` (home)

**Navegação (canto superior direito):**
- Dois links: `craft` e `track`
- Fonte: Fenix Regular 18pt
- Cor default: `#5F6A50`
- Cor selected: `#3B4028`

**Comportamento do underline na navegação:**
- Estado default (home, nenhum selecionado): uma linha contínua embaixo dos dois itens juntos, cor `#5F6A50`
- Estado selected (numa página interna): underline apenas no item ativo, cor `#3B4028`. O outro item fica sem underline.
- Na home, o estado é default (linha contínua nos dois).

### 7.2 Tagline

- Texto: "Curious Designer" (duas linhas: "Curious" / "Designer")
- Fonte: Geist Light 40pt
- Cor: `#5F6A50`
- Posição: abaixo do logo, alinhado à esquerda

### 7.3 Mosaico de fundo (background animado)

- Arquivo: `mosaic-home-bg.png`
- Imagem alta (muito maior que o viewport na vertical)
- Posicionada no lado direito da tela, atrás de todo o conteúdo
- **Animação:** scroll lento e contínuo de baixo para cima, em loop infinito
- Implementação sugerida: container com `overflow: hidden`, a imagem dentro com `@keyframes` animando `transform: translateY()` — de `0%` para `-50%` (se a imagem for duplicada para loop seamless) ao longo de ~60-90 segundos, `linear`, `infinite`
- A imagem deve ocupar aproximadamente a metade direita da tela (ou mais)

### 7.4 Header blur overlay

- Uma div com gradiente linear sobrepondo a área do header
- Gradiente: `#F9F9F2` com opacidade 0% (topo) → `#F9F9F2` com opacidade 100% (base do header)
- Propósito: esfumaçar suavemente a imagem do mosaico quando ela passa por trás do header
- `pointer-events: none` — não pode bloquear cliques
- `z-index` entre o mosaico (atrás) e o conteúdo (frente)

### 7.5 Footer

**Monograma (canto inferior esquerdo):**
- Arquivo: `dl-monogram.svg`
- Decorativo, sem interação

**Contato (canto inferior direito):**
- Email: `hello@douglima.work`
  - Fonte: Fenix Regular 18pt
  - Cor: `#5F6A50`
  - **Interação:** click-to-copy. Ao clicar, copia o email para o clipboard e mostra feedback visual (ex: texto muda temporariamente para "copied!" por 2 segundos, depois volta). Não abre mailto.
- Ícone Substack: `substack-logo.png`
  - Clicável → abre `https://substack.com/@douglima` em nova aba (`target="_blank" rel="noopener noreferrer"`)
- Ícone LinkedIn: `linkedin-logo.png`
  - Clicável → abre `https://www.linkedin.com/in/dougslima/?locale=en` em nova aba
- Pixel art: `doug-pixelart.png`
  - Apenas decorativo, sem interação

**Ordem no footer direito:** email → substack → linkedin → pixel art

---

## 8. Camadas (z-index)

```
z-0  — Mosaico animado (background)
z-10 — Header blur overlay (gradiente)
z-20 — Conteúdo (header, tagline, footer)
```

---

## 9. Checklist de implementação

### Fase 0 — Fundação
- [ ] Configurar fontes (Geist Light via `geist` package + Fenix via `next/font/google`)
- [ ] Definir cores no `tailwind.config.ts` (ou como CSS vars no `globals.css`)
- [ ] Limpar boilerplate do `create-next-app` (remover conteúdo default de `page.tsx`, limpar `globals.css`)
- [ ] Criar layout base em `app/layout.tsx` com as fontes carregadas
- [ ] Testar com `npm run dev`

### Fase 1 — Home
- [ ] Implementar estrutura de layout da home (100vh, grid/flex, paddings)
- [ ] Header: logo SVG + navegação com underline behavior
- [ ] Tagline: "Curious Designer" com Geist Light
- [ ] Mosaico: imagem animada em loop no background
- [ ] Header blur: gradiente overlay
- [ ] Footer: monograma + email (click-to-copy) + ícones sociais + pixel art
- [ ] Verificar z-index e sobreposições
- [ ] Testar no browser, verificar que não há scroll

---

## 10. O que NÃO fazer nesta fase

- Não criar rotas `/craft` ou `/track` — só a home
- Não implementar responsivo (será fase 5)
- Não adicionar meta tags / og:image (será fase 5)
- Não instalar dependências além do necessário (Geist já vem, Fenix via next/font)
- Não criar componentes genéricos / sistema de design — é um portfolio, código direto
- Não adicionar animações de transição entre páginas (será fase futura)

---

## 11. Referência visual

Os layouts estão no Figma. O Claude Code tem acesso ao Figma MCP se precisar consultar detalhes.
Os 5 frames de referência são:
- `home` — layout final
- `home-elementos` — spec de fontes e tipos de asset
- `home-estrutura_geral_das_telas` — spacing e grid
- `home-comportamento-seletores` — comportamento do underline da nav
- `home-comportamento-mosaico-bg` — comportamento da animação do mosaico
- `home-header-bg-blur` — detalhe do gradiente do header
