import { Model, DataTypes, Sequelize } from 'sequelize';

const USER_TABLE = 'usuario';

class User extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: USER_TABLE,
            modelName: 'Usuarios',
            timestamps: false
        }
    }
} 

const UserSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field:'id_usuario'
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Nombre'
    },
    last_name1: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'ApellidoP'
    },
    last_name2: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'ApellidoM'
    },
    email:{ 
        allowNull:false,
        type: DataTypes.STRING,
        field: 'Correo'
    },
    password:{ 
        allowNull:false,
        type: DataTypes.STRING,
        field: 'Contraseña'
    },
    address:{ 
        allowNull:true,
        type: DataTypes.STRING,
        field: 'Direccion'
    },
    phone:{
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Telefono'
    },
    cp:{ 
        allowNull:false,
        type: DataTypes.STRING,
        field: 'CP'
    },
    rol:{ 
        allowNull:false,
        type: DataTypes.INTEGER,
        field: 'Rol'
    },
    image:{ 
        allowNull:true,
        type: DataTypes.STRING,
        field: 'Imagen'
    },
    birthday:{ 
        allowNull:false,
        type: DataTypes.DATE,
        field: 'Fecha_nacimiento'
    },
}
  
export { User, UserSchema };