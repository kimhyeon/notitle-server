module.exports = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;
  return sequelize.define('user', {
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    pwd: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    profile: {
      type: DataTypes.STRING(100)
    },
    profile_back: {
      type: DataTypes.STRING(100)
    },
    status_message: {
      type: DataTypes.STRING(45)
    },
    email_certification_flag: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });
};
