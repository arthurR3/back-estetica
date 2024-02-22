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

sequelize.authenticate()
  .then(() => {
    console.log('DB connection successful.');
    return sequelize.sync(); // Sincroniza los modelos después de que se haya establecido la conexión
  })
  .then(() => {
    setupModels(sequelize); // Configura los modelos después de sincronizarlos
  })
  .catch((err) => {
    // catch error here
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;
