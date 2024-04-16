import { Model, DataTypes, Sequelize } from 'sequelize';

const USER_TABLE = 'usuariosNR';

class UserNR extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: USER_TABLE,
            modelName: 'UsuariosNR',
            timestamps: false
        }
    }
}

const UserNoRegistredSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'id_usuario_no_registrado'
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Nombre'
    },
    last_name1: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Apellido_Paterno'
    },
    last_name2: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Apellido_Materno'
    },
    phone: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Telefono'
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Correo'
    },
}

export { UserNR, UserNoRegistredSchema };
