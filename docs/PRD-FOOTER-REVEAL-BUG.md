# PRD — Bug: Footer Reveal Mobile (Craft)

> Criado na Sessão 23. Para resolver na próxima sessão.
> Imagens de referência em `docs/context-work-sessions/Mobile Final/`

---

## Comportamento esperado

Quando o utilizador termina de fazer scroll na página `/craft` (mobile), o card do carrossel deve **automaticamente subir 104px** (`translateY(-104px)`) revelando o `PrevNextBar` abaixo — sem necessitar de forçar scroll adicional.

Referência visual: `exemplo-footer-projetos.png`

---

## Comportamento actual

O card não sobe na primeira vez que o utilizador chega ao fundo. Só sobe depois de fazer over-scroll/rubber-band. Referência: `bug-scroll-footer-mobile-1.PNG`.

A variável de estado `footerRevealed` pode estar a ficar `true` (o `BackToTopButton` aparece), mas o card não move — ou então `footerRevealed` nunca fica `true` no scroll normal.

---

## Arquitectura relevante (`app/craft/page.tsx`)

```
Mobile DOM:
<div bg-[#313621]>                    ← outer dark wrapper
  <Header />                          ← fixed z-40
  <div card z-30 card-reveal>         ← transform: translateY(-104px) quando footerRevealed
    <div px-8 pb-8 paddingTop=var(--header-h)>
      ... conteúdo do projecto ...
      <div mt-8><Monogram /></div>
    </div>
  </div>
  <div ref={sentinelRef} style={{marginTop:"-104px", height:"1px"}} />  ← sentinel actual
</div>
<BackToTopButton />   ← fixed, render condicional: !showPasswordGate && footerRevealed
<PrevNextBar />       ← fixed z-20, sempre presente
```

**`footerRevealed`:**
- `true` → card `translateY(-104px)` + `BackToTopButton` aparece
- `false` → card `translateY(0)` + `BackToTopButton` escondido
- Reset explícito: `handlePrev()`, `handleNext()`, `handleSectionChange()`

**`.card-reveal` (globals.css):**
```css
.card-reveal { transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
@media (prefers-reduced-motion: reduce) { .card-reveal { transition: none; } }
```

---

## Historial de tentativas falhadas

### Tentativa 1 — Scroll listener reactivo
```js
const atBottom = window.scrollY + window.innerHeight >= document.scrollHeight - 10;
setFooterRevealed(atBottom);
```
**Falhou:** A spring animation do card dispara micro scroll events no iOS Safari que chegam com `atBottom = false`, revertendo o estado a meio da animação.

### Tentativa 2 — Latch com nearTop
```js
if (atBottom) setFooterRevealed(true);
if (window.scrollY < 50) setFooterRevealed(false);
```
**Falhou:** Para conteúdo curto, `atBottom` e `nearTop` são ambos `true` em `scrollY=0`. O React batcha os dois setState — o último (`false`) vence. Adicionalmente criou um espaço branco no fundo da página.

### Tentativa 3 — IntersectionObserver no Monogram (dentro do card)
```js
const observer = new IntersectionObserver(
  ([entry]) => setFooterRevealed(entry.isIntersecting),
  { threshold: 0 }
);
observer.observe(monogramRef.current); // monogram é filho do card
```
**Falhou:** O `Monogram` é filho do card. Quando `footerRevealed=true` e o card sobe 104px, o Monogram também sobe 104px (herda o transform). Se o Monogram estava perto do topo do viewport quando o IO disparou, passa a estar acima do viewport → `isIntersecting = false` → `footerRevealed = false` → card desce → Monogram volta → `isIntersecting = true` → **loop de oscilação**.

### Tentativa 4 — IntersectionObserver no sentinel (fora do card, estado actual)
```js
// sentinel: <div ref={sentinelRef} style={{ marginTop: "-104px", height: "1px" }} />
// colocado APÓS o card, como sibling, dentro do outer div
const observer = new IntersectionObserver(
  ([entry]) => setFooterRevealed(entry.isIntersecting),
  { threshold: 0 }
);
observer.observe(sentinelRef.current); // sentinel é sibling do card
```
**Ainda falha.** O sentinel é sibling correcto (sem feedback loop), mas o trigger ainda não dispara no momento certo.

---

## Diagnóstico do problema raiz

### Hipótese mais provável: `window.innerHeight` vs barra do browser

