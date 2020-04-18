/**
 * lodash is library handler array, object, function, collection, ...
 */
// import _ from 'lodash';

/**
 * ajv library
 */
import Ajv from 'ajv';

/**
 * booking model
 */
import BookingModel from '../model/BookingModel';

const ajv = new Ajv({ allErrors: true });

const bookingController = class BookingController {
    /**
     * initialize model
     */
    constructor() {
        this.model = new BookingModel();
    }
    /**
     * creat booking
     */
    async createBooking(requestBody, CreateBookingRequest) {
        const validate = ajv.compile(CreateBookingRequest);
        const valid = await validate(requestBody);
        if (!valid) {
            throw new Ajv.ValidationError(validate.errors);
        }

        return this.model.createBooking(requestBody);
    }

    /**
     * get list booking
     */
    async getList(requestQuery, GetListBookingRequest) {
        const validate = ajv.compile(GetListBookingRequest);
        const valid = await validate(requestQuery);
        if (!valid) {
            throw new Ajv.ValidationError(validate.errors);
        }

        const booking = await this.model.getList(requestQuery);

        return {
            totalRecord: 0,
            data: booking,
        };
    }

    /**
     * get booking by id
     */
    async getBooking(id) {
        return this.model.getBooking(id);
    }

    /**
     * update booking by id
     */
    async updateBooking(id, requestBody, UpdateBookingRequest) {
        const validate = ajv.compile(UpdateBookingRequest);
        const valid = await validate(requestBody);
        if (!valid) {
            throw new Ajv.ValidationError(validate.errors);
        }

        return this.model.updateBooking(id, requestBody);
    }
};
export default bookingController;
