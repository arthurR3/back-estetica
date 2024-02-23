import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';
import setupModels from './../db/models/index.js';
import mysql2 from 'mysql2'
const sequelize = new Sequelize(
    config.dbName, // name database
    config.dbUser, // user database
    config.dbPassword, // password database
    {
        host: config.dbHost,
        dialect: 'mysql',
        dialectModule: mysql2
    }
);

sequelize.sync();
setupModels(sequelize);

export default sequelize;

