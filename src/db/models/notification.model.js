import { all } from "axios";
import { Model, DataTypes } from "sequelize";

const NOTIFICATION_TABLE = 'subscription'

class Subscription extends Model { 
    static config(sequelize) {
        return { 
            sequelize,
            tableName: NOTIFICATION_TABLE,
            modelName: 'Suscripciones',
            timestamps: false
        }
    }
}

const SubscriptionSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field:'id_suscripcion'
    },
    endpoint:{
        allowNull: false,
        type: DataTypes.STRING,
        field:'endpoint'
    },
    expirationTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field:'experition_time'
      },
      keys: {
        type: DataTypes.JSON,
        allowNull: false,
        field:'keys'
      },
      id_user:{ //llave foranea
        type: DataTypes.INTEGER,
        allowNull: true,
        field:'id_usuario'
      }
}

export {Subscription, SubscriptionSchema };