document.querySelector("#logout-btn").addEventListener("click", (e) => {
  e.preventDefault();
  deleteCookie("jwt");
  window.location.href = "login.html";
});
const userData = parseJwt(jwt);
let postData = [];
let postId = 0;
$("document").ready(async () => {
  domUserAvatar();
  domUserName();
  await getPostData();
  console.log("🚀 ~ file: index.js:9 ~ $ ~ userData:", userData);

  DomPostData(postData);
});

function domUserName() {
  $("#user-profile-name").text(`${userData.firstName} ${userData.lastName}`);
  $("#post-user-name").text(`${userData.firstName} ${userData.lastName}`);
  document.querySelector(
    ".comment-user"
  ).innerText = `${userData.firstName} ${userData.lastName}`;
}

function postAreaInputHandler(e) {
  if (e.value.length > 10) {
    document.getElementById("post-btn").classList.remove("disabled");
  } else {
    document.getElementById("post-btn").classList.add("disabled");
  }
}

async function postFormHandler() {
  const title = document.querySelector("#post-text-area").value;

  const formData = {
    title: title,
    imageUrl: imgUrl ? imgUrl : null,
    userId: userData.userId,
  };

  const res = await PostAPI("https://localhost:7157/api/Posts", formData);
  console.log(res);
  if (res.status === 201) {
    postData = [res.data, ...postData];
    console.log(postData);
    DomPostData(postData);
    document.querySelector("#post-text-area").value = "";
    document.getElementById("img-preview").setAttribute("src", "");
  }
}
async function getPostData() {
  const res = await GetAPI("https://localhost:7157/api/Posts");
  postData = res;
}

function DomPostData(postData) {
  const html = postData
    .map((x) => {
      const inputDate = new Date(x.createDate);

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

      return `
             <div postId="${
               x.id
             }" class=" status-field-container write-post-container">
                <div class="user-profile-box">
                    <div class="user-profile">
                        <img src="${
                          x.userAvatar
                            ? "https://localhost:7157" + x.userAvatar
                            : "https://localhost:7157/images/users/0.png"
                        }" alt="">
                        <div>
                            <p> ${x.lastName} ${x.firstName}</p>
                            <small>${formattedDate}</small>
                        </div>
                    </div>
                    <div>
                        <a href="#"><i class="fas fa-ellipsis-v"></i></a>
                    </div>
                </div>
                <div class="status-field">
                    <p>${x.title} </p>
                    
            ${
              x.imageUrl
                ? `<img src="https://localhost:7157${x.imageUrl}" alt="">`
                : ""
            }
                </div>
                <div class="post-reaction">
                    <div class="activity-icons">
                        <button type="button" onclick="getDataComment(${
                          x.id
                        })" class="btn" data-bs-toggle="modal" data-bs-target="#commentModal">
                            <div><img src="images/comments.png" alt=""><div class="countCommentPost" countCommentPost=${
                              x.id
                            }>${x.comments.length} </div>Comment</div>
                        </button>
                        
                    </div>
                    
                </div>
            </div>
        `;
    })
    .join("");
  document.querySelector("#DOM-Post").innerHTML = html;
}
let imgUrl;
function previewImage() {
  $("#img-preview").css("display", "block");
  var oFReader = new FileReader();
  oFReader.readAsDataURL(document.getElementById("uploadImage").files[0]);
  oFReader.onload = function (oFREvent) {
    // const img = document.createElement("img");
    imgUrl = oFREvent.target.result;
    document
      .getElementById("img-preview")
      .setAttribute("src", oFREvent.target.result);

    // document.getElementById("img-preview").innerHTML = img;
  };
}

function domUserAvatar() {
  let avatarUrl = "https://localhost:7157/images/users/0.png";

  if (userData.avatar !== "null") {
    avatarUrl = `https://localhost:7157${userData.avatar}`;
  }
  console.log(avatarUrl);
  document.querySelector(".profile-image>img").setAttribute("src", avatarUrl);
  document.querySelectorAll(".user-profile>img.user-ava").forEach((e) => {
    e.setAttribute("src", avatarUrl);
  });
  document
    .querySelector("#comment-form img.user-avatar")
    .setAttribute("src", avatarUrl);
}

async function getDataComment(id) {
  postId = id;
  const data = await GetAPI(`https://localhost:7157/api/Posts/comment/${id}`);
  const commentContainer = document.querySelector(".comment-container");

  const dataHtml = data
    .map((x) => {
      return `
        <div class="comment">
            <img class="user-avatar" src="${
              x.userAvatarPath
                ? x.userAvatarPath
                : "https://localhost:7157/images/users/0.png"
            }" alt="">
            <div class="comment-content">
                <p class="comment-user">${x.userFirstName} ${x.userLastName}</p>
                <p class="comment-text">${x.comment}</p>
            </div>
        </div>
    `;
    })
    .join("");
  commentContainer.innerHTML = dataHtml;
}

function clearCommentData() {
  const commentContainer = document.querySelector(".comment-container");
  commentContainer.innerHTML = ``;
  postId = 0;
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
      } else {
        alert("Something go wrong, please try again!");
      }
    }
  });
