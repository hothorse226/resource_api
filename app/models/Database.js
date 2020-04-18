import mongoose from 'mongoose';
import DatabaseConfig from '../../config/database';
/**
 * BaseModel - class: Manage DB client
 */
export default class Database {
    /**
     * Constructor
     * Create elasticSearch client instance
     */
    constructor() {
        this.connect = mongoose.createConnection(`mongodb://${DatabaseConfig.username}:${DatabaseConfig.password}@${DatabaseConfig.host}:${DatabaseConfig.port}/${DatabaseConfig.index}`);
        this.connect.on('error', (err) => {
            console.log(err);
            process.exit();
        });
        mongoose.Promise = global.Promise;
    }
}
