import SalesViewService from '../services/sales_view.service.js';
const salesViewService = new SalesViewService();

const getSalesView = async (req, res) => {
    try {
        const response = await salesViewService.find();
        return res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export { getSalesView };
