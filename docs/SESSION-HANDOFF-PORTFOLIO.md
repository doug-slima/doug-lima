# SESSION HANDOFF — douglima.work Portfolio

> Documento de contexto para continuidade entre sessões.
> Última atualização: 05 jun 2026 — Sessão 22 (responsividade fluida implementada)
> **Specs de componentes, tokens, hooks e arquitetura desktop → `docs/DESIGN-SYSTEM.md`**

---

## 1. Projeto

**Stack:** Next.js 16.2.6 (App Router) · React 19.2.4 · Tailwind CSS v4 · TypeScript
**Deploy:** Vercel (auto-deploy via push na `main`) · Hobby plan
**Domínio:** `douglima.work` (Cloudflare DNS, propagado)
**Repo:** `~/Projects/doug-lima` → `github.com/doug-slima/doug-lima`

---

## 2. Infraestrutura

| Item | Status | Detalhes |
|---|---|---|
| Repo GitHub | ✅ | `doug-slima/doug-lima`, branch `main` |
| Vercel | ✅ | Auto-deploy na `main` |
| Cloudflare DNS | ✅ | `brenda.ns.cloudflare.com` + `zod.ns.cloudflare.com` |
| Domínio na Vercel | ✅ | `douglima.work` + `www.douglima.work` |
| Variável NDA | ⚠️ | `.env.local`: `NDA_PASSWORD=dvault` — **falta adicionar na Vercel** |
| 2FA Vercel | ✅ | Configurado |
| Email personalizado | ⏳ | Cloudflare Email Routing: `hello@douglima.work` → Gmail. Pendente. |

---

## 3. Rotas

```
/        → Home ✅
/track   → Bio + timeline de carreira ✅
/craft   → Playground ✅ + Selected Works (password gate dvault) ✅
```

---

## 4. Assets

**IMPORTANTE:** assets globais em `public/assets/home/` — não `public/assets/` raiz.

| Grupo | Pasta | Conteúdo |
|---|---|---|
| Global | `home/` | Lettering (default + hover), monograma, mosaico, avatares, substack-logo, linkedin-logo |
| Timeline | `companies-page-track/` | 12 logos: espm, klauvi, mercado-livre, olist, aprender-design, hash, ied, kyvo, ifood, livework, unifei, itau |
| Playground | `playground-works/` | Agroprop (12 imgs), LFC (14 imgs), Proxy (9 imgs), Purple (6 imgs) — cada pasta tem logo |
| Selected Works | `selected-works/` | `project-picking-handheld/` (9 imgs + logo) · `project-checkin-desktop/` (11 imgs + logo) |

---

## 5. Páginas

### Home (`/`)

- Server component (sem `"use client"`)
- `PageLayout` com `footerContent={<ContactButton />}` → `PageFooter variant="static"` no rodapé
- Tagline: Geist Light clamp(28px,7.5vw,32px) mobile / 40px desktop — in-flow abaixo do header
- Mosaico: 120s linear, `w-[1272px]` alinhado à direita, todos os estilos críticos em inline `style`
- Content: var(--header-h) mobile (clamp 108-112px) · pt-[72px] desktop via .page-content-pt

---

### Track (`/track`) ✅ Completa

**Desktop:** ver DESIGN-SYSTEM.md Seção 8. `px-[300px]` · `paddingTop: 160px` · sem `center` no footer.

**Mobile:**
```
<div bg-bg-base min-h-screen>
  <Header />                               ← fixed z-40, Variante A (sem block2)
  <div px-8 pb-10 style={paddingTop: "var(--header-h)"}>
    <p>"20 years..."</p>                   ← Geist Light clamp(28px,7.5vw,32px)
    <div flex flex-col>
      {timeline.map(e => <TimelineItem entry={e} />)}
    </div>
    <Monogram widthClass="w-[123px]" className="mt-12" />
  </div>
</div>
<BackToTopButton paddingBottom={73} />
```

**Timeline:**
- Array declarado mais recente primeiro (2026 → 2011)
- Logo sizing encapsulado em `TimelineItem`: `w-[68px] h-auto` → ESPM, Olist, IED, Kyvo, iFood, Livework; `max-h-[40px]` → Mercado Livre; `max-h-[48px]` → Klauvi, Aprender Design, Hash, Unifei, Itaú; `max-h-[36px]` → default

---

### Craft (`/craft`)

**Desktop:** ver DESIGN-SYSTEM.md Seção 8. `px-[10.5rem]` · `paddingTop: 200px` · `BlurOverlay height=280 solidUntil="80%"` · Header com `block2`.

