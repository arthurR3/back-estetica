import { Model, DataTypes, Sequelize } from 'sequelize';

const DATE_TABLE = 'cita';

class Date extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: DATE_TABLE,
            modelName: 'Citas',
            timestamps: false
        }
    }
} 

const DateSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field:'id_cita'
    },
    id_servicio: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_servicio',
        references: {
            model: 'Servicio', // Tabla relacionada
            key: 'id_servicio' // Nombre clave foránea
        }
    },
    id_usuario: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_usuario',
        references: {
            model: 'Usuario', // Tabla relacionada
            key: 'id_usuario' // Nombre clave foránea
        }
    },
    id_forma_pago: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_forma_pago',
        references: {
            model: 'FormaPago', // Tabla relacionada
            key: 'id_forma_pago' // Nombre clave foránea
        }
    },
    date: {
        allowNull: false,
        type: DataTypes.DATE,
        field:'Fecha'
    },
    time: {
        allowNull: false,
        type: DataTypes.TIME,
        field:'Hora'
    },
    total: {
        allowNull: false,
        type: DataTypes.FLOAT,
        field:'Total'
    }
}
  
export { Date, DateSchema };