module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define(
    'Vote',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      id_idea: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Ideia',
          key: 'id',
        },
      },
      created_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'vote',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['id_user', 'id_idea'],
          name: 'idx_user_idea_unique',
        },
      ],
    }
  );

  Vote.associate = (models) => {
    Vote.belongsTo(models.User, { foreignKey: 'id_user' });
    Vote.belongsTo(models.Idea, { foreignKey: 'id_idea' });
  };

  return Vote;
};
