import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import Logo from './Logo';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Header({ handleLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const currentUser = useContext(CurrentUserContext);

  const navigate = useNavigate();

  function handleMenuOnClick() {
    setIsOpen((prev) => !prev);
  }

  function handleLogOutClick() {
    handleLogout();
    navigate('/sign-in');
  }

  return (
    <header className='header'>
      <div className='header__menu-container'>
        <Logo />
        <button
          type='button'
          className={`button header__hamburger ${
            isOpen ? 'header__hamburger_active' : ''
          }`}
          onClick={handleMenuOnClick}
        />
      </div>
      <div
        className={`header__profile-container ${
          isOpen ? 'header__profile-container_active' : ''
        }`}
      >
        <p className='header__email'>
          {currentUser.email ? currentUser.email : 'email'}
        </p>
        <button
          className='button header__button'
          type='button'
          aria-label='Выйти из профиля'
          onClick={handleLogOutClick}
        >
          Выйти
        </button>
      </div>
    </header>
  );
}

export default Header;
