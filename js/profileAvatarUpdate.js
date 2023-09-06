const avatarUpload = document.getElementById("avatar-upload");
const avatarPreview = document.getElementById("avatar-preview");
const avatarModal = document.getElementById("avatarModal");

let base64Image;

avatarModal.addEventListener("shown.bs.modal", () => {
  if (userData.avatar !== "null") {
    avatarPreview.src = `http://localhost:5057${userData.avatar}`;
    base64Image = null;
  }
  avatarPreview.style.display = "block";
});

avatarUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.src = e.target.result;
      base64Image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

const saveButton = document.getElementById("save-avatar");
saveButton.addEventListener("click", async () => {
  if (base64Image !== null) {
    console.log("Avatar saved!");
    const formData = {
      userId: +userData.userId,
      base64Image: base64Image,
    };
    console.log(
      "🚀 ~ file: profileAvatarUpdate.js:38 ~ saveButton.addEventListener ~ formData:",
      formData
    );
    const res = await PostAPI(
      `http://localhost:5057/api/Users/avatar/${userData.userId}`,
      formData
    );

    setCookie("jwt", res.data.jwt);
    alert("Avatar Updated");
    location.reload();
    return;
  }

  return console.log("nothing change");
});
