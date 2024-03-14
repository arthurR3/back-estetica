
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

import { config } from '../config/config.js';
import setupModels from './../db/models/index.js';

dotenv.config();
const sequelize = new Sequelize(process.env.MYSQL_URL,
    {
        host: process.env.MYSQLHOST,
        dialect: 'mysql',
        define: {
            timestamps: false
        }
    }
);
/* const sequelize = new Sequelize(
    config.dbName,
    config.dbUser,
    config.dbPassword,
    {
        host: config.dbHost,
        dialect: 'mysql',
    }, 
);*/
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

