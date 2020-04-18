import _ from 'lodash';
import express from 'express';
import swagger from 'swagger-spec-express';
import ResourcesController from './controller/ResourcesController';
import MessageHandler from '../../library/MessageHandler';
import { VerifyToken } from '../../library/TokenVerify';
import ValidateError from '../../globalError/ValidateError.json';
import ServerError from '../../globalError/ServerError.json';
import AuthError from '../../globalError/AuthError.json';
import LoginResourceRequest from './validate/request/LoginResourceRequest.json';
import LoginResourceResponse from './validate/response/LoginResourceResponse.json';

import RegisterResourceRequest from './validate/request/RegisterResourceRequest.json';
import RegisterResourceResponse from './validate/response/RegisterResourceResponse.json';

import ForgotPasswordRequest from './validate/request/ForgotPasswordResourceRequest.json';
import ForgotPasswordResourceResponse from './validate/response/ForgotPasswordResourceResponse.json';

import CreateResourceRequest from './validate/request/CreateResourceRequest.json';
import CreateResourceResponse from './validate/response/CreateResourceResponse.json';

import GetListsResourceRequest from './validate/request/GetListsResourceRequest.json';
import GetListsResourceResponse from './validate/response/GetListsResourceResponse.json';

import GetResourceResponse from './validate/response/GetResourceResponse.json';
import UpdateResourceRequest from './validate/request/UpdateResourceRequest.json';
import UpdateResourceResponse from './validate/response/UpdateResourceResponse.json';
import DeleteResourceResponse from './validate/response/DeleteResourceResponse.json';

const router = express.Router();

swagger.swaggerize(router);


