# Na Régua Barber Shop

Site responsivo da Na Régua Barber Shop, com identidade visual escura e dourada, serviços e preços atualizados conforme a tabela enviada, horários e formulário de solicitação de agendamento.

## Arquivos
- `index.html` — estrutura do site
- `styles.css` — visual e responsividade
- `app.js` — menu, formulário e envio do pedido pelo WhatsApp
- `config.js` — telefone e configurações
- `supabase.sql` — estrutura opcional do banco de dados
- `assets/` — arquivos visuais

## Como abrir
Abra `index.html` no navegador. Para publicar, envie todos os arquivos e a pasta `assets` para a hospedagem mantendo a estrutura.

## WhatsApp
O formulário abre o WhatsApp com os dados preenchidos para a barbearia confirmar o horário. Ele não confirma automaticamente a disponibilidade.

## Supabase (opcional)
O arquivo `supabase.sql` contém uma tabela inicial para pedidos de agendamento. O site desta versão não grava os pedidos no Supabase; para isso, é necessário configurar um projeto, suas credenciais e integrar o envio no backend. Não publique chaves secretas no navegador.


## Painel administrativo do barbeiro

Acesse `admin.html` depois de publicar o site. O painel usa login do Supabase Auth e permite listar agendamentos, filtrar por status/data e confirmar, recusar, reabrir ou cancelar solicitações.

### Configuração necessária
1. No Supabase, abra **Project Settings > API** e copie a **Project URL** e a chave **anon/public**.
2. Cole esses dois valores em `config.js`. Nunca use a chave `service_role` ou uma chave `secret` no navegador.
3. No Supabase, abra **SQL Editor**, cole e execute o conteúdo de `supabase.sql`.
4. Em **Authentication > Users**, crie o usuário do barbeiro com e-mail e senha.
5. Copie o UUID desse usuário e execute no SQL Editor:
   `insert into public.barber_admins (user_id) values ('UUID-DO-USUARIO');`
6. Publique novamente todos os arquivos, mantendo `admin.html` e `admin.js` junto dos demais.

Os clientes enviam solicitações pelo formulário do site. Elas são gravadas como `pendente` no Supabase e aparecem no painel. O site também abre o WhatsApp com os dados para contato. O painel atualiza a lista a cada 20 segundos e possui botão de atualização manual.

**Importante:** a chave anon/public é própria para uso no navegador quando as políticas RLS estão corretas. A chave `service_role`/secret nunca deve ser publicada ou enviada.
