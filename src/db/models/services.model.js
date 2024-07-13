import { Model, DataTypes, Sequelize } from 'sequelize';

const SERVICE_TABLE = 'servicio';

class Service extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: SERVICE_TABLE,
            modelName: 'Servicio',
            timestamps: false
        }
    }
} 

const ServiceSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field:'id_servicio'
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Nombre'
    },
    id_category :{
        allowNull: false,
        type: DataTypes.INTEGER,
        field:'id_categoria'
    },
    description: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Descripcion'
    },
    price: {
        allowNull: false,
        type: DataTypes.FLOAT,
        field:'Precio'
    },
    duration: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Duracion'
    },
    image:{ 
        allowNull:true,
        type: DataTypes.STRING,
        field: 'Imagen'
    },
    status:{
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'Estatus'
    }
}
  
export { Service, ServiceSchema };