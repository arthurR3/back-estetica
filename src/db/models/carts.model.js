import { Model, DataTypes, Sequelize } from 'sequelize';

const CART_TABLE = 'carrito';

class Cart extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: CART_TABLE,
            modelName: 'Carritos',
            timestamps: false
        }
    }
}

const CartSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'id_carrito'
    },
    id_user: { //llave foránea
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_usuario' // Nombre del campo en la base de datos
    },
    status:{ 
        allowNull:false,
        type: DataTypes.STRING,
        field: 'Estado'
    },
    date: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'Fecha_creacion'
    },
}

export { Cart, CartSchema };