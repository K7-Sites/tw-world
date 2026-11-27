# Migração da K2Host para a Hostinger — fase 2

Roteiro para mover o DNS, as caixas de e-mail e a gestão do domínio `transworld.com.br`. O site já está hospedado na Hostinger. Esta fase começa após aprovação da Transworld e definição de uma janela de migração.

Na consulta pública de 27 de novembro de 2026, o DNS usava `ns1.k2host.com.br` e `ns2.k2host.com.br`. O MX tinha prioridade `1` e apontava para `mail.transworld.com.br`, que resolvia para `38.226.110.11`. `sge.transworld.com.br` também resolvia para esse IP. Nenhum registro DS foi retornado. Confira os valores novamente na data da migração.

## 1. Inventariar e fazer backup

1. Exporte a zona DNS da K2Host, ou peça o arquivo ao suporte. Registre os nameservers, os TTLs, os apontamentos atuais de site e e-mail, os subdomínios e o TXT de verificação do Search Console. Guarde uma cópia fora da K2Host.
2. Liste as caixas de e-mail, o espaço ocupado, as pastas relevantes, os aliases, os encaminhamentos, os filtros e as respostas automáticas. Identifique quem usa webmail, Outlook, Thunderbird ou celular e se existe acesso via POP. Confirme, no plano da Hostinger, a quantidade de caixas, as cotas e os limites de importação antes de contratar ou iniciar a transferência.
3. Faça um backup restaurável de cada caixa na K2Host e guarde uma cópia segura fora da hospedagem. Teste a leitura ou restauração de uma amostra. Exporte contatos e calendários separadamente. Faça backup também dos arquivos locais de e-mail, como PST e pastas locais, que podem conter mensagens ausentes do servidor. O IMAP só consegue importar o que a origem disponibiliza. [Importação de e-mails na Hostinger](https://www.hostinger.com/support/5866288-how-to-import-emails-to-hostinger-email/)
4. Confirme com a Transworld o uso do SGE e dos outros serviços legados que ainda apontam para a K2Host. Se algum continuar em uso, planeje a migração ou mantenha a hospedagem necessária para ele antes de cancelar o plano.

## 2. Mover o DNS mantendo o correio na K2Host

1. No hPanel, abra **Domínios → DNS** e prepare a zona da Transworld. Importe o arquivo BIND se disponível ou recrie os registros manualmente. Compare a zona antiga com a nova. Preserve os apontamentos do site para a Hostinger, os registros de subdomínios, a verificação do Google e os registros de e-mail da K2Host. Confira se nenhum MX padrão da Hostinger ficou ativo nessa etapa. Se a zona ainda não estiver disponível no hPanel, peça ao suporte que confirme como prepará-la antes da troca. [Editor de zona DNS da Hostinger](https://www.hostinger.com/support/how-to-use-hostingers-dns-zone-editor/)
2. Confirme os nameservers exatos no painel da Hostinger. Verifique se existe um DS ativo. Se houver, combine a transição do DNSSEC com os provedores antes de trocar os nameservers. Solicite a alteração pelo provedor que administra o domínio ou use o Registro.br se a administração for direta. [Gerenciamento do domínio no Registro.br](https://registro.br/ajuda/gerenciamento-de-conta/) · [DNSSEC na Hostinger](https://www.hostinger.com/support/3667267-how-to-use-dnssec-records-at-hostinger/)
3. Mantenha ambas as zonas funcionando durante a transição. Confirme que os novos servidores respondem pelos registros planejados. Teste o site em HTTPS, o envio e o recebimento de e-mails, o formulário, os serviços em subdomínios e a presença do TXT do Search Console. Avance quando esses serviços estiverem estáveis.

## 3. Preparar as caixas na Hostinger e importar o histórico

1. Crie na Hostinger as caixas com os mesmos endereços e cotas suficientes. Recrie aliases, encaminhamentos, filtros e respostas automáticas conforme o inventário. Obtenha da K2Host o hostname IMAP seguro do servidor antigo que continuará válido mesmo após a troca dos apontamentos de e-mail. Guarde os acessos em um cofre autorizado.
2. Use a ferramenta de importação do hPanel para copiar por IMAP da K2Host para a Hostinger, começando com uma caixa piloto. O recebimento continua na K2Host durante essa cópia. Antes de migrar as demais, confirme os limites da ferramenta para o produto contratado e combine com o suporte como tratar caixas grandes. [Importação de e-mails na Hostinger](https://www.hostinger.com/support/5866288-how-to-import-emails-to-hostinger-email/)
3. Compare as contagens por pasta na origem e no destino. Confira no webmail da Hostinger a Caixa de Entrada, os Enviados, o Arquivo e as pastas personalizadas. Abra amostras de mensagens antigas, recentes e com anexos. Registre diferenças e corrija as pendências, incluindo arquivos locais que precisem ser importados separadamente.

## 4. Virar o recebimento e sincronizar as últimas mensagens

1. Combine a janela com a equipe e registre os valores existentes para eventual retorno. Na zona ativa da Hostinger, use os MX e os registros SPF, DKIM e DMARC indicados para o produto contratado. Mantenha um único SPF no domínio e considere os remetentes autorizados que ainda estiverem ativos. Revise os registros de descoberta e acesso dos clientes de e-mail. Mantenha o endereço de origem necessário para a última sincronização. [Configuração manual do e-mail Hostinger](https://www.hostinger.com/br/support/8671319-como-fazer-a-configuracao-manual-de-dominio-para-e-mail-hostinger/)
2. Configure Outlook, celulares e demais clientes com os dados do novo serviço. No formulário, atualize o SMTP na configuração privada `tw-contact-private/contact-config.php`, fora de `public_html`. Preserve o destinatário comercial e confirme o remetente autenticado. Faça um teste externo de recebimento, responda a partir da Hostinger e confirme a entrega de uma solicitação de teste do site. [Onde consultar os dados de IMAP e SMTP na Hostinger](https://www.hostinger.com/br/support/1575756-como-encontrar-os-detalhes-de-configuracao-de-e-mail-no-hpanel-hostinger/)
3. Durante a propagação, monitore as duas hospedagens. Confira se chegou correio na K2Host após a troca e faça uma sincronização incremental, usando um método confirmado no piloto para evitar duplicatas. Repita a conferência por pasta e peça validação dos responsáveis pelas caixas. Mantenha a K2Host ativa até fechar todas as diferenças e confirmar que novas mensagens chegam apenas à Hostinger.

## 5. Transferir a gestão do domínio .com.br

1. Após estabilizar DNS e e-mail, confirme com o titular o acesso ao Registro.br, a renovação e a autorização para iniciar a transferência no hPanel. Verifique também se a mudança de provedor no cadastro da titularidade afeta outros domínios da empresa.
2. No Registro.br, siga o procedimento para selecionar **HSTDOMAINS (127)**. Se houver outro provedor vinculado, siga a transição e a carência que os painéis indicarem. Conclua a transferência no hPanel com os dados do titular atual e selecione a opção para **manter os nameservers existentes**, já validados na etapa 2. [Transferência de domínio .br na Hostinger](https://www.hostinger.com/support/8698031-how-to-transfer-a-br-domain-to-hostinger/) · [Regras do Registro.br](https://registro.br/ajuda/gerenciamento-de-conta/)
3. Confirme o domínio ativo no hPanel, o titular, a data de vencimento, a renovação e a delegação DNS. Teste novamente site, e-mails e subdomínios essenciais.

## Retorno em caso de falha e encerramento da K2Host

- Se a zona nova falhar, restaure os nameservers anteriores enquanto a zona da K2Host ainda estiver funcionando. Se a falha for apenas no correio, restaure os registros de e-mail anteriores na zona ativa e retorne o SMTP do formulário ao serviço original, se ele tiver sido alterado. O retorno também depende de propagação.
- Antes de retornar o e-mail, preserve as mensagens já recebidas ou enviadas pela Hostinger e reconcilie essas mensagens com o serviço que ficar ativo.
- Encerre a K2Host somente com backup recuperável, histórico conferido, última sincronização concluída, entrega e formulário testados, serviços legados resolvidos e aceite da Transworld. Registre a data da troca, as pendências por caixa e quem validou cada etapa. Guarde credenciais e cópias de e-mails fora do repositório.
