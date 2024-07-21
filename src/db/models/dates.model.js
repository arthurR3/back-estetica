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
        field: 'id_usuario' 
    },
    id_payment: { //llave foránea
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_metodo_pago'
    },
    date: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'Fecha'
    },
    time: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Horario'
    },
    paid: {
        allowNull: false,
        type: DataTypes.FLOAT,
        field: 'Pagado'
    },
    remaining: {
        allowNull: false,
        type: DataTypes.FLOAT,
        field: 'Restante'
    },
    payment_status:{ 
        allowNull:false,
        type: DataTypes.STRING,
        field: 'Estado_pago'
    },
    date_status:{ 
        allowNull:false,
        type: DataTypes.STRING,
        field: 'Estado_cita'
    },
}

export { Date, DateSchema };