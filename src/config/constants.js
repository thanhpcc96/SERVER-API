/* no-used-vars */
require('dotenv').config();

const WHITELIST = {
    posts: {
        create: ['title', 'text'],
        update: ['title', 'text']
    },
    users: {
        create: ['email', 'username', 'password']
    },
};
const devConfig = {
    JWT_SECRET: process.env.JWT_SECRET_DEV,
    MONGO_URL: process.env.MONGO_URL_DEV,
    REDIS_URL: process.env.REDIS_URI_
};
const testConfig = {
    JWT_SECRET: process.env.JWT_SECRET_TEST,
    MONGO_URL: process.env.MONGO_URL_TEST,
    REDIS_URL: process.env.REDIS_URI_
};

const prodConfig = {
    JWT_SECRET: process.env.JWT_SECRET_PROD,
    MONGO_URL: process.env.MONGO_URL_PROD,
    REDIS_URL: process.env.REDIS_URI_
}
const defaultConfig = {
    PORT: process.env.PORT || 3000,
    RAVEN_ID: process.env.RAVEN_ID,
    WHITELIST,
};

function envConfig(env) {
    switch (env) {
        case 'development':
            return devConfig;
        case 'test':
            return testConfig;
        default:
            return prodConfig;
    }
}
export default {
    ...defaultConfig,
    ...envConfig(process.env.NODE_ENV)
};
