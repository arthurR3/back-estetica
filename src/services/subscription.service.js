import { Subscription } from "../db/models/notification.model.js";
import { webPush } from "../config/web-push.js";
class SubscriptionService {
    constructor() { }

    async create(data) {
        const res = await Subscription.create(data)
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
                    console.log("Enviando a:", pushSubscription.endpoint);
                    await webPush.sendNotification(pushSubscription, notificationPayload);
                    console.log("Notificación enviada exitosamente a:", pushSubscription.endpoint);
                } catch (error) {
                    if (error.statusCode === 410) {
                        console.log(`La suscripción ha caducado o el cliente se dio de baja: ${pushSubscription.endpoint}`);
                        // Elimina la suscripción inválida de la base de datos
                        await Subscription.destroy({ where: { endpoint: subscription.endpoint } });
                        console.log(`Suscripción eliminada: ${pushSubscription.endpoint}`);
                    } else {
                        console.error(`Error al enviar notificación a ${pushSubscription.endpoint}:`, error);
                    }
                }
            }
            return { status: 200, message: 'Notificaciones enviadas a las subscripciones' }
        } catch (error) {
            console.log(error)
            return { status: 500, message: 'Error al Enviar las notificaciones' }
        }
    }
}

export default SubscriptionService;