swagger.common.parameters.addBody({
    name: 'LoginResource',
    description: 'Request login resource',
    schema: LoginResourceRequest,
});
router.post('/login', async (req, res) => {
    try {
        const controller = new ResourcesController();
        const data = await controller.loginResource(req.body, LoginResourceRequest);
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'post',
    common: { parameters: { body: ['LoginResource'] } },
    responses: {
        200: {
            description: 'Login resource response success',
            schema: LoginResourceResponse,
        },
        422: {
            description: 'Login resource error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Login resource error from server',
            schema: ServerError,
        },
    },
});

swagger.common.parameters.addBody({
    name: 'RegisterResource',
    description: 'Request register resource',
    schema: RegisterResourceRequest,
});
router.post('/register', async (req, res) => {
    try {
        const controller = new ResourcesController();
        const data = await controller.registerResource(req.body, RegisterResourceRequest);
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'post',
    common: { parameters: { body: ['RegisterResource'] } },
    responses: {
        200: {
            description: 'Register resource response success',
            schema: RegisterResourceResponse,
        },
        422: {
            description: 'Register resource error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Register resource error from server',
            schema: ServerError,
        },
    },
});


swagger.common.parameters.addBody({
    name: 'ForgotPasswordResource',
    description: 'Forgot password resource',
    schema: ForgotPasswordRequest,
});
router.post('/forgotPassword', async (req, res) => {
    try {
        const controller = new ResourcesController();
        const data = await controller.ForgotPasswordResource(req.body, ForgotPasswordRequest);
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'post',
    common: { parameters: { body: ['ForgotPasswordResource'] } },
    responses: {
        200: {
            description: 'Forgot password resource response success',
            schema: ForgotPasswordResourceResponse,
        },
        422: {
            description: 'Forgot password resource error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Forgot password resource error from server',
            schema: ServerError,
        },
    },
});

swagger.common.parameters.addBody({
    name: 'CreateResource',
    description: 'Request create resource',
    schema: CreateResourceRequest,
});
router.post('/create', VerifyToken, async (req, res) => {
    try {
        const controller = new ResourcesController();
        const data = await controller.createResource(req.body, CreateResourceRequest);
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'post',
    common: { parameters: { body: ['CreateResource'], header: ['token'] } },
    responses: {
        200: {
            description: 'Create resource response success',
            schema: CreateResourceResponse,
        },
        401: {
            description: 'Create resource auth validate',
            schema: AuthError,
        },
        422: {
            description: 'Create resource error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Create resource error from server',
            schema: ServerError,
        },
    },
});

router.get('/getLists', VerifyToken, async (req, res) => {
    try {
        const controller = new ResourcesController();
        const data = await controller.getLists(req.query, GetListsResourceRequest);
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'get',
    common: { parameters: { query: ['sort', 'post_per_page', 'paged'], header: ['token'] } },
    responses: {
        200: {
            description: 'get list resources response success',
            schema: GetListsResourceResponse,
        },
        401: {
            description: 'get list resources auth validate',
            schema: AuthError,
        },
        422: {
            description: 'get list resources error validate',
            schema: ValidateError,
        },
        500: {
            description: 'get list resources error from server',
            schema: ServerError,
        },
    },
});


swagger.common.parameters.addPath({
    name: 'resourceId',
    description: 'The id of resource',
    required: true,
    type: 'string',
});
router.get('/:resourceId', VerifyToken, async (req, res) => {
    try {
        const controller = new ResourcesController();
        const data = await controller.getResource(_.get(req, 'params.resourceId'));
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'get',
    common: { parameters: { path: ['resourceId'], header: ['token'] } },
    responses: {
        200: {
            description: 'get resource by resourceId response success',
            schema: GetResourceResponse,
        },
        401: {
            description: 'Get resource by resourceId auth validate',
            schema: AuthError,
        },
        422: {
            description: 'Get resource by resourceId error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Get resource by resourceId error from server',
            schema: ServerError,
        },
    },
});

swagger.common.parameters.addBody({
    name: 'UpdateResource',
    description: 'Request update resource',
    schema: UpdateResourceRequest,
});

router.put('/:resourceId', VerifyToken, async (req, res) => {
    try {
        const controller = new ResourcesController();
        const data = await controller.updateResource(_.get(req, 'params.resourceId'), req.body, UpdateResourceRequest);
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'put',
    common: { parameters: { path: ['resourceId'], body: ['UpdateResource'], header: ['token'] } },
    responses: {
        200: {
            description: 'Update resource by resourceId response success',
            schema: UpdateResourceResponse,
        },
        401: {
            description: 'Update resource by resourceId auth validate',
            schema: AuthError,
        },
        422: {
            description: 'Update resource by resourceId error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Update resource by resourceId error from server',
            schema: ServerError,
        },
    },
});

router.delete('/:resourceId', VerifyToken, async (req, res) => {
    try {
        const controller = new ResourcesController();
        const data = await controller.deleteResource(_.get(req, 'params.resourceId'));
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'delete',
    common: { parameters: { path: ['resourceId'], header: ['token'] } },
    responses: {
        200: {
            description: 'Delete resource by resourceId response success',
            schema: DeleteResourceResponse,
        },
        401: {
            description: 'Delete resource by resourceId auth validate',
            schema: AuthError,
        },
        422: {
            description: 'Delete resource by resourceId error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Delete resource by resourceId error from server',
            schema: ServerError,
        },
    },
});

swagger.common.parameters.addPath({
    name: 'token',
    description: 'The token of resource',
    required: true,
    type: 'string',
});
router.get('/getResourceBuyToken/:token', async (req, res) => {
    try {
        const controller = new ResourcesController();
        const data = await controller.getResourceByToken(_.get(req, 'params.token'));
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'get',
    common: { parameters: { path: ['token'] } },
    responses: {
        200: {
            description: 'check token resource response success',
            schema: GetResourceResponse,
        },
        422: {
            description: 'check token resource by  error validate',
            schema: ValidateError,
        },
        500: {
            description: 'check token resource error from server',
            schema: ServerError,
        },
    },
});

module.exports = router;
