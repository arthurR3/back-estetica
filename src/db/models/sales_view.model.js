import { Model, DataTypes } from 'sequelize';

const SALES_VIEW = 'vista_productos_ventas';

class SalesView extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: SALES_VIEW,
            modelName: 'SalesView',
            timestamps: false,
            createdAt: false,
            updatedAt: false
        };
    }
}

const SalesViewSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
    },
    id_sale: {
        type: DataTypes.INTEGER,
        field: 'id_sale'
    },
    id_user: {
        type: DataTypes.INTEGER,
        field: 'id_user'
    },
    id_product: {
        type: DataTypes.INTEGER,
        field: 'id_product'
    },
    amount: {
        type: DataTypes.INTEGER,
        field: 'amount'
    },
    product_name: {
        type: DataTypes.STRING,
        field: 'name'
    },
    price: {
        type: DataTypes.FLOAT,
        field: 'price'
    },
    category_name: {
        type: DataTypes.STRING,
        field: 'Categoria'
    },
    brand_name: {
        type: DataTypes.STRING,
        field: 'Marca'
    }
};

export { SalesView, SalesViewSchema };