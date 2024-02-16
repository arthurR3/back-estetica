import { Model, DataTypes, Sequelize } from 'sequelize';

const CODE_TABLE = 'resetCode';

class ResetCode extends Model { 
    static config(sequelize) {
        return {
            sequelize,
            tableName : CODE_TABLE,
            modelName : 'Codigos',
            timestamps : false
        }
    }
}
const CodeSchema = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'IDCode'
        },
        userEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'email'
        },
        resetCode: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'Codigo'
        },
        expirationTime: {
            type: DataTypes.DATE,
            allowNull: false,
            field : 'expirationTime'
        },
}

export {ResetCode, CodeSchema}