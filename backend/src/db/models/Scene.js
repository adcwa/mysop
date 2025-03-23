module.exports = (sequelize, DataTypes) => {
  const Scene = sequelize.define('Scene', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sceneData: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {});

  Scene.associate = function(models) {
    Scene.hasMany(models.SceneInstance, {
      foreignKey: 'sceneId',
      as: 'instances'
    });
  };

  return Scene;
}; 