import { SalesView } from '../db/models/sales_view.model.js';

class SalesViewService {

    async find() {
        return await SalesView.findAll();
    }

}

export default SalesViewService;