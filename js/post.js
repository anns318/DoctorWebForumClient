const userData = parseJwt(jwt);
console.log("🚀 ~ file: post.js:2 ~ userData:", userData);

const urlParam = new URLSearchParams(document.location.search);
const postId = urlParam.get("id");
let comment = [];

async function getPost() {
  const resPost = await GetAPI(`https://localhost:7157/api/Posts/${postId}`);

  const resComment = await GetAPI(
    `https://localhost:7157/api/Posts/comment/${postId}`
  );
  console.log();
  const inputDate = new Date(resPost.createDate);

  const options = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    inputDate
  );
  const htmlPost = `
<div class="user-profile-box">
                    <div class="user-profile">
                        <img src="https://localhost:7157${
                          resPost.userAvatar
                        }" alt="">
                        <div>
                            <p>${resPost.firstName} ${resPost.lastName}</p>
                            <small>${formattedDate}</small>
                        </div>
                    </div>
                    <div>
                        <a href="#"><i class="fas fa-ellipsis-v" aria-hidden="true"></i></a>
                    </div>
                </div>
                <div class="status-field">
                    <p>${resPost.title}</p>
                    ${
                      resPost.imageUrl
                        ? `<img src="https://localhost:7157${resPost.imageUrl}" alt="${resPost.id}">`
                        : ""
                    }
                </div>
                 <div class="post-reaction">
                    <div class="activity-icons">
                        <button type="button"class="btn" >
                            <div><img src="images/comments.png" alt="">
                                <div class="countCommentPost" countcommentpost="${
                                  resPost.id
                                }">${resComment.length}</div>Comment
                            </div>
                        </button>

                    </div>

                </div>
    `;
  document.querySelector("#post-content").innerHTML = htmlPost;

  const htmlComment = resComment
    .map((x) => {
      return `
            <div class="comment">
                            <img class="user-avatar" src="https://localhost:7157${x.userAvatarPath}" alt="${x.userId}">
                            <div class="comment-content">
                                <p class="comment-user">${x.userFirstName} ${x.userLastName}</p>
                                <p class="comment-text">${x.comment}
                                </p>
                            </div>
                        </div>
    `;
    })
    .join("");

  document.querySelector("#post-comment-section > div").innerHTML = htmlComment;
}
async function getCommentByPost() {}

getPost();
function domUserAvatar() {
  let avatarUrl = "https://localhost:7157/images/users/0.png";

  if (userData.avatar !== "null") {
    avatarUrl = `https://localhost:7157${userData.avatar}`;
  }
  document.querySelector(".profile-image>img").setAttribute("src", avatarUrl);
  document.querySelectorAll(".user-profile>img.user-ava").forEach((e) => {
    e.setAttribute("src", avatarUrl);
  });
  document
    .querySelector("#comment-form img.user-avatar")
    .setAttribute("src", avatarUrl);
}
domUserName();
domUserAvatar();
function domUserName() {
  $("#user-profile-name").text(`${userData.firstName} ${userData.lastName}`);
  $("#post-user-name").text(`${userData.firstName} ${userData.lastName}`);
  document.querySelector(
    ".comment-user"
  ).innerText = `${userData.firstName} ${userData.lastName}`;
}
