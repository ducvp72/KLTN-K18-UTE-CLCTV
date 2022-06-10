const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL
// const { username, room } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });

// console.log("username", username);
// console.log("room", room);

let socket;
let roomId;
let userType;

const changeUser = async () => {
  roomId = document.getElementById("roomId").value;
  const token = document.getElementById("userId").value;

  if (token.length < 10 || token.length > 50) {
    alert("Input id User !!!!!!!!!");
    return;
  }

  // socket = io("https://socket-ute-v2.herokuapp.com", {
  //   extraHeaders: { Authorization: `Bearer ${token}` },
  // });
  // http://localhost:8000
  //https://socket-ute-v2.herokuapp.com
  // http://nodejsapi.eastasia.cloudapp.azure.com:8000

  //sua duong link o day
  socket = await io("http://mmchatappea-api.eastasia.cloudapp.azure.com:8000", {
    transports: ["polling"],
    reconnectionDelayMax: 10000,
    auth: { userId: token },
  });

  setTimeout(() => {
    socket.emit("room:info", roomId);
  }, 500);

  socket.on("connect_error", (err) => {
    document.getElementById("err").innerHTML = err.toString();
    setTimeout(() => {
      document.getElementById("err").innerHTML = "";
    }, 3000);
    // console.log(err.toString());
  });

  socket.on("connect", () => {
    console.log("Your socket id: ", socket.id);

    //Listen Message from server
    socket.on("room:chat", (message) => {
      console.log("ON EVENT - room:chat", message);
      outputMessage(message);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on("room:getout", ({ roomId }) => {
      adminKickRoom(roomId);
    });

    //getUserInfo with socket
    socket.on("user:getUserInfo", (userInfo) => {
      console.log("userInfo", userInfo);
    });

    // Get room and users
    socket.on("room:info", ({ room, users }) => {
      console.log("CLIENT ON EVENT - room:info");
      outputRoomName(room);
      outputUsers(users);
    });

    //notification if in this room
    socket.on("room:inRoom", (memo) => {
      alert(memo);
    });

    //notificatition invite
    // socket.on("room:invite", ({ status, message }) => {
    //   inviteSpecialRoom(status, message);
    // });
  });
};

// socket.on("room:invite", ({ roomId }) => {
//   socket.join(roomId);
// });

// Join chatroom
const changeRoom = () => {
  const roomId = document.getElementById("roomId").value;
  socket.emit("room:join", roomId);
  console.log("roomId", roomId);
};

const adminKickRoom = (roomId) => {
  console.log(`M bi admin kick roi con ${roomId}`);
  setTimeout(() => {
    socket.emit("room:kickByAdmin", roomId);
  }, 500);
  // socket.emit("room:out", roomId);
};

const leaveSpecialRoom = () => {
  const roomId = document.getElementById("roomId").value;
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    socket.emit("room:out", roomId);
    document.getElementById("roomId").value = "";
    console.log("You out this room: ", roomId);
  } else {
    // alert("some thing was wrong please try again");
    return;
  }
};

const inviteSpecialRoom = (status, message) => {
  const roomId = document.getElementById("roomId").value;
  if (status) {
    alert(`${message}`);
  } else {
    alert("some thing was wrong please try again");
    return;
  }
};

const kickUser = () => {
  const userId = document.getElementById("deleteId").value;
  const roomId = document.getElementById("roomId").value;
  console.log("userId", userId);
  console.log("roomId", roomId);
  socket.emit("room:kick", { userId, roomId });
};

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  console.log(msg);
  if (!msg) {
    return false;
  }

  const id = document.getElementById("userId").value;
  const roomId = document.getElementById("roomId").value;

  //Fake response
  const message = {
    text: msg,
    image: null,
    video: null,
    createdAt: `${new Date()}`,
    updatedAt: `${new Date()}`,
    _id: new Date(),
    typeId: new Date().getTime(),
    user: {
      avatar:
        "https://res.cloudinary.com/kltn-k18-dl/image/upload/v1650966158/myGallary/azusjmrzhfmyzku9idpc.jpg",
      name: id,
      _id: id,
    },
  };

  outputMessage(message);

  socket.emit("room:chat", {
    roomId,
    message,
  });

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function sendTypingStatus(e) {
  console.log(e.target.value);
}

// document.getElementById("msg").addEventListener("change", function () {
//   console.log(roomId);
//   if (this.value.length > 1) {
//     console.log("You selected: ", this.value);
//   }
//   socket.emit("room:typing", roomId);
//   console.log("ok");
// });

// Output message to DOM

function outputMessage(message) {
  // console.log("Message", message);
  const div = document.createElement("div");
  div.classList.add("message");

  div.innerHTML = `<p class="meta">${
    message.user.name
  } <span>${new Date()}</span></p>
  <p class="text">${message.text}</p>`;

  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.info.userName;
    userList.appendChild(li);
  });
}
