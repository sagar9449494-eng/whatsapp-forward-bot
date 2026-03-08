const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

// simple web server (hosting ke liye)
app.get("/", (req, res) => {
  res.send("WhatsApp Forward Bot Running");
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  }
});

// QR code
client.on("qr", (qr) => {
  console.log("Scan this QR Code:");
  qrcode.generate(qr, { small: true });
});

// ready
client.on("ready", () => {
  console.log("Bot is ready!");
});

// numbers
const SOURCE_NUMBER = "917006346953@c.us";
const TARGET_NUMBER = "919660477174@c.us";

// message forward
client.on("message", async (message) => {

  if (message.from === SOURCE_NUMBER) {

    try {

      await client.sendMessage(
        TARGET_NUMBER,
        message.body
      );

      console.log("Message forwarded");

    } catch (error) {

      console.log("Forward error:", error);

    }

  }

});

client.initialize();