**Mobile:**
```
<div bg-[#313621]>
  <Header />                               ← Variante A, SIBLING do card (nunca filho)
  <div card z-30 translateY-spring rounded-b-[24px] shadow>
    <div px-8 pb-8 style={paddingTop: "var(--header-h)"}>
      <SectionDropdown />                  ← scrollável com o card (não fixo no header)
      <NavSelector -mx-8 px-8 overflow-x-auto />
      info block: h-[120px] · logo h-[56px] w-auto
      imagens: -mx-5 · gap-3 → 12px nas laterais (= gap entre imagens)
      <Monogram widthClass="w-[123px]" className="mt-8" />
    </div>
  </div>
</div>
<BackToTopButton paddingBottom={180} zIndex={40} />    ← aparece quando footerRevealed
<PrevNextBar onPrev onNext />                           ← z-20, sempre presente
```

**Alturas mobile:**
- Header: `pt-[44px]`(44) + logo`h-[clamp(28px,7.5vw,32px)]` + `pb-3`(12) + gradiente(24) = `--header-h: clamp(108px, calc(80px + 7.5vw), 112px)`
- Card jump: `translateY(-104px)` → BackToTopButton `paddingBottom={180}`

**Password Gate:** senha `dvault`. Escape volta para Playground.

**REGRA — Header fora do card:** `position: fixed` dentro de ancestral com CSS `transform` perde o viewport como containing block — o header se moveria com o card. Manter `<Header />` como sibling do `cardRef`, nunca filho.

---

## 6. Tarefas pendentes

### Esta sessão — Ajustes finais mobile ✅ Concluída

| # | Tarefa | Status |
|---|---|---|
| 1 | BackToTopButton — `pl-6 pr-5`, `text-[20px]`, hover `bg-[#E8E9D9]` | ✅ `components/BackToTopButton.tsx` |
| 2 | PrevNextBar — `font-geist font-light`, hover `text-[#C7FF04]`, currentColor nos ícones | ✅ `craft/PrevNextBar.tsx` |
| 3 | Auditoria visual mobile (screenshots Mobile Final 1–6) | ✅ Desktop ✅ + Mobile ✅ |
| 4 | BackToTopButton adicionado ao Track mobile (descoberta da auditoria) | ✅ `track/page.tsx` |
| 5 | Responsividade fluida — movida para PRD | ✅ `docs/PRD-RESPONSIVIDADE-FLUIDA.md` |

### Sessão 22 — Responsividade fluida ✅ Concluída

PRD executado em `docs/PRD-RESPONSIVIDADE-FLUIDA.md`. Todos os valores foram ajustados iterativamente com base em testes visuais.

**Valores finais implementados:**
```
Logo mobile:     h-[clamp(28px,7.5vw,32px)] md:h-[40px]
Pills mobile:    pillHeight="h-[clamp(28px,7.5vw,32px)] md:h-[40px]"
Pills padding:   px-[clamp(12px,3.5vw,20px)] md:px-5
--header-h:      clamp(108px, calc(80px + 7.5vw), 112px)
Header mobile:   px-8 pt-[44px] pb-3 (+ gradiente 24px)
Conteúdo px:     px-8 (mobile) / md:px-[72px] (desktop)

craft pt:        style={{ paddingTop: "var(--header-h)" }}
track pt:        style={{ paddingTop: "var(--header-h)" }}
home pt:         .page-content-pt class → var(--header-h) mobile / 72px desktop

Taglines:        text-[clamp(28px,7.5vw,32px)]
Imagens craft:   -mx-5 (12px nas laterais = gap entre imagens)
```

### Depois desta sessão

- [ ] Transições entre páginas — em discussão
- [ ] `NDA_PASSWORD` na Vercel (painel → Environment Variables → `dvault`)
- [ ] Meta tags (og:image, description, favicon)
- [ ] Cloudflare Email Routing (`hello@douglima.work` → Gmail)

### Sanity-check antes do launch v1

**Deletar deprecated:**
```bash
rm app/components/ControlPill.tsx app/components/ScrollColumn.tsx
rm app/hooks/useSplitLayout.ts app/hooks/useFooterAnimation.ts
rm app/craft/ProjectCarousel.tsx app/craft/ProjectSelector.tsx
# verificar imports órfãos:
grep -r "ControlPill\|ScrollColumn\|useSplitLayout\|useFooterAnimation\|ProjectCarousel\|ProjectSelector" app/
```

