import _ from 'lodash';
import Database from '../../../models/Database';
import ProjectSchema from '../schema/ProjectSchema';
import ClientSchema from '../../clients/schema/ClientSchema';
import DatabaseConfig from '../../../../config/database';

ProjectSchema.post('save', (error, doc, next) => {
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
export default class ProjectModel extends Database {
    constructor() {
        super();
        this.connect.model('clients', ClientSchema);
        this.model = this.connect.model('projects', ProjectSchema);
    }

    async createProject(projectData) {
        try {
            return this.model.create(projectData);
        } catch (e) {
            throw e;
        }
    }

    async getLists(requestQuery) {
        try {
            const PostPerPage = parseFloat(_.get(requestQuery, 'post_per_page', DatabaseConfig.post_per_page));
            const CurrentPage = parseFloat(_.get(requestQuery, 'paged', 1) - 1);
            const keySort = _.get(requestQuery, 'sort', 'name');

            return this.model.find({ is_active: true })
                .populate('clientId')
                .sort({
                    [keySort]: 'asc',
                })
                .limit(PostPerPage)
                .skip(PostPerPage * CurrentPage);
        } catch (ex) {
            throw ex;
        }
    }

    /**
     * get total project
     */
    async gettotalRecords() {
        try {
            return this.model.find({ is_active: true }).count();
        } catch (ex) {
            throw ex;
        }
    }

    async getProject(id) {
        try {
            return this.model.findById(id).populate('clientId');
        } catch (e) {
            throw e;
        }
    }
    async updateProject(id, body) {
        try {
            const project = await this.model.findById(id);

            _.forEach(body, (value, key) => {
                _.set(project, key, value);
            });

            return project.save();
        } catch (e) {
            throw e;
        }
    }
    deleteProjectById(id) {
        try {
            return this.model.findOneAndRemove({ _id: id });
        } catch (e) {
            throw e;
        }
    }
}
