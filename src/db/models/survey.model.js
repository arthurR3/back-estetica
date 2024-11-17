import { Model, DataTypes } from "sequelize";

const SURVEY_TABLE = 'Encuesta'

class Survey extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: SURVEY_TABLE,
            modelName: 'Survey',
            timestamps: false,
        }
    }
}

const SurveySchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'id_encuesta',
    },
    id_user:{
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_usuario',
    },
    question1:{
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'pregunta_1',
    },
    question2:{
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'pregunta_2',
    },
}

export {Survey, SurveySchema};