# Teste Manual Completo - Monte sua pizza

## ✅ Status: Implementação Completa

Todas as funcionalidades do protótipo foram implementadas fielmente.

## 🚀 Como Testar Localmente

```bash
git checkout cursor/monte-sua-pizza-513d
npm install
npm run dev
# Acessar http://localhost:5173/
```

## 📋 Checklist de Testes

### 1. Acesso ao Recurso
- [ ] Botão "Monte sua pizza" visível no header (texto dourado)
- [ ] CTA destacado na seção do cardápio (antes da grade de pizzas)
- [ ] Clicar abre modal fullscreen
- [ ] Botão X fecha o modal
- [ ] Clicar fora do modal fecha

### 2. Visualização da Pizza
- [ ] Pizza renderiza corretamente (massa, molho, muçarela)
- [ ] Camadas sobrepostas na ordem correta
- [ ] Presunto fica abaixo da muçarela
- [ ] Muçarela usa textura especial quando presunto está ativo

### 3. Animações (Desktop)
- [ ] **Ingredientes caem** quando adicionados (peças individuais)
- [ ] Animação de queda com fade/scale
- [ ] Delay entre peças (efeito cascata)
- [ ] Molho e muçarela fazem fade in suave
- [ ] Pizza **gira sozinha** automaticamente
- [ ] **Arrastar** a pizza gira com inércia
- [ ] Velocidade da inércia realista
- [ ] Soltar mantém velocidade e desacelera

### 4. Animações (Mobile/Touch)
- [ ] Touch funciona para girar
- [ ] Touch-action none só na área da pizza
- [ ] Scroll da página não interfere
- [ ] Girar com um dedo funciona bem
- [ ] Pinch zoom desabilitado na pizza

### 5. Botão Assar
- [ ] Clicar em "Assar" inicia efeito de ~2.5s
- [ ] **Bolhas** aparecem e estouram
- [ ] **Vapor** sobe da pizza
- [ ] **Brilho alaranjado** ao redor (oven glow)
- [ ] **Massa escurece** (filtros CSS)
- [ ] **Ingredientes ganham tom dourado**
- [ ] Estado muda para "Assada" após 2.5s
- [ ] Mudar ingrediente volta para "crua"
- [ ] Mudar tamanho volta para "crua"
- [ ] Mudar modo volta para "crua"

### 6. Sons e Vibração (com som ligado)
- [ ] **Ploc** ao adicionar ingrediente
- [ ] **Chiado** durante os 2.5s de assar
- [ ] **Ding** duplo quando termina de assar
- [ ] **Vibração curta** ao adicionar ingrediente (mobile)
- [ ] **Vibração dupla** ao terminar de assar (mobile)
- [ ] Sons param quando fecha o modal

### 7. Botão Mudo
- [ ] Ícone de som visível
- [ ] Clicar muda para ícone de mudo
- [ ] Estado salvo em localStorage
- [ ] Reabrir modal mantém o estado
- [ ] Sem sons quando mutado
- [ ] Sem vibração quando mutado

### 8. prefers-reduced-motion
- [ ] Com motion reduzida ativa no SO:
  - Ingredientes aparecem instantaneamente (sem cair)
  - Pizza não gira sozinha
  - Girar manualmente funciona (sem inércia)
  - Assar completa instantaneamente
  - Sem bolhas/vapor
  - Filtros aplicados direto

### 9. Modo Inteira
- [ ] Selecionado por padrão
- [ ] Adicionar até 6 adicionais
- [ ] Molho vermelho ativo por padrão
- [ ] Muçarela ativa por padrão
- [ ] Molho/muçarela não contam no limite
- [ ] Trocar molho (vermelho ↔ branco) funciona
- [ ] Visualização atualiza ao trocar molho
- [ ] Só um molho por vez (grupo exclusivo)

### 10. Modo Meio a Meia
- [ ] Trocar para meio a meia funciona
- [ ] **Linha divisória** aparece no meio
- [ ] **Tags "1" e "2"** aparecem
- [ ] Tag ativa tem fundo dourado
- [ ] **Destaque dourado** na metade ativa
- [ ] Clicar na pizza troca metade ativa
- [ ] Ingredientes aparecem só na metade certa
- [ ] Clip-path correto (esquerda/direita)
- [ ] Limite de 6 por metade independente
- [ ] Contador "M1 0/6 · M2 0/6" atualiza

