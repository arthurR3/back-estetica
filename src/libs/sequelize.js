
import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';
import setupModels from './../db/models/index.js';
import mysql2 from 'mysql2'

const sequelize = new Sequelize(
    process.env.MYSQLDATABASE,
    process.env.MYSQLUSER,
    process.env.MYSQLPASSWORD,
    {
        host: process.env.MYSQLHOST,
        dialect: 'mysql',
        dialectModule: mysql2
    }
);

(async () => {
    try {
        await sequelize.sync();
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
})();

setupModels(sequelize);

export default sequelize;

