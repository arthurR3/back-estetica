import { Model, DataTypes } from "sequelize";

const TIMEEXP_TABLE = 'horarios_exception'

class HorarioEXP extends Model{
    static config(sequelize){
        return{
            sequelize,
            tableName: TIMEEXP_TABLE,
            modelName: 'HorarioEXP',
            timestamps: false
        }
    }
}

const HEXPSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_horario_Exception'
    },
    id_administrador: {
        type: DataTypes.INTEGER,
        field: 'id_administrador'
    },
    dia_semana: {
        type: DataTypes.INTEGER,
        field: 'Dias_trabajo'
    },
    hora_desde: {
        type: DataTypes.TIME,
        field: 'hora_desde'
    },
    hora_hasta: {
        type: DataTypes.TIME,
        field: 'hora_hasta'
    }
}

export {HorarioEXP, HEXPSchema}