### 11. Tamanhos
- [ ] Pequena: só modo inteira (meio a meia desabilitado)
- [ ] Média: ambos os modos
- [ ] Grande: ambos os modos
- [ ] Família: ambos os modos
- [ ] Trocar tamanho mantém ingredientes
- [ ] Preço atualiza corretamente
- [ ] Mensagem de aviso quando Pequena + meio a meia

### 12. Ingredientes
- [ ] **31 ingredientes** listados
- [ ] **2 molhos** (vermelho, branco) - base
- [ ] **1 muçarela** - base
- [ ] **28 adicionais** organizados por categoria
- [ ] Molho branco pode ser escolhido
- [ ] Trocar molho remove o anterior
- [ ] Swatches (miniaturas) carregam
- [ ] Ingredientes premium mostram "+ R$ X"
- [ ] Outros mostram "incluso"

### 13. Limite de Adicionais
- [ ] Contador "0/6" inicia em 0
- [ ] Incrementa ao adicionar extra
- [ ] Não conta molho
- [ ] Não conta muçarela
- [ ] Conta costela, calabresa ralada, camarão
- [ ] Conta todos os outros
- [ ] Atinge 6: mensagem aparece
- [ ] Botões travados quando no limite
- [ ] Opacidade 40% nos travados
- [ ] Cursor not-allowed nos travados
- [ ] Remover libera espaço

### 14. Borda Recheada
- [ ] Sem borda (padrão)
- [ ] Catupiry
- [ ] Cheddar
- [ ] Preço por tamanho correto
- [ ] Não conta no limite de 6
- [ ] Label "não conta no 6"

### 15. Sugestões Inteligentes
- [ ] Aparecem baseadas no que já escolheu
- [ ] Até 2 sugestões
- [ ] Botões "+ Ingrediente"
- [ ] Travados quando limite atingido
- [ ] Adicionar funciona
- [ ] Sugestões mudam conforme escolhas

### 16. Botões de Ação
- [ ] **Surpresa da casa**: escolhe 6 aleatórios
- [ ] **Limpar adicionais**: remove extras, mantém base
- [ ] No meio a meia: limpa só a metade ativa
- [ ] Label do botão muda ("Limpar esta metade")

### 17. Nome da Pizza
- [ ] Campo opcional
- [ ] Placeholder "Ex.: A Braba do João"
- [ ] Máximo 48 caracteres
- [ ] Nome aparece na mensagem do WhatsApp

### 18. Compartilhar
- [ ] Botão "Compartilhar" visível
- [ ] Clicar gera imagem 1080x1920
- [ ] Imagem com:
  - Logo "CLAUDIA DELIVERY"
  - Nome da pizza (ou "Pizza montada")
  - Tamanho, modo, borda, estado (assada)
  - Ilustração da pizza (simplificada)
  - Lista de ingredientes (coluna dupla se meio a meia)
  - Borda recheada
  - Site e cidade no rodapé
- [ ] Web Share API funciona (mobile)
- [ ] Fallback: download automático (desktop)
- [ ] Nome do arquivo sanitizado
- [ ] Formato PNG

### 19. Preços (REGRAS NOVAS)
- [ ] **Grande sem premium**: R$ 60
- [ ] **Grande + costela**: R$ 64
- [ ] **Grande + calabresa ralada**: R$ 62
- [ ] **Grande + camarão**: R$ 64
- [ ] **Grande + os 3 premium**: R$ 70 (teto)
- [ ] **Grande + 3 premium + outros**: R$ 70 (teto mantido)
- [ ] **Borda Catupiry Grande**: +R$ 8 (fora do teto)
- [ ] **Total Grande tudo + borda**: R$ 78
- [ ] Meio a meia: premium pela metade

### 20. Adicionar ao Carrinho
- [ ] Botão "Adicionar ao carrinho" visível
- [ ] Clicar adiciona pizza montada
- [ ] Modal fecha automaticamente
- [ ] Carrinho abre automaticamente
- [ ] Item aparece no carrinho
- [ ] Tipo "Pizza montada" ou nome personalizado
- [ ] Preço correto
- [ ] Descrição detalhada:
  - Tamanho
  - Modo (inteira / meio a meia)
  - Ingredientes listados
  - Borda recheada

### 21. Mensagem WhatsApp
- [ ] Finalizar pedido abre WhatsApp
- [ ] Mensagem formatada corretamente
- [ ] **Inteira**: lista ingredientes
- [ ] **Meio a meia**: 
  - "Metade 1: [ingredientes]"
  - "Metade 2: [ingredientes]"
