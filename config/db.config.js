require('dotenv').config();

module.exports = {
    HOST: process.env.MONGO_DB_HOST,
    PORT: process.env.MONGO_DB_PORT,
    DB: process.env.MONGO_DB_NAME,
}