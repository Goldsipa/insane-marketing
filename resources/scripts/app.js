function sendMessageSelf(text) {
  var messageWrapper = document.createElement('div');
  messageWrapper.classList.add('message-wrapper');

  var message = document.createElement('div');
  message.classList.add('message-self');
  message.classList.add('noselect');
  message.innerHTML = text || '&nbsp';
  messageWrapper.appendChild(message);

  var content = document.querySelector('.content');
  content.appendChild(messageWrapper);
  content.scrollTop = content.scrollHeight;

  // isTyping()
  // window.setTimeout(isNotTyping, 800);
  // window.setTimeout(function () {
  //   sendMessage(text);
  // }, 1000);
}

function sendMessage(text) {
  var messageWrapper = document.createElement('div');
  messageWrapper.classList.add('message-wrapper');

  var message = document.createElement('div');
  message.classList.add('message');
  message.classList.add('noselect');
  message.innerHTML = text || '&nbsp';
  messageWrapper.appendChild(message);

  var content = document.querySelector('.content');
  content.appendChild(messageWrapper);
  content.scrollTop = content.scrollHeight;
}

function sendMessageInline(text, buttons) {
  var messageWrapper = document.createElement('div');
  messageWrapper.classList.add('message-wrapper');

  var message = document.createElement('div');
  message.classList.add('message-inline');
  message.classList.add('noselect');
  message.innerHTML = text || '&nbsp';
  messageWrapper.appendChild(message);

  for (var i = 0; i < buttons.length; i++) {
    var button = document.createElement('div');
    button.classList.add('button-block');
    button.classList.add('noselect');
    button.innerHTML = buttons[i] || '&nbsp';
    button.onclick = blockTrird;
    messageWrapper.appendChild(button);
  }

  var content = document.querySelector('.content');
  content.appendChild(messageWrapper);
  content.scrollTop = content.scrollHeight;
}

function isTyping() {
  document.querySelector('.bot-label').classList.add('hidden');
  document.querySelector('.typing-wrapper').classList.remove('hidden');
}
function isNotTyping() {
  document.querySelector('.typing-wrapper').classList.add('hidden');
  document.querySelector('.bot-label').classList.remove('hidden');
}

var showText = function (target, message, index, interval) {   
  if (index < message.length) {
    document.querySelector('input').value += message[index++];
    setTimeout(function () { showText(target, message, index, interval); }, interval);
  }
}

var sendClick = function () {
  sendMessageSelf($('input').val());
  $('input').val('');
  document.querySelector('.button-send').classList.remove('button-pending');
  document.querySelector('.button-send').onclick = null;
  $(document).off("keydown");
  blockSecond();
};

var sendNumberClick = function () {
  if(!($('.phone').cleanVal().length == 10)) return;
  sendMessageSelf($('.phone').cleanVal())
  $('input').val('');
  isTyping()
  window.setTimeout(isNotTyping, 700);
  window.setTimeout(function () {
    sendMessage('Мы обязательно с Вами свяжемся!');
  }, 1000);
}

function blockFirst() {
  isTyping()
  window.setTimeout(isNotTyping, 700);
  window.setTimeout(function () {
    sendMessage('Привет! Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, provident consequatur illum cupiditate consequuntur, aspernatur optio eos inventore laudantium sequi officia repudiandae quasi eum voluptatibus obcaecati, fuga nemo. Deleniti, impedit.');
  }, 1000);
  window.setTimeout(function () {
    showText("input", "Интересно...", 0, 40);
    document.querySelector('.button-send').classList.add('button-pending');
    document.querySelector('.button-send').onclick = sendClick;
    $(document).on('keydown', function(e) {
      if (e.which == 13) {
        sendClick();
      }
    });
  }, 1500);
}

function blockSecond() {
  window.setTimeout(isTyping, 200);
  window.setTimeout(isNotTyping, 1000);
  window.setTimeout(function () {
    sendMessageInline(
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur consequuntur perspiciatis facere rerum, nemo laborum. Hic quae magni vel libero, incidunt eligendi est, enim harum, sint quod commodi ea quos? Что бы вы хотели узнать?',
      ['Как это работает?', 'Почему это эффективно?']
    );
  }, 1200);
}

function blockTrird() {
  window.setTimeout(isTyping, 200);
  window.setTimeout(isNotTyping, 1000);
  window.setTimeout(function () {
    sendMessageInline(
      'Что ещё Вас интересует?',
      ['Заказать продвижение', 'Узнать цену', 'Наша бот-воронка']
    );
    document.querySelector('input').disabled = false;
    document.querySelector('input').placeholder = "(XXX)XXX-XXXX";
    $('.phone').mask('(000)000-0000');
    $('.phone').focus();
    document.querySelector('.button-send').onclick = sendNumberClick;
    $('input[type=text]').on('keydown', function(e) {
      if (e.which == 13) {
        sendNumberClick();
      }
    });
  }, 1200);
}

$(document).ready(function(){
  document.querySelector('input').disabled = true;

  blockFirst();
  // blockTrird();
});