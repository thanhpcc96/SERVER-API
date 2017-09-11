import httpStatus from 'http-status';

/**
* @extends Error
*/
class ExtendableError extends Error{
    constructor(message, status, isPublic){
        super(message);
        this.name= this.constructor.name;
        this.message= message;
        this.status= status;
        this.isPublic= isPublic;
        this.isOperational= true;
        Error.captureStackTrace(this, this.constructor.name);    
    }
}

/**
 * Class dai dien xu ly loi.
 *
 * @extends ExtendableError
 */
class APIError extends ExtendableError{
    /**
     * Tao  API xu ly loi
     * 
     * @param {String} message- Thong bao loi.
     * @param {Boolean} Status- HTTP status code of error
     * @param {Number} status-  Whether the message should be visible to user or not.
     */
    constructor(
        message,
        status = httpStatus.INTERNAL_SERVER_ERROR,
        isPublic = false,
      ) {
        super(message, status, isPublic);
      }
}
/**
 * Class for required error
 *
 * @class RequiredError
 */
export class RequiredError {
    /**
     * clean code lam cho Err dep hon :v 
     *
     * @static
     * @param {Array} errors - mang cac doi tuong err
     * @returns {Object} - errors - Object Error sau khi bien doi
     */
    static makePretty(errors) {
      return errors.reduce((obj, error) => {
        const nObj = obj;
        nObj[error.field] = error.messages[0].replace(/"/g, '');
        return nObj;
      }, {});
    }
  }
  
  export default APIError;