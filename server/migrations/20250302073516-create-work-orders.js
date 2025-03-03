'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('work_orders', {
      no: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'name is required',
          },
          notEmpty: {
            msg: 'name is required',
          },
        },
      },
      status: {
        type: Sequelize.ENUM('Pending', 'In Progress', 'Completed', 'Canceled'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['Pending', 'In Progress', 'Completed', 'Canceled']],
            msg: 'status must be Pending, In Progress, Completed, or Canceled',
          },
          notNull: {
            msg: 'status is required',
          },
          notEmpty: {
            msg: 'status is required',
          },
        },
        values: ['Pending', 'In Progress', 'Completed', 'Canceled'],
        defaultValue: 'Pending',
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'amount is required',
          },
          notEmpty: {
            msg: 'amount is required',
          },
          min: {
            args: [1],
            msg: 'amount must be greater than 0',
          },
        },
      },
      operator_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: { tableName: 'users' },
          key: 'id',
        },
        validate: {
          notNull: {
            msg: 'operator_id is required',
          },
          notEmpty: {
            msg: 'operator_id is required',
          },
        },
      },
      deadline: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'deadline is required',
          },
          notEmpty: {
            msg: 'deadline is required',
          },
          min: {
            args: [new Date()],
            msg: 'deadline must be greater than current date',
          },
        },
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: { tableName: 'users' },
          key: 'id',
        },
        validate: {
          notNull: {
            msg: 'created_by is required',
          },
          notEmpty: {
            msg: 'created_by is required',
          },
        },
      },
      in_progress_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      in_finish_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
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
    await queryInterface.dropTable('work_orders');
  },
};
