const userData = parseJwt(jwt);
console.log("🚀 ~ file: post.js:2 ~ userData:", userData);

const urlParam = new URLSearchParams(document.location.search);
const postId = urlParam.get("id");
let comment = [];

async function getPost() {
  const resPost = await GetAPI(`http://localhost:5057/api/Posts/${postId}`);

  const resComment = await GetAPI(
    `http://localhost:5057/api/Posts/comment/${postId}`
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
                        <img src="http://localhost:5057/${
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
                        ? `<img src="http://localhost:5057/${resPost.imageUrl}" alt="${resPost.id}">`
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
  const currentDateTime = Date.now();
  const htmlComment = resComment
    .map((x) => {
      const timeDifference = currentDateTime - new Date(x.commentCreateDate);

      return `
            <div class="comment">
                            <img class="user-avatar" src="http://localhost:5057/${
                              x.userAvatarPath
                            }" alt="${x.userId}">
                            <div class="comment-content">
                <div class="user-comment-section">
                    <p class="comment-user">${x.userFirstName} ${
        x.userLastName
      }</p>
                <p class="comment-text">${x.comment}</p>
                </div>
                <div class="user-comment-time">
                    <small>${calculateTimeDiff(timeDifference)}</small>
                </div>
                
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
  let avatarUrl = "http://localhost:5057/images/users/0.png";

  if (userData.avatar !== "null") {
    avatarUrl = `http://localhost:5057/${userData.avatar}`;
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
