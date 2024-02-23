
import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';
import setupModels from './../db/models/index.js';

const sequelize = new Sequelize(url,
    config.dbName, // name database
    config.dbUser, // user database
    config.dbPassword, // password database
    process.env.MYSQL_URL,
    {
        host: config.dbHost,
        dialect: 'mysql',
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

