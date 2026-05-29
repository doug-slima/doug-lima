# SESSION HANDOFF — douglima.work Portfolio

> Documento de contexto para continuidade entre sessões.
> Última atualização: 29 mai 2026 — Sessão 1 (Home)

---

## 1. Visão geral do projeto

Portfolio pessoal de **Douglas Lima** — product designer em transição para código.
Site mínimo, estático, com personalidade forte e paleta terrosa.

**Stack:** Next.js 15+ (App Router) + Tailwind CSS v4 + TypeScript
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

---

## 3. Estrutura de rotas

```
/              → Home (IMPLEMENTADA)
/craft         → Trabalhos — Playground (público) + Selected Works (protegido por senha NDA)
/track         → Bio + timeline de carreira
```

---

## 4. Paleta de cores

| Token | Hex | Uso |
|---|---|---|
| `bg-base` | `#F9F9F2` | Background geral do site |
| `text-default` | `#5F6A50` | Texto padrão, links inativos |
| `text-active` | `#3B4028` | Texto selecionado/ativo, hovers |

Sem dark mode.

---

## 5. Fontes

| Fonte | Peso | Uso | Carregamento |
|---|---|---|---|
| **Geist** | Light (300) | Tagline, textos de destaque — 40pt | `next/font/google`, var `--font-geist-var` |
| **Fenix** | Regular (400) | Navegação, footer, body text — 20pt (nav) / 18pt (footer) | `next/font/google`, var `--font-fenix-var` |

Logo "doug_lima." é SVG, não fonte.

---

## 6. Assets

Todos em `public/assets/`:

| Arquivo | Tipo | Uso |
|---|---|---|
| `doug-lima-lettering.svg` | SVG | Logo "doug_lima." no header |
| `dl-monogram.svg` | SVG | Monograma decorativo no footer |
| `mosaic-home-bg.png` | PNG | Imagem de fundo animada (mosaico pixelado) |
| `doug-pixelart.png` | PNG | Pixel art decorativa no footer (h-10) |
| `substack-logo.png` | PNG | Ícone Substack no footer (h-7) |
| `linkedin-logo.png` | PNG | Ícone LinkedIn no footer (h-7) |

---

## 7. Componentes implementados

### 7.1 `app/components/Header.tsx`

Componente reutilizável para todas as páginas. Contém:

- Logo SVG clicável (volta para `/`)
- Nav com dois links: `craft` e `track`
- Usa `usePathname()` para determinar estado ativo

**Comportamento da nav:**
- Default (home): sem underline, texto `#5F6A50`
- Hover: underline aparece no item hovered, texto muda para `#3B4028`
- Active (página interna): underline permanece no item ativo, cor `#3B4028`

**NÃO contém o blur overlay** — o blur é responsabilidade de cada page, pois precisa estar no mesmo stacking context que o conteúdo.

### 7.2 Blur overlay (padrão por página)

Cada página que tiver conteúdo passando por trás do header deve incluir o blur overlay como **sibling direto** do mosaico e do conteúdo principal:

```tsx
{/* Blur overlay — z-10 */}
<div
  className="absolute top-0 left-0 right-0 h-[280px] z-10 pointer-events-none"
  style={{
    background: "linear-gradient(to bottom, #F9F9F2 0%, #F9F9F2 65%, rgba(249,249,242,0) 100%)",
  }}
/>
```

**Regra de z-index (todas as páginas):**
- Mosaico/background: `z-0`
- Blur overlay: `z-10`
- Conteúdo (header + body + footer): `z-20`

**Nunca colocar o blur dentro do Header.tsx** — causa problemas de stacking context.

---

## 8. Padrões de layout

### Spacing (desktop)

| Região | Valor |
|---|---|
| Padding top | 112px (`pt-28`) |
| Padding bottom | 80px (`pb-20`) |
| Padding horizontal | `px-[10.5rem]` (168px) |

### Home — 100vh

