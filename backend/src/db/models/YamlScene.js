module.exports = (sequelize, DataTypes) => {
  const YamlScene = sequelize.define('YamlScene', {
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
    yamlContent: {
      type: DataTypes.TEXT,
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

  YamlScene.associate = function(models) {
    YamlScene.hasMany(models.SceneInstance, {
      foreignKey: 'sceneId',
      as: 'instances',
      constraints: false,
      scope: {
        sceneType: 'yaml'
      }
    });
  };

  return YamlScene;
}; 