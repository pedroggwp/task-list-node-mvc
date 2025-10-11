const { Sequelize } = require("sequelize");

const DB_NAME = process.env.DB_NAME || "tasks_db";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "root";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 3306;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  dialectOptions: {
    connectTimeout: 10000,
  },
  logging: false,
});

async function connectWithRetry(retries = 5, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log("🔌 Conexão com o MySQL estabelecida com sucesso!");
      return;
    } catch (error) {
      console.error(
        `❌ Tentativa ${i + 1}/${retries} falhou: ${error.message}`
      );
      if (i < retries - 1) {
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        console.error(
          "❌ Não foi possível conectar ao banco de dados após várias tentativas."
        );
      }
    }
  }
}

connectWithRetry();

module.exports = sequelize;
