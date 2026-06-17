# 🏎️ Interface Web - Guia de Uso

## 🌐 Acessar a Interface

Abra seu navegador e acesse:

```
http://localhost:3000
```

---

## 📋 Funcionalidades da Interface

### 1. **Dashboard** 📊
- **Total de Pilotos:** Quantidade de pilotos cadastrados
- **Times:** Quantidade de times únicos
- **Pontos do Líder:** Pontos do piloto em primeiro lugar
- **Campeonatos:** Total de campeonatos de todos os pilotos
- **Ações Rápidas:** Botões para acessar funcionalidades principais

### 2. **Pilotos** 👥
- **Listar Pilotos:** Visualiza todos os pilotos em cards
- **Buscar:** Campo de busca para encontrar pilotos por nome
- **Filtrar por Time:** Dropdown para filtrar por time
- **Ordenar:** 
  - Por Pontos (Alto para Baixo)
  - Por Nome (A-Z)
  - Por Campeonatos
- **Cards de Piloto:**
  - Número do piloto
  - Nome
  - Time
  - Nacionalidade
  - Pontos
  - Campeonatos
  - Status (Ativo/Inativo)
  - Botões de Editar e Remover

### 3. **Novo Piloto** ➕
- **Formulário de Criação:**
  - Nome (obrigatório)
  - Time (obrigatório)
  - Nacionalidade (obrigatório)
  - Número (obrigatório, único)
  - Pontos (opcional, padrão 0)
  - Campeonatos (opcional, padrão 0)
- Validação de formulário
- Sucesso/Erro com notificação

### 4. **Ranking** 🏆
- **Ranking Oficial:** Pilotos ordenados por pontos
- **Posições com Medalhas:**
  - 🥇 Primeiro lugar (ouro)
  - 🥈 Segundo lugar (prata)
  - 🥉 Terceiro lugar (bronze)
  - # Demais posições
- **Informações por Piloto:**
  - Posição
  - Nome
  - Time
  - Pontos
  - Campeonatos

---

## 🎨 Características da Interface

### Tema Dark/Light
- **Botão de Tema:** 🌙 (light mode) / ☀️ (dark mode)
- **Preferência Salva:** Mantém a escolha no localStorage

### Responsividade
- ✅ Desktop (1400px+)
- ✅ Tablet (768px - 1399px)
- ✅ Mobile (até 767px)

### Notificações
- ✅ Sucesso (verde)
- ❌ Erro (vermelho)
- ⚠️ Aviso (amarelo)
- ℹ️ Informação (azul)

---

## 📝 Operações CRUD

### CREATE (Criar Piloto)
1. Clique em **"➕ Novo Piloto"**
2. Preencha o formulário
3. Clique em **"✅ Criar Piloto"**
4. Será redirecionado automaticamente para a lista de pilotos

### READ (Visualizar)
1. Clique em **"👥 Pilotos"** para ver todos
2. Use filtros para refinar resultados
3. Cada card mostra todas as informações

### UPDATE (Editar)
1. No card do piloto, clique em **"✏️ Editar"**
2. Modifique os dados no modal
3. Clique em **"✅ Salvar"**

### DELETE (Remover)
1. No card do piloto, clique em **"🗑️ Remover"**
2. Confirme na modal de exclusão
3. Piloto será removido da lista

---

## 🔍 Filtros e Busca

### Busca por Nome
```
Digite parcial ou completo do nome do piloto
Exemplo: "Max", "Verstappen", "Lando"
```

### Filtrar por Time
```
Selecione o time no dropdown
Mostra apenas pilotos daquele time
```

### Ordenar Por
```
- Padrão: Ordem de inserção
- Pontos: Descendente (maior para menor)
- Nome: Alfabético (A-Z)
- Campeonatos: Descendente (mais para menos)
```

### Combinar Filtros
```
Exemplo: Buscar "Ferrari" + Ordenar por "Pontos"
Resultado: Pilotos Ferrari ordenados por pontos
```

---

## 📊 Dashboard Stats

| Stat | Atualização | Descrição |
|------|------------|-----------|
| Total de Pilotos | Ao recarregar/criar/deletar | Contagem total |
| Times | Ao recarregar/criar/deletar | Contagem de times únicos |
| Pontos do Líder | Ao recarregar/atualizar pontos | Máximo de pontos |
| Campeonatos | Ao recarregar/criar | Soma total |

---

