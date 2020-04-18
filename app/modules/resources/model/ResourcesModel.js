/**
 * lodash is library handler array, object, function, collection, ...
 */
import _ from 'lodash';

/**
 * connect database
 */
import Database from '../../../models/Database';

/**
 * initialize resources collection
 */
import ResourcesSchema from '../schema/ResourcesSchema';

/**
 * database configuration
 */
import DatabaseConfig from '../../../../config/database';

/**
 * inject 2 functions: hashPassWord, verifyPassWord
 */
import { hashPassword, verifyPassword } from '../../../library/encrypt';

/**
 * hasPassword before save
 */
ResourcesSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await hashPassword(this.password);

    return next();
});

/**
 * catch error while save with method post
 */
ResourcesSchema.post('save', (error, doc, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {
        let mess = error.message.match(/index:(.*?)dup/g);
        if (mess) {
            mess = _.replace(_.trim(_.takeRight(_.split(mess, ':'))), /(_[0-9]\s)(.*?)$/g, '');
        }
        next(new Error(`${mess} is duplicate key error`));
    } else {
        next(error);
    }
});

export default class ResourcesModel extends Database {
    /**
     * constructor
     */
    constructor() {
        super();
        // initialize model resource
        this.model = this.connect.model('resources', ResourcesSchema);
    }

    /**
     * create resource
     */
    async createResource(resourcesData) {
        try {
            return this.model.create(resourcesData);
        } catch (e) {
            throw e;
        }
    }

    /**
     * get list resource
     */
    async getLists(requestQuery) {
        try {
            const PostPerPage = parseFloat(_.get(requestQuery, 'post_per_page', DatabaseConfig.post_per_page));
            const CurrentPage = parseFloat(_.get(requestQuery, 'paged', 1) - 1);
            const keySort = _.get(requestQuery, 'sort', 'firstName');

            return this.model.find({ is_active: true })
                .sort({
                    [keySort]: 'asc',
                }).select('-password')
                .limit(PostPerPage)
                .skip(PostPerPage * CurrentPage);
        } catch (ex) {
            throw ex;
        }
    }

    /**
     * get total resource
     */
    async gettotalRecords() {
        try {
            return this.model.find({ is_active: true }).count();
        } catch (ex) {
            throw ex;
        }
    }

    /**
     * get resouce by id
     */
    async getResource(id) {
        try {
            return this.model.findById(id).select('-password');
        } catch (e) {
            throw e;
        }
    }

    /**
     * update resouce
     */
    async updateResource(id, body) {
        try {
            const resource = await this.model.findById(id);
            _.forEach(body, (value, key) => {
                _.set(resource, key, value);
            });

            return resource.save();
        } catch (e) {
            throw e;
        }
    }

    /**
     * check login
     */
    async checkLogin(request, encoded = false) {
        const userData = await this.getUserByEmail(request.email);

        if (userData == null) {
            return false;
        }
        let VerifyPasswordFlag = false;
        if (encoded === true) {
            VerifyPasswordFlag = userData.password === request.password;
        } else {
            VerifyPasswordFlag = await verifyPassword(userData.password, request.password);
        }
        if (VerifyPasswordFlag === false) {
            return false;
        }

        return userData;
    }

    /**
     * get user by email
     */
    async getUserByEmail(email) {
        try {
            return this.model.findOne({
                email,
            });
        } catch (ex) {
            throw ex;
        }
    }

    async deleteResourceById(id) {
        try {
            return this.model.findOneAndRemove({ _id: id });
        } catch (e) {
            throw e;
        }
    }
}
