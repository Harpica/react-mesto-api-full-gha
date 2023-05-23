import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import isURL from 'validator/lib/isURL.js';
import bcrypt from 'bcrypt';
import UnauthorizedError from '../utils/errors/UnauthorizedError.js';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: [isURL, 'Value is not valid url'],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [isEmail, 'Value is not valid email'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.methods.getUserWithRemovedPassport = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.statics.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

userSchema.statics.validatePassword = function (password, hash) {
  return bcrypt.compareSync(password, hash);
};

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user || !this.validatePassword(password, user.password)) {
        throw new UnauthorizedError('Неверная почта или пароль');
      }
      const newUser = user.getUserWithRemovedPassport();
      return newUser;
    });
};

const User = mongoose.model('user', userSchema);
export default User;
