import { Log } from "../db/models/logs.model.js";

class LogsServices {
    constructor() { }

    async find() {
        const res = await Log.findAll();
        return res;
    }

    async findOne(id) {
        const res = await Log.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await Log.create(data);
        return res;
    }

    async update(id, data) {
        const model = await this.findOne(id);
        const res = await model.update(data);
        return res;
    }

    async delete(id) {
        const model = await this.findOne(id);
        const res = await model.destroy();
        return res;
    }

    async logLogin(ip, email) {
        const existingLog = await Log.findOne({ where: { email, action_description: 'Inicio de sesión' } });

        if (existingLog && existingLog.email === email) {
            // Si el registro existe y el correo coincide, actualiza la fecha
            await existingLog.update({ date: new Date() });
        } else {
            // Si no existe un registro para este correo, crea uno nuevo
            await Log.create({
                ip,
                email,
                date: new Date(),
                action_description: 'Inicio de sesión'
            });
        }
    }


    async logLoginBlock(ip, email) {
        const existingLog = await Log.findOne({ where: { email, action_description: 'Bloqueo de inicio de sesión' } });

        if (existingLog && existingLog.email === email) {
            // Si el registro existe y el correo coincide, actualiza la fecha
            await existingLog.update({ date: new Date() });
        } else {
            await Log.create({
                ip,
                email,
                date: new Date(),
                action_description: 'Bloqueo de inicio de sesión'
            });
        }
    }

    async logLoginOAuth(ip, email, oauthService) {
        const existingLog = await Log.findOne({ where:  { email, action_description: `Inicio de sesión por ${oauthService}` }  });

        if (existingLog && existingLog.email === email) {
            // Si el registro existe y el correo coincide, actualiza la fecha
            await existingLog.update({ date: new Date() });
        } else {
            await Log.create({
                ip,
                email,
                date: new Date(),
                action_description: `Inicio de sesión por ${oauthService}`
            });
        }
    }

    async logSensitiveDataUpdate(ip, email, description) {
        await Log.create({
            ip,
            email,
            date: new Date(),
            action_description: description
        });
    }
}

export default LogsServices;
