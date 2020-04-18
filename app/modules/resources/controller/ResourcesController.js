/**
 * lodash is library handler array, object, function, collection, ...
 */
import _ from 'lodash';
import Ajv from 'ajv';
import Nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import fs from 'fs';
import NodeDateTime from 'node-datetime';
import EmailConfig from '../../../../config/email';
import ResourcesModel from '../model/ResourcesModel';
import config from '../../../../config/secret';
import globalConfig from '../../../../config/global';
import { readHTMLFile } from '../../../library/EmailTemplate';

const ajv = new Ajv({ allErrors: true });

export default class ResourcesController {
    constructor() {
        this.model = new ResourcesModel();
    }

    async createResource(requestBody, CreateResourceRequest) {
        const validate = ajv.compile(CreateResourceRequest);
        const valid = await validate(requestBody);
        if (!valid) {
            throw new Ajv.ValidationError(validate.errors);
        }

        const email = _.get(requestBody, 'email', '');
        const invitePerson = _.get(requestBody, 'invitePerson', false);

        const transporter = Nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EmailConfig.email,
                pass: EmailConfig.password,
            },
        });

        if (invitePerson) {
            readHTMLFile(`${global.rootPath}/emails/invite-resource.html`, (err, html) => {
                const template = handlebars.compile(html);
                const replacements = {
                    fullname: _.get(requestBody, 'firstName', '') + _.get(requestBody, 'lastName', ''),
                    email: _.get(requestBody, 'email', ''),
                    password: _.get(requestBody, 'password', ''),
                };
                const htmlToSend = template(replacements);
                const mailOptions = {
                    from: EmailConfig.password,
                    to: email,
                    subject: 'Email invite resource',
                    html: htmlToSend,
                };
                transporter.sendMail(mailOptions, (error) => {
                    if (error) {
                        throw new Error('Send mail error');
                    }
                });
            });
        }

        const avatar = _.get(requestBody, 'avatar', '');

        if (!_.isEmpty(avatar)) {
            const data = avatar.replace(/^data:image\/\w+;base64,/, '');
            const buf = new Buffer(data, 'base64');
            const dt = NodeDateTime.create();
            const publicDir = `${global.rootPath}/../public`;

            if (!fs.existsSync(publicDir)) {
                fs.mkdirSync(publicDir);
            }

            const uploadsDir = `${publicDir}/uploads`;

            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir);
            }

            const monthDir = `${uploadsDir}/${dt.format('Ym')}`;

            if (!fs.existsSync(monthDir)) {
                fs.mkdirSync(monthDir);
            }

            const avatarFileName = dt.format('YmdHMS') + _.get(requestBody, 'avatarFileName', '');

            fs.writeFile(`${monthDir}/${avatarFileName}`, buf, (error) => {
                if (error) {
                    throw new Error('Write file error');
                }
            });

            _.set(requestBody, 'avatar', `${dt.format('Ym')}/${avatarFileName}`);
        }

        const resourceData = await this.model.createResource(requestBody);
        _.unset(resourceData, 'password');

        return resourceData;
    }
    async registerResource(requestBody, RegisterResourceRequest) {
        const validate = ajv.compile(RegisterResourceRequest);
        const valid = await validate(requestBody);
        if (!valid) {
            throw new Ajv.ValidationError(validate.errors);
        }
        const response = {
            resourceData: {},
            token: '',
            message: '',
        };

        _.set(requestBody, 'timeZone', _.get(requestBody, 'timeZone', globalConfig.timeZone));
        _.set(requestBody, 'nickName', _.get(requestBody, 'nickName', requestBody.firstName));
        _.set(requestBody, 'permission', 1);

        const resourceData = await this.model.createResource(requestBody);
        if (resourceData === false) {
            throw new Error('Register error');
        }

        const token = jwt.sign({
            email: resourceData.email,
            password: resourceData.password,
            time: +new Date(),
        }, config.secretKey);

        _.unset(resourceData, 'password');
        response.resourceData = resourceData;
        response.token = token;
        response.message = 'Register success';

        return response;
    }

    async getLists(requestQuery, GetListsResourceRequest) {
        const validate = ajv.compile(GetListsResourceRequest);
        const valid = await validate(requestQuery);
        if (!valid) {
            throw new Ajv.ValidationError(validate.errors);
        }

        const totalRecords = await this.model.gettotalRecords();
        const resources = await this.model.getLists(requestQuery);

        return {
            totalRecord: totalRecords,
            data: resources,
        };
    }

    async getResource(id) {
        const resourceData = await this.model.getResource(id);

        return resourceData;
    }

    async updateResource(id, requestBody, UpdateResourceRequest) {
        const validate = ajv.compile(UpdateResourceRequest);
        const valid = await validate(requestBody);
        if (!valid) {
            throw new Ajv.ValidationError(validate.errors);
        }

        const currentResourceData = await this.model.getResource(id);

        if (_.isEmpty(currentResourceData)) {
            throw new Ajv.ValidationError('Resource not found');
        }

        const avatar = _.get(requestBody, 'avatar', '');

        if (!_.isEmpty(avatar) && currentResourceData.avatar !== avatar) {
            const data = avatar.replace(/^data:image\/\w+;base64,/, '');
            const buf = new Buffer(data, 'base64');
            const dt = NodeDateTime.create();

            const publicDir = `${global.rootPath}/../public`;

            if (!fs.existsSync(publicDir)) {
                fs.mkdirSync(publicDir);
            }

            const uploadsDir = `${publicDir}/uploads`;

            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir);
            }

            const monthDir = `${uploadsDir}/${dt.format('Ym')}`;

            if (!fs.existsSync(monthDir)) {
                fs.mkdirSync(monthDir);
            }

            const avatarFileName = dt.format('YmdHMS') + _.get(requestBody, 'avatarFileName', '');

            fs.writeFile(`${monthDir}/${avatarFileName}`, buf, (error) => {
                if (error) {
                    throw new Error('Write file error');
                }
            });

            _.set(requestBody, 'avatar', `${dt.format('Ym')}/${avatarFileName}`);
        }

        const resourceData = await this.model.updateResource(id, requestBody);
        _.unset(resourceData, 'password');

        return resourceData;
    }

    async loginResource(requestBody, LoginResourceRequest) {
        const validate = ajv.compile(LoginResourceRequest);
        const valid = await validate(requestBody);
        if (!valid) {
            throw new Ajv.ValidationError(validate.errors);
        }

        const response = {
            resourceData: {},
            token: '',
            message: '',
        };

        const resourceData = await this.model.checkLogin(requestBody);
        if (resourceData === false) {
            throw new jwt.JsonWebTokenError('Invalid credentials');
        }

        const token = jwt.sign({
            email: resourceData.email,
            password: resourceData.password,
            time: +new Date(),
        }, config.secretKey);

        _.unset(resourceData, 'password');
        response.resourceData = resourceData;
        response.token = token;
        response.message = 'login success';

        return response;
    }

    async getResourceByToken(token) {
        const response = {
            resourceData: {},
            token: '',
            message: '',
        };
        const tokenInfo = jwt.verify(token, config.secretKey);
        const resourceData = await this.model.checkLogin(tokenInfo, true);
        if (resourceData === false) {
            throw new jwt.JsonWebTokenError('Email or password is not valid test 2');
        }

        const newToken = jwt.sign({
            email: resourceData.email,
            password: resourceData.password,
            time: +new Date(),
        }, config.secretKey);

        _.unset(resourceData, 'password');
        response.resourceData = resourceData;
        response.token = newToken;
        response.message = 'login success';

        return response;
    }

    async ForgotPasswordResource(requestBody, ForgotPasswordRequest) {
        const validate = ajv.compile(ForgotPasswordRequest);
        const valid = await validate(requestBody);
        if (!valid) {
            throw new Ajv.ValidationError(validate.errors);
        }
        const email = _.get(requestBody, 'email', '');
        const resourceData = await this.model.getUserByEmail(email);
        if (resourceData === null) {
            throw new jwt.JsonWebTokenError('Email is not valid');
        }

        const encodeForgotpass = jwt.sign({
            email: resourceData.email,
            password: resourceData.password,
            time: +new Date(),
        }, config.secretKey);

        const transporter = Nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EmailConfig.email,
                pass: EmailConfig.password,
            },
        });

        const mailOptions = {
            from: EmailConfig.password,
            to: email,
            subject: 'Email forgot password',
            text: `Hi ${resourceData.firstName} ${encodeForgotpass}`,
        };
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                throw new Error('Something when wrong');
            }
        });

        return `Password reset instructions have been sent to ${email}`;
    }

    async deleteResource(id) {
        return this.model.deleteResourceById(id);
    }
}
