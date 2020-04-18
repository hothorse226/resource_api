/**
 * lodash is library handler array, object, function, collection, ...
 */
import _ from 'lodash';

/**
 * connect database
 */
import Database from '../../../models/Database';

/**
 * initialize booking collection
 */
import BookingSchema from '../schema/BookingSchema';

/**
 * import clients schema
 */
import ClientSchema from '../../clients/schema/ClientSchema';

/**
 * import clients schema
 */
import ProjectSchema from '../../projects/schema/ProjectSchema';

/**
 * import client resources schema
 */
import ResourceSchema from '../../resources/schema/ResourcesSchema';
/**
 * catch error while save with method post
 */
BookingSchema.post('save', (error, doc, next) => {
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

export default class BookingModel extends Database {
    /**
     * constructor
     */
    constructor() {
        super();
        this.connect.model('clients', ClientSchema);
        this.connect.model('resources', ResourceSchema);
        this.connect.model('projects', ProjectSchema);
        // initialize model resource
        this.model = this.connect.model('booking', BookingSchema);
        this.modelResource = this.connect.model('resources', ResourceSchema);
    }

    /**
     * create resource
     */
    async createBooking(bookingData) {
        try {
            // time string has format look like this: 2019-04-22T08:00:00
            // const timeFrom = Date.parse(bookingData.time_from);
            // const timeEnd = Date.parse(bookingData.time_end);
            // if (
            //     isNaN(timeFrom) ||
            //     isNaN(timeEnd)
            // ) {
            //     throw new Error('the time format is not correct !');
            // }

            // if (Math.abs(timeEnd - timeFrom) / 36e5 > 9) {
            //     throw new Error('The time booking is greater then 8 hours !');
            // }

            // if (Math.abs(timeEnd - timeFrom) / 36e5 <= 0) {
            //     throw new Error('The time booking is greater then 8 hours !');
            // }
            if (bookingData.hours_per_day > 8) {
                throw new Error('Hours per day cannot greater than 8 hours !');
            }

            return this.model.create(bookingData);
        } catch (e) {
            throw e;
        }
    }

    /**
     * get booking by id
     */
    async getBooking(id) {
        try {
            return this.model.findById(id)
                .populate('resource_id')
                .populate('client_id')
                .populate('booker_id');
        } catch (e) {
            throw e;
        }
    }

    /**
     * get list booking
     */
    async getList(requestQuery) {
        try {
            const keySort = _.get(requestQuery, 'sort', 'name');

            const finalData = {};
            const resourcesData = [];
            const events = [];

            const dataResource = await this.modelResource.find({});
            dataResource.forEach((item) => {
                resourcesData.push({ id: item._id, name: item.nickName });
            });
            const dataEvent = await this.model.find({})
                .sort({
                    [keySort]: 'asc',
                });
            let i = 1;
            dataEvent.forEach((item) => {
                /* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */
                events.push(
                    {
                        id: i,
                        start: item.time_from,
                        end: item.time_end,
                        resourceId: item.booker_id,
                        title: 'title...',
                        bgColor: '#D9D9D9',
                        showPopover: false,
                    },
                );
                /* eslint no-plusplus: "error" */
                i += 1;
            });
            finalData.resources = resourcesData;
            finalData.events = events;

            return finalData;
        } catch (ex) {
            throw ex;
        }
    }

    /**
     * update booking by id
     */
    async updateBooking(id, body) {
        try {
            const booking = await this.model.findById(id);

            _.forEach(body, (value, key) => {
                _.set(booking, key, value);
            });

            return booking.save();
        } catch (e) {
            throw e;
        }
    }
}
