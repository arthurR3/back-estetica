import HorarioGService from "../services/horarioGnral.service.js";

const horarioGnral = new HorarioGService();

const get = async (req, res) => {
    try {
        // Recuperar todos los horarios generales
        const horariosGenerales = await horarioGnral.find();
        
        // Agrupar intervalos por día de la semana
        const intervalosPorDia = horariosGenerales.reduce((acc, horario) => {
            // Desestructuración para obtener los valores
            const { dia_semana, hora_desde, hora_hasta } = horario;
            
            // Si el día de la semana no existe en el acumulador, crear un nuevo array para él
            if (!acc[dia_semana]) {
                acc[dia_semana] = [];
            }
            
            // Añadir el intervalo al array correspondiente del día de la semana
            acc[dia_semana].push({ hora_desde, hora_hasta });
            
            return acc;
        }, {});
        
        // Formatear la respuesta para incluir los intervalos agrupados
        const response = Object.keys(intervalosPorDia).map(dia_semana => ({
            dia_semana: parseInt(dia_semana),
            intervalos: intervalosPorDia[dia_semana]
            
        }));

        return res.json(response);
    } catch (err) {
        res.status(500).send({ success: false, message: err.message });
    }
}


const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await horarioGnral.findOne(id);
        return res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const create = async (req, res) => {
    try {
        const response = await horarioGnral.create(req.body);
        return res.json({success: true, data: response});
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await horarioGnral.update(id, req.body);
        return res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const _delete = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await horarioGnral.delete(id);
        return res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export {
    get, getById, create, update, _delete
};