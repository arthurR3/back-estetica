
import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';
import setupModels from './../db/models/index.js';
import mysql2 from 'mysql2'
const sequelize = new Sequelize(
    config.dbName, // name database
    config.dbUser, // user database
    config.dbPassword, // password database
    process.env.MYSQL_URL,
    {
        host: config.dbHost,
        dialect: 'mysql',
        dialectModule: mysql2,
        dialectOptions: { dialect: 'mysql' }
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

