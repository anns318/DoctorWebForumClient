document.querySelector("#register").addEventListener("submit", async (e) => {
  e.preventDefault();
  const firstName = document.querySelector("#firstName").value;
  const lastName = document.querySelector("#lastName").value;

  const userName = document.querySelector("#username").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const confirmPassword = document.querySelector("#confirmPassword").value;

  if (password !== confirmPassword) {
    return alert("Confirm password not equal password");
  }

  let roleId = 0;
  document.querySelectorAll(".role").forEach((e) => {
    if (e.checked === true) {
      roleId = e.value;
      return;
    }
  });

  if (roleId === 0) {
    return alert("Please select role!");
  }
  const formData = {
    firstName,
    lastName,
    userName,
    email,
    hashedPassword: password,
    roleId,
  };

  const res = await PostAPI(
    "http://localhost:5057/api/Auth/Register",
    formData
  );

  console.log(res);
});
