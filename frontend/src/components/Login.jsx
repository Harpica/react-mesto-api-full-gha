import LoginForm from './LoginForm';
import useForm from '../hooks/useForm';
import { Validator } from '../utils/validator';
import { TEXT_MINLENGTH } from '../utils/constants';

// New validator for each input field
const emailValidator = new Validator({
  minLength: TEXT_MINLENGTH,
  required: true,
});
const passwordValidator = new Validator({
  minLength: TEXT_MINLENGTH,
  required: true,
});

const Login = ({ onLogin, isLoading }) => {
  const { handleChange, values, errors, validities, isValid } = useForm({
    email: emailValidator,
    password: passwordValidator,
  });

  function handleSubmit() {
    onLogin(values);
  }

  return (
    <>
      <div className='login-container'>
        <LoginForm
          name='login'
          title='Вход'
          onSubmit={handleSubmit}
          buttonText='Войти'
          buttonLoadingText='Загрузка...'
          isLoading={isLoading}
          isValid={isValid}
        >
          <input
            type='text'
            className='form__input form__input_theme_black'
            id='input-email'
            name='email'
            placeholder='Email'
            minLength={TEXT_MINLENGTH}
            required
            value={values.email ?? ''}
            onChange={handleChange}
          />
          <span
            className={`popup__error ${
              !validities.email && 'popup__error_visible'
            }`}
            id='email-error'
          >
            {errors.email}
          </span>
          <input
            type='password'
            className='form__input form__input_theme_black'
            id='input-password'
            name='password'
            placeholder='Пароль'
            minLength={TEXT_MINLENGTH}
            required
            value={values.password ?? ''}
            onChange={handleChange}
          />
          <span
            className={`popup__error ${
              !validities.password && 'popup__error_visible'
            }`}
            id='password-error'
          >
            {errors.password}
          </span>
        </LoginForm>
      </div>
    </>
  );
};

export default Login;