A barra de navegação inferior do Chrome (~60px com ← → + ⊟) **não é incluída em `window.innerHeight`**. O `document.scrollHeight` é calculado correctamente, mas o utilizador não consegue chegar aos últimos ~60px do documento via scroll natural — estão escondidos atrás do chrome do browser.

Resultado: `window.scrollY + window.innerHeight < document.scrollHeight - 10` mesmo quando o utilizador chegou ao fundo visual. Só com over-scroll (rubber-band, que faz `scrollY` ultrapassar o limite) é que a condição dispara.

O mesmo afecta o `IntersectionObserver`: se o sentinel estiver na zona coberta pela barra do browser, não é considerado "intersecting" pelo IO (o IO usa o visual viewport, que exclui o chrome do browser).

### Evidência
- `bug-scroll-footer-mobile-2.PNG` mostra o estado correcto (card subiu) com a barra do Chrome visível **abaixo** do PrevNextBar — confirmando que a barra está fora do visual viewport.
- O trigger só funciona ao fazer over-scroll, que empurra `scrollY` para além do limite natural.

---

## Abordagem recomendada para a próxima sessão

### Opção A — Padding no outer wrapper (mais simples)

Adicionar `paddingBottom` ao outer dark wrapper igual à altura do `PrevNextBar` (104px). Isto aumenta o `document.scrollHeight` em 104px, tornando o sentinel (actualmente com `marginTop: -104px`) acessível dentro do scroll natural, mesmo com a barra do browser a cobrir os últimos 60px.

```jsx
<div className="block md:hidden"
     style={{ backgroundColor: "#313621", paddingBottom: "104px" }}>
  <Header />
  <div card ...>...</div>
  <div ref={sentinelRef} style={{ marginTop: "-104px", height: "1px" }} />
</div>
```

**Como funciona:**
- Outer wrapper fica 104px mais alto
- Sentinel está a 104px do NOVO fundo (que é 104px mais baixo que antes)
- O utilizador consegue fazer scroll até ao sentinel sem rubber-band
- O sentinel permanece sibling do card → sem feedback loop ✓

**Risco:** O fundo do outer wrapper (104px escuro extra) pode ser visível antes do card subir — verificar visualmente.

---

### Opção B — `visualViewport` API + scroll listener robusto

Usar `window.visualViewport.height` em vez de `window.innerHeight` e aumentar o threshold para acomodar o chrome do browser:

```js
useEffect(() => {
  const onScroll = () => {
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const atBottom = window.scrollY + vh >= document.documentElement.scrollHeight - 80;
    if (atBottom) setFooterRevealed(true);
    // Só reset explícito via Prev/Next/section change
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", onScroll);
  }
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.visualViewport?.removeEventListener("resize", onScroll);
  };
}, []);
```

**`-80` em vez de `-10`:** cobre a barra do browser (~60px) com margem.
**`footerRevealed` como latch (nunca false via scroll):** elimina o risco de revert durante a animação. Reset apenas via Prev/Next.
**`visualViewport resize`:** recalcula quando o chrome do browser mostra/esconde (URL bar).

**Risco:** Com latch, ao scrollar para cima o card permanece em `-104px`. Resolver com reset quando `scrollY === 0` (já que Prev/Next fazem scroll to top explícito).

---

### Recomendação

Começar pela **Opção A** — é uma mudança de 1 linha e elimina a causa raiz (document scrollável não chega ao sentinel). Se ainda falhar visualmente, combinar com **Opção B** como fallback do trigger.

---

## Ficheiros relevantes

| Ficheiro | O quê |
|---|---|
| `app/craft/page.tsx` | Estado `footerRevealed`, sentinel ref, useEffect IO, card transform |
| `app/globals.css` | `.card-reveal` transition, `--header-h` |
| `app/craft/PrevNextBar.tsx` | Footer mobile fixo, z-20, bg `#313621` |
| `app/components/BackToTopButton.tsx` | Render condicional em `footerRevealed` |

## Imagens de referência

| Ficheiro | O quê |
|---|---|
| `docs/context-work-sessions/Mobile Final/exemplo-footer-projetos.png` | Estado correcto desejado |
| `docs/context-work-sessions/Mobile Final/bug-scroll-footer-mobile-1.PNG` | Estado errado — card não subiu |
| `docs/context-work-sessions/Mobile Final/bug-scroll-footer-mobile-2.PNG` | Estado correcto após over-scroll (mostra barra Chrome) |
| `docs/context-work-sessions/Mobile Final/bug-scroll-footer-mobile-3.PNG` | Estado errado após fix da Sessão 23 |
