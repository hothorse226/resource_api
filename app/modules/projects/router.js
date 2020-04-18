import _ from 'lodash';
import express from 'express';
import swagger from 'swagger-spec-express';
import ProjectController from './controller/ProjectController';
import MessageHandler from '../../library/MessageHandler';
import { VerifyToken } from '../../library/TokenVerify';
import CreateProjectRequest from './validate/request/CreateProjectRequest.json';
import CreateProjectResponse from './validate/response/CreateProjectResponse.json';

import ValidateError from '../../globalError/ValidateError.json';
import ServerError from '../../globalError/ServerError.json';
import AuthError from '../../globalError/AuthError.json';
import GetListsProjectRequest from './validate/request/GetListsProjectRequest.json';
import GetListsProjectResponse from './validate/response/GetListsProjectResponse.json';
import GetProjectByIdResponse from './validate/response/GetProjectByIdResponse.json';
import UpdateProjectRequest from './validate/request/UpdateProjectRequest.json';
import UpdateProjectResponse from './validate/response/UpdateProjectResponse.json';
import DeleteProjectSchemaResponse from './validate/response/DeleteProjectByIdResponse.json';

const router = express.Router();

swagger.swaggerize(router);


swagger.common.parameters.addBody({
    name: 'CreateProject',
    description: 'Request create project',
    schema: CreateProjectRequest,
});
router.post('/create', VerifyToken, async (req, res) => {
    try {
        const controller = new ProjectController();
        const data = await controller.createProject(req.body, CreateProjectRequest);
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'post',
    common: { parameters: { body: ['CreateProject'], header: ['token'] } },
    responses: {
        200: {
            description: 'Create project response success',
            schema: CreateProjectResponse,
        },
        401: {
            description: 'Create project auth validate',
            schema: AuthError,
        },
        422: {
            description: 'Create project error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Create project error from server',
            schema: ServerError,
        },
    },
});


router.get('/getLists', VerifyToken, async (req, res) => {
    try {
        const controller = new ProjectController();
        const data = await controller.getLists(req.query, GetListsProjectRequest);
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'get',
    common: { parameters: { query: ['sort', 'post_per_page', 'paged'], header: ['token'] } },
    responses: {
        200: {
            description: 'get list projects response success',
            schema: GetListsProjectResponse,
        },
        401: {
            description: 'get list project auth validate',
            schema: AuthError,
        },
        422: {
            description: 'get list projects error validate',
            schema: ValidateError,
        },
        500: {
            description: 'get list project error from server',
            schema: ServerError,
        },
    },
});


swagger.common.parameters.addPath({
    name: 'projectId',
    description: 'The id of project',
    required: true,
    type: 'string',
});
router.get('/:projectId', VerifyToken, async (req, res) => {
    try {
        const controller = new ProjectController();
        const data = await controller.getProject(_.get(req, 'params.projectId'));
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'get',
    common: { parameters: { path: ['projectId'], header: ['token'] } },
    responses: {
        200: {
            description: 'get project by projectId response success',
            schema: GetProjectByIdResponse,
        },
        401: {
            description: 'get project by projectId auth validate',
            schema: AuthError,
        },
        422: {
            description: 'Get project by projectId error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Get project by projectId error from server',
            schema: ServerError,
        },
    },
});

swagger.common.parameters.addBody({
    name: 'UpdateProject',
    description: 'Request update project',
    schema: UpdateProjectRequest,
});

router.put('/:projectId', VerifyToken, async (req, res) => {
    try {
        const controller = new ProjectController();
        const data = await controller.updateProject(_.get(req, 'params.projectId'), req.body, UpdateProjectRequest);
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'put',
    common: { parameters: { path: ['projectId'], body: ['UpdateProject'], header: ['token'] } },
    responses: {
        200: {
            description: 'Update project by projectId response success',
            schema: UpdateProjectResponse,
        },
        401: {
            description: 'Update project by projectId auth validate',
            schema: AuthError,
        },
        422: {
            description: 'Update project by projectId error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Update project by projectId error from server',
            schema: ServerError,
        },
    },
});

router.delete('/:projectId', VerifyToken, async (req, res) => {
    try {
        const controller = new ProjectController();
        const data = await controller.deleteProject(_.get(req, 'params.projectId'));
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'delete',
    common: { parameters: { path: ['projectId'], header: ['token'] } },
    responses: {
        200: {
            description: 'Delete project by projectId response success',
            schema: DeleteProjectSchemaResponse,
        },
        401: {
            description: 'Delete project by projectId auth validate',
            schema: AuthError,
        },
        422: {
            description: 'Delete project by projectId error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Delete project by projectId error from server',
            schema: ServerError,
        },
    },
});

module.exports = router;
