import { Model, DataTypes, Sequelize } from 'sequelize';

const PRODUCT_TABLE = 'producto';

class Product extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: PRODUCT_TABLE,
            modelName: 'Productos',
            timestamps: false
        }
    }
} 

const ProductSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field:'id_producto'
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Nombre'
    },
    price: {
        allowNull: false,
        type: DataTypes.FLOAT,
        field:'Precio'
    },
    amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field:'Cantidad'
    },
    description:{ 
        allowNull:false,
        type: DataTypes.STRING,
        field: 'Descripcion'
    },
    categoria:{
        allowNull:false,
        type: DataTypes.STRING,
        field: 'Categoria'
    },
    marca: {
        allowNull:false,
        type: DataTypes.STRING,
        field: 'Marca'
    },
    image:{ 
        allowNull:false,
        type: DataTypes.STRING,
        field: 'Imagen'
    }
}
  
export { Product, ProductSchema };
