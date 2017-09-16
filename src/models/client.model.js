import mongoose, { Schema } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt-nodejs';
import uniqueValidator from 'mongoose-unique-validator';
import jwt from 'jsonwebtoken';
import constants from '../config/constants';

const ClientUserSchema = new Schema({
    phone: {
        type: String,
        unique: true
    },
    acount_payment: {
        balance: {
            type: Number,
            default: 0,
            min: 0
        },
        history_recharge: {
            type: Array
        },
        history_transaction: {
            type: Schema.Types.ObjectId,
            ref: 'tickets'
        }


    },
    info: {
        firstname: {
            type: String,
            required: [true, 'First name is required'],
            trim: true
        },
        lastname: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true
        },
        address: {
            type: String,
            trim: true
        }
    },
    local: {
        email: {
            type: String,
            required: [true, "email is importable and required"],
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is re quired"],
            trim: true,
            minlength: [6, 'Password must lenght'],
            validate: {
                validator(password) {
                    return password.length >= 6 && password.match(/\d+/g)
                },
                message: '{VALUE} is not a vaidl password',
            },
        },
        photo: {
            type: String,
            trim: true
        },
        resetPasswordToken: { // danh cho khoi phuc mat khau
            type: String,
            trim: true
        },
        resetPasswordExpires: {
            type: Date
        }

    },
    // facebook: {
    //     id: {
    //         type: String,
    //         trim: true
    //     },
    //     token: {
    //         type: String,
    //         trim: true
    //     },
    //     email: {
    //         type: String,
    //         trim: true
    //     },
    //     name: {
    //         type: String
    //     },
    //     photo: {
    //         type: String,
    //         trim: true
    //     }
    // },
    // google: {
    //     id: {
    //         type: String,
    //         trim: true,
    //     },
    //     token: {
    //         type: String,
    //         trim: true
    //     },
    //     email: {
    //         type: String,
    //         trim: true
    //     },
    //     name: {
    //         type: String
    //     },
    //     photo: {
    //         type: String,
    //         trim: true
    //     }
    // },
    scoreFriendly: {
        type: Number,
        default: 10
    },
    status: String // ACTIVE, DEACTIVE, SUSPENDED
}, { timestamps: true });

/*
 ** setup middleware mongoose cho hanh dong SAVE thi tu dong hash pass
 */
ClientUserSchema.plugin(uniqueValidator, {
    message: '{VALUE} da ton tai'
})
ClientUserSchema.pre('save', function (next) {
    if (this.isModified('local.password')) {
        this.local.password = this._hashPassword(this.local.password);
    }
    return next();
});

ClientUserSchema.methods = {
    /**
 * Bam mat khau nguoi dung
 *
 * @private
 * @param {String} password - password nguoi dung
 * @returns {String} password - password sau khi bam
 */
    _hashPassword(password) {
        return hashSync(password);
    },
    /**
  * Chung thuc user
  *
  * @public
  * @param {String} password - thuc hien hash pass
  * @returns {Boolean} isMatch - ket qua so sanh
  */
    authenticateClientUser(password) {
        return compareSync(password, this.local.password);
    },
    /**
  * Generate ra jwt token cho viec chung thuc nguoi dung
  *
  * @public
  * @returns {String} token - tra ve JWT token
  */
    createToken() {
        return jwt.sign(
            {
                _id: this._id,
            },
            constants.JWT_SECRET,
        );
    },
    /**
    * paser the user object in data we wanted to send when is auth
    *
    * @public
    * @returns {Object} User - ready for auth
     */
    toAuthJSON() {
        return {
            _id: this._id,
            email: this.local.email,
            token: `JWT ${this.createToken()}`,
        };
    },
    /**
   * Parse the user object in data we wanted to send
   *
   * @public
   * @returns {Object} User - ready for populate
   */
    toJSON() {
        return {
            _id: this._id,
            token: this.createToken()
        };
    },
}
export default mongoose.model('clients', ClientUserSchema);