import { Model, DataTypes, Sequelize } from 'sequelize';

const SALE_DETAIL_TABLE = 'detalle_venta';

class SaleDetail extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: SALE_DETAIL_TABLE,
            modelName: 'Detalle_ventas',
            timestamps: false
        }
    }
}

const SaleDetailSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'id_detalle_venta'
    },
    id_sale: { //llave foránea
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_venta' // Nombre del campo en la base de datos
    },
    id_product: { //llave foránea
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_producto' // Nombre del campo en la base de datos
    },
    amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'Cantidad'
    },
    unit_price: {
        allowNull: false,
        type: DataTypes.FLOAT,
        field: 'Precio_unitario'
    },
    subtotal: {
        allowNull: false,
        type: DataTypes.FLOAT,
        field: 'Subtotal'
    }
}

export { SaleDetail, SaleDetailSchema };