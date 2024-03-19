import { Model, DataTypes, Sequelize } from 'sequelize';

const CATEGORY_TABLE = 'categoria';

class Category extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: CATEGORY_TABLE,
            modelName: 'Categorias',
            timestamps: false
        }
    }
} 

const CategorySchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field:'id_categoria'
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Nombre'
    }
}
  
export { Category, CategorySchema };