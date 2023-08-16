const jwt = getCookie("jwt");

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  try {
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

if (parseJwt(jwt) !== null) {
  window.location.href = "/";
}
