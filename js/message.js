const openButton = document.getElementById("openButton");
const popup = document.getElementById("popup");
const chatArea = document.getElementById("messagesList");
const sendButton = document.getElementById("btn-sendMessages");

const connection = new signalR.HubConnectionBuilder()
  .configureLogging(signalR.LogLevel.None)
  .withUrl("http://localhost:5057/chatHub")
  .build();

//Disable the send button until connection is established.
// document.getElementById("btn-sendMessages").disabled = true;
connection
  .start()
  .then(async function () {
    document.getElementById("btn-sendMessages").disabled = false;
    await getOldMessage();
  })
  .catch(function (err) {
    return console.error(err.toString());
  });

connection.on("ReceiveMessage", function (userId, user, message) {
  console.log({ userId, user, message });
  document.getElementById("chatbox").value = "";
  const newMessageDiv = document.createElement("div");
  newMessageDiv.innerHTML = `<span>${user}: </span><span>${message}</span>`;

  const messagesList = document.getElementById("messagesList");
  messagesList.appendChild(newMessageDiv);

  // Scroll to the bottom of the messagesList
  messagesList.scrollTop = messagesList.scrollHeight;
});

async function getOldMessage() {
  const data = await GetAPI(`http://localhost:5057/api/Messages`);

  const dataHtml = data
    .map((x) => {
      return `<div><span>${x.firstName} ${x.lastName}: </span><span>${x.message}</span></div>`;
    })
    .join("");

  const messagesList = document.getElementById("messagesList");
  messagesList.innerHTML = dataHtml;

  console.log(messagesList.scrollHeight);
  messagesList.scrollTop = messagesList.scrollHeight;
}

document
  .getElementById("form-message")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const userId = userData.userId;
    const user = `${userData.firstName} ${userData.lastName}`;
    const messageInput = document.getElementById("chatbox");

    const message = messageInput.value;

    if (message.trim() !== "") {
      connection
        .invoke("SendMessage", userId, user, message)
        .catch(function (err) {
          return console.error(err.toString());
        });
      event.preventDefault();
      messageInput.value = "";
    }
  });

openButton.addEventListener("click", () => {
  if (popup.style.display === "block") {
    popup.style.display = "none"; // Hide the popup if it's already visible
  } else {
    popup.style.display = "block";
  }
});

sendButton.addEventListener("click", () => {});

document.getElementById("close-messenger").addEventListener("click", () => {
  popup.style.display = "none";
});
