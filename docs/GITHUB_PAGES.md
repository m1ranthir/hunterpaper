# Hospedagem no GitHub Pages

O Hunter Paper usa um workflow do GitHub Actions para validar e publicar o site. Cada push na branch `main` executa os testes antes do deploy.

Enquanto não houver um domínio próprio, o endereço será:

```text
https://m1ranthir.github.io/hunterpaper/
```

## Ativar o primeiro deploy

Depois que a PR com o arquivo `.github/workflows/pages.yml` for aprovada e incorporada à `main`:

1. abra o repositório `m1ranthir/hunterpaper` no GitHub;
2. acesse **Settings**;
3. no menu lateral, abra **Pages**;
4. em **Build and deployment**, escolha **GitHub Actions** como source;
5. abra a aba **Actions** e acompanhe o workflow **Deploy GitHub Pages**;
6. quando ele terminar, abra `https://m1ranthir.github.io/hunterpaper/`.

O workflow também pode ser executado manualmente pela aba **Actions**, usando **Run workflow**.

## Adicionar um domínio próprio futuramente

Não adicione um domínio de exemplo ao repositório. Aguarde até possuir o domínio que será usado oficialmente.

Quando o domínio estiver disponível:

1. no GitHub, acesse **Settings > Pages** do repositório;
2. em **Custom domain**, informe o domínio real, por exemplo `www.hunterpaper.org`, e salve;
3. no painel da empresa onde o domínio foi registrado, crie um registro `CNAME` para `www` apontando para `m1ranthir.github.io`;
4. se também quiser usar o domínio raiz, como `hunterpaper.org`, configure os registros `A`, `AAAA` ou `ALIAS/ANAME` indicados na documentação atual do GitHub Pages;
5. aguarde a validação do DNS e ative **Enforce HTTPS**;
6. em **Settings > Pages** da sua conta GitHub, verifique o domínio com o registro `TXT` informado pelo GitHub;
7. teste tanto o domínio raiz quanto o endereço com `www`.

Prefira `www` como domínio principal e configure o redirecionamento do domínio raiz. Não use registros DNS curinga como `*.hunterpaper.org`, pois eles aumentam o risco de tomada de subdomínio.

Documentação oficial:

- [Gerenciar domínio personalizado no GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Verificar domínio personalizado](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [Proteger o site com HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

## Por que não existe um arquivo `CNAME` agora

O projeto publica por um workflow personalizado do GitHub Actions. O domínio deve ser registrado em **Settings > Pages** quando existir; um `CNAME` com valor fictício poderia interromper o endereço padrão sem configurar um domínio válido.

O site já usa caminhos relativos e rotas por hash. Por isso, ele funciona tanto em `/hunterpaper/` quanto na raiz de um domínio próprio sem precisar reescrever as rotas.

## Segurança do deploy

- somente a branch `main` publica automaticamente;
- a Action recebe apenas `contents: read`, `pages: write` e `id-token: write`;
- o deploy só acontece depois que os testes e as verificações de sintaxe passam;
- apenas `index.html`, `styles.css`, `assets/` e `src/` entram no site publicado;
- testes, documentação interna e arquivos Git não entram no artefato público.

O GitHub Pages não permite definir todos os headers HTTP personalizados. A CSP em `index.html` continua ativa, mas controles que exigem headers de resposta devem ser reavaliados se o projeto migrar de hospedagem.
