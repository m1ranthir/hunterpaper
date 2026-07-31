# Manual para publicar um paper

Este manual descreve o processo manual de publicação do Hunter Paper. O site não importa Issues automaticamente e não usa API, backend ou banco de dados.

```text
Issue recebida → revisão manual → src/data.js → testes → GitHub → paper publicado
```

## 1. Abra a submissão

Entre em [Issues](https://github.com/m1ranthir/hunterpaper/issues) e abra a Issue do paper.

Confira:

- o perfil e o histórico público do autor;
- se o material está autorizado para divulgação;
- se não existem credenciais, tokens, dados pessoais ou nomes de clientes;
- se a vulnerabilidade já pode ser divulgada;
- se o texto apresenta contexto, metodologia, impacto e mitigação;
- se imagens e evidências foram redigidas;
- se o conteúdo não é um texto genérico gerado por IA.

Durante a análise, use a label `paper:reviewing`.

### Onde aplicar as labels

As labels são aplicadas na **Issue do paper no GitHub**. Elas não devem ser escritas em `src/data.js`, no Markdown ou no código do site.

1. Abra a Issue, por exemplo [`hunterpaper/issues/1`](https://github.com/m1ranthir/hunterpaper/issues/1).
2. Na barra lateral direita, encontre a seção **Labels**.
3. Clique no ícone de engrenagem ao lado de **Labels**.
4. Marque a label correspondente ao estado atual.
5. Desmarque a label de estado anterior.

Em telas menores, a seção **Labels** pode aparecer abaixo do texto da Issue ou dentro do menu lateral.

Use somente uma label de estado `paper:*` por vez:

```text
paper:pending
      ↓
paper:reviewing
      ↓
paper:changes-requested  →  paper:reviewing
      ou
paper:approved
      ↓
paper:published
```

Se o paper for recusado, troque o estado atual por `paper:declined` e encerre a Issue.

Também é possível alterar uma label pelo terminal:

```bash
gh issue edit NUMERO --repo m1ranthir/hunterpaper \
  --remove-label "paper:pending" \
  --add-label "paper:reviewing"
```

## 2. Decida o resultado

- Use `paper:changes-requested` quando o autor precisar corrigir algo.
- Use `paper:declined` quando o material não for aceito.
- Use `paper:approved` quando o paper estiver pronto para entrar no site.

Aprovar a Issue não publica o paper automaticamente. A etapa seguinte é obrigatória.

## 3. Adicione o paper ao site

### Onde inserir o paper no código

Abra [`src/data.js`](../src/data.js). No começo do arquivo existe o array `papers`:

```js
export const papers = [
  // Os papers publicados ficam aqui.
];
```

Cada publicação é um `Object.freeze({ ... })`. Cole o novo objeto **depois de `[` e antes de `];`**. Para manter os papers recentes primeiro, coloque a nova publicação acima das anteriores.

O resultado deve seguir esta estrutura:

```js
export const papers = [
  Object.freeze({
    slug: "titulo-do-paper",
    title: "Título do paper",
    excerpt: "Resumo curto exibido na página inicial.",
    category: "web",
    tags: ["web", "xss", "bug-bounty"],
    publishedAt: "2026-07-31",
    readMinutes: 8,
    difficulty: "beginner",
    author: "usuario-github",
    authorName: "Nome exibido",
    authorGithub: "usuario-github",
    authorGithubId: 123456,
    initials: "UG",
    sourceUrl: "https://github.com/m1ranthir/hunterpaper/issues/NUMERO",
    body: `## Resumo

Cole aqui todo o paper em Markdown.

## Evidência

![Descrição da imagem](https://github.com/user-attachments/assets/IDENTIFICADOR)

## Mitigação

Explique como o problema pode ser corrigido.`,
  }),

  // Os papers publicados anteriormente permanecem abaixo.
];
```

Não crie outro `export const papers`. Adicione somente o novo `Object.freeze({ ... })` ao array que já existe.

### Campos obrigatórios

| Campo | Como preencher |
| --- | --- |
| `slug` | Endereço curto, minúsculo, sem espaços ou acentos |
| `title` | Título completo do paper |
| `excerpt` | Uma ou duas frases para o feed |
| `category` | Tema principal, por exemplo `web`, `api` ou `recon` |
| `tags` | Entre uma e cinco tags pesquisáveis |
| `publishedAt` | Data no formato `AAAA-MM-DD` |
| `readMinutes` | Tempo estimado de leitura em minutos |
| `difficulty` | `beginner`, `intermediate` ou `advanced` |
| `author` | Nome mostrado no card do paper |
| `authorGithub` | Login do autor sem `@` |
| `authorGithubId` | ID numérico permanente da conta GitHub |
| `initials` | Uma ou duas letras usadas no avatar textual |
| `sourceUrl` | URL da Issue original |
| `body` | Paper completo em Markdown |

Para descobrir o ID numérico de um usuário:

```bash
gh api users/USUARIO --jq .id
```

Se usar uma categoria nova, adicione-a também ao array `topicOrder` em `src/data.js`.

## 4. Adicione imagens

O upload feito na Issue gera um endereço semelhante a:

```text
https://github.com/user-attachments/assets/IDENTIFICADOR
```

Use esse endereço no corpo do paper:

```md
![Descrição objetiva da imagem](https://github.com/user-attachments/assets/IDENTIFICADOR)
```

Sempre escreva um texto alternativo descritivo e confirme que a imagem não expõe informações sensíveis.

## 5. Cuidado com Markdown dentro de JavaScript

O campo `body` usa crases para armazenar o Markdown. Crases usadas dentro do próprio paper precisam ser escapadas com uma barra invertida.

Markdown original:

````md
```http
GET / HTTP/1.1
```
````

Dentro de `body`:

```js
body: `\`\`\`http
GET / HTTP/1.1
\`\`\``,
```

Se o paper contiver `${`, escreva `\${` para impedir que o JavaScript tente interpretar o trecho.

## 6. Atualize o README

Na seção **Papers publicados** do [`README.md`](../README.md), adicione o título, o autor, o idioma, a data e o link da Issue.

Não adicione papers ainda em revisão ou recusados.

## 7. Valide localmente

Execute:

```bash
node --check src/app.js
node --check src/data.js
node --test tests/*.test.js
```

Inicie ou mantenha o servidor local:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Abra `http://127.0.0.1:4173` e confira:

- o paper na página inicial;
- busca e filtro por tag;
- título, autor, data e tempo de leitura;
- Markdown, links, blocos de código e imagens;
- versões EN-US e PT-BR da interface;
- visualização em tela pequena.

## 8. Publique no GitHub

Depois da revisão visual:

```bash
git status
git add src/data.js README.md
git commit -m "content: publish titulo-do-paper"
git push
```

Inclua no `git add` qualquer imagem local ou teste criado para o paper.

## 9. Finalize a Issue

Quando o commit estiver na branch `main`:

1. remova as labels de revisão anteriores;
2. aplique `paper:published`;
3. deixe um comentário com o link do paper;
4. encerre a Issue como concluída.

Se o paper ainda não aparecer, confirme primeiro se ele realmente foi adicionado ao array `papers` em `src/data.js`. Fechar uma Issue, sozinho, não altera o site.
