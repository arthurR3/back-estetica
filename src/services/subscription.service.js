import { Subscription } from "../db/models/notification.model.js";
import { webPush } from "../config/web-push.js";
class SubscriptionService {
    constructor() { }

    async create(data) {
        const res = await Subscription.create(data)
        return res;
    }

    async findOne(endPoint) {
        const res = await Subscription.findOne({
            where: {
                endpoint: endPoint
            }
        })
        return res;
    }
    async findById(id){
        const res = await Subscription.findByPk(id)
        return res;
    }
    async findByUser(idUser){
        const res = await Subscription.findAll({
            where: {
                id_user: idUser
            }
        })
        return res;
    }

    async findAll() {
        const res = await Subscription.findAll()
        return res;
    }

    async sendNotification(title, message) {
        try {
            const subscriptions = await Subscription.findAll()
            const notificationPayload = JSON.stringify({ title, message })
            for (let subscription of subscriptions) {
                let keys;

                // Primero parseamos el campo `keys` para convertirlo en un objeto
                if (typeof subscription.keys === 'string') {
                    // Si es una cadena, haz un JSON.parse
                    keys = JSON.parse(subscription.keys);
                } else {
                    // Si ya es un objeto, lo asignamos directamente
                    keys = subscription.keys;
                }
                const pushSubscription = {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: keys.p256dh,  // Clave pública de la suscripción
                        auth: keys.auth       // Clave de autenticación
                    }
                };
                try {
                    //console.log("Enviando a:", pushSubscription.endpoint);
                    await webPush.sendNotification(pushSubscription, notificationPayload);
                    //console.log("Notificación enviada exitosamente a:", pushSubscription.endpoint);
                } catch (error) {
                    if (error.statusCode === 410) {
                        //console.log(`La suscripción ha caducado o el cliente se dio de baja: ${pushSubscription.endpoint}`);
                        // Elimina la suscripción inválida de la base de datos
                        await Subscription.destroy({ where: { endpoint: subscription.endpoint } });
                        //console.log(`Suscripción eliminada: ${pushSubscription.endpoint}`);
                    } else {
                        console.error(`Error al enviar notificación a ${pushSubscription.endpoint}:`, error);
                    }
                }
            }
            return { status: 200, message: 'Notificaciones enviadas a las subscripciones' }
        } catch (error) {
            //console.log(error)
            return { status: 500, message: 'Error al Enviar las notificaciones' }
        }
        
    }

    async sendNotificationToUser(userID, title, message) {
        try {
            // Buscar las suscripciones asociadas al usuario específico
            const subscriptions = await this.findByUser(userID);
    
            if (subscriptions.length === 0) {
                console.log(`No hay suscripciones para el usuario con ID: ${userID}`);
                return;
            }
    
            const notificationPayload = JSON.stringify({
                    title: title,
                    message: message
            });
    
            for (let subscription of subscriptions) {
                let keys;
    
                // Si `keys` es una cadena, la parseamos a un objeto
                if (typeof subscription.keys === 'string') {
                    keys = JSON.parse(subscription.keys);
                } else {
                    keys = subscription.keys; // Si ya es un objeto, usamos directamente
                }
    
                const pushSubscription = {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: keys.p256dh,  // Clave pública de la suscripción
                        auth: keys.auth       // Clave de autenticación
                    }
                };
    
                try {
                    console.log("Enviando a:", pushSubscription.endpoint);
                    await webPush.sendNotification(pushSubscription, notificationPayload);
                    console.log("Notificación enviada exitosamente a:", pushSubscription.endpoint);
                } catch (error) {
                    if (error.statusCode === 410) {
                        console.log(`La suscripción ha caducado o el cliente se dio de baja: ${pushSubscription.endpoint}`);
                        await Subscription.destroy({ where: { endpoint: subscription.endpoint } });
                        console.log(`Suscripción eliminada: ${pushSubscription.endpoint}`);
                    } else {
                        console.error(`Error al enviar notificación a ${pushSubscription.endpoint}:`, error);
                    }
                }
            }
    
            return { status: 200, message: 'Notificación enviada correctamente al usuario' };
    
        } catch (error) {
            console.log('Error al enviar la notificación:', error);
            return { status: 500, message: 'Error al enviar la notificación' };
        }
    }
    


    async update(id, data) {
        const model = await this.findById(id);
        const res = await model.update(data);
        return res;
    }

    async updateUserToNull(idUser) {
        // Encontrar todas las suscripciones del usuario
        const subscriptions = await this.findByUser(idUser);

        if (subscriptions.length > 0) {
            // Para cada suscripción, actualizamos `id_user` a null
            const updates = subscriptions.map(subscription =>
                subscription.update({ id_user: null })
            );

            // Ejecutar todas las actualizaciones en paralelo
            await Promise.all(updates);
            return { message: 'Las suscripciones se actualizaron correctamente' };
        } else {
            return { message: 'No se encontraron suscripciones para el usuario' };
        }
    }

    async delete(idUser) {
        const res = await Subscription.destroy({ where: { id_user: idUser } });
        return res;
    }
}
export default SubscriptionService;