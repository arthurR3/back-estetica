import { User, UserSchema } from './users.model.js';
import { Product, ProductSchema } from './products.model.js'
import { CodeSchema, ResetCode } from './codes.model.js';

function setupModels(sequelize) {
    User.init(UserSchema, User.config(sequelize));
    Product.init(ProductSchema, Product.config(sequelize));
    ResetCode.init(CodeSchema, ResetCode.config(sequelize))
}

export default setupModels;