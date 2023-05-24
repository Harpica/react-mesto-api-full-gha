import { SERVER_URL } from './constants';

class Api {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }
  _request(url, options) {
    return fetch(url, { ...options, credentials: 'include' }).then(
      this._checkResponse
    );
  }
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }
}

class AuthApi extends Api {
  constructor({ baseUrl, headers }) {
    super({ baseUrl, headers });
  }
  registerUser({ email, password }) {
    return this._request(`${this.baseUrl}/signup`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ email: email, password: password }),
    });
  }
  loginUser({ email, password }) {
    return this._request(`${this.baseUrl}/signin`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ email: email, password: password }),
    });
  }
  getUserData() {
    const request = this._request(`${this.baseUrl}/users/me`, {
      method: 'GET',
      headers: this.headers,
    });
    return request;
  }
}

class CardsApi extends Api {
  constructor({ baseUrl, headers }) {
    super({ baseUrl, headers });
  }
  postCard({ name, link }) {
    return this._request(`${this.baseUrl}/cards`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ name: name, link: link }),
    });
  }
  deleteCard(cardID) {
    return this._request(`${this.baseUrl}/cards/${cardID}`, {
      method: 'DELETE',
      headers: this.headers,
    });
  }
  getInitialCards() {
    return this._request(`${this.baseUrl}/cards`, { headers: this.headers });
  }
  setUserInfo(userName, about) {
    return this._request(`${this.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({ name: userName, about: about }),
    });
  }
  setUserAvatar(avatarLink) {
    return this._request(`${this.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({ avatar: avatarLink }),
    });
  }
  getUserInfo() {
    return this._request(`${this.baseUrl}/users/me`, { headers: this.headers });
  }
  likeCard(cardID) {
    return this._request(`${this.baseUrl}/cards/${cardID}/likes`, {
      method: 'PUT',
      headers: this.headers,
    });
  }
  removeLikeCard(cardID) {
    return this._request(`${this.baseUrl}/cards/${cardID}/likes`, {
      method: 'DELETE',
      headers: this.headers,
    });
  }
  changeLikeCardStatus(cardID, isLiked) {
    console.log(cardID, isLiked);
    return isLiked ? this.removeLikeCard(cardID) : this.likeCard(cardID);
  }
}
// Создадим объекты для общения с сервером
export const cardsApi = new CardsApi({
  baseUrl: `${SERVER_URL}`,
  headers: {
    'Access-Control-Request-Credentials': 'true',
    'Content-Type': 'application/json',
  },
});

export const authApi = new AuthApi({
  baseUrl: SERVER_URL,
  headers: {
    'Access-Control-Request-Credentials': 'true',
    'Content-Type': 'application/json',
  },
});
