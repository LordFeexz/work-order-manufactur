'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('work_trackers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      work_order_number: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: { tableName: 'work_orders' },
          key: 'no',
        },
        validate: {
          notNull: {
            msg: 'work order number is required',
          },
          notEmpty: {
            msg: 'work order number is required',
          },
        },
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: { tableName: 'users' },
          key: 'id',
        },
        validate: {
          notNull: {
            msg: 'updated_by is required',
          },
          notEmpty: {
            msg: 'updated_by is required',
          },
        },
      },
      current_status: {
        type: Sequelize.ENUM('Pending', 'In Progress', 'Completed', 'Canceled'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['Pending', 'In Progress', 'Completed', 'Canceled']],
            msg: 'current_status must be Pending, In Progress, Completed, or Canceled',
          },
          notNull: {
            msg: 'current_status is required',
          },
          notEmpty: {
            msg: 'current_status is required',
          },
        },
        values: ['Pending', 'In Progress', 'Completed', 'Canceled'],
        defaultValue: 'Pending',
      },
      updated_status: {
        type: Sequelize.ENUM('Pending', 'In Progress', 'Completed', 'Canceled'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['Pending', 'In Progress', 'Completed', 'Canceled']],
            msg: 'updated_status must be Pending, In Progress, Completed, or Canceled',
          },
          notNull: {
            msg: 'updated_status is required',
          },
          notEmpty: {
            msg: 'updated_status is required',
          },
        },
        values: ['Pending', 'In Progress', 'Completed', 'Canceled'],
        defaultValue: 'Pending',
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
    await queryInterface.dropTable('work_trackers');
  },
};
