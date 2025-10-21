module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('pending','in-progress','done'),
      defaultValue: 'pending'
    },
    dueDate: DataTypes.DATEONLY
  }, {
    timestamps: true
  });

  return Task;
};
