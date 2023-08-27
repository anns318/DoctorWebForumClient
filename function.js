const userSettings = document.querySelector(".user-settings");

function UserSettingToggle() {
  userSettings.classList.toggle("user-setting-showup-toggle");
}
function notificationToggle() {
  document
    .querySelector("#notification-modal")
    .classList.toggle("notification-modal-showup-toggle");
}

// $(".container").on("click", () => {
//   userSettings.classList.forEach((e) => {
//     if (e === "user-setting-showup-toggle") {
//       userSettings.classList.remove("user-setting-showup-toggle");
//     }
//   });
// });

// var darkBtn = document.getElementById("dark-button");
// var LoadMoreBackground = document.querySelector(".btn-LoadMore");
// darkBtn.onclick = function(){
//     darkBtn.classList.toggle("dark-mode-on");
// }

// function darkModeON() {
//   darkBtn.classList.toggle("dark-mode-on");
//   document.body.classList.toggle("dark-theme");
// }

// function LoadMoreToggle() {
//   LoadMoreBackground.classList.toggle("loadMoreToggle");
// }
