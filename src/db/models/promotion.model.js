import { Model, DataTypes, Sequelize } from 'sequelize';

const NAME_TABLE = 'promocion';

class Promotion extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: NAME_TABLE,
            modelName: 'Promocion',
            timestamps: false
        }
    }
}

const PromotionSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'id_promocion'
    },
    title: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'Titulo'
    },
    description: {
        allowNull: true,
        type: DataTypes.TEXT,
        field: 'Descripcion'
    },
    discount: {
        allowNull: false,
        type: DataTypes.FLOAT,
        field: 'Descuento'
    },
    startDate: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'Fecha_inicio'
    },
    endDate: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'Fecha_fin'
    },
    id_product: { // Foreign key
        allowNull: true,
        type: DataTypes.INTEGER,
        field: 'id_producto'
    },
    id_service: { // Foreign key
        allowNull: true,
        type: DataTypes.INTEGER,
        field: 'id_servicio'
    },
    status:{
        allowNull: false,
        type: DataTypes.BOOLEAN,
        field: 'Estado',
        defaultValue: true
    }
}

export { Promotion, PromotionSchema };
