const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const mensaje = req.body.Body;

  try {
    const respuesta = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: mensaje }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const texto = respuesta.data.choices[0].message.content;
    res.type("text/xml")
    res.send(`
      <Response>
        <Message>${texto}</Message>
      </Response>
    `);

  } catch (error) {
res.type("text/xml")    
res.send(`
      <Response>
        <Message>Error en el bot</Message>
      </Response>
    `);
  }
});

app.listen(3000, () => {
  console.log("Bot funcionando");
});
