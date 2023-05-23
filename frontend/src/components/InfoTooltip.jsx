import useEscapeKey from '../hooks/useEsc';
import useOutsideClick from '../hooks/useOutsideClick';
import failure from '../images/failure.svg';
import success from '../images/success.svg';

const tooltipStatus = {
  success: {
    text: 'Вы успешно зарегистрировались!',
    image: success,
  },
  failure: {
    text: 'Что-то пошло не так! Попробуйте ещё раз.',
    image: failure,
  },
};

const InfoTooltip = ({ isOpen, onClose, status }) => {
  useEscapeKey(onClose, isOpen);
  const ref = useOutsideClick(onClose, isOpen);

  const image = tooltipStatus[status]?.image;
  const text = tooltipStatus[status]?.text;

  return (
    <section className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className='popup__container' ref={ref}>
        <img className='popup__icon' src={image} alt='Информационная иконка' />
        <p className='popup__info'>{text}</p>
        <button
          className='button close-button'
          type='button'
          onClick={onClose}
        />
      </div>
    </section>
  );
};

export default InfoTooltip;
