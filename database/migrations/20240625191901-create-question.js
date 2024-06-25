/* eslint-disable prettier/prettier */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      question: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      skillId: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'skill_id',
      },
      difficultyLevel: {
        type: Sequelize.ENUM('easy', 'medium', 'hard'),
        allowNull: false,
        field: 'difficulty_level',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('questions');
  },
};

