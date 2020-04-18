import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { secretKey } from '../../config/secret';
import ResourceModel from '../modules/resources/model/ResourcesModel';

module.exports = {
    async VerifyToken(req, res, next) {
        const token = _.get(req, 'headers.token');
        try {
            if (_.isEmpty(token)) {
                throw new jwt.JsonWebTokenError('Token is required in header request');
            }
            const decodeToken = jwt.verify(token, secretKey);
            const RSModel = new ResourceModel();
            const userData = await RSModel.checkLogin(decodeToken, true);
            if (!_.get(userData, '_id', null)) {
                throw new jwt.JsonWebTokenError('Token is not valid');
            }

            req.resourceData = userData;
            next();
        } catch (e) {
            res.status(401).json({ status: false, message: e.message });
        }
    },
};
