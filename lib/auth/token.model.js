module.exports = (app) => {
  const sequelize = app.get('sequelize')
  const { INTEGER, TEXT } = app.get('DataTypes')

  const token = sequelize.define(
    'token',
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      token: {
        type: TEXT,
        allowNull: false,
        unique: true,
      },
      authId: {
        type: INTEGER,
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
  return token
}