**Verificações:**
- [ ] `npm run build` sem erros
- [ ] `NDA_PASSWORD` na Vercel
- [ ] Testar iOS Safari (dvh, safe-area-inset)
- [ ] Testar Chrome mobile (375px + 430px)
- [ ] Reduce Motion — animações desativadas
- [ ] Password gate: senha `dvault`, Escape fecha, erro exibe
- [ ] Imagens de projeto carregam (playground + selected works)
- [ ] ContactButton mobile — painel, links, copy
- [ ] BackToTopButton em todas as páginas mobile
- [ ] Parallax footer desktop (craft + track)

---

## 7. Arquitetura — Decisões e Deprecated

### Arquivos deprecated (deletar no sanity-check)

| Arquivo | Substituto |
|---|---|
| `components/ControlPill.tsx` | `FooterBackToTop` (exportado de `PageFooter`) |
| `components/ScrollColumn.tsx` | div `absolute inset-0 overflow-y-auto` direto |
| `hooks/useSplitLayout.ts` | padrão content-module + `useScrollParallax` |
| `hooks/useFooterAnimation.ts` | `useScrollParallax` + `PageFooter variant="inline"` |
| `craft/ProjectCarousel.tsx` | conteúdo inline em `craft/page.tsx` |
| `craft/ProjectSelector.tsx` | `NavSelector` via `block2` no Header |

### Decisões de produto (não óbvias no código)

- **Bloco 2 mobile da craft scrolla com o conteúdo** — não fixo no header. Decisão intencional: dar mais espaço ao conteúdo ao rolar.
- **`<Header />` deve ser sibling do `cardRef`, nunca filho** — CSS `transform` em ancestral quebra `position: fixed`.
- **ContactButton é universal** — painel ancorado via `relative`/`absolute bottom-0 right-0` ao trigger. Nunca hardcodar coordenadas de viewport.
- **Imagem containers na craft:** `w-full overflow-hidden`, sem arredondamento, sem fundo.
- **`h-dvh` em containers full-height mobile** — nunca `h-screen`. iOS Safari/Chrome adaptam com dvh.
- **Inline style para valores críticos** — cores de identidade dark e box-shadows ficam em inline style. Evita purge, centraliza no componente.
- **Mosaico:** `MosaicBackground` com todos os estilos de positioning em inline `style` — Tailwind purga classes arbitrárias quando o bundle é regenerado por mudanças não relacionadas.

### Pass de responsividade — ✅ Implementado na Sessão 22

Valores fluid implementados com `clamp()`. Ver seção 6 — Sessão 22 para referência rápida de valores.

### Componentes — inventário rápido

Ver DESIGN-SYSTEM.md Seção 3 para specs completas com props e exemplos.

**Ativos:** Header · NavSelector · PageLayout · PageFooter · BlurOverlay · TimelineBlock · MosaicBackground · Monogram · BackToTopButton · ContactButton · SectionDropdown · PrevNextBar · TimelineItem · PasswordGate
**Hooks ativos:** `useScrollParallax`
**Deprecated:** ver tabela acima

---

## 8. Workflow

1. Planejamento e refinamento visual → Claude.ai
2. Specs e interações → `docs/PRD-*.md`
3. Execução de código → Claude Code (Sonnet 4.6)
4. Validação visual → Doug roda `npm run dev`, envia screenshots, ajustamos
5. Assets → Doug exporta do Figma para `public/assets/`, Claude Code consome

---

## 9. Learnings das sessões

> Catálogo de erros para não repetir. Sessões recentes com detalhamento completo. Sessões 2–7 comprimidas ao essencial não-óbvio.

---

### Sessões 2–7 — Fundações (comprimido)

- **Tailwind purge:** classes arbitrárias em template literals são purgadas. Usar inline `style` para valores dinâmicos ou condicionais — `style={{ backgroundColor: "#C7FF04" }}` sempre vence className.
- **`group`/`group-hover` nomeados** (`group/avatar`): hover isolado em elementos específicos dentro de um container sem afetar outros.
- **`ring` usa `box-shadow`** — ao adicionar `boxShadow` inline, o ring some. Usar `border` inline + `boxShadow` separado.
- **Ordem de dados:** exibição segue a ordem do array. Para inverter timeline, reordenar o array.
- **`backdropFilter` requer conteúdo por trás.** `WebkitBackdropFilter` obrigatório para Safari.
- **Posicionamento de overlay:** ancorar via `position: relative` no container + `absolute` no painel. Nunca hardcodar coordenadas de viewport.

---

### Sessão 8 — Mobile (craft + track)

#### ❌ Erros — NÃO repetir

1. **Não ler `PageLayout` antes de calcular altura do header.** Total = `pt-10`(40) + logo(32) + `pb-6`(24) = 96px sólido + 24px gradiente = **120px visual**.

