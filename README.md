# Hunter Paper

Um projeto open source e sem fins lucrativos criado por **m1ranthir** para compartilhar papers gratuitos de bug bounty com a comunidade.

Esta é a primeira versão navegável do projeto. Ela entrega a direção visual, o feed, a leitura e a submissão manual de papers pelo GitHub Issues. O fluxo está documentado em [`docs/GITHUB_SUBMISSIONS.md`](docs/GITHUB_SUBMISSIONS.md).

## Rodar localmente

Não há dependências nem etapa de build.

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Abra `http://127.0.0.1:4173`.

Validações disponíveis:

```bash
node --check src/app.js
node --test
```

## O que já funciona

- página inicial preparada para receber papers aprovados;
- páginas de leitura renderizadas a partir de Markdown sanitizado;
- índice de seções e cópia do link do paper;
- formulário estruturado de submissão no GitHub Issues;
- escrita integral em Markdown e envio de imagens pelo GitHub;
- identificação do autor pelo próprio perfil GitHub;
- revisão, aprovação ou recusa totalmente manual;
- interface em EN-US e PT-BR, com EN-US como idioma padrão;
- área de comunidade para apoiadores, contribuidores e autores de papers;
- layout responsivo, navegação por teclado e suporte a `prefers-reduced-motion`.

## Idiomas e comunidade

A interface está disponível em **EN-US** e **PT-BR**. Em um primeiro acesso ela usa EN-US por padrão; a troca de idioma altera os textos da navegação, formulários, mensagens, metadados, datas e estados da aplicação.

A rota [`#community`](http://127.0.0.1:4173/#community) reúne:

- a área **Created by / Criado por**, com a imagem de m1ranthir e botões para GitHub e LinkedIn;
- apoiadores confirmados, separados entre empresas e pessoas;
- contribuidores do código e da manutenção do projeto;
- pesquisadores identificados pelo GitHub nos papers publicados;
- **m1ranthir** como criador e mantenedor do Hunter Paper.

Os dados dessa área ficam em [`src/community.js`](src/community.js). Listas vazias não recebem perfis fictícios. URLs sociais, sites e perfis GitHub vazios permanecem desativados na interface até que sejam configurados com um endereço real.

## Submissão e moderação

```text
autor → formulário no GitHub → Issue com paper e imagens
                                      ↓
                         revisão manual por m1ranthir
                         ↙ aprovação      ↘ recusa
                 publicação manual     Issue encerrada
```

O botão de publicação do site abre o formulário em [`github.com/m1ranthir/hunterpaper`](https://github.com/m1ranthir/hunterpaper/issues/new?template=paper-submission.yml). Não há API, backend, banco de dados ou publicação automática. A Issue identifica o perfil do autor e recebe o Markdown e as imagens para análise manual.

As submissões são públicas no GitHub. O autor deve enviar somente material autorizado para divulgação e sem credenciais, dados pessoais ou vulnerabilidades ativas.

## Estrutura

```text
.
├── assets/                  # favicon e imagem do criador
├── docs/                    # decisões de arquitetura e moderação
├── src/
│   ├── app.js               # rotas, telas e interações
│   ├── community.js         # apoiadores e contribuidores
│   ├── config.js            # repositório e formulário de submissão
│   ├── data.js              # papers aprovados
│   ├── i18n.js              # textos e formatação EN-US/PT-BR
│   └── markdown.js          # renderer seguro e índice de headings
├── tests/                   # testes de Markdown, comunidade, idiomas e submissão
├── index.html
└── styles.css
```

## Próximas etapas

1. criar as labels de moderação descritas em `docs/GITHUB_SUBMISSIONS.md`;
2. carregar papers aprovados a partir de arquivos Markdown com frontmatter;
3. gerar RSS, sitemap e busca estática no deploy;
4. definir formalmente as licenças do código e dos papers.

## Segurança

Não envie tokens, dados pessoais, nomes de clientes ou vulnerabilidades ainda ativas pelas Issues públicas. Consulte [`SECURITY.md`](SECURITY.md).
