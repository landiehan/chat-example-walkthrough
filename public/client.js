const socket = io();
const form = document.querySelector('.message-form');
const input = document.querySelector('.message-input');
const messages = document.querySelector('.messages');

const loginContainer = document.querySelector('.login-container');
const loginForm = document.querySelector('.login');
const nameInput = loginForm.querySelector('input');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (nameInput.value) {
    socket.emit('add user', nameInput.value);
    loginContainer.classList.add('slide-out');
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value) {
    addSelfMessage(input.value);
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

function addSelfMessage(msg) {
  const item = document.createElement('li');
  item.classList.add('self-message');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}

socket.on('chat message', (msg) => addMessage(msg));
socket.on('system message', (msg) => addSystemMessage(msg));

function addSystemMessage(msg) {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}

function addMessage(msg) {
  const { user, content } = msg;

  const item = document.createElement('li');
  const fullItem = `
    <span class='msg-user'>
      ${user}
    </span>
    <span class='msg-content'>
      ${content}
    </span>
  `;
  item.innerHTML = fullItem;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}

const usersOnline = document.querySelector('.usersOnline');
socket.on('update users status', (users) => {
  while (usersOnline.firstChild) {
    usersOnline.removeChild(usersOnline.firstChild);
  }

  if (users.length <= 0) {
    return;
  }

  users.forEach((user) => {
    const item = document.createElement('li');
    item.textContent = user;
    usersOnline.appendChild(item);
  });
});