2. **`pt` do content = header sólido + gradiente.** Nunca só o sólido — conteúdo fica dentro do fade.

3. **Tailwind class purgada em altura de gradiente.** Usar `style={{ height: "24px" }}` inline para alturas críticas.

4. **`bg-transparent` em className sobrepõe `bg-[#C7FF04]`.** Aplicar cor de fundo ativa sempre via inline style.

5. **Não verificar `BlurOverlay` existente antes de criar gradiente do zero.**

6. **`pointer-events-none` no wrapper sem `pointer-events-auto` no conteúdo** → header não clicável.

---

### Sessão 9 — Mobile polish

#### ❌ Erros — NÃO repetir

1. **`top: "50%"` sem `transform: "translateY(-50%)"`.** Para centralizar um elemento: sempre usar os dois juntos.

2. **`ring-1` + `boxShadow` inline → ring some.** Usar `border` inline + `boxShadow` separado.

3. **z-index do dropdown:** `fixed` com ref para medir trigger é desnecessariamente complexo. `z-index: 30` + posição abaixo da zona do gradiente resolve.

4. **Alterar padding não solicitado ao reposicionar elemento** → regressão visual. Só alterar o que foi explicitamente pedido.

5. **Espaçamento em duas fontes de verdade** (wrapper + componente). Espaçamento pertence ao componente — uma responsabilidade.

---

### Sessão 11 — Extração de componentes, a11y, PasswordGate

#### ❌ Erros — NÃO repetir

1. **`Write` sem `Read` prévio** → erro "File has not been read yet." Para edições pontuais, preferir `Edit` (não exige Read).

2. **Diagnóstico incompleto de pointer events:** tentar corrigir o handler sem examinar o DOM. O container do `BackToTopButton` (full-width, 225px altura, `pointer-events: auto`) bloqueava eventos. Investigar z-index e pointer-events hierarchy primeiro.

3. **Importação órfã após refatoração.** Ao remover uso de uma importação, remover o import junto.

---

### Sessão 14 — Header craft desktop, BlurOverlay configurável

#### ❌ Erros — NÃO repetir

1. **BlurOverlay não cobria header dois blocos.** `h-[185px]` cobre PageNav mas não MenuNav. Calcular altura total do header ao configurar `blurHeight`.

2. **`scrollTop + clientHeight >= scrollHeight - 10` dispara antes do fim** quando há `paddingBottom`. Usar `getBoundingClientRect()` para posição real do último elemento.

---

### Sessão 15 — useFooterAnimation, PageFooter, refatoração craft + track

#### ❌ Erros — NÃO repetir

1. **Exit do footer anchorado ao threshold `atEnd`** — timing errado. O usuário precisava rolar `footerHeight` pixels de volta antes do footer começar a sair. Correto: anchorar em `enterScrollTopRef` (scrollTop exato no fim do enter). Exit começa ao primeiro pixel de scroll-back.

2. **JSX duplicado ao mover footer no DOM.** Ao mover JSX de posição, sempre remover o original.

3. **`Edit` falhou por string não encontrada após edição anterior.** Ao fazer múltiplas edições no mesmo arquivo, reler o trecho com `Read + offset` antes da próxima edição.

---

### Sessão 16 — Scroll-driven enter, ajustes Track + Craft desktop

#### ❌ Erros — NÃO repetir

1. **`h-[280px] flex items-center` quebrou timeline.** `flex` sem `flex-col` = row direction. Correto: `flex flex-col justify-center`.

2. **`Edit` "string not found" após edição encadeada.** Reler com `Read + offset` antes de cada edição no mesmo arquivo.

3. **`paddingBottom = footerHeight + BOUNCE_PX`** criava espaço vazio visível. Correto: `paddingBottom = footerHeight` exato, sem bounce buffer.

---

### Sessão 17 — ContactButton min-width fix

**Padrão aprendido:** em `flex-col items-end`, quando o filho mais largo muda de tamanho, o container encolhe e todos os filhos parecem deslocados. `min-w` = máximo dos filhos estáticos resolve — sem spans invisíveis para fixar largura.

---

### Sessão 18 — Header unificado block2, SectionDropdown overlay

#### ❌ Erros — NÃO repetir

1. **Overlay implementado com dois elementos separados.** A técnica de overlay é: wrapper com height fixa (reserva espaço no layout) + pill `absolute top-0 left-0 right-0` (expande downward). Estrutura interna dos botões permanece intacta.

2. **Tailwind não inclui classes de template literal** (`` `rounded-[${N}px]` ``). Usar `style={{ borderRadius: `${N}px` }}` + `matchMedia` para responsividade.

