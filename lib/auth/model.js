module.exports = (app) => {
  const sequelize = app.get('sequelize')
  const { INTEGER, STRING } = app.get('DataTypes')

  const auth = sequelize.define(
    'auth',
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: STRING,
        allowNull: false,
      },
      email: {
        type: STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: STRING,
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
  return auth
}