## 🎯 Exemplo de Uso Completo

### 1. Visualizar Dashboard
```
Acesse http://localhost:3000
→ Vê estatísticas gerais
```

### 2. Ver Todos os Pilotos
```
Clique em "👥 Pilotos"
→ Vê todos em cards
```

### 3. Filtrar Ferrari
```
Selecione "Ferrari" em "Todos os Times"
→ Mostra apenas Ferrari
```

### 4. Buscar Max
```
Digite "Max" em "Buscar piloto"
→ Filtra para Max Verstappen
```

### 5. Ver Ranking
```
Clique em "🏆 Ranking"
→ Vê ranking ordenado por pontos
```

### 6. Criar Novo Piloto
```
Clique em "➕ Novo Piloto"
→ Preenche formulário
→ Clica "✅ Criar Piloto"
→ Volta à lista automaticamente
```

### 7. Editar Piloto
```
No card, clique "✏️ Editar"
→ Modifica dados
→ Clica "✅ Salvar"
→ Dados atualizados
```

### 8. Deletar Piloto
```
No card, clique "🗑️ Remover"
→ Confirma exclusão
→ Piloto removido
```

---

## 💡 Dicas

### Atalhos
- 🌙 Tema: Clique no ícone no header
- 🔄 Recarregar: Botão "Recarregar" no Dashboard
- 🔍 Busca: Funciona em tempo real

### Performance
- Interface carrega dados via API (não é renderização no servidor)
- Filtros funcionam localmente (rápido)
- Notificações desaparecem automaticamente em 3 segundos

### Validações
- **Número único:** Não pode repetir número de piloto
- **Campos obrigatórios:** Nome, Time, Nacionalidade, Número
- **Pontos/Campeonatos:** Nunca podem ser negativos

---

## 🎨 Layout & Design

### Cores
- **Vermelho (#e10600):** Cor primária (F1)
- **Amarelo (#ffc300):** Acentos
- **Verde:** Sucesso
- **Vermelho:** Erro
- **Laranja:** Aviso
- **Azul:** Informação

### Tipografia
- **Headings:** Bold, 1.5-2.5rem
- **Textos:** Regular, 0.9-1rem
- **Labels:** Uppercase, 0.75rem

### Espaçamento
- Consistente em toda interface
- Responsive (reduz em mobile)

---

## 🐛 Troubleshooting

### "API não está respondendo"
- ✅ Verifique se o servidor está rodando: `npm start`
- ✅ Verifique se está em `http://localhost:3000`
- ✅ Recarregue a página (F5)

### Interface em branco
- ✅ Abra o DevTools (F12)
- ✅ Verifique o console para erros
- ✅ Verifique se a API está acessível

### Dados não aparecem
- ✅ Clique no botão "Recarregar" no Dashboard
- ✅ Verifique se há pilotos na base de dados
- ✅ Tente criar um novo piloto

### Notificação desaparece rápido
- ✅ Isso é proposital (3 segundos)
- ✅ Dados foram salvos mesmo assim

---

## 📱 Mobile

A interface é totalmente responsiva:

### Visualização
- **Pilotos:** Um card por linha (em vez de grid)
- **Filtros:** Stack vertical
- **Botões:** Full width
- **Modal:** 95% de width

### Touch-friendly
- ✅ Botões maiores
- ✅ Sem hover effects em mobile
- ✅ Teclado otimizado

---

## 🌙 Dark Mode

### Ativar
1. Clique no ícone de tema (🌙 / ☀️) no header
2. Preferência é salva automaticamente
3. Ao recarregar, mantém a escolha

### Cores
- Dark: Fundo escuro (#1a1a1a)
- Light: Fundo claro (#ffffff)
- Texto invertido conforme necessário

---

## 🔐 Segurança

- ✅ Input sanitization
- ✅ CORS ativado
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet.js (headers seguros)
- ✅ Sem exposição de dados sensíveis

---

## 📈 Funcionalidades Futureiras

Possíveis melhorias:
- [ ] Exportar dados em CSV/PDF
- [ ] Importar pilotos em lote
- [ ] Histórico de pontos
- [ ] Gráficos de evolução
- [ ] Autenticação de usuários
- [ ] Backup/Restore
- [ ] WebSocket para atualizações em tempo real

---

**Versão:** 1.0.0  
**Status:** ✅ Completa e funcional  
**Última atualização:** Junho 2026
