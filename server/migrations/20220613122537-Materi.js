'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Materis", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
     name : Sequelize.STRING,
     description : Sequelize.STRING,
     file : Sequelize.STRING,
     classroom_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "Classrooms",
        key: "id",
        as: "classroom_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    queryInterface.dropTable("Materis");
  },
};
