import React from 'react';
import PopupForm from './PopupForm';

const PopupWithForm = React.memo(({ isOpen, popupRef, name, ...props }) => {
  return (
    <section className={`popup ${name} ${isOpen ? 'popup_opened' : ''}`}>
      <div className='popup__container' ref={popupRef}>
        <PopupForm name={name} {...props} />
      </div>
    </section>
  );
});

export default PopupWithForm;
