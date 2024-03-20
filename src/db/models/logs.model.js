import { Model, DataTypes, Sequelize } from 'sequelize';

const LOG_TABLE = 'log';

class Log extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: LOG_TABLE,
            modelName: 'Logs',
            timestamps: false
        }
    }
} 

const LogSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field:'id_log'
    },
    ip: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Nombre'
    },
    date:{ 
        allowNull:false,
        type: DataTypes.DATE,
        field: 'Fecha'
    },
    email:{ 
        allowNull:true,
        type: DataTypes.STRING,
        field: 'Correo'
    },
    action_description:{ 
        allowNull:true,
        type: DataTypes.STRING,
        field: 'Pregunta'
    }
}
  
export { User, UserSchema };