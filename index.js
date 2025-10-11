// 1. IMPORTAÇÕES
const express = require("express");
const exphbs = require("express-handlebars");
const conn = require("./db/conn");
const Task = require("./models/Task");
const taskRoutes = require("./routes/taskRoutes");

// 2. INICIALIZAÇÃO DO EXPRESS
const app = express();
const PORT = process.env.PORT || 3000;

// 3. CONFIGURAÇÃO DE MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.static("public"));

// 4. USO DAS ROTAS
app.use("/tasks", taskRoutes);
app.get("/", (_, res) => res.redirect("/tasks"));

// 5. CONEXÃO COM O BANCO E INICIALIZAÇÃO DO SERVIDOR
conn
  .sync()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Servidor rodando com sucesso em http://localhost:${PORT}`)
    );
  })
  .catch((err) =>
    console.log("❌ Erro ao conectar com o banco de dados:", err)
  );
