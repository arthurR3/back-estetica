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

const sendData = async (req, res) => {
    const {title, message} = req.body;
    try {
        await subscription.sendNotification(title, message);
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message});
    }
}

export {getKey, create, sendData}