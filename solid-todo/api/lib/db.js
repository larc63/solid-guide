const { Sequelize } = require('sequelize');
const initModels = require('../models/init-models');

const useMemoryDatabase = true;

class Database {
    static sequelize;
    static models;

    static async seed() {
        try {
            console.log('create list');
            const newList = await Database.models.todolists.create({
                title: 'Shopping List'
            });

            console.log(`Created list ${newList.list_id} successfully!`);

            console.log(`***** create list item on ${Object.keys(Database.models)}`);
            let newItem = await Database.models.listitems.create({
                text: 'Apples',
                rank: 1,
                list_id: newList.list_id          // Required (must reference existing list in todolists table)
            });
            console.log(`Created list ${newItem.item_id} item successfully!`);

            newItem = await Database.models.listitems.create({
                text: 'bananas',
                rank: 2,
                list_id: newList.list_id          // Required (must reference existing list in todolists table)
            });
            console.log(`Created list ${newItem.item_id} item successfully!`);

            // const items = await Database.models.listitems.findAll({
            //     where: { list_id: 1 }
            // });
            // console.log(`found ${items.length} items`);
            // console.log(JSON.stringify(items));
        } catch (error) {
            console.error('Unable to create list item:', error);
            console.error(error.message);
        }
    }

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
        console.log('Initializing models');
        Database.models = initModels(Database.sequelize);
        try {
            await Database.sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }

        try {
            if (useMemoryDatabase) {
                await Database.sequelize.sync({ force: true });
            } else {
                await Database.sequelize.sync();
            }
        } catch (error) {
            console.error('Unable to sync to the database:', error);
        }
        if (useMemoryDatabase) {
            Database.seed();
        }
    }
}

module.exports = Database;