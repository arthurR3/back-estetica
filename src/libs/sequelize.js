
import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';
import setupModels from './../db/models/index.js';
const sequelize = new Sequelize(process.env.MYSQL_URL,
    {
        host: process.env.MYSQLHOST,
        dialect: 'mysql',
        define: {
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

