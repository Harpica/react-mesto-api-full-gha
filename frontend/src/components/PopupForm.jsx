const PopupForm = ({
  name,
  onClose,
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
    <form
      className={`form ${name}__form`}
      name={`${name}-form`}
      onSubmit={handleSubmit}
    >
      <button
        className='button close-button'
        type='button'
        onClick={onClose}
      ></button>
      <h2 className='popup__title'>{title}</h2>
      <fieldset className='form__input-container'>
        {children}
        <button
          type='submit'
          className={`form__button ${isValid ? '' : 'form__button_disabled'}`}
          aria-label='Сохранить изменения'
          disabled={isValid ? false : true}
        >
          {isLoading ? buttonLoadingText : buttonText}
        </button>
      </fieldset>
    </form>
  );
};

export default PopupForm;
