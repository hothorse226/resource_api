import _ from 'lodash';
import express from 'express';
import swagger from 'swagger-spec-express';
import MessageHandler from '../../library/MessageHandler';
import { VerifyToken } from '../../library/TokenVerify';
import BookingController from './controller/BookingController';
import CreateBookingRequest from './validate/request/CreateBookingRequest.json';
import CreateBookingResponse from './validate/response/CreateBookingResponse.json';
import GetListBookingRequest from './validate/request/GetListBookingRequest.json';
import GetListBookingResponse from './validate/response/GetListBookingResponse.json';
import GetBookingByIdResponse from './validate/response/GetBookingByIdResponse.json';
import UpdateBookingRequest from './validate/request/UpdateBookingRequest.json';
import UpdateBookingResponse from './validate/response/UpdateBookingResponse.json';
import ValidateError from '../../globalError/ValidateError.json';
import ServerError from '../../globalError/ServerError.json';
import AuthError from '../../globalError/AuthError.json';

const router = express.Router();

swagger.swaggerize(router);

swagger.common.parameters.addBody({
    name: 'CreateBooking',
    description: 'Create Booking',
    schema: CreateBookingRequest,
});
router.post('/create', VerifyToken, async (req, res) => {
    try {
        const controller = new BookingController();
        const data = await controller.createBooking(req.body, CreateBookingRequest);
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'post',
    common: { parameters: { body: ['CreateBooking'], header: ['token'] } },
    responses: {
        200: {
            description: 'Create resource response success',
            schema: CreateBookingResponse,
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

router.get('/getlist', VerifyToken, async (req, res) => {
    try {
        const controller = new BookingController();
        const data = await controller.getList(req.query, GetListBookingRequest);
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'get',
    common: { parameters: { query: ['sort', 'post_per_page', 'paged'], header: ['token'] } },
    responses: {
        200: {
            description: 'get list booking response success',
            schema: GetListBookingResponse,
        },
        401: {
            description: 'get list booking auth validate',
            schema: AuthError,
        },
        422: {
            description: 'get list booking error validate',
            schema: ValidateError,
        },
        500: {
            description: 'get list booking error from server',
            schema: ServerError,
        },
    },
});

swagger.common.parameters.addPath({
    name: 'bookingid',
    description: 'The id of booking',
    required: true,
    type: 'string',
});
router.get('/:bookingid', VerifyToken, async (req, res) => {
    try {
        const controller = new BookingController();
        const data = await controller.getBooking(_.get(req, 'params.bookingid'));
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'get',
    common: { parameters: { path: ['bookingid'], header: ['token'] } },
    responses: {
        200: {
            description: 'get booking by bookingid response success',
            schema: GetBookingByIdResponse,
        },
        401: {
            description: 'get booking by bookingid auth validate',
            schema: AuthError,
        },
        422: {
            description: 'Get booking by bookingid error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Get booking by bookingid error from server',
            schema: ServerError,
        },
    },
});

swagger.common.parameters.addBody({
    name: 'UpdateBooking',
    description: 'Request update booking',
    schema: UpdateBookingRequest,
});
router.put('/:bookingid', VerifyToken, async (req, res) => {
    try {
        const controller = new BookingController();
        const data = await controller.updateBooking(_.get(req, 'params.bookingid'), req.body, UpdateBookingRequest);
        MessageHandler.handleSuccess(data, res);
    } catch (ex) {
        MessageHandler.handleError(ex, res);
    }
}).describe({
    summary: 'put',
    common: { parameters: { path: ['bookingid'], body: ['UpdateBooking'], header: ['token'] } },
    responses: {
        200: {
            description: 'Update booking by bookingid response success',
            schema: UpdateBookingResponse,
        },
        401: {
            description: 'Update booking by bookingid auth validate',
            schema: AuthError,
        },
        422: {
            description: 'Update booking by bookingid error validate',
            schema: ValidateError,
        },
        500: {
            description: 'Update booking by bookingid error from server',
            schema: ServerError,
        },
    },
});

module.exports = router;
