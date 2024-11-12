import { Subscription } from "../db/models/notification.model.js";
import webPush from 'web-push'

webPush.setVapidDetails(
    "mailto:esteticaprincipal7@gmail.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
)
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
    async findById(id) {
        const res = await Subscription.findByPk(id)
        return res;
    }
    async findByUser(idUser) {
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

    async sendNotification(subscription, payload) {
        let pushSubscription; 
        let keys;  
        try {
            if (typeof subscription.keys === 'string') {
                // Si es una cadena, hacemos un JSON.parse
                keys = JSON.parse(subscription.keys);
            } else {
                // Si ya es un objeto, lo asignamos directamente
                keys = subscription.keys;
            }
    
            pushSubscription = {  // Ahora asignamos a la variable declarada previamente
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: keys.p256dh,  // Clave pública de la suscripción
                    auth: keys.auth       // Clave de autenticación
                }
            };
    
            await webPush.sendNotification(pushSubscription, JSON.stringify(payload));
            console.log("Notificación enviada exitosamente a:", subscription.endpoint);
    
        } catch (error) {
            if (pushSubscription) {  // Verificamos que pushSubscription esté definido
                if (error.statusCode === 410) {
                    console.log(`La suscripción ha caducado o el cliente se dio de baja: ${pushSubscription.endpoint}`);
                    await Subscription.destroy({ where: { endpoint: pushSubscription.endpoint } });
                } else if (error.statusCode === 404 || error.message.includes('network error')) {
                    console.warn(`Error de red al enviar notificación a ${pushSubscription.endpoint}. No se eliminó la suscripción.`);
                } else {
                    console.error(`Error al enviar notificación a ${pushSubscription.endpoint}:`, error);
                }
            } else {
                console.error("Error al preparar la suscripción para la notificación:", error);
            }
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