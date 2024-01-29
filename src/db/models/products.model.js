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
    id_categoria: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_categoria',
        references: {
            model: 'Categoria', // Tabla relacionada
            key: 'id_categoria' // Nombre clave foránea
        }
    },
    id_marca: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_marca',
        references: {
            model: 'Marca', // Tabla relacionada
            key: 'id_marca' // Nombre clave foránea
        }
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
    image:{ 
        allowNull:true,
        type: DataTypes.STRING,
        field: 'Imagen'
    }
}
  
export { Product, ProductSchema };