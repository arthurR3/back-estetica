import { Model, DataTypes, Sequelize } from 'sequelize';

const ADDRESS_TABLE = 'direccion';

class Address extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: ADDRESS_TABLE,
            modelName: 'Direcciones',
            timestamps: false
        }
    }
} 

const AddressSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field:'id_direccion'
    },
    municipality: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Municipio'
    },
    cologne: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Colonia'
    },
    street: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Calle'
    },
    cp: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'CP'
    }
}
  
export { Address, AddressSchema };