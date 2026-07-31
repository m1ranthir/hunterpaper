# Submissões de papers pelo GitHub

O GitHub Issues é a caixa de entrada e o painel de moderação do Hunter Paper. Não existe API, backend ou publicação automática.

Para transformar uma Issue aprovada em conteúdo do site, siga o [`Manual para publicar um paper`](PUBLICAR_PAPER.md).

## Fluxo

1. O autor abre o formulário `Submit a paper` no GitHub.
2. O GitHub registra o perfil responsável pela submissão.
3. A Issue recebe a label `paper:pending` e é atribuída a `m1ranthir`.
4. O paper, o perfil do autor e as imagens são revisados manualmente.
5. O mantenedor aprova, solicita mudanças ou recusa a submissão.
6. Papers aprovados são adicionados manualmente ao site.
7. A Issue é marcada como publicada e encerrada.

As Issues são públicas. O formulário aceita somente conteúdo já autorizado para divulgação.

## Labels

Estas labels precisam ser criadas uma vez nas configurações do repositório:

| Label | Uso |
| --- | --- |
| `paper:pending` | Paper recebido e ainda não revisado |
| `paper:reviewing` | Revisão manual em andamento |
| `paper:changes-requested` | Autor precisa ajustar o conteúdo |
| `paper:approved` | Paper aprovado para publicação |
| `paper:declined` | Paper recusado |
| `paper:published` | Paper já publicado no site |

## Aprovação

1. Verifique o histórico e o perfil público do autor.
2. Confirme que o conteúdo pode ser divulgado.
3. Revise Markdown, evidências, impacto, mitigação, referências e imagens.
4. Troque a label para `paper:approved`.
5. Adicione o paper e suas imagens ao conteúdo público do projeto.
6. Depois de validar o site, use `paper:published` e encerre a Issue.

## Alterações ou recusa

- Para ajustes, use `paper:changes-requested` e descreva objetivamente o que deve mudar.
- Para recusar, use `paper:declined`, informe o motivo e encerre a Issue.
