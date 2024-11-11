import { Date } from "../db/models/dates.model.js";
import { User } from "../db/models/users.model.js";
import { Payment } from "../db/models/payments.model.js";
import { Service } from "../db/models/services.model.js";
import { DateDetail } from "../db/models/datesDetail.model.js";
import Sequelize from "sequelize";
import { where } from "sequelize";
import { SaleDetail } from "../db/models/salesDetail.model.js";
class DatesService {

    constructor() { }

    async find() {
        try {
            const res = await Date.findAll({
                include: [
                    {
                        model: User, // Modelo de usuario relacionado
                        attributes: ['id', 'name', 'last_name1', 'last_name2', 'phone', 'email'], // Atributos que se quiere obtener del usuario
                    },
                    {
                        model: DateDetail, // Modelo de detalle de cita relacionado
                        include: [
                            {
                                model: Service, // Modelo de servicio relacionado dentro de detalle de cita
                                attributes: ['name'] // Atributos que se quiere obtener del servicio
                            }
                        ],
                        attributes: ['id_service', 'price', 'duration'] // Atributos del detalle de cita
                    },
                    {
                        model: Payment, // Modelo de método de pago relacionado
                        attributes: ['type'], // Atributos que se quiere obtener del método de pago
                    },
                ],
            });

            return res || []; // Devuelve el resultado o un array vacío si no hay resultados
        } catch (error) {
            console.error('Error al obtener las citas:', error);
            throw error;
        }
    }
    async findByUserId(userId) {
        const res = await Date.findAll({
            where: {
                id_user: userId
            },
            include: [
                {
                    model: User, // Modelo de usuario relacionado
                    attributes: ['id', 'name', 'last_name1', 'last_name2', 'phone', 'email'], // Atributos que se quiere obtener del usuario
                },
                {
                    model: DateDetail, // Modelo de detalle de cita relacionado
                    include: [
                        {
                            model: Service, // Modelo de servicio relacionado dentro de detalle de cita
                            attributes: ['name'] // Atributos que se quiere obtener del servicio
                        }
                    ],
                    attributes: ['id_service', 'price', 'duration'] // Atributos del detalle de cita
                },
                {
                    model: Payment, // Modelo de método de pago relacionado
                    attributes: ['type'], // Atributos que se quiere obtener del método de pago
                },
            ]
        });
        return res;
    }

    async findById(id) {
        const res = await Date.findAll({
            where: { id: id }
        })
        return res
    }

    async findOne(id) {
        const res = await Date.findByPk(id);
        return res;
    }
    async findOneUser(userId) {
        const res = await Date.findAll({
            where: { id_user: userId },
            include: [
                {
                    model: User, // Modelo de usuario relacionado
                    attributes: ['id', 'name', 'last_name1', 'last_name2', 'phone', 'email'], // Atributos que se quiere obtener del usuario
                },
                {
                    model: DateDetail, // Modelo de detalle de cita relacionado
                    include: [
                        {
                            model: Service, // Modelo de servicio relacionado dentro de detalle de cita
                            attributes: ['name'] // Atributos que se quiere obtener del servicio
                        }
                    ],
                    attributes: ['id_service', 'price', 'duration'] // Atributos del detalle de cita
                },
                {
                    model: Payment, // Modelo de método de pago relacionado
                    attributes: ['type'], // Atributos que se quiere obtener del método de pago
                },
            ]
        });
        if (!res) return [];

        return res;
    }

    async findGetNotifications(dateString) {
        try {
           
            const citas = await Date.findAll({
                where: {
                    date: {
                        [Sequelize.Op.gte]: dateString
                    },
                    date_status: { [Sequelize.Op.notIn]: ['Cancelada', 'Atendida'] }
                },
                attributes: ['id_user'], // No necesitamos los atributos de Cita, solo del usuario
                include: [
                    {
                        model: User, // Modelo de usuario relacionado
                        attributes: ['name', 'last_name1', 'last_name2', 'phone', 'email'], // Atributos que se quiere obtener del usuario
                    },
                ],
                group: ['id_user']  // Aquí usamos el alias correcto
            });

            return citas;
        } catch (error) {
            console.error('Error al obtener las citas:', error);
        }
    }

    async getTotalAttendedSales() {
        try {
            const totalIncome = await Date.sum('paid', {
                where: {
                    date_status: 'Atendida'
                }
            });

            return totalIncome || 0; // Devuelve 0 si no hay ingresos
        } catch (error) {
            console.error('Error al obtener el total de ventas atendidas:', error);
            throw error;
        }
    }
    async findOneDate(id) {
        const res = await Date.findAll({
            where: {
                id_user: id,
                date_status: 'pendiente'
            }
        });
        return res;
    }
    async findDate() {
        const res = this.find({
            attributes: ['Fecha'],
            where: {
                date_status: 'P_Confirmar'
            }
        })
        return res;
    }
    async findBookedSlots(date) {
        const res = await Date.findAll({
            where: {
                date: {
                    [Sequelize.Op.eq]: date
                },
                date_status: ['pendiente', 'Confirmada', 'P_Confirmar']
            },
            attributes: ['Horario']
        });
        return res
    }
    async countStatus() {
        const confirmadas = await Date.count({
            where: {
                date_status: 'Confirmada'
            }
        })
        const pendientes = await Date.count({
            where: {
                date_status: 'P_Confirmar'
            }
        })
        const canceladas = await Date.count({
            where: {
                date_status: 'Cancelada'
            }
        })
        const atendidas = await Date.count({
            where: {
                date_status: 'Atendida'
            }
        })
        return { confirmadas, pendientes, canceladas, atendidas };
    }

    async create(data) {
        const res = await Date.create(data);
        return res;
    }

    async update(id, data) {
        const model = await Date.findByPk(id);
        const res = await model.update(data);
        return res;
    }
    async updateDate(id, data) {
        const model = await this.findOne(id);
        const res = await model.update(data);
        return res;
    }

    async delete(id) {
        const model = await this.findOne(id);
        await model.destroy();
        return { deleted: true };
    }

}

export default DatesService;