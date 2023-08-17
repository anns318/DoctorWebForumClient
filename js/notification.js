const userId = userData.userId;
const connectionNotification = new signalR.HubConnectionBuilder()
  .withUrl(`https://localhost:7157/notification?userId=${userId}`)
  .build();

connectionNotification
  .start()
  .then(function () {
    console.log("connected!");
    SendNotification(1);
  })
  .catch(function (err) {
    return console.error(err.toString());
  });

connectionNotification.on(
  "HaveNewNotification",
  function (postId, notification) {
    let div = document.createElement("div");
    div.className = "notification";
    div.innerHTML = notification;
    document.getElementById("container-notify").appendChild(div);
    $("#container-notify").fadeIn(200);
    setTimeout(() => {
      $("#container-notify").fadeOut(1000, () => {
        document.getElementById("container-notify").innerHTML = "";
      });
    }, 2000);
  }
);

function SendNotification(PostId) {
  const htmlNotification = `
                 <img src="${
                   userData.avatar == "null"
                     ? "https://localhost:7157/images/users/0.png"
                     : "https://localhost:7157/" + userData.avatar
                 }" alt="User 1">
                    <div class="notification-content">
                        <h3>${userData.firstName} ${
    userData.lastName
  } comment on your post</h3>
                        <p id="notificationTime">Just Now</p>
                    </div>
            `;

  connectionNotification
    .invoke(
      "SendNotification",
      PostId.toString(),
      htmlNotification,
      Date.now().toString()
    )
    .catch(function (err) {
      return console.error(err.toString());
    });
}
