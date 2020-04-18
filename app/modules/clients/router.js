/**
 * Created by TiepND2 on 6/25/2017.
 */
import express from 'express';
import swagger from 'swagger-spec-express';
import ClientController from './controller/ClientController';
import MessageHandler from '../../library/MessageHandler';
import { VerifyToken } from '../../library/TokenVerify';
import CreateClientRequest from './validate/request/CreateClientRequest.json';
import UpdateClientRequest from './validate/request/UpdateClientRequest.json';
import CreateClientResponse from './validate/response/CreateClientResponse.json';
import GetListsClientRequest from './validate/request/GetListsClientRequest.json';
import GetListsClientResponse from './validate/response/GetListsClientResponse.json';
import GetClientByIdResponse from './validate/response/GetClientByIdResponse.json';
import UpdateClientResponse from './validate/response/UpdateClientResponse.json';
import DeleteClientResponse from './validate/response/DeleteClientResponse.json';


import ValidateError from '../../globalError/ValidateError.json';
import ServerError from '../../globalError/ServerError.json';
import AuthError from '../../globalError/AuthError.json';

const router = express.Router();

swagger.swaggerize(router);


swagger.common.parameters.addBody({
    name: 'CreateClient',
    description: 'Request create client',
    schema: CreateClientRequest,
});
router.post('/create', VerifyToken, async (req, res) => {
    try {
        const controller = new ClientController();
        const data = await controller.createClient(req.body, CreateClientRequest);
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'post',
    common: { parameters: { body: ['CreateClient'], header: ['token'] } },
    responses: {
        200: {
            description: 'Create client response success',
            schema: CreateClientResponse,
        },
        401: {
            description: 'Create client auth validate',
            schema: AuthError,
        },
        422: {
            description: 'Create client error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Create client error from server',
            schema: ServerError,
        },
    },
});


router.get('/getLists', VerifyToken, async (req, res) => {
    try {
        const controller = new ClientController();
        const data = await controller.getLists(req.query, GetListsClientRequest);
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'get',
    common: { parameters: { query: ['sort', 'post_per_page', 'paged'], header: ['token'] } },
    responses: {
        200: {
            description: 'get list clients response success',
            schema: GetListsClientResponse,
        },
        401: {
            description: 'get list clients auth validate',
            schema: AuthError,
        },
        422: {
            description: 'get list client error validate',
            schema: ValidateError,
        },
        500: {
            description: 'get list client error from server',
            schema: ServerError,
        },
    },
});
swagger.common.parameters.addPath({
    name: 'clientId',
    description: 'The clientId of client',
    required: true,
    type: 'string',
});

router.get('/:clientId', VerifyToken, async (req, res) => {
    try {
        const controller = new ClientController();
        const data = await controller.getClient(req.params.clientId);
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'get',
    common: { parameters: { path: ['clientId'], header: ['token'] } },
    responses: {
        200: {
            description: 'get clients by clientId response success',
            schema: GetClientByIdResponse,
        },
        401: {
            description: 'Get client by clientId auth validate',
            schema: AuthError,
        },
        422: {
            description: 'Get client by clientId error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Get client by clientId error from server',
            schema: ServerError,
        },
    },
});


swagger.common.parameters.addBody({
    name: 'UpdateClient',
    description: 'Request update client',
    schema: UpdateClientRequest,
});
router.put('/:clientId', VerifyToken, async (req, res) => {
    try {
        const controller = new ClientController();
        const { clientId } = req.params;
        const data = await controller.updateClient(clientId, req.body, UpdateClientRequest);
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'put',
    common: { parameters: { path: ['clientId'], body: ['UpdateClient'], header: ['token'] } },
    responses: {
        200: {
            description: 'Update clients by clientId response success',
            schema: UpdateClientResponse,
        },
        401: {
            description: 'Update client by clientId auth validate',
            schema: AuthError,
        },
        422: {
            description: 'Update client by clientId error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Update client by clientId error from server',
            schema: ServerError,
        },
    },
});

router.delete('/:clientId', VerifyToken, async (req, res) => {
    try {
        const controller = new ClientController();
        const { clientId } = req.params;

        const deleteData = await controller.DeleteClient(clientId, req.body);
        MessageHandler.handleSuccess(deleteData, res);
    } catch (e) {
        MessageHandler.handleError(e, res);
    }
}).describe({
    summary: 'delete',
    common: { parameters: { path: ['clientId'], header: ['token'] } },
    responses: {
        200: {
            description: 'Delete by clientId response success',
            schema: DeleteClientResponse,
        },
        401: {
            description: 'Update client by clientId auth validate',
            schema: AuthError,
        },
        422: {
            description: 'Update client by clientId error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Update client by clientId error from server',
            schema: ServerError,
        },
    },
});
module.exports = router;
