# Monte sua pizza - Documentação

## 📋 Resumo da Implementação

O recurso "Monte sua pizza" foi integrado com sucesso ao site da Claudia Delivery (https://pizzariadeliverysj.com/). O protótipo aprovado em HTML/CSS/JS foi portado para React 19 + Vite + Tailwind mantendo fidelidade visual e funcional.

## 🎯 Funcionalidades Implementadas

### Core
- ✅ Visualização da pizza com camadas (massa, molho, presunto, muçarela, coberturas)
- ✅ Modo Inteira / Meio a meia (Média, Grande, Família; Pequena desabilitada)
- ✅ Limite de 6 adicionais por metade (molho e muçarela não contam)
- ✅ Borda recheada: Sem borda / Catupiry / Cheddar
- ✅ Nome personalizado da pizza (opcional)
- ✅ Sugestões inteligentes baseadas no cardápio

### Integração
- ✅ Adição ao carrinho/comanda existente (localStorage 'claudia-delivery:pedido')
- ✅ Mensagem WhatsApp completa com ingredientes detalhados
- ✅ Carregamento lazy (React.lazy) para não pesar o site
- ✅ CTAs: link no header + seção destacada no cardápio

## 💰 Sistema de Preços (CONFIGURÁVEL)

### Arquivo principal
**`src/data/pizzaBuilderPricing.ts`** ← Edite aqui para mudar valores

### Regras atuais
```
Tamanho Grande (exemplo):
- Base: R$ 60 (massa + molho + muçarela)
- Teto: R$ 70 (máximo com adicionais premium)

Ingredientes Premium (únicos com custo adicional):
- Costela: +R$ 4
- Calabresa ralada: +R$ 2
- Camarão: +R$ 4
- Todos os outros: INCLUSOS (R$ 0)

Borda recheada (FORA do teto):
- Catupiry Grande: +R$ 8
- Cheddar Grande: +R$ 9

Meio a meia:
- Premium de cada metade cobrado pela metade
- Teto continua valendo
```

### Outros tamanhos
```
Pequena: base R$ 40, teto R$ 48
Média:   base R$ 50, teto R$ 58
Grande:  base R$ 60, teto R$ 70
Família: base R$ 72, teto R$ 84
```

## 📁 Estrutura de Arquivos

### Componentes principais
```
src/components/PizzaBuilder/
├── PizzaBuilderModal.tsx       # Modal principal com lazy loading
├── PizzaBuilderContent.tsx     # Layout do builder
├── PizzaStage.tsx              # Visualização da pizza
├── usePizzaBuilder.ts          # Hook com toda a lógica de estado
├── ModeSelector.tsx            # Inteira / Meio a meia
├── SizeSelector.tsx            # Pequena / Média / Grande / Família
├── HalfTabs.tsx                # Metade 1 / Metade 2
├── LimitRow.tsx                # Contador de adicionais
├── CrustSelector.tsx           # Borda recheada
├── IngredientCategories.tsx    # Grid de ingredientes por categoria
├── SuggestionsChips.tsx        # Sugestões baseadas no cardápio
├── ActionsRow.tsx              # Surpresa / Limpar
├── PizzaNameField.tsx          # Campo de nome personalizado
└── index.ts                    # Exports
```

### Dados e configuração
```
src/data/
├── pizzaBuilderPricing.ts      # ⭐ PREÇOS (edite aqui)
└── pizzaBuilderIngredients.ts  # Lista de ingredientes

src/types/order.ts              # Tipo CustomPizzaOrderLine

src/context/OrderContext.tsx    # addCustomPizza()
```

### Assets
```
public/pizza-builder/assets/
├── base/           # Massa, molho, muçarela
├── layers/         # Camadas completas de ingredientes
├── swatches/       # Miniaturas para os botões
└── layout.json     # Coordenadas para animações (não usado na versão simplificada)
```

## 🧪 Como Testar

### 1. Instalar e rodar
```bash
cd /workspace
npm install
npm run dev
```

Acessar: http://localhost:5173/

### 2. Fluxo completo
1. **Abrir** o Monte sua pizza (header ou CTA do cardápio)
2. **Escolher tamanho**: Grande
3. **Modo inteira**: adicionar ingredientes até ver o limite
4. **Trocar para meio a meia**: ver as duas metades independentes
5. **Adicionar borda**: Catupiry (verificar +R$ 8)
6. **Nome personalizado**: "Pizza Especial"
7. **Adicionar ao carrinho**
8. **Finalizar pedido** e conferir mensagem do WhatsApp

### 3. Validar preços
```
Pizza Grande SEM premium:
✅ Base R$ 60 + ingredientes inclusos = R$ 60

Pizza Grande COM TUDO (3 premium):
✅ Base R$ 60 + costela R$ 4 + calabresa ralada R$ 2 + camarão R$ 4 = R$ 70 (TETO)

Pizza Grande COM TUDO + Borda Catupiry:
✅ Pizza R$ 70 + Borda R$ 8 = R$ 78 TOTAL
```

## 🚀 Deploy (NÃO feito ainda)

⚠️ **Este branch está pronto para teste LOCAL antes do merge.**

O dono vai testar desktop + mobile e validar os preços antes de aprovar o merge em `main`.

## 🔧 Personalizações Fáceis

### Mudar preços
Editar: `src/data/pizzaBuilderPricing.ts`

```typescript
export const SIZE_PRICING: Record<PizzaSizeId, SizePricing> = {
  grande: {
    base: 60,      // ← Mudar aqui
    ceiling: 70,   // ← E aqui
  },
  // ...
}

export const PREMIUM_INGREDIENTS: Record<string, number> = {
  costela: 4,              // ← Mudar aqui
  'calabresa-ralada': 2,   // ← Mudar aqui
  camarao: 4,              // ← Mudar aqui
}
```

### Adicionar/remover ingredientes
Editar: `src/data/pizzaBuilderIngredients.ts`

```typescript
export const INGREDIENTS: Ingredient[] = [
  // Adicionar novo:
  {
    id: 'meu-ingrediente',
    name: 'Meu Ingrediente',
    cat: 'Carnes',
    count: 7,
    size: 15,
  },
  // ...
]
```

## 🐛 Troubleshooting

### Build falha com erro de TypeScript
```bash
npm run build
```
Se houver erro, verificar imports e tipos.

### Modal não abre
- Verificar console do navegador
- Confirmar que `PizzaBuilderModal` está importado
- Checar se `builderOpen` state está funcionando

### Preços errados
- Confirmar valores em `pizzaBuilderPricing.ts`
- Verificar cálculo em `calculateBuilderPrice()`
- Testar diferentes combinações

### Imagens não carregam
- Confirmar assets em `public/pizza-builder/assets/`
- Verificar caminhos absolutos começando com `/`
- Inspecionar Network tab do DevTools

## 📦 Branch e PR

- **Branch**: `cursor/monte-sua-pizza-513d`
- **PR**: #1 (draft) https://github.com/franciscojeronimo1/front/pull/1
- **Base**: `main`

## ✅ Checklist de Testes

- [ ] Desktop: Chrome, Firefox, Safari
- [ ] Mobile: Chrome Android, Safari iOS
- [ ] Pizza inteira com 0-6 adicionais
- [ ] Meio a meia com limite por metade
- [ ] Borda recheada soma corretamente
- [ ] Preço Grande sem premium = R$ 60
- [ ] Preço Grande com tudo = R$ 70 (teto)
- [ ] Adicionar ao carrinho funciona
- [ ] Mensagem WhatsApp lista ingredientes
- [ ] Nome personalizado aparece no pedido
- [ ] Sugestões baseadas no cardápio funcionam
- [ ] Limpar adicionais funciona
- [ ] Surpresa da casa funciona
- [ ] Trocar tamanho mantém ingredientes
- [ ] Pequena bloqueia meio a meia

## 📧 Contato

Dúvidas ou problemas? Entre em contato com o desenvolvedor.

---

✨ **Implementação completa e pronta para testes!**
