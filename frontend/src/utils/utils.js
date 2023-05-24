function clearCookies() {
  const cookies = document.cookie.split(';');
  cookies.forEach((cookie) => {
    document.cookie = cookie + '=; expires=' + new Date(0).toUTCString();
  });
}

export { clearCookies };
