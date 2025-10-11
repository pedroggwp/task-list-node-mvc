const Task = require("../models/Task"); // O Controller precisa do Model para interagir com o banco

module.exports = {
  // Função para RENDERIZAR a página com todas as tarefas
  async showTasks(req, res) {
    // Pede ao Model para buscar TODAS as tarefas no banco. `raw: true` simplifica os dados.
    const tasks = await Task.findAll({ raw: true });

    tasks.forEach((task) => {
      if (task.priority === 3) {
        task.priorityText = "Alta";
        task.priorityClass = "priority-high";
      } else if (task.priority === 2) {
        task.priorityText = "Média";
        task.priorityClass = "priority-medium";
      } else {
        task.priorityText = "Baixa";
        task.priorityClass = "priority-low";
      }
    });

    // Renderiza a view 'all.handlebars' e envia o objeto { tasks } com os dados do banco
    res.render("all", { tasks });
  },

  // Função para RENDERIZAR a página de criação de tarefa
  createTask(req, res) {
    res.render("create");
  },

  // Função para SALVAR uma nova tarefa no banco
  async saveTask(req, res) {
    const { title, description, priority, dueDate } = req.body;
    try {
      await Task.create({
        title,
        description,
        priority: parseInt(priority, 10) || 1,
        dueDate,
        done: false,
      });
      res.redirect("/tasks");
    } catch (err) {
      res.status(500).send("Erro ao criar tarefa");
    }
  },

  // Função para RENDERIZAR a página de edição com dados de UMA tarefa
  async editTask(req, res) {
    // Pega o 'id' que vem na URL (ex: /tasks/edit/5)
    const id = req.params.id;
    // Pede ao Model para buscar a tarefa específica pela sua Chave Primária (id)
    const task = await Task.findByPk(id, { raw: true });
    // Renderiza a view 'edit.handlebars' e envia os dados da tarefa encontrada
    res.render("edit", { task });
  },

  // Função para ATUALIZAR uma tarefa no banco
  async updateTask(req, res) {
    const { id, title, description, done, priority, dueDate } = req.body;
    try {
      await Task.update(
        {
          title,
          description,
          done: !!done,
          priority: parseInt(priority, 10) || 1,
          dueDate,
        },
        { where: { id } }
      );
      res.redirect("/tasks");
    } catch (err) {
      res.status(500).send("Erro ao atualizar tarefa");
    }
  },

  // Função para DELETAR uma tarefa
  async deleteTask(req, res) {
    const id = req.body.id;
    await Task.destroy({ where: { id: id } }); // DELETE FROM Tasks WHERE id = ?
    res.redirect("/tasks");
  },

  // Função para FILTRAR tarefas por status (pendentes ou concluídas)
  async showAllTasks(req, res) {
    const filter = (req.query.filter || "").toLowerCase();

    let where = {};

    if (filter === "pending") {
      where.done = 0;
    } else if (filter === "completed") {
      where.done = 1;
    }

    const tasks = await Task.findAll({ where, raw: true });

    tasks.forEach((task) => {
      if (task.priority === 3) {
        task.priorityText = "Alta";
        task.priorityClass = "priority-high";
      } else if (task.priority === 2) {
        task.priorityText = "Média";
        task.priorityClass = "priority-medium";
      } else {
        task.priorityText = "Baixa";
        task.priorityClass = "priority-low";
      }
    });

    res.render("all", {
      tasks,
      filter,
      isPending: filter === "pending",
      isCompleted: filter === "completed",
    });
  },
};