3. **Não recalcular `pt` do content após alterar padding do header.** Regra: sempre recalcular cascade de alturas ao alterar qualquer padding do header.

#### Definições desta sessão

- **Bloco 2 mobile da craft scrolla com o conteúdo** — não fixo no header. Decisão de produto.
- **Border radius proporcional:** `openRadius = triggerHeight / 2` — regra universal do SectionDropdown.
- **`pt` do content = header sólido + gradiente.** Zero gap entre gradiente e início do conteúdo.

---

### Sessão 22 — Responsividade fluida, ajustes de spacing mobile

#### Entregas

- CSS custom property `--header-h: clamp(108px, calc(80px + 7.5vw), 112px)` com override desktop `72px`.
- Classe `.page-content-pt` em globals.css para garantir que desktop receba `72px` explícito (CSS variable override via `@media` pode não resolver corretamente com inline style em Tailwind v4).
- Logo e pills: `h-[clamp(28px,7.5vw,32px)] md:h-[40px]` — fluid mobile, fixo desktop.
- Pill padding: `px-[clamp(12px,3.5vw,20px)] md:px-5` — fluid mobile.
- Padding lateral mobile: `px-8` (32px) em todas as páginas — header, conteúdo, card craft.
- Header mobile: `pt-[44px]` superior · `pb-3` abaixo do logo.
- Taglines: `text-[clamp(28px,7.5vw,32px)]` em home e track.
- Imagens craft: `-mx-5` → 12px nas laterais (alinhado com `gap-3` entre imagens).
- Craft desktop: `paddingTop: 200px` (era 240px) — reduz gap visual abaixo do block2.
- Track: removido `-mx-2` do timeline — alinhado com `px-8` do conteúdo.

#### Aprendizado técnico

- **CSS variable override com `@media` + inline style:** inline style sempre vence sobre classes Tailwind, mas `var(--CSS-property)` resolve no momento do paint. Se a override de media query do `:root` não funcionar como esperado (possível issue com Tailwind v4 processing), a solução robusta é usar uma CSS class explícita com sua própria media query — a classe tem menor especificidade que inline style, mas como removemos o inline style e usamos apenas a classe, funciona corretamente.
- **Cascade automático via CSS custom property:** ao mudar qualquer valor do header mobile, só é necessário atualizar `--header-h` em globals.css — todas as 3 páginas acompanham automaticamente.

---

### Sessão 21 — Ajustes finais mobile, auditoria visual, PRD responsividade

#### Entregas

- `BackToTopButton`: `px-5` → `pl-6 pr-5`, `text-[18px]` → `text-[20px]`, hover `bg-[#E8E9D9] border-transparent`.
- `PrevNextBar`: `font-fenix` → `font-geist font-light`, cor via `text-[#FAFAF5]` em className (não inline style), hover `text-[#C7FF04]`, ícones passam a usar `currentColor`.
- `track/page.tsx`: adicionado `BackToTopButton` no mobile — `useState footerRevealed` + scroll listener no `window` + render condicional com `paddingBottom={73}`. Estava ausente (descoberto na auditoria visual).
- PRD de responsividade fluida criado em `docs/PRD-RESPONSIVIDADE-FLUIDA.md`.

#### Sem erros novos esta sessão.

---

### Sessão 19 — useScrollParallax, PageFooter inline, arquitetura footer

#### ❌ Erros — NÃO repetir

1. **Parallax com fórmula delta-based** (`offset += delta × factor`): drift por acúmulo de float. Correto: `factor × (scrollTop − scrollMax)` — determinístico, sem estado acumulado.

2. **Footer por cima do carrossel** (valor positivo empurrava footer para baixo, saindo mais rápido). Correto: valor sempre ≤ 0 — footer move a 60% da velocidade do scroll.

3. **`flushSync` dentro de `useEffect`** → erro "flushSync was called from inside a lifecycle method." Nunca usar `flushSync` em `useEffect`. Para separar dois `setState` no mesmo effect, usar `queueMicrotask`.

4. **Elemento removido acidentalmente ao reescrever arquivo inteiro.** Ao reescrever um arquivo, conferir todos os elementos do layout original antes de finalizar.

#### Definições desta sessão

- **Footer desktop padrão:** `PageFooter variant="inline"` in-flow no scroll container + `useScrollParallax factor=0.4`. Nunca footer `absolute bottom-0` fora do scroll container.
- **Z-layering:** `isolation: isolate` no scroll container + `relative z-10` no conteúdo → conteúdo passa sobre footer. Ver DESIGN-SYSTEM.md Seção 8.
