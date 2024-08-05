import { Model, DataTypes, Sequelize } from 'sequelize';
import CryptoJS from 'crypto-js';
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

    /* static init(sequelize) {
        super.init(UserSchema, {
            sequelize,
            hooks: {
                beforeCreate: async (instance, options) => {
                    // Generar el ID autoincremental antes de encriptarlo
                    await super.init(sequelize); 
                    await User.encryptId(instance);
                }
            }
        });
    }
    // Metodo para encriptar el ID del Usuario antes de crear al nuevo usuario
    static async encryptId(instance) {
        if (instance.id_usuario) {
            // Convertir el ID a una cadena de texto antes de encriptarlo
            instance.id_usuario = CryptoJS.AES.encrypt(instance.id_usuario.toString(), process.env.SECRET_KEY).toString();
        }
    } */
}

const UserSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'id_usuario'
    },
    id_role: { //llave foránea
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_rol' // Nombre del campo en la bd
    },
    id_frequency: { //llave foránea
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'id_frecuencia' // Nombre del campo en la bd
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Nombre'
    },
    last_name1: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'ApellidoP'
    },
    last_name2: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'ApellidoM'
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Correo'
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Contraseña'
    },
    phone:{
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Telefono'
    },
    image: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'Imagen'
    },
    birthday: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'Fecha_nacimiento'
    },
    question: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'Pregunta'
    },
    answers: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'Respuesta'
    },
    numIntentos: {
        allowNull: true,
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'NumIntentos'
    },
    code: {
        allowNull: false,
        type: DataTypes.STRING,
        field:'Codigo'
    },
    status:{
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'Estatus'
    }
}

export { User, UserSchema };