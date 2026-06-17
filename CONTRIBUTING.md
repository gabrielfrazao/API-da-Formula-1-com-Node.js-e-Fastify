# 🤝 Contribuindo para F1 API

Obrigado por considerar contribuir para este projeto! Este documento fornece diretrizes e instruções para contribuir.

## 📋 Código de Conduta

Todos os contribuidores devem aderir ao nosso código de conduta:
- Ser respeitoso com outros contribuidores
- Aceitar críticas construtivas
- Focar no que é melhor para a comunidade
- Zelar pela segurança e privacidade

## 🐛 Reportando Bugs

Antes de criar um relatório de bug, verifique se o problema já foi reportado. Se não foi:

1. **Use um título descritivo** que identifique o problema
2. **Descreva os passos exatos** para reproduzir o problema
3. **Forneça exemplos específicos** para demonstrar os passos
4. **Descreva o comportamento observado** e o esperado
5. **Inclua capturas de tela ou logs** se possível
6. **Mencione sua configuração** (SO, versão Node.js, etc)

### Exemplo de Relatório de Bug

```
Título: Validação quebrada ao criar piloto com número negativo

Passos para reproduzir:
1. Enviar POST para /drivers
2. Incluir "number": -5 no corpo
3. Observar que a requisição é aceita

Comportamento esperado:
- Retornar erro 400 Bad Request
- Mensagem indicando número inválido

Logs:
```

## 💡 Sugerindo Melhorias

Sugestões de melhorias são sempre bem-vindas! Inclua:

1. **Um título claro e descritivo**
2. **Uma descrição detalhada da melhoria sugerida**
3. **Exemplos de como funcionaria**
4. **Por que isso seria útil**

## 🔀 Seu Primeiro Código

Unsure where to begin? You can start by looking through these labels:

- `good-first-issue` - Issues ideais para primeiros PRs
- `help-wanted` - Issues que precisam de ajuda
- `documentation` - Melhorias na documentação

## 📝 Processo de Contribuição

### 1. Fork o Repositório

```bash
git clone https://github.com/seu-usuario/f1-api.git
cd f1-api
```

### 2. Crie uma Branch

```bash
# Atualize primeiro
git checkout main
git pull origin main

# Crie sua branch
git checkout -b feature/sua-feature-aqui
```

**Convenção de Nomes de Branch:**
- `feature/nova-funcionalidade` - Para novas funcionalidades
- `fix/nome-do-bug` - Para correções
- `docs/melhoria-docs` - Para documentação
- `refactor/nome-refactoring` - Para refatorações

### 3. Faça suas Mudanças

- Escreva código limpo e bem comentado
- Siga o estilo existente do projeto
- Adicione testes se aplicável
- Execute ESLint: `npm run lint`

### 4. Commit das Mudanças

```bash
git add .
git commit -m "feat: descrição clara da mudança"
```

**Convenção de Commits:**
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Mudanças em documentação
- `style:` - Formatação, falta de ponto-e-vírgula, etc
- `refactor:` - Refatoração de código
- `test:` - Adicionar ou atualizar testes
- `chore:` - Mudanças no build, deps, etc

### 5. Push da Branch

```bash
git push origin feature/sua-feature-aqui
```

### 6. Abra um Pull Request

1. Vá para o repositório no GitHub
2. Clique em "Compare & pull request"
3. Forneça um título descritivo
4. Descreva as mudanças em detalhes
5. Referencie issues relacionadas com `Fixes #123`
6. Clique em "Create pull request"

## ✅ Guia de Style

### JavaScript

```javascript
// ✅ BOM
const getUserById = (id) => {
  if (!id) {
    throw new Error('ID é obrigatório');
  }
  return users.find(user => user.id === id);
};

// ❌ RUIM
function getUserById(id) {
  if (id != null) {
    return users.find(u => u.id == id);
  }
}
```

### Comentários

```javascript
// ✅ BOM - Explica o "por quê"
// Validar número do piloto para evitar duplicatas
if (drivers.some(d => d.number === number)) {
  throw new Error('Número já existe');
}

// ❌ RUIM - Óbvio
// Loop através dos drivers
drivers.forEach(driver => {
  // ...
});
```

### Funções

```javascript
// ✅ BOM - Função concisa e com responsabilidade única
const filterDriversByTeam = (team) => {
  return drivers.filter(d => d.team === team);
};

// ❌ RUIM - Muitas responsabilidades
const doAllTheStuff = (team) => {
  const filtered = drivers.filter(d => d.team === team);
  console.log(filtered);
  return filtered.map(d => d.name);
};
```

## 🧪 Testes

Antes de fazer PR:

1. Teste manualmente a funcionalidade
2. Verifique se não quebrou nada existente
3. Use `requests.http` para testar endpoints

## 📚 Documentação

Se sua mudança afeta a API:

1. Atualize o `README.md`
2. Adicione exemplos de uso
3. Documente novos endpoints
4. Atualize variáveis de `.env.example` se necessário

## 🚀 Processo de Review

1. Pelo menos um maintainer revisará seu PR
2. Mudanças podem ser solicitadas
3. Uma vez aprovado, será feito o merge
4. Parabéns! Você é agora um contribuidor! 🎉

## 📞 Suporte

- GitHub Issues para bugs e features
- Discussions para perguntas gerais
- Email para questões de segurança

## 📄 Licença

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Obrigado por contribuir! 🙏**
