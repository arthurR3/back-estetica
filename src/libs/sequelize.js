
import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';
import setupModels from './../db/models/index.js';
const sequelize = new Sequelize('mysql://root:da-A1GEAbBfcH5E-12--DaFa63h2a5eB@monorail.proxy.rlwy.net:29800/railway',
    {
        host: process.env.MYSQLHOST,
        dialect: 'mysql',
        define :{
            timestamps: false
        }
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

