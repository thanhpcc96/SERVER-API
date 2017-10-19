/* no-used-vars */
require("dotenv").config();

const WHITELIST = {
  manager: {
    createUser: ["email", "username",'firstname','lastname','address','passport','phone','gender','dateofbirth'],
    deleteUser:["iduser"],
    updateInfo: ["firstname", "lastname","address",'dateofbirth','phone'],
    updatePassWord:['password','newpassword'],
    deleteClient: ["one", "list"],
    rechairCoin: ["idclient","amount"],
  },
  client: {
    register: ["firstname", "lastname", "phone", "email", "password"],
    resetPassword: ["email"],
    updateInfo: ["firstname", "lastname", "phone", "email", "address"],
    updatePassWord: ["password", "newpassword"]
  }
};
const devConfig = {
  JWT_SECRET: process.env.JWT_SECRET_DEV,
  MONGO_URL: process.env.MONGO_URL_DEV,
  REDIS_URL: process.env.REDIS_URI_DEV,
  MONGO_URL_JOB: process.env.MONGO_URI_JOB_DEV
};
const testConfig = {
  JWT_SECRET: process.env.JWT_SECRET_TEST,
  MONGO_URL: process.env.MONGO_URL_TEST,
  REDIS_URL: process.env.REDIS_URI_TEST,
  MONGO_URL_JOB: process.env.MONGO_URI_JOB_TEST
};

const prodConfig = {
  JWT_SECRET: process.env.JWT_SECRET_PROD,
  MONGO_URL: process.env.MONGO_URL_PROD,
  REDIS_URL: process.env.REDIS_URI_PROD,
  MONGO_URL_JOB: process.env.MONGO_URI_JOB_PROD
};
const defaultConfig = {
  PORT: process.env.PORT || 3000,
  RAVEN_ID: process.env.RAVEN_ID,
  WHITELIST
};

function envConfig(env) {
  switch (env) {
    case "development":
      return devConfig;
    case "test":
      return testConfig;
    default:
      return prodConfig;
  }
}
export default {
  ...defaultConfig,
  ...envConfig(process.env.NODE_ENV)
};
