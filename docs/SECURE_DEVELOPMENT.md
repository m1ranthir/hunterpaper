# Desenvolvimento seguro do Hunter Paper

Este documento registra o modelo de ameaças e os controles mínimos do Hunter Paper. Ele deve ser revisado sempre que o projeto adicionar dependências, autenticação, API, banco de dados, uploads próprios ou qualquer operação de escrita.

## Modelo atual

O Hunter Paper é um site estático. Papers aprovados são adicionados manualmente ao repositório, e o navegador apenas lê arquivos locais do projeto.

O site não possui:

- login ou sessão própria;
- cookies de autenticação;
- API ou backend;
- banco de dados;
- endpoint de upload;
- requisições que alteram estado.

As principais superfícies de risco são o Markdown publicado, metadados adicionados em `src/data.js`, URLs externas, imagens e configurações do servidor de hospedagem.

## IDs de papers

As rotas usam IDs públicos no formato `hp-a1b2c3d4`. O ID evita expor o título na URL e permanece estável quando o título mudar.

O ID não é segredo e não substitui autenticação ou autorização. Base64 não deve ser usado como proteção porque pode ser decodificado por qualquer pessoa.

## Prevenção de XSS

O renderer de Markdown deve continuar usando uma lista pequena de elementos suportados. HTML arbitrário enviado pelo autor é tratado como texto.

Regras obrigatórias:

1. passe dados dinâmicos por encoding adequado ao contexto antes de usar `innerHTML`;
2. prefira `textContent`, `setAttribute` com nomes fixos e criação explícita de elementos em novos componentes;
3. não introduza `eval`, `new Function`, handlers HTML como `onclick` ou scripts inline;
4. aceite somente HTTPS em links externos da interface;
5. recuse `javascript:`, `data:`, `blob:`, URLs com credenciais, caracteres de controle e URLs iniciadas por `//`;
6. carregue imagens externas somente dos anexos do GitHub aprovados;
7. mantenha testes com payloads de XSS para links, imagens, atributos e rotas;
8. trate a CSP como defesa adicional, não como substituta do encoding e da sanitização.

Referência: [OWASP Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

## CSRF

CSRF exige uma aplicação capaz de receber uma requisição autenticada e alterar estado. Esse cenário não existe no frontend estático atual.

Antes de adicionar um backend:

- nunca altere estado por `GET`;
- use tokens CSRF validados no servidor em operações autenticadas por cookie;
- configure cookies como `Secure`, `HttpOnly` e `SameSite` de acordo com o fluxo;
- valide `Origin` e Fetch Metadata como defesa adicional;
- mantenha uma allowlist CORS restrita e não combine origem curinga com credenciais;
- exija reautenticação ou confirmação em operações sensíveis.

Referência: [OWASP Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

## Headers obrigatórios no deploy

A CSP presente em `index.html` oferece uma proteção inicial. O servidor de produção deve enviar os headers abaixo em todas as respostas HTML:

```text
Content-Security-Policy: default-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; frame-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' https://github.com https://*.githubusercontent.com https://github-production-user-asset-6210df.s3.amazonaws.com; connect-src 'none'; font-src 'self'; media-src 'none'; form-action 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
X-Frame-Options: DENY
Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
```

Depois de confirmar que o domínio e todos os subdomínios funcionam exclusivamente por HTTPS, adicione:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

`frame-ancestors` não funciona dentro de uma tag `<meta>`; ele precisa ser enviado no header HTTP. A configuração exata depende da plataforma escolhida para hospedar o projeto.

Referências: [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) e [MDN CSP `frame-ancestors`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors).

## Misconfigurations e segredos

- nunca publique `.env`, tokens, chaves privadas, cookies, dumps ou relatórios sob embargo;
- mantenha `.env*`, logs, dependências e artefatos de build fora do Git;
- sirva o site somente por HTTPS em produção;
- desative listagem de diretórios, métodos HTTP desnecessários e páginas de erro com detalhes internos;
- defina tipos MIME corretos e use `nosniff`;
- não adicione bibliotecas remotas por CDN sem revisão, versão fixa e integridade;
- revise redirects, domínios externos e permissões sempre que a hospedagem mudar;
- execute os testes e uma revisão visual antes de cada publicação.

## Checklist antes do merge

```bash
node --check src/app.js
node --check src/data.js
node --check src/markdown.js
node --check src/routing.js
node --check src/security.js
node --test tests/*.test.js
git diff --check
```

Além dos testes, abra rotas válidas e inválidas no navegador e verifique o console em busca de violações da CSP.
