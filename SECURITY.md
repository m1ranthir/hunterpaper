# Política de segurança

## Vulnerabilidades no Hunter Paper

Não abra uma issue pública com detalhes exploráveis. Antes do lançamento, o projeto ainda precisa configurar um canal privado de contato; até isso acontecer, preserve o relatório localmente e não envie segredos pelo protótipo.

Consulte também o [guia de desenvolvimento seguro](docs/SECURE_DEVELOPMENT.md), que documenta o modelo de ameaças, as defesas aplicadas e os headers obrigatórios no deploy.

## Vulnerabilidades descritas em papers

O Hunter Paper aceita somente conteúdo cuja divulgação foi autorizada. Antes de submeter:

- aguarde a correção ou a autorização explícita do programa;
- remova domínios, tokens, credenciais, PII e dados de clientes;
- use contas e ambientes controlados nas evidências;
- não inclua instruções cujo propósito seja causar dano a sistemas reais.

O formulário de papers usa Issues públicas do GitHub e não é um canal seguro para conteúdo sob embargo.

## Controles implementados

- Markdown não aceita HTML arbitrário;
- valores dinâmicos recebem encoding antes de entrar no HTML;
- URLs com `javascript:`, `data:`, `blob:`, HTTP remoto, credenciais ou caracteres de controle são recusadas;
- imagens remotas são limitadas aos anexos hospedados pelo GitHub;
- links externos usam HTTPS, `noopener`, `noreferrer` e `ugc` quando aplicável;
- a página possui CSP restritiva como proteção adicional;
- papers usam IDs públicos opacos na URL, sem tratar o ID como segredo ou controle de acesso.

O frontend atual não possui login, cookies de sessão, API ou operações próprias de escrita. Portanto, não existe atualmente uma ação autenticada que possa ser explorada por CSRF. Isso deve ser reavaliado antes de adicionar qualquer backend.
