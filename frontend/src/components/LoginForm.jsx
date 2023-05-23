const LoginForm = ({
  name,
  title,
  onSubmit,
  isLoading,
  isValid,
  buttonText,
  buttonLoadingText,
  children,
}) => {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }
  return (
    <form className='form' name={`${name}-form`} onSubmit={handleSubmit}>
      <h2 className='form__title'>{title}</h2>
      <fieldset className='form__input-container'>{children}</fieldset>
      <button
        type='submit'
        className={`form__button form__button_theme_black ${
          isValid ? '' : 'form__button_theme_black_disabled'
        }`}
        aria-label='Сохранить изменения'
        disabled={isValid ? false : true}
      >
        {isLoading ? buttonLoadingText : buttonText}
      </button>
    </form>
  );
};

export default LoginForm;
