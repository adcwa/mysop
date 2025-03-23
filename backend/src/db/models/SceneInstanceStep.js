module.exports = (sequelize, DataTypes) => {
  const SceneInstanceStep = sequelize.define('SceneInstanceStep', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    instanceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'SceneInstances',
        key: 'id'
      }
    },
    stepNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stepName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stepData: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('running', 'completed', 'failed'),
      defaultValue: 'running'
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
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

  SceneInstanceStep.associate = function(models) {
    SceneInstanceStep.belongsTo(models.SceneInstance, {
      foreignKey: 'instanceId',
      as: 'instance'
    });
  };

  return SceneInstanceStep;
}; 