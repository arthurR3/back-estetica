import { Model, DataTypes } from "sequelize";

const TIMEGNR_TABLE = 'horario_genral'

class HorarioG extends Model{
    static config(sequelize){
        return{
            sequelize,
            tableName: TIMEGNR_TABLE,
            modelName: 'HorarioG',
            timestamps: false
        }
    }
}

const HGRALSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_horario_general'
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

export {HorarioG, HGRALSchema}