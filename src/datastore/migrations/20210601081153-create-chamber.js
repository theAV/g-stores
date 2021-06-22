"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("chambers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      capacity: {
        type: Sequelize.FLOAT,
      },
      status: {
        type: Sequelize.BOOLEAN,
      },
      warehouseId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          // User belongsTo Company 1:1
          model: "warehouses",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("chambers");
  },
};
