import _ from 'lodash';
import Database from '../../../models/Database';
import ClientSchema from '../schema/ClientSchema';
import DatabaseConfig from '../../../../config/database';

ClientSchema.post('save', (error, doc, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {
        let messge = error.message.match(/index:(.*?)dup/g);
        if (messge) {
            messge = _.replace(_.trim(_.takeRight(_.split(messge, ':'))), /(_[0-9]\s)(.*?)$/g, '');
        }
        next(new Error(`${messge} is duplicate key error`));
    } else {
        next(error);
    }
});
export default class ClientModel extends Database {
    constructor() {
        super();
        this.model = this.connect.model('clients', ClientSchema);
    }

    async createClient(clientData) {
        try {
            return this.model.create({
                name: _.get(clientData, 'name'),
                color: _.get(clientData, 'color'),
                note: _.get(clientData, 'note'),
                is_active: _.get(clientData, 'is_active', true),
            });
        } catch (ex) {
            throw ex;
        }
    }

    async getLists(requestQuery) {
        try {
            const PostPerPage = parseFloat(_.get(requestQuery, 'post_per_page', DatabaseConfig.post_per_page));
            const CurrentPage = parseFloat(_.get(requestQuery, 'paged', 1) - 1);
            const keySort = _.get(requestQuery, 'sort', 'name');

            return this.model.find({ is_active: true })
                .sort({
                    [keySort]: 'asc',
                })
                .limit(PostPerPage)
                .skip(PostPerPage * CurrentPage);
        } catch (ex) {
            throw ex;
        }
    }

    async getClient(id) {
        try {
            return this.model.findById(id);
        } catch (e) {
            throw e;
        }
    }

    async updateClient(id, body) {
        try {
            const client = await this.model.findById(id);

            _.forEach(body, (value, key) => {
                _.set(client, key, value);
            });

            return client.save();
        } catch (e) {
            throw e;
        }
    }
    deleteClientById(id) {
        try {
            return this.model.findOneAndRemove({ _id: id });
        } catch (e) {
            throw e;
        }
    }
}
