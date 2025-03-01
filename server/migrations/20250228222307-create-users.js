'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('product manager', 'operator'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['product manager', 'operator']],
            msg: 'role must be product manager or operator',
          },
          notNull: {
            msg: 'role is required',
          },
          notEmpty: {
            msg: 'role is required',
          },
        },
        values: ['product manager', 'operator'],
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'username is required',
          },
          notEmpty: {
            msg: 'username is required',
          },
          min: {
            args: [3],
            msg: 'username must be at least 3 characters',
          },
          max: {
            args: [30],
            msg: 'username must be at most 30 characters',
          },
        },
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'password is required',
          },
          notEmpty: {
            msg: 'password is required',
          },
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
