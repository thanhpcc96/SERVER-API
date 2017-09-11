/**
 * Error Handle cho api routes
 */
// eslint-disable-next-line no-unused-vars
import Raven from 'raven';
import PrettyError from 'pretty-error';
import httpStatus from 'http-status';

import constants from '../config/constants';
import APIError, { RequiredError } from './error';

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

// eslint-disable-next-line no-unused-vars
export default function LogErrorService(err, req, res, next) {
    if (!err) {
        return new APIError(
            'Error with server!',
            httpStatus.INTERNAL_SERVER_ERROR,
            true,
        );
    }
    if (isProd) {
        const raven = new Raven.Client(constants.RAVEN_ID);
        raven.captureException(err);
    }
    if (isDev) {
        const pe = new PrettyError();
        pe.skipNodeFiles();
        pe.skipPackage('express');
        // eslint-disable-next-line no-console
        console.log(pe.render(err));
    }
    const error = {
        message: err.message || "Internal Server Error",

    }

    if (err.errors) {
        error.error = {};
        const { errors } = err;
        if (Array.isArray(errors)) {
            error.errors = RequiredError.makePretty(errors);
        } else {
            Object.keys(errors).forEach(key => {
                error.errors[key] = errors[key].message;
            });
        }
    }
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json(error);
    return next();
}