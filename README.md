# Delícias Geladas — Robô de Atendimento

V1 preparada para atendimento da Sorveteria & Açaiteria Delícias Geladas.

## Dados configurados

- Endereço: Rua João XXIII, nº 213
- Taxa de entrega: R$ 2,00
- Segunda a sexta: 17:00 às 22:00
- Sábado: fechado
- Domingo: 18:00 às 22:00
- Cardápio: public/cardapio.jpg

## Testar no computador

1. Instale Node.js.
2. Abra o terminal nesta pasta.
3. Execute:
   npm install
4. Depois:
   npm start
5. Abra:
   http://localhost:3000

A tela permite testar o robô sem precisar conectar o WhatsApp ainda.

## Próxima etapa

Conectar o webhook e o envio de mensagens à API oficial do WhatsApp, cadastrar o número da empresa e criar o painel de atendentes.


## Deploy no Render

- Tipo: Web Service
- Build Command: npm install
- Start Command: npm start
- Variável: WHATSAPP_VERIFY_TOKEN (crie um valor secreto seu)
- Webhook de verificação: /webhook
- Health check: /health
