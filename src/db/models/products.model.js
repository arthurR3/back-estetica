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
    id_category: { //llave foránea
        allowNull: true,
        type: DataTypes.INTEGER,
        field: 'id_categoria' // Nombre del campo en la bd
    },
    id_brand: { //llave foránea
        allowNull: true,
        type: DataTypes.INTEGER,
        field: 'id_marca' // Nombre del campo en la bd
    },
    id_supplier: { //llave foránea
        allowNull: true,
        type: DataTypes.INTEGER,
        field: 'id_proveedor' // Nombre del campo en la bd
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
        allowNull:false,
        type: DataTypes.STRING,
        field: 'Imagen'
    },
    categoria:{
        allowNull:true,
        type: DataTypes.STRING,
        field: 'Categoria'
    },
    marca: {
        allowNull:true,
        type: DataTypes.STRING,
        field: 'Marca'
    },
}
  
export { Product, ProductSchema };