A home é tela fixa, sem scroll. Layout com flex column, `h-screen`, `overflow-hidden`.

### Mosaico de fundo (home)

- Largura fixa: `w-[1272px]`
- Alinhado à direita: `right-0`
- Duas cópias da imagem empilhadas para loop seamless
- Animação: `translateY(0) → translateY(-50%)` em **150 segundos**, linear, infinite
- Container com `overflow: hidden`
- Keyframe definido em `globals.css`:
  ```css
  @keyframes mosaic-scroll {
    from { transform: translateY(0); }
    to { transform: translateY(-50%); }
  }
  ```
- Token: `--animate-mosaic-scroll: mosaic-scroll 150s linear infinite`

---

## 9. Footer (padrão)

- Monograma DL no canto inferior esquerdo (decorativo)
- Canto inferior direito: email + substack + linkedin + pixel art
- Gap entre elementos: `gap-6` (24px)
- Alinhamento: `items-end` (pela base)
- Email: click-to-copy com feedback "copied!" por 2 segundos
- Substack: `https://substack.com/@douglima` (nova aba)
- LinkedIn: `https://www.linkedin.com/in/dougslima/?locale=en` (nova aba)
- Pixel art: decorativo, sem interação

---

## 10. Proteção NDA (a implementar)

A rota `/craft/selected-works` (ou equivalente dentro de `/craft`) será protegida por:

- Middleware do Next.js protegendo a rota
- Senha guardada como env var na Vercel (nunca no código)
- Server Action para verificação da senha
- Cookie `httpOnly` para manter sessão
- Conteúdo renderizado no servidor apenas após autenticação
- Tela de senha: input centralizado com mensagem "This section is protected by NDA / please enter the password below:"

---

## 11. Páginas pendentes

### /craft
Duas sub-seções:
- **Playground** (público): galeria de logos e marcas (Purple, Agroprop, etc.)
- **Selected Works** (NDA): cases de produto/UX (Picking Handheld, Scan Desktop, Order Checkout)
- Toggle ou navegação entre Playground e Selected Works (comportamento a definir)
- "swipe-up to see more" como indicador de scroll
- Página com scroll vertical (diferente da home que é 100vh)

### /track
- Bio curta: "I'm just another Brazilian curious designer trying to find beauty in the..."
- "Here is a nut of my career:"
- Timeline de carreira: ano + cargo + logo da empresa
- Itens confirmados: Livework (2011, Service Designer), Itaú (2013, Service Designer), outros a definir
- Scroll vertical

---

## 12. Pendências finais (Fase 5+)

- [ ] Responsivo (mobile/tablet)
- [ ] Meta tags (og:image, description, favicon)
- [ ] Transições entre páginas
- [ ] Cloudflare Email Routing (`hello@douglima.work` → Gmail)
- [ ] git push + deploy final

---

## 13. Workflow estabelecido

1. **Planejamento e refinamento visual** → Claude.ai (esta conversa)
2. **Specs e interações** → documentadas em PRDs (pasta `docs/`)
3. **Execução de código** → Claude Code (Sonnet 4.6 via Vertex AI)
4. **Validação visual** → Doug roda `npm run dev`, envia screenshots, ajustamos via prompts pro Claude Code
5. **Assets** → Doug exporta do Figma para `public/assets/`, Claude Code consome

**Regra:** Claude.ai não executa código. Sempre gera prompts para o Claude Code executar.

---

## 14. Arquivos do projeto

```
doug-lima/
├── app/
│   ├── components/
│   │   └── Header.tsx          # Componente reutilizável (logo + nav)
│   ├── globals.css             # Cores, fontes, keyframes
│   ├── layout.tsx              # Geist + Fenix, metadata
│   └── page.tsx                # Home (mosaico + blur + tagline + footer)
├── docs/
│   └── PRD-HOME.md             # PRD da home (referência)
├── public/
│   └── assets/                 # SVGs, PNGs, imagens
├── tailwind.config.ts
├── next.config.ts
└── package.json
```
