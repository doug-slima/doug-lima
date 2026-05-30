# PRD — Craft: Página de Senha NDA (Fix)

> 30 mai 2026

---

## 0. Regra única

O ÚNICO arquivo a ser alterado é a page da senha NDA dentro de `/craft`. Não altere NENHUM outro arquivo. Nem Header, nem PageLayout, nem globals.css, nem nenhuma outra page.

---

## 1. Problema

A página de senha NDA em `/craft` tem dois bugs visuais:

1. O input de senha está largo demais — ocupa quase a largura inteira da página
2. O bloco de conteúdo (título + subtítulo + input) não está centralizado no viewport

---

## 2. Estado desejado

O bloco de senha deve ser um componente compacto, centralizado **horizontal e verticalmente** no espaço disponível da viewport (abaixo do header).

Visualmente:

```
┌──────────────────────────────────────────────┐
│  doug_lima.                    craft   track  │  ← header (não mexer)
│                                               │
│                                               │
│                                               │
│        This section is protected by NDA       │
│         please enter the password below:      │
│                  [ •••••• ]                   │
│                                               │
│                                               │
│                                               │
│  swipe-up                                     │
│  [monograma]                                  │
└──────────────────────────────────────────────┘
```

O bloco `título + subtítulo + input` fica centrado no meio da viewport, tanto no eixo X quanto no Y.

---

## 3. Implementação exata

O container que envolve o bloco de senha precisa de:

```
flex flex-col items-center justify-center
```

E precisa ocupar o espaço vertical disponível (entre o header e o footer/monograma). Usar `flex-1` ou `min-h-[algo]` para que o justify-center funcione.

### Título

```
"This section is protected by NDA"
```
- Fenix Regular, ~20px, cor #5F6A50
- `text-center`

### Subtítulo

```
"please enter the password below:"
```
- Fenix Regular, ~16-18px, cor #5F6A50
- `text-center`

### Input de senha

- **Largura máxima contida:** `max-w-[200px]` ou `w-[200px]` — NÃO pode ser `w-full`
- Se o input tem `w-full`, ele precisa estar dentro de um container que limite a largura
- `mx-auto` para centralizar se não estiver dentro de um flex com items-center
- Background: `#F0EEE5` ou similar (surface-tag)
- Border: `1px solid` com cor suave ou `border` com rounded
- `border-radius` suave (8px)
- `text-center` para os dots ficarem centrados dentro do input
- `type="password"`
- Margem top do input em relação ao subtítulo: ~16-24px

### Estrutura HTML esperada

```tsx
{/* Container que ocupa o espaço disponível e centraliza */}
<div className="flex-1 flex flex-col items-center justify-center">
  
  {/* Título */}
  <h2 className="text-center" style={{ fontFamily: 'var(--font-fenix-var)', fontSize: '20px', color: '#5F6A50' }}>
    This section is protected by NDA
  </h2>
  
  {/* Subtítulo */}
  <p className="text-center mt-2" style={{ fontFamily: 'var(--font-fenix-var)', fontSize: '16px', color: '#5F6A50' }}>
    please enter the password below:
  </p>
  
  {/* Input — largura contida, centralizado */}
  <input
    type="password"
    className="mt-4 w-[200px] text-center rounded-lg border px-4 py-3"
    style={{ backgroundColor: '#F0EEE5', borderColor: '#E5E3DA', color: '#5F6A50' }}
  />
  
</div>
```

---

## 4. O que NÃO fazer

- NÃO usar `w-full` no input
- NÃO usar `w-full` no container do bloco de senha (ele deve ser compacto e centrado, não esticado)
- NÃO alterar Header.tsx
- NÃO alterar PageLayout.tsx
- NÃO alterar globals.css
- NÃO alterar a home ou a track
- NÃO adicionar novas dependências

---

## 5. Verificação

Após a correção:

1. O bloco título + subtítulo + input está centrado horizontalmente na viewport? ✓
2. O bloco está centrado verticalmente no espaço disponível (entre header e footer)? ✓
3. O input tem largura contida (~200px), não esticada? ✓
4. Os dots da senha estão centrados dentro do input? ✓
5. A home (/) está inalterada? ✓
6. A track (/track) está inalterada? ✓
