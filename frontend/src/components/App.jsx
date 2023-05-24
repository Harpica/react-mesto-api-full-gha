import { useState, useEffect, useCallback } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { Routes, Route } from 'react-router-dom';
import ProtectedRouteElement from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import Login from './Login';
import Register from './Register';
import Header from './Header';
import HeaderAnauth from './HeaderUnauth';
import Footer from './Footer';
import Main from './Main';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeletePopup from './DeletePopup';
import useLocalStorage from '../hooks/useLocalStorage';
import { cardsApi } from '../utils/api';
import { authApi } from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  // User states
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useLocalStorage('user', {});
  const [currentUser, setCurrentUser] = useState({});
  // Popup management
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipStatus, setTooltipStatus] = useState('');
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  // Cards
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);

  const navigate = useNavigate();
  const currentRoute = useLocation().pathname;

  const handleLoggedInCheck = useCallback(() => {
    setIsLoading(true);
    authApi
      .getUserData()
      .then(() => {
        setLoggedIn(true);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setIsLoading, setLoggedIn]);

  // Checking if browser already has token in localStorage (so user doesn't need to sign in)
  useEffect(() => {
    handleLoggedInCheck();
  }, [handleLoggedInCheck]);

  // If loggedIn === true, get info from the server
  useEffect(() => {
    if (loggedIn) {
      const getCardsPromise = cardsApi.getInitialCards();
      const getUserPromise = cardsApi.getUserInfo();
      const checkUserToken = authApi.getUserData(user.token);
      Promise.all([getCardsPromise, getUserPromise, checkUserToken])
        .then(([cardsData, userData, authUserData]) => {
          setCards(cardsData.data);
          setCurrentUser(userData.data);
          setCurrentUser((data) => ({
            ...data,
            email: authUserData.data.email,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user.token, loggedIn]);

  async function handleLogin(values) {
    setIsLoading(true);
    return authApi
      .loginUser(values)
      .then((res) => {
        setLoggedIn(true);
        setUser(res);
        navigate('/', { replace: true });
      })
      .catch((err) => {
        setTooltipOpen(true);
        setTooltipStatus('failure');
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }

  async function handleRegister(values) {
    setIsLoading(true);
    return authApi
      .registerUser(values)
      .then(() => {
        setTooltipStatus('success');
        setTooltipOpen(true);
        navigate('/sign-in');
      })
      .catch((err) => {
        setTooltipStatus('failure');
        setTooltipOpen(true);
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  function handleLogout() {
    authApi
      .logoutUser()
      .then(() => {
        setLoggedIn(false);
        setUser({});
      })
      .catch((err) => {
        setTooltipStatus('failure');
        setTooltipOpen(true);
        console.log(err);
      });
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleDeleteCardClick(card) {
    setIsDeletePopupOpen(true);
    setSelectedCard(card);
  }
  function handleCardClick(card) {
    setIsImagePopupOpen(true);
    setSelectedCard(card);
  }
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeletePopupOpen(false);
    setIsImagePopupOpen(false);
    setTooltipOpen(false);
    setSelectedCard({});
  }
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    cardsApi
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        console.log(newCard);
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard.data : c))
        );
      })
      .catch((err) => console.log(err));
  }
  function handleCardDelete(card) {
    setIsLoading(true);
    cardsApi
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }
  function handleUpdateUser(name, about) {
    setIsLoading(true);
    cardsApi
      .setUserInfo(name, about)
      .then((newUser) => {
        setCurrentUser((user) => ({
          ...user,
          name: newUser.data.name,
          about: newUser.data.about,
        }));
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }
  function handleUpdateAvatar(avatar) {
    setIsLoading(true);
    cardsApi
      .setUserAvatar(avatar)
      .then((newUser) => {
        setCurrentUser((state) => {
          state.avatar = newUser.data.avatar;
          return state;
        });
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }
  function handleAddPlaceSubmit(name, link) {
    setIsLoading(true);
    cardsApi
      .postCard({ name: name, link: link })
      .then((newCard) => {
        setCards([newCard.data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  return (
    <div className='root'>
      <CurrentUserContext.Provider value={currentUser}>
        {loggedIn ? (
          <Header handleLogout={handleLogout} />
        ) : (
          (currentRoute === '/sign-in' && (
            <HeaderAnauth linkText='Регистрация' linkPath='/sign-up' />
          )) ||
          (currentRoute === '/sign-up' && (
            <HeaderAnauth linkText='Войти' linkPath='/sign-in' />
          ))
        )}

        <Routes>
          <Route
            index
            path='/'
            element={
              isLoading ? (
                <></>
              ) : (
                <ProtectedRouteElement
                  statement={loggedIn === true}
                  redirect={'/sign-in'}
                >
                  <Main
                    cards={cards}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleDeleteCardClick}
                  />
                </ProtectedRouteElement>
              )
            }
          />
          <Route
            path='/sign-up'
            element={
              <ProtectedRouteElement
                statement={loggedIn === false}
                redirect={'/'}
              >
                <Register onRegister={handleRegister} isLoading={isLoading} />
              </ProtectedRouteElement>
            }
          />
          <Route
            path='/sign-in'
            element={
              <ProtectedRouteElement
                statement={loggedIn === false}
                redirect={'/'}
              >
                <Login onLogin={handleLogin} isLoading={isLoading} />
              </ProtectedRouteElement>
            }
          />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
        {/* секция попапа для изменения данных профиля  */}
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />
        {/* секция попапа для изменения аватара профиля */}
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        />
        {/* секция попапа для добавления картинки */}
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
        />
        {/* секция попапа для подтверждения удаления карточки */}
        <DeletePopup
          isOpen={isDeletePopupOpen}
          onClose={closeAllPopups}
          onCardDelete={handleCardDelete}
          isLoading={isLoading}
          card={selectedCard}
        />
        {/* секция попапа для увеличения изображения */}
        <ImagePopup
          isOpen={isImagePopupOpen}
          card={selectedCard}
          onClose={closeAllPopups}
        />
        {/* секция попапа для информации по авторизации */}
        <InfoTooltip
          isOpen={isTooltipOpen}
          onClose={closeAllPopups}
          status={tooltipStatus}
        />
        <Footer />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