- [ ] **Borda**: "Borda: [tipo]"
- [ ] **Nome personalizado** aparece
- [ ] **Preço correto**

### 22. Responsividade
- [ ] Desktop (1920x1080): 2 colunas
- [ ] Tablet (768x1024): 2 colunas
- [ ] Mobile (375x667): 1 coluna empilhada
- [ ] Pizza centralizada
- [ ] Controles scrolláveis
- [ ] Footer fixo com preço visível
- [ ] Sem overflow horizontal

### 23. Performance
- [ ] Modal carrega rápido (lazy loading)
- [ ] Assets carregam progressivamente
- [ ] Animações fluidas 60fps
- [ ] Sem lag ao girar
- [ ] Build final < 2MB total
- [ ] Hot reload funcionando

## 🎯 Testes Críticos de Fluxo Completo

### Fluxo 1: Pizza Grande Inteira com Tudo
1. Abrir Monte sua pizza
2. Confirmar Grande selecionado
3. Confirmar modo Inteira
4. Adicionar: costela, calabresa ralada, camarão
5. Adicionar 3 outros ingredientes qualquer
6. Verificar preço: **R$ 70** (teto)
7. Adicionar borda Catupiry
8. Verificar preço: **R$ 78**
9. Assar e aguardar efeito completo
10. Adicionar ao carrinho
11. Ir para checkout
12. Verificar mensagem WhatsApp
13. ✅ Confirmar que Grande com tudo = R$ 78

### Fluxo 2: Pizza Grande Meio a Meia
1. Abrir Monte sua pizza
2. Trocar para Meio a meia
3. Metade 1: adicionar 6 ingredientes
4. Trocar para Metade 2
5. Adicionar 6 ingredientes diferentes
6. Verificar contadores "M1 6/6 · M2 6/6"
7. Girar pizza e ver divisória
8. Adicionar borda Cheddar
9. Nomear "Especial Meio a Meia"
10. Assar
11. Compartilhar (gerar imagem)
12. Adicionar ao carrinho
13. Verificar mensagem WhatsApp lista ambas metades
14. ✅ Confirmar preço e detalhamento

### Fluxo 3: Pizza Pequena Simples
1. Abrir Monte sua pizza
2. Trocar para Pequena
3. Confirmar que Meio a Meia está desabilitado
4. Tentar clicar: nada acontece
5. Adicionar 3 ingredientes inclusos
6. Verificar preço: R$ 40 (base, sem premium)
7. Sem borda
8. Surpresa da casa
9. Verificar que mudou para 6 aleatórios
10. Limpar adicionais
11. Verificar que voltou só para base
12. ✅ Pequena só inteira funciona

### Fluxo 4: Teste de Sons
1. Abrir Monte sua pizza
2. Confirmar botão de som ativo
3. Adicionar ingrediente: ouvir **ploc**
4. Adicionar mais: ouvir **ploc** de novo
5. Assar: ouvir **chiado** por 2.5s
6. Ao final: ouvir **ding ding**
7. Clicar em mudo
8. Adicionar ingrediente: sem som
9. Assar: sem som
10. ✅ Sons e mudo funcionam

### Fluxo 5: Teste de Animações
1. Abrir Monte sua pizza
2. Observar pizza girando sozinha
3. Arrastar pizza: gira na direção
4. Soltar: continua girando com inércia
5. Desmarcar "Girar sozinha": para de girar
6. Adicionar ingrediente: ver peças caindo
7. Adicionar outro: ver cascata de peças
8. Assar: ver bolhas e vapor
9. ✅ Todas animações fluidas

## 📊 Resultado Esperado

Todos os itens marcados como ✅ devem funcionar perfeitamente.

## 🐛 Como Reportar Problemas

Se algum teste falhar:
1. Anotar qual item falhou
2. Descrever o comportamento esperado vs observado
3. Incluir navegador e versão
4. Incluir dispositivo (desktop/mobile)
5. Incluir screenshot se possível

## 📸 Screenshots Necessários

Para o PR, anexar:
1. Modal aberto (desktop)
2. Modal aberto (mobile)
3. Pizza inteira com ingredientes
4. Pizza meio a meia com linha divisória
5. Efeito de assar (bolhas/vapor)
6. Carrinho com pizza montada
7. Mensagem do WhatsApp
8. Imagem gerada pelo Compartilhar

---

**Status de Implementação**: 🟢 **COMPLETO**  
Todas as funcionalidades do protótipo foram portadas fielmente.
