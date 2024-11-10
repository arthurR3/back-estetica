import SubscriptionService from "../services/subscription.service.js";
const subscription = new SubscriptionService();

const getKey = async (req, res) =>{
    try {
        const key = process.env.VAPID_PUBLIC_KEY
        res.status(200).json(key)
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const create = async (req, res) => {
    try {
        const data = req.body;
        //console.log(data)
        //res.status(200).send({ success: true, message: data});
        await subscription.create(data);
        res.status(201).json();
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const subscribeUser = async( req, res ) => {
    const data = req.body;
    try {
        const subscriptionActive = await subscription.findOne(data.subscription.endpoint);
        if(subscriptionActive){
            await subscription.update(subscriptionActive.id, { id_user: data.id_user })
            //console.log('Subscription updated')
            res.status(200).json({success: true, message: 'Subscription asociate successfully'});
        }else{
            await subscription.create({
                id_user: data.id_user,
                endpoint: data.subscription.endpoint,
                expirationTime: data.subscription.expirationTime,
                keys: data.subscription.keys,
            });
        
            console.log('subscription created')
            res.status(200).json({ success: true, message: 'Nueva suscripción creada y asociada' });
        }

    } catch (error) {
        //console.error("Error al suscribir usuario:", error);
        res.status(500).json({ success: false, message: 'Error al guardar la suscripción' });
    }
} 

const _deleteSubscription = async(req, res ) =>{
    const data = req.body;
    try {
        await subscription.updateUserToNull(data.id_user);
        res.status(200).json({ success: true, message: 'Suscripción desasociada del usuario' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message});
    }
 
}

const sendData = async (req, res) => {
    const {title, message} = req.body;
    try {
        await subscription.sendNotification(title, message);
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message});
    }
}

export {getKey, create, subscribeUser,_deleteSubscription, sendData}