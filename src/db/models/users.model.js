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

    
    // Metodo para encriptar el ID del Usuario antes de crear al nuevo usuario
    static async encryptId(instance) {
        if (instance.id_usuario) {
            instance.id_usuario = CryptoJS.AES.encrypt(instance.id_usuario.toString(), process.env.SECRET_KEY).toString();
        }
    }

    //Hook beforeCreate para encriptar el ID antes de que se cree al usuario
    static init(sequelize) {
        super.init(UserSchema, {
            sequelize,
            hooks: {
                beforeCreate: async (instance, options) => {
                    await User.encryptId(instance)
                }
            }
        });
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
        allowNull:true,
        type: DataTypes.INTEGER,
        field: 'Rol'
    },
    image:{ 
        allowNull:true,
        type: DataTypes.STRING,
        field: 'Imagen'
    },
    birthday:{ 
        allowNull:true,
        type: DataTypes.DATE,
        field: 'Fecha_nacimiento'
    },
    question:{ 
        allowNull:true,
        type: DataTypes.STRING,
        field: 'Pregunta'
    },
    answers:{ 
        allowNull:true,
        type: DataTypes.STRING,
        field: 'Respuesta'
    },
    numIntentos:{
        allowNull: true,
        type : DataTypes.INTEGER,
        defaultValue: 0,
        field: 'NumIntentos' 
    }
}
  
export { User, UserSchema };