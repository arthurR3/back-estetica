import { Model, DataTypes, Sequelize } from 'sequelize';

const PAYMENT_TABLE = 'metodo_pago';

class Payment extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: PAYMENT_TABLE,
            modelName: 'Metodo_pagos',
            timestamps: false
        }
    }
} 

const PaymentSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field:'id_metodo_pago'
    },
    type: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Tipo'
    },
    add_info: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Informacion_adicional'
    }
}
  
export { Payment, PaymentSchema };