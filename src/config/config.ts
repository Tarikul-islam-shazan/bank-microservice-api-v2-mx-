import * as dotenv from 'dotenv';
dotenv.config();

const config = require(`./env/${process.env.NODE_ENV}`) || {};

export default config;
