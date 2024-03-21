import { Model, DataTypes, Sequelize } from 'sequelize';

const SALE_TABLE = 'venta';

class Sale extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: SALE_TABLE,
            modelName: 'Ventas',
            timestamps: false
        }
    }
}

const SaleSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'id_venta'
    },
    id_user: { //llave foránea
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_usuario' // Nombre del campo en la base de datos
    },
    id_payment: { //llave foránea
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_metodo_pago' // Nombre del campo en la base de datos
    },
    id_address: { //llave foránea
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_direccion' // Nombre del campo en la base de datos
    },
    shipping_status:{ 
        allowNull:false,
        type: DataTypes.STRING,
        field: 'Estado_envio'
    },
    total: {
        allowNull: false,
        type: DataTypes.FLOAT,
        field: 'Total'
    },
    date: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'Fecha'
    },
}

export { Sale, SaleSchema };