import { Model, DataTypes, Sequelize } from 'sequelize';

const FREQUENCY_TABLE = 'frecuencia';

class Frequency extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: FREQUENCY_TABLE,
            modelName: 'Frecuencias',
            timestamps: false
        }
    }
} 

const FrequencySchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field:'id_frecuencia'
    },
    type: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Tipo'
    }
}
  
export { Frequency, FrequencySchema };