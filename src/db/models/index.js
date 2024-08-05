import { User, UserSchema } from './users.model.js';
import { UserNR, UserNoRegistredSchema } from './usersNoRegistred.model.js';
import { Product, ProductSchema } from './products.model.js'
import { Date, DateSchema } from './dates.model.js';
import { Service, ServiceSchema } from './services.model.js';
import { CodeSchema, ResetCode } from './codes.model.js';
import { Role, RoleSchema } from './roles.model.js';
import { Frequency, FrequencySchema } from './frequencies.model.js';
import { Brand, BrandSchema } from './brands.model.js';
import { Category, CategorySchema } from './categories.model.js';
import { Supplier, SupplierSchema } from './suppliers.model.js';
import { Payment, PaymentSchema } from './payments.model.js';
import { Address, AddressSchema } from './addresses.model.js';
import { Sale, SaleSchema } from './sales.model.js';
import { SaleDetail, SaleDetailSchema } from './salesDetail.model.js';
import { Cart, CartSchema } from './carts.model.js';
import { CartDetail, CartDetailSchema } from './cartsDetail.model.js';
import { Log, LogSchema } from './logs.model.js';
import { DateDetail, DateDetailSchema } from './datesDetail.model.js';
import { Promotion, PromotionSchema } from './promotion.model.js';
import { SalesView, SalesViewSchema } from './sales_view.model.js';

function setupModels(sequelize) {
    User.init(UserSchema, User.config(sequelize));
    UserNR.init(UserNoRegistredSchema, UserNR.config(sequelize));
    Product.init(ProductSchema, Product.config(sequelize));
    Date.init(DateSchema, Date.config(sequelize));
    DateDetail.init(DateDetailSchema, DateDetail.config(sequelize));
    Service.init(ServiceSchema, Service.config(sequelize));
    Role.init(RoleSchema, Role.config(sequelize));
    Frequency.init(FrequencySchema, Frequency.config(sequelize));
    Brand.init(BrandSchema, Brand.config(sequelize));
    Category.init(CategorySchema, Category.config(sequelize));
    Supplier.init(SupplierSchema, Supplier.config(sequelize));
    Payment.init(PaymentSchema, Payment.config(sequelize));
    Address.init(AddressSchema, Address.config(sequelize));
    Sale.init(SaleSchema, Sale.config(sequelize));
    SaleDetail.init(SaleDetailSchema, SaleDetail.config(sequelize));
    Cart.init(CartSchema, Cart.config(sequelize));
    CartDetail.init(CartDetailSchema, CartDetail.config(sequelize));
    ResetCode.init(CodeSchema, ResetCode.config(sequelize));
    Log.init(LogSchema, Log.config(sequelize));
    Promotion.init(PromotionSchema, Promotion.config(sequelize));
    SalesView.init(SalesViewSchema, SalesView.config(sequelize));

    // Establecer relaciones
    Date.belongsTo(User, { foreignKey: 'id_user' }); // Una cita pertenece a un usuario.
    User.hasMany(Date, { foreignKey: 'id_user' }); // Un usuario puede tener muchas citas.

    Date.belongsTo(Payment, { foreignKey: 'id_payment' }); // Una cita pertenece a un metodo_pago.
    Payment.hasMany(Date, { foreignKey: 'id_payment' }); // Un metodo_pago puede tener muchas citas.

    DateDetail.belongsTo(Date, {foreignKey: 'id_date'}); //Un detalle cita tiene una cita
    Date.hasMany(DateDetail, {foreignKey: 'id_date'}); //Una cita puede tener muchos detalles
    
    DateDetail.belongsTo(Service, {foreignKey: 'id_service'}); //Una cita puede service del service
    Service.hasMany(DateDetail, {foreignKey: 'id_service'}); //Un service puede tener muchos detalles
    User.belongsTo(Role, { foreignKey: 'id_role' }); // Un usuario pertenece a un rol.
    Role.hasMany(User, { foreignKey: 'id_role' }); // Un rol puede tener muchos usuarios.

    User.belongsTo(Frequency, { foreignKey: 'id_frequency' }); // Un usuario pertenece a una frecuencia.
    Frequency.hasMany(User, { foreignKey: 'id_frequency' }); // Una frecuencia puede tener muchos usuarios.

    Address.belongsTo(User, { foreignKey: 'id_user' }); // Un usuario pertenece a una direccion.
    User.hasMany(Address, { foreignKey: 'id_user' }); // Una direccion puede tener muchos usuarios.

    Product.belongsTo(Brand, { foreignKey: 'id_brand' }); // Un producto pertenece a una marca.
    Brand.hasMany(Product, { foreignKey: 'id_brand' }); // Una marca puede tener muchos productos.

    Product.belongsTo(Category, { foreignKey: 'id_category' }); // Un producto pertenece a una categoria.
    Category.hasMany(Product, { foreignKey: 'id_category' }); // Una categoria puede tener muchos productos.
    
    Service.belongsTo(Category, {foreignKey: 'id_category'});
    Category.hasMany(Service, { foreignKey: 'id_category' }); 

    Product.belongsTo(Supplier, { foreignKey: 'id_supplier' }); // Un producto pertenece a un proveedor.
    Supplier.hasMany(Product, { foreignKey: 'id_supplier' }); // Un proveedor puede tener muchos productos.

    Sale.belongsTo(User, { foreignKey: 'id_user' }); // Una venta pertenece a un usuario.
    User.hasMany(Sale, { foreignKey: 'id_user' }); // Un usuario puede tener muchas ventas.

    Sale.belongsTo(Payment, { foreignKey: 'id_payment' }); // Una venta pertenece a un metodo_pago.
    Payment.hasMany(Sale, { foreignKey: 'id_payment' }); // Un metodo_pago puede tener muchas ventas.

    Sale.belongsTo(Address, { foreignKey: 'id_address' }); // Una venta pertenece a una direccion.
    Address.hasMany(Sale, { foreignKey: 'id_address' }); // Una direccion puede tener muchas ventas.

    // Define la relación entre Venta y DetalleVenta
    SaleDetail.belongsTo(Sale, { foreignKey: 'id_sale', });
    Sale.hasMany(SaleDetail, { foreignKey: 'id_sale', });

    // Define la relación entre Producto y DetalleVenta
    SaleDetail.belongsTo(Product, { foreignKey: 'id_product', });
    Product.hasMany(SaleDetail, { foreignKey: 'id_product', });

    Cart.belongsTo(User, { foreignKey: 'id_user' }); // Un carrito pertenece a un usuario.
    User.hasOne(Cart, { foreignKey: 'id_user' }); // Un carrito puede tener un usuario.

    CartDetail.belongsTo(Cart, { foreignKey: 'id_cart', });
    Cart.hasMany(CartDetail, { foreignKey: 'id_cart', });

    CartDetail.belongsTo(Product, { foreignKey: 'id_product', });
    Product.hasMany(CartDetail, { foreignKey: 'id_product', });

    Promotion.belongsTo(Product, { foreignKey: 'id_product' }); // Una promoción puede pertenecer a un producto.
    Product.hasMany(Promotion, { foreignKey: 'id_product' }); // Un producto puede tener muchas promociones.

    Promotion.belongsTo(Service, { foreignKey: 'id_service' }); // Una promoción puede pertenecer a un servicio.
    Service.hasMany(Promotion, { foreignKey: 'id_service' }); // Un servicio puede tener muchas promociones.
}

export default setupModels;