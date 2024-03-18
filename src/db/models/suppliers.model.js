import { Model, DataTypes, Sequelize } from 'sequelize';

const SUPPLIER_TABLE = 'proveedor';

class Supplier extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: SUPPLIER_TABLE,
            modelName: 'Proveedores',
            timestamps: false
        }
    }
} 

const SupplierSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field:'id_proveedor'
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Nombre'
    },
    last_name1: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'ApellidoP'
    },
    last_name2: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'ApellidoM'
    },
    address:{ 
        allowNull:true,
        type: DataTypes.STRING,
        field: 'Direccion'
    },
    phone:{
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Telefono'
    },
    email:{ 
        allowNull:false,
        type: DataTypes.STRING,
        field: 'Correo'
    }
}
  
export { Supplier, SupplierSchema };