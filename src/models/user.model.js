import mongoose, { Schema } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';
import constants from '../config/constants';


const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Email la bat buoc'],
        trim: true,
        validate: {
            validator(email) {
                const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i;
                return emailRegex.test(email);
            },
            message: '{VALUE} khong dung dinh dang'
        }
    },
    username:{
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Mat khau la bat buoc!"],
        trim: true,
        minlength: [6, 'Mat khau phai dai hon 6 ky tu'],
        validate: {
            validator(password) {
                return password.length >= 6 && password.match(/\d+/g);
            }
        }
    },
    info: {
        fullname:{
          type: String
        },
        dateofbirth:{
            type: Date,
        },
        gender:{
            type: String,
            default: 'KHAC'
        },
        address: {
            type: String,
            trim: true
        },
        passportNumber: {
            type: String,
            trim: true,
            unique: true
        },
        phoneNumber: {
            type: String
        },
        photoProfile: {
            type: String
        },

    },
    resetPasswordToken: { // danh cho khoi phuc mat khau
        type: String,
        trim: true
    },
    resetPasswordExpires: {
        type: Date
    },
    role: {
        type: Number, // 1 Quan ly, 2 lai xe ,3 phu xe,  4 nhan vien giam sat
        default: 1
    },
    status: String // ACTIVE, DEACTIVE, SUSPENDED
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, {
    message: '{VALUE} da ton tai',
});

/*
 ** setup middleware mongoose cho hanh dong SAVE thi tu dong hash pass
 */
UserSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = this._hashPassword(this.password);
    }
    return next();
});

UserSchema.methods = {
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
    authenticateUser(password) {
        return compareSync(password, this.password);
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
                role: this.role
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
            email: this.email,
            token: `JWT ${this.createToken()}`,
        };
    },
    /**
   * Parse the user object in data we wanted to send
   *
   * @public
   * @returns {Object} User - ready for populate
   */
    // toJSON() {
    //     return {
    //         _id: this._id,
    //         token: this.createToken()
    //     };
    // },
}
export default mongoose.model('users', UserSchema);
