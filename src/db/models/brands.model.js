import { Model, DataTypes, Sequelize } from 'sequelize';

const BRAND_TABLE = 'marca';

class Brand extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: BRAND_TABLE,
            modelName: 'Marcas',
            timestamps: false
        }
    }
} 

const BrandSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field:'id_marca'
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Nombre'
    }
}
  
export { Brand, BrandSchema };