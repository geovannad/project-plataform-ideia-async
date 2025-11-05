const { Idea } = require('../models');

module.exports = {

  // GET ALL
  async index(req, res) {
    try {
      const ideas = await Idea.findAll();
      return res.json(ideas);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // GET BY ID
  async show(req, res) {
    try {
      const { id } = req.params;
      const idea = await Idea.findByPk(id);
      if (!idea) return res.status(404).json({ message: 'Idea not found' });

      return res.json(idea);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // CREATE
  async store(req, res) {
    try {
      const { title, description, category, id_category, id_user, created_date } = req.body;
      const idea = await Idea.create({ title, description, category, id_category, id_user, created_date });

      return res.status(201).json(idea);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // UPDATE
  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, category, id_category, id_user, created_date } = req.body;

      const idea = await Idea.findByPk(id);
      if (!idea) return res.status(404).json({ message: 'Idea not found' });

      await idea.update({ title, description, category, id_category, id_user, created_date });

      return res.json(idea);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // DELETE
  async delete(req, res) {
    try {
      const { id } = req.params;
      const idea = await Idea.findByPk(id);
      if (!idea) return res.status(404).json({ message: 'Idea not found' });

      await idea.destroy();

      return res.json({ message: "deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

}
