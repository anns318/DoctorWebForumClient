document.querySelector("#login").addEventListener("submit", async (e) => {
  e.preventDefault();

  const userName = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  console.log({ userName, password });

  const req = await fetch("https://localhost:7157/api/Auth/Login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, password }),
  });
  const status = await req.status;
  const res = await req.json();

  if (status === 200) {
    setCookie("jwt", res.jwt);
    window.location.href = "/";
  }

  if (status === 401) {
    alert("Username or password is wrong!");
  }
});
