import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';
import setupModels from './../db/models/index.js';
const sequelize = new Sequelize(process.env.MYSQL_URL,
    {
        dialect: 'mysql',
        define :{
            timestamps: false
        }
    }
);

sequelize.sync();
setupModels(sequelize);

export default sequelize;

