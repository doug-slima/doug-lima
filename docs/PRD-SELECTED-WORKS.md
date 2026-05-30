# PRD — Selected Works (`/craft` → seção protegida por NDA)

> Próxima sessão de implementação.
> Criado em: 30 mai 2026

---

## 1. Objetivo

Implementar a seção **Selected Works** na página `/craft`, com exatamente os mesmos padrões visuais e de comportamento definidos para o Playground, acrescida de proteção por senha (NDA).

---

## 2. O que já está pronto (não mexer)

- `ProjectCarousel.tsx` — coluna direita (info block + image displays)
- `ProjectSelector.tsx` — seletor vertical em 50vh
- `data.ts` — array `"selected-works"` aguarda apenas os dados reais
- `useSplitLayout` com `resetDeps` — já suporta troca de projeto

O mecanismo de troca de seção (Playground ↔ Selected Works) já funciona. Basta popular os dados e implementar a proteção.

---

## 3. Assets necessários (Doug prepara antes da sessão)

Criar a pasta `public/assets/selected-works/` com uma subpasta por projeto, seguindo exatamente o mesmo padrão do Playground:

```
public/assets/selected-works/
├── NomeDoProjeto1/
│   ├── nomeprojeto1-logo.png     ← logo para o info block (max-width 400px)
│   ├── nomeprojeto1-1.png        ← image-display 1
│   ├── nomeprojeto1-2.png        ← image-display 2
│   └── ...
├── NomeDoProjeto2/
│   └── ...
└── ...
```

**Specs das imagens:**
- Logo: PNG, fundo transparente ou branco, tamanho livre (será contido em 400px × 144px)
- Image displays: PNG, proporção livre — altura padrão 527px (se uma imagem tiver proporção diferente e precisar de hug, Doug avisa e implementamos `hugLast: true`)

---

## 4. Dados a preencher em `data.ts`

Substituir os placeholders do array `"selected-works"`:

```ts
"selected-works": [
  {
    name: "Nome do Projeto",       // aparece no seletor e no info block
    label: "tipo do trabalho",     // linha 1 do info block (Geist Semibold 24pt)
    logo: "/assets/selected-works/NomeDoProjeto/logo.png",
    images: Array.from({ length: N }, (_, i) =>
      `/assets/selected-works/NomeDoProjeto/nomeprojeto-${i + 1}.png`
    ),
    hugLast: true,  // opcional — só se a última imagem precisar de hug height
  },
  // ... demais projetos
],
```

**Pontos a confirmar com Doug:**
- Nomes exatos dos projetos
- Label de cada projeto (ex: "product design", "ux research", "design system")
- Quantas imagens por projeto
- Algum projeto com `hugLast`?

---

## 5. Proteção NDA

A seção Selected Works é visível no seletor para todos os visitantes, mas ao clicar em qualquer projeto da seção, o conteúdo só é exibido após autenticação por senha.

### 5.1 Fluxo

```
User clica em "Selected Works"
        ↓
Verifica cookie httpOnly "sw_auth"
        ↓
[sem cookie]              [cookie válido]
     ↓                          ↓
Tela de senha            Exibe conteúdo normalmente
     ↓
User digita senha
     ↓
Server Action valida vs. env var NDA_PASSWORD
     ↓
[errada] → erro inline    [correta] → seta cookie + exibe conteúdo
```

### 5.2 Implementação técnica

**Env var (Vercel):**
```
NDA_PASSWORD=<senha definida pelo Doug>
```

**Middleware (`middleware.ts` na raiz):**
- Intercepta requisições para `/craft` quando `activeSection === "selected-works"`
- Verifica cookie `sw_auth`
- Se inválido: não redireciona (a proteção é client-side via Server Action, não por rota separada)

**Alternativa mais simples — proteção client-side com Server Action:**
- Ao trocar para "selected-works", verificar estado `isAuthenticated` (inicialmente `false`)
- Se não autenticado: renderiza `<PasswordGate>` no lugar do `ProjectCarousel`
- Server Action `verifyPassword(pwd)` compara com `process.env.NDA_PASSWORD`
- Sucesso: `isAuthenticated = true` + seta cookie `sw_auth` (httpOnly, 30 dias)
- Próximas visitas: ao montar o componente, faz um Server Action `checkAuth()` que lê o cookie

### 5.3 Tela de senha (`PasswordGate`)

Exibida no lugar do `ProjectCarousel` quando não autenticado na seção Selected Works.

**Visual (a definir com Doug — sugestão):**
- Centralizada na coluna direita (mesma área do carrossel)
- Input de senha: estilo minimalista, sem borda visível, texto Geist Light
- Placeholder: "enter password"
- Submit: tecla Enter ou botão invisível
- Erro: mensagem inline sutil ("wrong password" — Geist Light, `text-text-muted`)
- Sem label "password", sem título — minimalismo total

**Ponto a confirmar:** Doug aprova o visual da tela de senha antes de implementar.

---

## 6. Checklist da sessão

### Pré-sessão (Doug faz antes)
- [ ] Exportar assets dos projetos Selected Works do Figma
- [ ] Criar estrutura de pastas em `public/assets/selected-works/`
- [ ] Definir nomes, labels e senha NDA
- [ ] Configurar `NDA_PASSWORD` no `.env.local` (para dev) e na Vercel (para prod)

### Durante a sessão (Claude Code executa)
- [ ] Preencher `"selected-works"` em `data.ts` com dados reais
- [ ] Implementar Server Action `verifyPassword` + `checkAuth`
- [ ] Criar componente `PasswordGate`
- [ ] Integrar proteção no `page.tsx` (renderização condicional)
- [ ] Testar fluxo completo: sem cookie → senha errada → senha correta → reload mantém acesso
- [ ] Validar que Playground não é afetado

---

## 7. Referências

- Padrão visual: idêntico ao Playground (ver `docs/SESSION-HANDOFF-PORTFOLIO.md`, seção 11)
- Componentes reutilizados: `ProjectCarousel`, `ProjectSelector`, `useSplitLayout`
- Dados: `app/craft/data.ts`
