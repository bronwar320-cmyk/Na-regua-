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
