import { Model, DataTypes, Sequelize } from 'sequelize';

const DATE_TABLE = 'detalle_cita';

class DateDetail extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: DATE_TABLE,
            modelName: 'Detalle_citas',
            timestamps: false
        }
    }
}

const DateDetailSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'id_detalle_cita'
    },
    id_date: { //llave foránea
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_cita' // Nombre del campo en la base de datos
    },
    id_service: { //llave foránea
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_servicio' // Nombre del campo en la base de datos
    },
    price: { //llave foránea
        allowNull: false,
        type: DataTypes.FLOAT,
        field: 'Precio' // Nombre del campo en la base de datos
    },
    duration: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Duracion'
    }
}

export { DateDetail, DateDetailSchema };