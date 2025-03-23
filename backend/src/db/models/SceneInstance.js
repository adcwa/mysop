module.exports = (sequelize, DataTypes) => {
  const SceneInstance = sequelize.define('SceneInstance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sceneId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Scenes',
        key: 'id'
      }
    },
    sceneType: {
      type: DataTypes.ENUM('json', 'yaml'),
      defaultValue: 'json',
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('running', 'completed', 'failed'),
      defaultValue: 'running'
    },
    inputParams: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    outputResult: {
      type: DataTypes.JSONB,
      allowNull: true
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

  SceneInstance.associate = function(models) {
    SceneInstance.belongsTo(models.Scene, {
      foreignKey: 'sceneId',
      as: 'scene',
      constraints: false,
      scope: {
        sceneType: 'json'
      }
    });
    
    SceneInstance.belongsTo(models.YamlScene, {
      foreignKey: 'sceneId',
      as: 'yamlScene',
      constraints: false,
      scope: {
        sceneType: 'yaml'
      }
    });
    
    SceneInstance.hasMany(models.SceneInstanceStep, {
      foreignKey: 'instanceId',
      as: 'steps'
    });
  };

  return SceneInstance;
}; 