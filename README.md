<p align="center">
  <img src="./assets/hp_logo.png" alt="Logo do Hunter Paper" width="220">
</p>

<h1 align="center">Hunter Paper</h1>

<p align="center">
  Fórum gratuito e sem fins lucrativos para publicação de papers sobre bug bounty e pesquisa em segurança.
</p>

## O que é o Hunter Paper

O Hunter Paper é um projeto criado por [**m1ranthir**](https://github.com/m1ranthir) para reunir pesquisas técnicas, descobertas e experiências reais da comunidade de bug bounty. O conteúdo é publicado gratuitamente e pode ser lido por qualquer pessoa.

Os papers são enviados pelo GitHub em Markdown, analisados manualmente e publicados somente depois da aprovação do mantenedor. Não existe API, backend, banco de dados ou aprovação automática.

## Objetivo

- preservar conhecimento prático produzido por pesquisadores;
- ajudar iniciantes a entender metodologias, raciocínio e impacto técnico;
- oferecer um espaço gratuito para pesquisadores documentarem suas descobertas;
- incentivar papers responsáveis, sem credenciais, dados pessoais ou vulnerabilidades ainda ativas;
- dar crédito aos autores, contribuidores e apoiadores do projeto.

## Para quem é

- pessoas iniciando em bug bounty;
- bug bounty hunters e pesquisadores independentes;
- profissionais e estudantes de segurança de aplicações;
- equipes de AppSec interessadas em compartilhar aprendizado autorizado;
- pessoas que desejam aprender ou ensinar por meio de experiências documentadas.

## Papers publicados

- [**Welcome to Hunter Paper**](https://github.com/m1ranthir/hunterpaper/issues/1) — m1ranthir, EN-US, 31 de julho de 2026.

[Submeter um paper](https://github.com/m1ranthir/hunterpaper/issues/new?template=paper-submission.yml)

## Contribuidores

- [**m1ranthir**](https://github.com/m1ranthir) — criador e mantenedor.

Novos contribuidores de código serão exibidos na área de comunidade do site e no [histórico de contribuidores do GitHub](https://github.com/m1ranthir/hunterpaper/graphs/contributors). Autores de papers recebem crédito no próprio paper e na lista de pesquisadores do projeto.

## Como funciona

1. O pesquisador abre o formulário `Submit a paper`.
2. Escreve o paper integralmente em Markdown e anexa imagens redigidas quando necessário.
3. A submissão vira uma Issue pública com o perfil GitHub do autor.
4. **m1ranthir** analisa manualmente o perfil, o conteúdo e as evidências.
5. O paper pode receber uma solicitação de alterações, ser recusado ou ser aprovado para publicação.

O fluxo completo está documentado em [`docs/GITHUB_SUBMISSIONS.md`](docs/GITHUB_SUBMISSIONS.md).
O passo a passo de publicação está no [`Manual para publicar um paper`](docs/PUBLICAR_PAPER.md).

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

## Hospedagem

O site é publicado pelo GitHub Pages após cada merge na branch `main`. Antes do deploy, o GitHub Actions verifica a sintaxe do JavaScript e executa os testes do projeto.

Endereço padrão após a ativação:

```text
https://m1ranthir.github.io/hunterpaper/
```

O workflow já funciona com caminhos relativos e está preparado para um domínio próprio futuro. O passo a passo para ativar o Pages e configurar DNS, HTTPS e verificação de domínio está em [`docs/GITHUB_PAGES.md`](docs/GITHUB_PAGES.md).

## O que já funciona

- página inicial preparada para receber papers aprovados;
- páginas de leitura renderizadas a partir de Markdown sanitizado;
- URLs canônicas de papers baseadas em IDs públicos estáveis;
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
├── assets/                  # logo do projeto, favicon e imagem do criador
├── docs/                    # decisões de arquitetura e moderação
├── .github/workflows/        # validação e deploy no GitHub Pages
├── src/
│   ├── app.js               # rotas, telas e interações
│   ├── community.js         # apoiadores e contribuidores
│   ├── config.js            # repositório e formulário de submissão
│   ├── data.js              # papers aprovados
│   ├── i18n.js              # textos e formatação EN-US/PT-BR
│   ├── markdown.js          # renderer seguro e índice de headings
│   ├── routing.js           # IDs e resolução das rotas de papers
│   └── security.js          # validação central de URLs e imagens
├── tests/                   # testes de Markdown, comunidade, idiomas e submissão
├── index.html
└── styles.css
```

## Próximas etapas

1. carregar papers aprovados a partir de arquivos Markdown com frontmatter;
2. gerar RSS, sitemap e busca estática no deploy;
3. definir formalmente as licenças do código e dos papers.

## Segurança

Não envie tokens, dados pessoais, nomes de clientes ou vulnerabilidades ainda ativas pelas Issues públicas. Consulte [`SECURITY.md`](SECURITY.md).

As regras de encoding, URLs, CSP, CSRF futuro e headers de produção estão documentadas em [`docs/SECURE_DEVELOPMENT.md`](docs/SECURE_DEVELOPMENT.md).
