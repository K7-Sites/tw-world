# Decisões aprovadas

## Rodapé institucional · 23 de novembro de 2026

- **Decisão e motivo.** O responsável pelo projeto confirmou as cinco localidades e os endereços da imagem de referência para exibição no novo rodapé.
- **Alternativa considerada.** Manter a seleção anterior de Boa Vista e CIC.
- **Impacto.** O rodapé compartilhado apresenta Recife e Olinda como unidades e os colégios da Imaculada Conceição, de Nossa Senhora de Lourdes e de São José como núcleos. A confirmação abrange a identificação e o endereço de cada local.
- **Aprovação.** Responsável pelo projeto, em conversa de implementação. Decisão aprovada.

## Destino provisório do formulário · 25 de novembro de 2026

- **Decisão.** Usar `comercial@transworld.com.br` como destino provisório das solicitações do formulário. O endereço informado na conversa foi `comercial@`, completado com o domínio institucional.
- **Motivo.** Direcionar as solicitações à equipe comercial enquanto a integração definitiva de leads está pendente.
- **Alternativas consideradas.** Usar a caixa institucional de contato ou aguardar a integração definitiva.
- **Impacto.** A escolha define o destinatário. O remetente autenticado, a configuração do servidor e o teste de entrega em homologação continuam pendentes. O formulário permanece desabilitado.
- **Aprovação.** Destino indicado pelo responsável pelo projeto em conversa de implementação. A ativação do envio permanece pendente.

## Envio provisório na Hostinger · 25 de novembro de 2026

- **Decisão.** Homologar o envio com PHP na Hostinger e SMTP autenticado da K2Host pela caixa comercial, sem migrar as caixas postais nesta etapa.
- **Motivo.** O site estático já está em homologação na Hostinger. O PHP acrescenta validação e envio no servidor sem mudar a entrega das páginas Eleventy.
- **Alternativa considerada.** Usar a função serverless planejada na arquitetura inicial.
- **Impacto.** O PHPMailer (LGPL 2.1) trata SMTP autenticado e conexão cifrada. A dependência e as credenciais ficam fora da raiz pública. O modo de homologação aceita apenas dados fictícios. O envio público segue pendente de validação e autorização.
- **Aprovação.** Responsável pelo projeto, em conversa de implementação. Homologação aprovada.
- **Validação.** Na Hostinger, o formulário em modo de teste enviou uma solicitação fictícia. A K2Host aceitou a mensagem, e o responsável pelo projeto confirmou o recebimento na caixa comercial e a exibição do e-mail fictício. A ativação pública ainda depende da autorização de produção e da preservação do e-mail na mudança de DNS.

## Ativação do formulário no domínio oficial · 27 de novembro de 2026

- **Decisão.** Liberar o envio do formulário em `transworld.com.br` para `comercial@transworld.com.br`. O responsável pelo projeto autorizou a ativação e adiou a publicação da política de privacidade.
- **Motivo.** A entrega pelo domínio oficial foi confirmada com dados fictícios após a mudança de hospedagem.
- **Alternativa considerada.** Manter o formulário em modo de teste até a publicação da política de privacidade.
- **Impacto.** Em modo `live`, o formulário aceita solicitações dos visitantes e as encaminha à caixa comercial existente. A política de privacidade e as regras de acesso e retenção continuam pendentes.
- **Aprovação e estado.** Ativação aprovada pelo responsável pelo projeto em conversa de implementação. O domínio oficial responde em modo `live`, e o responsável confirmou a entrega do primeiro teste de produção na caixa comercial.

## Confirmação de envio do formulário · 27 de novembro de 2026

- **Decisão.** Usar `/obrigado/` como confirmação dos envios da página de contato e do formulário em janela.
- **Motivo.** Mostrar a confirmação e oferecer acesso ao telefone oficial e à página inicial em uma tela própria.
- **Alternativa considerada.** Exibir apenas a confirmação no formulário.
- **Impacto.** O redirecionamento depende da confirmação do servidor. A página tem `noindex` e fica fora do sitemap.
- **Aprovação e estado.** Página solicitada pelo responsável pelo projeto. Implementada em desenvolvimento.

## Fontes editoriais, relação de marca e Blog · 24 de novembro de 2026

- **Decisão.** Considerar aprovadas as informações presentes em `Guia de Cursos 2026.docx`, `Novo site- Produtor Visual.docx` e `Novo site - Desenvolvedor.docx`. A TW Idiomas é a nova marca da Transworld Idiomas. O Blog fica para uma segunda etapa e não deve aparecer na navegação nesta fase.
- **Motivo.** O responsável pelo projeto confirmou que os arquivos foram enviados pelo cliente e autorizou seu conteúdo para o site, além de definir a relação entre as marcas e o adiamento do Blog.
- **Alternativas consideradas.** Manter os conteúdos dos arquivos como pendentes; manter o Blog no menu; continuar exibindo uma marcação de validação para a relação Transworld Idiomas → TW Idiomas.
- **Impacto.** A relação de marca pode ser apresentada como fato aprovado. Quando os arquivos não trouxerem detalhes suficientes, a página deve orientar o visitante a entrar em contato, sem inventar programas, níveis ou condições comerciais. A rota do Blog permanece preservada para a segunda etapa, mas seu link é removido da navegação atual.
- **Aprovação.** Responsável pelo projeto, em conversa de implementação. Decisão aprovada.
