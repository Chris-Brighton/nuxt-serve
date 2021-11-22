module.exports = (app) => {
  const sequelize = app.get('sequelize')
  const DataTypes = app.get('DataTypes')
  const user = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCount(options) {
          options.raw = true
        },
      },
    }
  )
  user.associate = (models) => {}
  return user
}
