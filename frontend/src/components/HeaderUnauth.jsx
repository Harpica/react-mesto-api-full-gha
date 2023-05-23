import { Link } from 'react-router-dom';
import Logo from './Logo';

const HeaderAnauth = ({ linkText, linkPath }) => {
  return (
    <header className='header'>
      <div className='header__menu-container'>
        <Logo />
        <Link to={linkPath} className='header__link'>
          {linkText}
        </Link>
      </div>
    </header>
  );
};

export default HeaderAnauth;
