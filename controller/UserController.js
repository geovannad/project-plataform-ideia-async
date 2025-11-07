const { User } = require('../models');

module.exports = {

  // GET ALL
  async index(req, res) {
    try {
      const users = await User.findAll();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // GET BY ID
  async show(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // CREATE
  async store(req, res) {
    try {
      const { name, cpf, email, created_date, password } = req.body;
      const user = await User.create({ name, cpf, email, created_date, password });

      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // UPDATE
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, cpf, email, created_date, password } = req.body;
      
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      await user.update({ name, cpf, email, created_date, password });
      
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // DELETE
  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      await user.destroy();
      
      return res.json({ message: "deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

}
