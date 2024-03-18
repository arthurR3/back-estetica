import { User, UserSchema } from './users.model.js';
import { Product, ProductSchema } from './products.model.js'
import { Date, DateSchema } from './dates.model.js';
import { Service, ServiceSchema } from './services.model.js';
import { CodeSchema, ResetCode } from './codes.model.js';
import { Role, RoleSchema } from './roles.model.js';
import { Frequency, FrequencySchema } from './frequencies.model.js';
import { Brand, BrandSchema } from './brands.model.js';
import { Category, CategorySchema } from './categories.model.js';
import { Supplier, SupplierSchema } from './suppliers.model.js';

function setupModels(sequelize) {
    User.init(UserSchema, User.config(sequelize));
    Product.init(ProductSchema, Product.config(sequelize));
    Date.init(DateSchema, Date.config(sequelize));
    Service.init(ServiceSchema, Service.config(sequelize));
    Role.init(RoleSchema, Role.config(sequelize));
    Frequency.init(FrequencySchema, Frequency.config(sequelize));
    Brand.init(BrandSchema, Brand.config(sequelize));
    Category.init(CategorySchema, Category.config(sequelize));
    Supplier.init(SupplierSchema, Supplier.config(sequelize));
    ResetCode.init(CodeSchema, ResetCode.config(sequelize));

    // Establecer relaciones
    User.hasMany(Date, { foreignKey: 'id_user' }); // Un usuario puede tener muchas citas.
    Date.belongsTo(User, { foreignKey: 'id_user' }); // Una cita pertenece a un usuario.

    Service.hasMany(Date, { foreignKey: 'id_service' }); // Un servicio puede tener muchas citas.
    Date.belongsTo(Service, { foreignKey: 'id_service' }); // Una cita pertenece a un servicio.

    User.belongsTo(Role, { foreignKey: 'id_role' }); // Un usuario pertenece a un rol.
    Role.hasMany(User, { foreignKey: 'id_role' }); // Un rol puede tener muchos usuarios.
  
    User.belongsTo(Frequency, { foreignKey: 'id_frequency' }); // Un usuario pertenece a una frecuencia.
    Frequency.hasMany(User, { foreignKey: 'id_frequency' }); // Una frecuencia puede tener muchos usuarios.

    Product.belongsTo(Brand, { foreignKey: 'id_brand' }); // Un producto pertenece a una marca.
    Brand.hasMany(Product, { foreignKey: 'id_brand' }); // Una marca puede tener muchos productos.

    Product.belongsTo(Category, { foreignKey: 'id_category' }); // Un producto pertenece a una categoria.
    Category.hasMany(Product, { foreignKey: 'id_category' }); // Una categoria puede tener muchos productos.

    Product.belongsTo(Supplier, { foreignKey: 'id_supplier' }); // Un producto pertenece a un proveedor.
    Supplier.hasMany(Product, { foreignKey: 'id_supplier' }); // Un proveedor puede tener muchos productos.
}

export default setupModels;