
import Ajv from 'ajv';
import ProjectModel from '../model/ProjectModel';

const ajv = new Ajv({ allErrors: true });

export default class ProjectController {
    constructor() {
        this.model = new ProjectModel();
    }

    async createProject(requestBody, CreateProjectRequest) {
        const validate = ajv.compile(CreateProjectRequest);
        const valid = await validate(requestBody);
        if (!valid) {
            throw new Ajv.ValidationError(validate.errors);
        }

        return this.model.createProject(requestBody);
    }

    async getLists(requestQuery, GetListProjectsRequest) {
        const validate = ajv.compile(GetListProjectsRequest);
        const valid = await validate(requestQuery);
        if (!valid) {
            throw new Ajv.ValidationError(validate.errors);
        }

        const totalRecords = await this.model.gettotalRecords();
        const projects = await this.model.getLists(requestQuery);

        return {
            totalRecord: totalRecords,
            data: projects,
        };
    }

    async getProject(id) {
        return this.model.getProject(id);
    }

    async updateProject(id, requestBody, UpdateProjectRequest) {
        const validate = ajv.compile(UpdateProjectRequest);
        const valid = await validate(requestBody);
        if (!valid) {
            throw new Ajv.ValidationError(validate.errors);
        }

        return this.model.updateProject(id, requestBody);
    }

    async deleteProject(id) {
        return this.model.deleteProjectById(id);
    }
}
