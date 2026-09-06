const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const config = {
  nome: "Delícias Geladas",
  endereco: "Rua João XXIII, nº 213",
  taxaEntrega: "R$ 2,00",
  horario: {
    segunda: "17:00 às 22:00",
    terca: "17:00 às 22:00",
    quarta: "17:00 às 22:00",
    quinta: "17:00 às 22:00",
    sexta: "17:00 às 22:00",
    sabado: "FECHADO",
    domingo: "18:00 às 22:00"
  }
};

function menu() {
  return `🍦🍓 DELÍCIAS GELADAS 🍓🍦

Olá! Seja bem-vindo(a)! 😍

Como podemos ajudar?

1️⃣ 📋 Cardápio
2️⃣ 🛵 Taxa de entrega
3️⃣ 📍 Endereço
4️⃣ 🕐 Horário de atendimento
5️⃣ 👩‍💼 Falar com atendente
6️⃣ ❓ Outras informações

Digite o número da opção desejada.`;
}

function resposta(opcao) {
  switch (String(opcao).trim()) {
    case "1":
      return `🍨 CARDÁPIO — DELÍCIAS GELADAS

Confira nosso cardápio! 😋

[ENVIAR_IMAGEM_CARDAPIO]

Para voltar ao menu, digite MENU.`;

    case "2":
      return `🛵 TAXA DE ENTREGA

Nossa taxa de entrega é de ${config.taxaEntrega}.

Para outras informações sobre entrega, digite 5️⃣ para falar com um atendente.`;

    case "3":
      return `📍 NOSSO ENDEREÇO

🍦 ${config.nome}
${config.endereco}

Esperamos por você! 😍`;

    case "4":
      return `🕐 HORÁRIO DE ATENDIMENTO

📅 Segunda a sexta: ${config.horario.segunda}
❌ Sábado: não funcionamos
📅 Domingo: ${config.horario.domingo}

💜 Esperamos por você!`;

    case "5":
      return `👩‍💼 ATENDIMENTO HUMANO

Claro! Vou encaminhar sua conversa para um de nossos atendentes.

⏳ Aguarde um momento, por favor.`;

    case "6":
      return `❓ OUTRAS INFORMAÇÕES

Envie sua dúvida por aqui ou digite 5️⃣ para falar com um atendente.`;

    default:
      return null;
  }
}

// Rota de demonstração: testa o robô sem WhatsApp.
app.post("/api/teste", (req, res) => {
  const mensagem = String(req.body.mensagem || "").trim();
  const normalizada = mensagem.toLowerCase();

  if (!mensagem || ["oi", "olá", "ola", "menu", "bom dia", "boa tarde", "boa noite"].includes(normalizada)) {
    return res.json({ resposta: menu() });
  }

  const respostaAutomatica = resposta(mensagem);
  if (respostaAutomatica) {
    return res.json({
      resposta: respostaAutomatica,
      imagem: normalizada === "1" ? "/cardapio.jpg" : null,
      transferirAtendente: normalizada === "5"
    });
  }

  if (
    normalizada.includes("cardapio") ||
    normalizada.includes("cardápio")
  ) {
    return res.json({ resposta: resposta("1"), imagem: "/cardapio.jpg" });
  }

  if (normalizada.includes("entrega")) {
    return res.json({ resposta: resposta("2") });
  }

  if (normalizada.includes("endereço") || normalizada.includes("endereco") || normalizada.includes("onde fica")) {
    return res.json({ resposta: resposta("3") });
  }

  if (normalizada.includes("horário") || normalizada.includes("horario") || normalizada.includes("abre")) {
    return res.json({ resposta: resposta("4") });
  }

  if (
    normalizada.includes("atendente") ||
    normalizada.includes("pessoa") ||
    normalizada.includes("humano")
  ) {
    return res.json({ resposta: resposta("5"), transferirAtendente: true });
  }

  return res.json({
    resposta: `🤖 Não consegui identificar sua solicitação.

Escolha uma opção:

1️⃣ Cardápio
2️⃣ Taxa de entrega
3️⃣ Endereço
4️⃣ Horário
5️⃣ Falar com atendente
6️⃣ Outras informações`
  });
});

// Webhook preparado para futura conexão com WhatsApp Cloud API.
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  console.log("Webhook recebido:", JSON.stringify(req.body, null, 2));
  // Nesta etapa inicial, apenas confirmamos o recebimento.
  // O envio de respostas pela API oficial será configurado após o webhook.
  res.sendStatus(200);
});

app.get("/health", (_, res) => res.status(200).json({ ok: true, servico: "Delicias Geladas" }));

app.get("/api/config", (_, res) => res.json(config));

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Delícias Geladas rodando em http://localhost:${port}`);
});
