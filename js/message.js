const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7157/chatHub")
  .build();

//Disable the send button until connection is established.
// document.getElementById("btn-sendMessages").disabled = true;
connection
  .start()
  .then(function () {
    document.getElementById("btn-sendMessages").disabled = false;
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

document
  .getElementById("form-message")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const userId = userData.userId;
    const user = `${userData.firstName} ${userData.lastName} (${userData.role})`;
    const message = document.getElementById("chatbox").value;

    connection
      .invoke("SendMessage", userId, user, message)
      .catch(function (err) {
        return console.error(err.toString());
      });
    event.preventDefault();
  });
