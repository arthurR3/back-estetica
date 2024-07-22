import PromotionService from '../services/promotion.service.js';

const promotionService = new PromotionService();

const getPromotions = async (req, res) => {
    try {
        const promotions = await promotionService.findAll();
        res.status(200).json(promotions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPromotionsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const promotions = await promotionService.findByProduct(productId);
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPromotionsByService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const promotions = await promotionService.findByService(serviceId);
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPromotionById = async (req, res) => {
    try {
        const promotion = await promotionService.findOne(req.params.id);
        if (!promotion) {
            return res.status(404).json({ error: 'Promotion not found' });
        }
        res.status(200).json(promotion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createPromotion = async (req, res) => {
    try {
        const data = {
            title : req.body.title,
            description : req.body.description,
            discount : req.body.discountPercentage,
            startDate : req.body.startDate,
            endDate : req.body.endDate,
            id_product : req.body.productId || null,
            id_service : req.body.serviceId || null,
        }
        console.log(data)
        const promotion = await promotionService.create(data);
        console.log(promotion)
        res.status(201).json(promotion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updatePromotion = async (req, res) => {
    try {
        const promotion = await promotionService.update(req.params.id, req.body);
        if (!promotion) {
            return res.status(404).json({ error: 'Promotion not found' });
        }
        res.status(200).json(promotion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deletePromotion = async (req, res) => {
    try {
        const result = await promotionService.delete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Promotion not found' });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { getPromotions, getPromotionById, createPromotion, updatePromotion, deletePromotion };
