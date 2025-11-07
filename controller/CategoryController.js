const { Category } = require('../models');

module.exports = {
  
  // GET ALL
  async index(req, res) {
    try {
      const categories = await Category.findAll();
      return res.json(categories);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // GET BY ID
  async show(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) return res.status(404).json({ message: 'Category not found' });

      return res.json(category);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // CREATE
  async store(req, res) {
    try {
      const { name, created_date } = req.body;
      const category = await Category.create({ name, created_date });

      return res.status(201).json(category);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // UPDATE
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, created_date } = req.body;

      const category = await Category.findByPk(id);
      if (!category) return res.status(404).json({ message: 'Category not found' });

      await category.update({ name, created_date });

      return res.json(category);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // DELETE
  async delete(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) return res.status(404).json({ message: 'Category not found' });

      await category.destroy();

      return res.json({ message: "deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

}
