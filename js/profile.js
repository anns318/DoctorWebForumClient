const userData = parseJwt(jwt);
console.log("🚀 ~ file: profile.js:2 ~ userData:", userData);
const urlParam = new URLSearchParams(document.location.search);
const userNameParam = urlParam.get("username");
// console.log("🚀 ~ file: profile.js:4 ~ userNameParam:", userNameParam);
let postData = [];
let postId = 0;
document.querySelector("#logout-btn").addEventListener("click", (e) => {
  e.preventDefault();
  deleteCookie("jwt");
  window.location.href = "login.html";
});

$("document").ready(async () => {
  domUserName();
  domUserAvatar();
  if (
    userNameParam !== null &&
    userNameParam.toLowerCase() !== userData.username.toLowerCase()
  ) {
    return getUserWhenHaveUrlParam();
  }
  getUserProfile();
  document.querySelector(".dashboard-img").addEventListener("click", () => {
    const updateAvatarBtn = document.querySelector("#update-avatar-btn");
    if (updateAvatarBtn.style.display === "none") {
      updateAvatarBtn.style.display = "block";
    } else {
      updateAvatarBtn.style.display = "none";
    }
  });

  document.getElementById("profile-container").style.display = "block";
  if (userData.role === "Doctor") {
    displayVerify();
  }
});

function displayVerify() {
  const verify = document.createElement("img");
  verify.src = `/images/verify2.png`;
  verify.id = "verify-image";
  document.querySelector("#profile-name").appendChild(verify);
}

async function getUserProfile() {
  getUserDetail();
  domProfileUser(userData.firstName, userData.lastName);
  await getPostData(userData.userId);
  DomPostData(postData);
  document.getElementById("profile-container").style.display = "block";
}
async function getUserWhenHaveUrlParam() {
  await getUserDetailByUserName();
}

async function getUserDetailByUserName() {
  const res = await GetAPI(
    `http://localhost:5057/api/Users/profile/${userNameParam}`
  );
  console.log("🚀 ~ file: profile.js:52 ~ getUserDetailByUserName ~ res:", res);

  if (res === 404) {
    document.querySelector(
      "#profile-container"
    ).innerHTML = `<p>User not found!</p>`;

    document.getElementById("profile-container").style.display = "block";
    return;
  }
  if (res.roleId === 2) {
    displayVerify();
  }
  document.querySelector(
    ".left-dashboard .dashboard-img"
  ).src = `http://localhost:5057/${res.avatarPath}`;
  document.querySelector(
    ".left-dashboard .left-dashboard-info h3"
  ).innerText = `${res.firstName} ${res.lastName}`;
  hideSetting();
  domUserInfo(res.userDetails);
  document.getElementById("profile-container").style.display = "block";

  await getPostData(res.id);
  DomPostData(postData);
}
function hideSetting() {
  $(".intro-bio > img").hide();
  $(".background-details #edit-information-icon").hide();

  $(".write-post-container").hide();
}
function domUserName() {
  $("#user-profile-name").text(`${userData.firstName} ${userData.lastName}`);
  $("#post-user-name").text(`${userData.firstName} ${userData.lastName}`);
}
function domProfileUser(firstName, lastName) {
  $(".left-dashboard-info h3").text(`${firstName} ${lastName}`);
  document.querySelector(
    ".comment-user"
  ).innerText = `${firstName} ${lastName}`;
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

  const res = await PostAPI("http://localhost:5057/api/Posts", formData);
  console.log(res);
  if (res.status === 201) {
    postData = [res.data, ...postData];
    // console.log(postData);
    DomPostData(postData);
    document.querySelector("#post-text-area").value = "";
    document.getElementById("img-preview").setAttribute("src", "");
  }
}
async function getPostData(userId) {
  const res = await GetAPI(`http://localhost:5057/api/Posts/user/${userId}`);
  postData = res;
}

function DomPostData(postData) {
  if (postData.length == 0) {
    return (document.querySelector(
      "#DOM-Post"
    ).innerHTML = `<p style="display: flex;margin-top:20px;justify-content: center;">You don't have any post</p>`);
  }
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
                            ? "http://localhost:5057/" + x.userAvatar
                            : "http://localhost:5057/images/users/0.png"
                        }" alt="">
                        <div>
                            <p>${x.firstName} ${x.lastName} </p>
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
                ? `<img src="http://localhost:5057/${x.imageUrl}" alt="">`
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
  let avatarUrl = "http://localhost:5057/images/users/0.png";
  if (userData.avatar !== "null") {
    avatarUrl = `http://localhost:5057/${userData.avatar}`;
  }

  document.querySelector(".profile-image>img").setAttribute("src", avatarUrl);
  document.querySelector("img.dashboard-img").setAttribute("src", avatarUrl);
  document.querySelectorAll(".user-profile .user-ava").forEach((e) => {
    e.setAttribute("src", avatarUrl);
  });
  document
    .querySelector("#comment-form img.user-avatar")
    .setAttribute("src", avatarUrl);
}

