import { Model, DataTypes, Sequelize } from 'sequelize';

const CART_DETAIL_TABLE = 'detalle_carrito';

class CartDetail extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: CART_DETAIL_TABLE,
            modelName: 'Detalle_carritos',
            timestamps: false
        }
    }
}

const CartDetailSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'id_detalle_carrito'
    },
    id_cart: { //llave foránea
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_carrito' // Nombre del campo en la base de datos
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
}

export { CartDetail, CartDetailSchema };