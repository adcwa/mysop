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
      as: 'scene'
    });
    SceneInstance.hasMany(models.SceneInstanceStep, {
      foreignKey: 'instanceId',
      as: 'steps'
    });
  };

  return SceneInstance;
}; 