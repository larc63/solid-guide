const { Sequelize } = require('sequelize');
const initModels = require('../models/init-models');

const useMemoryDatabase = true;

class Database {
    static sequelize;
    static models;
    static async init() {
        try {
            if (useMemoryDatabase) {
                Database.sequelize = new Sequelize('sqlite::memory:')
            } else {
                Database.sequelize = new Sequelize('postgres://postgres:postgres@192.168.1.97:5432/notesdb')
            }
            console.log('Database connection created successfully.');
        } catch (error) {
            console.error('Unable to create connection to the database:', error);
        }
        try {
            await Database.sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
        console.log('Initializing models');
        Database.models = initModels(Database.sequelize);

        try {
            if (useMemoryDatabase) {
                await Database.sequelize.sync({ force: true });
            } else {
                await Database.sequelize.sync();
            }
        } catch (error) {
            console.error('Unable to sync to the database:', error);
        }
    }
}

module.exports = Database;