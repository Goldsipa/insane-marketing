function sendMessageSelf() {
  var messageWrapper = document.createElement('div');
  messageWrapper.classList.add('message-wrapper');

  var message = document.createElement('div');
  message.classList.add('message-self');
  message.classList.add('noselect');
  message.innerHTML = $('.phone').cleanVal() || '&nbsp';
  messageWrapper.appendChild(message);

  var content = document.querySelector('.content');
  content.appendChild(messageWrapper);
  content.scrollTop = content.scrollHeight;
  window.setTimeout(sendMessage, 700);
}
function sendMessage() {
  var messageWrapper = document.createElement('div');
  messageWrapper.classList.add('message-wrapper');

  var message = document.createElement('div');
  message.classList.add('message');
  message.classList.add('noselect');
  message.innerHTML = $('.phone').cleanVal() || '&nbsp';
  messageWrapper.appendChild(message);

  var content = document.querySelector('.content');
  content.appendChild(messageWrapper);
  content.scrollTop = content.scrollHeight;
}

document.querySelector('.button-send').onclick = sendMessageSelf;

$(document).ready(function(){
  $('.phone').mask('(000)000-0000');
  $('.phone').focus();
  // $('.phone').val("(0");
});