import { Model, DataTypes, Sequelize } from 'sequelize';

const ROLE_TABLE = 'rol';

class Role extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: ROLE_TABLE,
            modelName: 'Roles',
            timestamps: false
        }
    }
} 

const RoleSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field:'id_rol'
    },
    type: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Tipo'
    }
}
  
export { Role, RoleSchema };