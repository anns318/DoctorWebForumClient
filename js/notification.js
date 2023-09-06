const userId = userData.userId;
const connectionNotification = new signalR.HubConnectionBuilder()
  .configureLogging(signalR.LogLevel.None)
  .withUrl(`http://localhost:5057/notification?userId=${userId}`)
  .build();

connectionNotification
  .start()
  .then(function () {
    console.log("connected!");
  })
  .catch(function (err) {
    return console.error(err.toString());
  });

connectionNotification.on(
  "HaveNewNotification",
  function (postId, notification) {
    let a = document.createElement("a");
    a.className = "container-notify";
    a.href = `/post.html?id=${postId}`;
    a.innerHTML = `<div class="notification">${notification}</div>`;
    document.getElementById("container-notify-display").appendChild(a);
    $("#container-notify-display").fadeIn(200);
    setTimeout(() => {
      $("#container-notify-display").fadeOut(1500, () => {
        document.getElementById("container-notify-display").innerHTML = "";
      });
    }, 3000);
  }
);

function SendNotification(PostId) {
  console.log(PostId);
  const userAvatar =
    userData.avatar == "null"
      ? "http://localhost:5057/images/users/0.png"
      : "http://localhost:5057/" + userData.avatar;
  const userName = `${userData.firstName} ${userData.lastName}`;

  connectionNotification
    .invoke(
      "SendNotification",
      PostId.toString(),
      userData.userId.toString(),
      userName,
      userAvatar,
      "comment on your post",
      Date.now().toString()
    )
    .catch(function (err) {
      return console.error(err.toString());
    });
}

document
  .getElementById("comment-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const userId = userData.userId;
    const comment = document.getElementById("comment-text").value;
    console.log(userData);
    if (userId && comment) {
      const newComment = document.createElement("div");
      newComment.classList.add("comment");
      newComment.innerHTML = `
         <div class="comment">
            <img class="user-avatar" src="${
              userData.avatar
                ? `http://localhost:5057${userData.avatar}`
                : "http://localhost:5057/images/users/0.png"
            }" alt="">
            <div class="comment-content">
                <div class="user-comment-section">
                    <p class="comment-user">${userData.firstName} ${
        userData.lastName
      }</p>
                <p class="comment-text">${comment}</p>
                </div>
                <div class="user-comment-time">
                    <small>1 second ago</small>
                </div>
            </div>
        </div>
        `;

      const formData = { postId, userId, comment };

      const res = await PostAPI("http://localhost:5057/api/Comments", formData);

      if (res.status === 201) {
        document.querySelector(".comment-container").appendChild(newComment);
        document.getElementById("comment-text").value = "";

        const countCommentPost = document.querySelectorAll(".countCommentPost");

        countCommentPost.forEach((element) => {
          if (+element.getAttribute("countCommentPost") === postId) {
            element.textContent = +element.textContent + 1;
          }
        });
        SendNotification(postId);
      } else {
        alert("Something go wrong, please try again!");
      }
    }
  });

async function getNotificationByUser() {
  const userId = userData.userId;
  const data = await GetAPI(
    `http://localhost:5057/api/Notifications/User/${userId}`
  );

  if (data.length === 0) {
    return $("#notification-modal-body").html(
      `<small style="
    display: flex;
    justify-content: center;margin:10px 0" >You don't have notification</small>`
    );
  }
  const currentDateTime = Date.now();

  const dataHtml = data
    .map((x) => {
      const timeDifference = currentDateTime - new Date(x.createDate);

      return `
        <a class="container-notify" href="/post.html?id=${x.postId}">
            <div class="notification"><img src="http://localhost:5057/${
              x.fromUserAvatar
            }" alt="${x.fromUserAvatar}">
                <div class="notification-content">
                    <h3>${x.fromUserFullName} ${x.notificationContent}</h3>
                    <p id="notificationTime">${calculateTimeDiff(
                      timeDifference
                    )}</p>
                </div>
            </div>
        </a>
    `;
    })
    .join("");

  $("#notification-modal-body").html(dataHtml);
}
getNotificationByUser();
