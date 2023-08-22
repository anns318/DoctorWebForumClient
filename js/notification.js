const userId = userData.userId;
const connectionNotification = new signalR.HubConnectionBuilder()
  .withUrl(`https://localhost:7157/notification?userId=${userId}`)
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
    // setTimeout(() => {
    //   $("#container-notify-display").fadeOut(1500, () => {
    //     document.getElementById("container-notify-display").innerHTML = "";
    //   });
    // }, 2000);
  }
);

function SendNotification(PostId) {
  console.log(PostId);
  const userAvatar =
    userData.avatar == "null"
      ? "https://localhost:7157/images/users/0.png"
      : "https://localhost:7157/" + userData.avatar;
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

    if (userId && comment) {
      const newComment = document.createElement("div");
      newComment.classList.add("comment");
      newComment.innerHTML = `
         <div class="comment">
            <img class="user-avatar" src="${
              userData.userAvatar
                ? userData.userAvatar
                : "https://localhost:7157/images/users/0.png"
            }" alt="">
            <div class="comment-content">
                <p class="comment-user">${userData.firstName} ${
        userData.lastName
      }</p>
                <p class="comment-text">${comment}</p>
            </div>
        </div>
        `;

      const formData = { postId, userId, comment };

      const res = await PostAPI(
        "https://localhost:7157/api/Comments",
        formData
      );

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

let notificationArr = [];
async function getNotificationByUser() {
  const userId = userData.userId;
  const data = await GetAPI(``);
}
