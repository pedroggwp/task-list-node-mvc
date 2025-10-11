const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController"); // A Rota precisa saber qual Controller chamar

// Rota para a página inicial (listar todas as tarefas) - agora usa o handler que trata o query param "filter"
router.get("/", taskController.showAllTasks);

// Rota para a página de formulário de criação
router.get("/create", taskController.createTask);

// Rota para RECEBER os dados do formulário de criação
router.post("/create", taskController.saveTask);

// Rota para a página de formulário de edição
router.get("/edit/:id", taskController.editTask);

// Rota para RECEBER os dados do formulário de edição
router.post("/edit", taskController.updateTask);

// Rota para RECEBER a requisição de deletar uma tarefa
router.post("/delete", taskController.deleteTask);

module.exports = router;
