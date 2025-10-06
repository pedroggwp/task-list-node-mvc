const Task = require("../models/Task"); // O Controller precisa do Model para interagir com o banco

module.exports = {
  // Função para RENDERIZAR a página com todas as tarefas
  async showTasks(req, res) {
    // Pede ao Model para buscar TODAS as tarefas no banco. `raw: true` simplifica os dados.
    const tasks = await Task.findAll({ raw: true });
    // Renderiza a view 'all.handlebars' e envia o objeto { tasks } com os dados do banco
    res.render("all", { tasks });
  },

  // Função para RENDERIZAR a página de criação de tarefa
  createTask(req, res) {
    res.render("create");
  },

  // Função para SALVAR uma nova tarefa no banco
  async saveTask(req, res) {
    // Pega os dados enviados pelo formulário no corpo (body) da requisição
    await Task.create({
      title: req.body.title,
      description: req.body.description,
      done: false, // O status inicial é sempre 'false'
    });
    // Redireciona o usuário para a página inicial após a criação
    res.redirect("/tasks");
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
    // Pega o 'id' que vem do campo escondido (<input type="hidden">) do formulário
    const id = req.body.id;
    await Task.update(
      {
        title: req.body.title,
        description: req.body.description,
        // Lógica para checkbox: se ele for marcado, req.body.done será 'on', senão será 'undefined'.
        done: req.body.done === "on" ? true : false,
      },
      { where: { id: id } } // Cláusula WHERE: atualize APENAS a tarefa com este id
    );
    res.redirect("/tasks");
  },

  // Função para DELETAR uma tarefa
  async deleteTask(req, res) {
    const id = req.body.id;
    await Task.destroy({ where: { id: id } }); // DELETE FROM Tasks WHERE id = ?
    res.redirect("/tasks");
  },
};
