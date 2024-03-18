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
        field: 'id_cita'
    },
    id_user: { //llave foránea
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_usuario' // Nombre del campo en la base de datos
    },
    id_service: { //llave foránea
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_servicio' // Nombre del campo en la base de datos
    },
    date: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'Fecha'
    },
    time: {
        allowNull: false,
        type: DataTypes.TIME,
        field: 'Hora'
    },
    total: {
        allowNull: false,
        type: DataTypes.FLOAT,
        field: 'Total'
    }
}

export { Date, DateSchema };