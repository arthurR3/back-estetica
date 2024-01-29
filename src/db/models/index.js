import { User, UserSchema } from './users.model.js';
import { Product, ProductSchema } from './products.model.js'

function setupModels(sequelize) {
    User.init(UserSchema, User.config(sequelize));
    Product.init(ProductSchema, Product.config(sequelize));
}

export default setupModels;