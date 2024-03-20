import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';
import setupModels from './../db/models/index.js';

const sequelize = new Sequelize(
    'db_estetica', // name database
    'root', // user database
    '', // password database,
    {
        host: 'localhost',
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

