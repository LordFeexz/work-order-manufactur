'use strict';
require('dotenv/config');
const { USER_NAME, USER_PASSWORD } = process.env;
const { hashSync } = require('bcryptjs');
const { v4 } = require('uuid');

/**
 * @description
 * cara menambahkan user
 * USER_NAME=xxxx USER_PASSWORD=xxxx npx sequelize-cli db:seed --seed 20250301042306-create_product_manager.js
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    if (!USER_NAME || !USER_PASSWORD)
      throw new Error('USER_NAME or USER_PASSWORD is required');

    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: v4(),
          role: 'product manager',
          username: USER_NAME,
          password: hashSync(USER_PASSWORD, 10),
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    if (!USER_NAME) throw new Error('USER_NAME is required');

    await queryInterface.bulkDelete(
      'users',
      { username: USER_NAME, role: 'product manager' },
      {},
    );
  },
};
