import { User, UserSchema } from './users.model.js';
import { Product, ProductSchema } from './products.model.js'
import { Date, DateSchema } from './dates.model.js';
import { Service, ServiceSchema } from './services.model.js';
import { CodeSchema, ResetCode } from './codes.model.js';

function setupModels(sequelize) {
    User.init(UserSchema, User.config(sequelize));
    Product.init(ProductSchema, Product.config(sequelize));
    Date.init(DateSchema, Date.config(sequelize));
    Service.init(ServiceSchema, Service.config(sequelize));
    ResetCode.init(CodeSchema, ResetCode.config(sequelize));

    // Establecer relaciones
    User.hasMany(Date, { foreignKey: 'UserId' }); // Un usuario puede tener muchas citas.
    Date.belongsTo(User, { foreignKey: 'UserId' }); // Una cita pertenece a un usuario.

    Service.hasMany(Date, { foreignKey: 'ServiceId' }); // Un servicio puede tener muchas citas.
    Date.belongsTo(Service, { foreignKey: 'ServiceId' }); // Una cita pertenece a un servicio.
}

export default setupModels;