async function getDataComment(id) {
  postId = id;
  const data = await GetAPI(`http://localhost:5057/api/Posts/comment/${id}`);
  const commentContainer = document.querySelector(".comment-container");
  const currentDateTime = Date.now();

  const dataHtml = data
    .map((x) => {
      const timeDifference = currentDateTime - new Date(x.commentCreateDate);

      return `
        <div class="comment">
            <img class="user-avatar" src="${
              "http://localhost:5057/" + x.userAvatarPath
            }" alt="">
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
  commentContainer.innerHTML = dataHtml;
}

function clearCommentData() {
  const commentContainer = document.querySelector(".comment-container");
  commentContainer.innerHTML = ``;
  postId = 0;
}

async function getUserDetail() {
  const data = await GetAPI(
    `http://localhost:5057/api/UserDetails/${userData.userId}`
  );
  domUserInfo(data);
}

function domUserInfo(data) {
  if (data.intro.length === 0) {
    document.querySelector("#intro-text").innerHTML = `No introduction yet`;
  } else {
    document.querySelector("#intro-text").innerText = `${data.intro}`;
    document.querySelector("#intro-textarea").innerText = `${data.intro}`;
  }

  const backgroundDetails = document.querySelector(".background-details");

  if (
    data.workAt.length === 0 &&
    data.studyAt.length === 0 &&
    data.liveAt.length === 0 &&
    data.from.length === 0
  ) {
    const p = document.createElement("p");
    p.innerHTML = `<p style="display: flex;
    justify-content: center;">No information yet </p>`;
    return backgroundDetails.appendChild(p);
  }

  const userJob = document.createElement("a");
  const userStudy = document.createElement("a");
  const userLive = document.createElement("a");
  const userAt = document.createElement("a");
  userJob.innerHTML = `<i class="fas fa-briefcase"></i><p>Work at ${data.workAt}</p>`;
  userStudy.innerHTML = `<i class="fas fa-graduation-cap"></i><p>Studied at ${data.studyAt}</p>`;
  userLive.innerHTML = `<i class="fas fa-home"></i><p>Lives in ${data.liveAt}</p>`;
  userAt.innerHTML = `<i class="fas fa-map-marker-alt"></i><p>From ${data.from}</p> `;
  if (data.workAt.length > 0) {
    backgroundDetails.appendChild(userJob);
    document.querySelector("#workAt").value = `${data.workAt}`;
  }
  if (data.studyAt.length > 0) {
    backgroundDetails.appendChild(userStudy);
    document.querySelector("#studyAt").value = `${data.studyAt}`;
  }
  if (data.liveAt.length > 0) {
    backgroundDetails.appendChild(userLive);
    document.querySelector("#liveAt").value = `${data.liveAt}`;
  }
  if (data.from.length > 0) {
    backgroundDetails.appendChild(userAt);
    document.querySelector("#comeFrom").value = `${data.from}`;
  }
}

async function saveIntro() {
  let intro = document.querySelector("#intro-textarea").value;

  const res = await PutAPI(
    `http://localhost:5057/api/UserDetails/intro/${userData.userId}`,
    JSON.stringify({ intro })
  );
  if (res === 204) {
    alert("update intro success");

    $("#updateIntro").modal("hide");
    if (intro.length === 0) {
      intro = "No introduction yet";
    }
    document.querySelector("#intro-text").innerText = `${intro}`;
  }
}

async function saveInfo() {
  const workAt = document.querySelector("#workAt").value;
  const studyAt = document.querySelector("#studyAt").value;
  const liveAt = document.querySelector("#liveAt").value;
  const from = document.querySelector("#comeFrom").value;

  const res = await PutAPI(
    `http://localhost:5057/api/UserDetails/${userData.userId}`,
    JSON.stringify({ workAt, studyAt, liveAt, from })
  );
  if (res === 204) {
    alert("update information success");

    $("#updateProfile").modal("hide");
    const backgroundDetails = document.querySelector(".background-details");
    backgroundDetails.innerHTML = `<div style="position: relative;">
                            <h4>Information</h4>
                            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/OR6SzrfoMFg.png" id="edit-information-icon" data-bs-toggle="modal" data-bs-target="#updateProfile" />
                        </div>`;
    getUserDetail();
  }
}
