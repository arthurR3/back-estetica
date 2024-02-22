import { Sequelize } from 'sequelize';

import { config } from '../config/config.js';
import setupModels from './../db/models/index.js';

const sequelize = new Sequelize(
    config.dbName, // name database
    config.dbUser, // user database
    config.dbPassword, // password database
    {
        host: config.dbHost,
        dialect: 'mysql'
    }
);

sequelize.sync();
setupModels(sequelize);

export default sequelize;
//export default sequelize;
