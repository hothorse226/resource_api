
import Ajv from 'ajv';
import ClientModel from '../model/ClientModel';

const ajv = new Ajv({ allErrors: true });

export default class ClientController {
    constructor() {
        this.model = new ClientModel();
    }

    async createClient(requestBody, createClientRequest) {
        const validate = ajv.compile(createClientRequest);
        const valid = await validate(requestBody);
        if (!valid) {
            throw new Ajv.ValidationError(validate.errors);
        }

        return this.model.createClient(requestBody);
    }

    async getLists(requestQuery, GetListClientsRequest) {
        const validate = ajv.compile(GetListClientsRequest);
        const valid = await validate(requestQuery);
        if (!valid) {
            throw new Ajv.ValidationError(validate.errors);
        }

        const clients = await this.model.getLists(requestQuery);

        return {
            totalRecord: 0,
            data: clients,
        };
    }

    async getClient(id) {
        return this.model.getClient(id);
    }

    async updateClient(id, requestBody, UpdateClientRequest) {
        const validate = ajv.compile(UpdateClientRequest);
        const valid = await validate(requestBody);
        if (!valid) {
            throw new Ajv.ValidationError(validate.errors);
        }

        return this.model.updateClient(id, requestBody);
    }

    async DeleteClient(id) {
        return this.model.deleteClientById(id);
    }
}
