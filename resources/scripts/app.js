var timeouts = [];

function cancelTimeouts() {
  while(timeouts.length > 0) clearTimeout(timeouts.pop());
}

function playSound() {
  var sound = document.querySelector("#message-sound");
  sound.pause();
  sound.currentTime = 0;
  sound.play();
}

function sendMessageSelf(text) {
  var messageWrapper = document.createElement('div');
  messageWrapper.classList.add('message-wrapper');

  var message = document.createElement('div');
  message.classList.add('message-self');
  message.innerHTML = text || '&nbsp';
  messageWrapper.appendChild(message);

  var content = document.querySelector('.content');
  content.appendChild(messageWrapper);
  content.scrollTop = content.scrollHeight*2;
}

function sendMessage(text) {
  var messageWrapper = document.createElement('div');
  messageWrapper.classList.add('message-wrapper');

  var message = document.createElement('div');
  message.classList.add('message');
  message.innerHTML = text || '&nbsp';
  messageWrapper.appendChild(message);

  var content = document.querySelector('.content');
  content.appendChild(messageWrapper);
  content.scrollTop = content.scrollHeight*2;

  playSound();
}

function sendMessageInline(text, buttons, pretext='') {
  var messageWrapper = document.createElement('div');
  messageWrapper.classList.add('message-wrapper');

  if(pretext) {
    var preMessage = document.createElement('div');
    preMessage.classList.add('premessage-inline');
    preMessage.innerHTML = pretext || '&nbsp';
    messageWrapper.appendChild(preMessage);
  }

  var message = document.createElement('div');
  message.classList.add('message-inline');
  message.innerHTML = text || '&nbsp';
  messageWrapper.appendChild(message);

  for (var i = 0; i < buttons.length; i++) {
    if(buttons[i].link) {
      var button = document.createElement('a');
      button.classList.add('button-block');
      button.href = buttons[i].link;
      button.target = '_blank';
      button.innerHTML = buttons[i].text || '&nbsp';
      var arrow = document.createElement('img');
      arrow.src = './resources/images/arrow.png';
      arrow.alt = 'arrow';
      arrow.classList.add('button-arrow');
      button.appendChild(arrow);
    } else {
      var button = document.createElement('div');
      button.classList.add('button-block');
      button.innerHTML = buttons[i].text || '&nbsp';
      if(buttons[i].onclick) button.onclick = buttons[i].onclick;
    }
    messageWrapper.appendChild(button);
  }

  var content = document.querySelector('.content');
  content.appendChild(messageWrapper);
  content.scrollTop = content.scrollHeight*2;

  playSound();
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
    document.querySelector(target).value += message[index++];
    setTimeout(function () { showText(target, message, index, interval); }, interval);
  }
}

var sendClick = function () {
  sendMessageSelf($('#phone').val());
  $('#phone').val('');
  document.querySelector('.button-send').classList.remove('button-pending');
  document.querySelector('.button-send').onclick = null;
  $(document).off("keydown");
  blockSecond();
};

var sendNumberClick = function () {
  if(!($('.phone').cleanVal().length == 10)) return;
  sendMessageSelf($('.phone').cleanVal())
  $('#phone').val('');
  isTyping()
  window.setTimeout(isNotTyping, 700);
  window.setTimeout(function () {
    sendMessage('Мы обязательно с Вами свяжемся!');
  }, 1000);
}

function changeFieldToPhone() {
  document.querySelector('#phone').disabled = false;
  document.querySelector('#phone').placeholder = "Оставьте Ваш номер телефона для начала продвижения";
  $('.phone').val('');
  $('.phone').mask('(000)000-0000');
  document.querySelector('.button-send').onclick = sendNumberClick;
  $('#phone').on('keydown', function(e) {
    if (e.which == 13) {
      sendNumberClick();
    }
  });
}

function checkRedArrow() {
  var redArrow = document.querySelector('#red-arrow');
  if(!redArrow.classList.contains('hidden')) redArrow.classList.add('hidden');
}

function checkFooterGrown() {
  checkRedArrow();
  var messageField = document.querySelector('.message-field');
  var inputField = document.querySelector('#phone');
  var buttonSend = document.querySelector('.button-send');
  if(messageField.classList.contains('message-field-grow')) {
    messageField.classList.remove('message-field-grow');
    inputField.classList.remove('input-grow');
    buttonSend.classList.remove('button-grow');
  }
  if(!messageField.classList.contains('message-field-grown')) {
    messageField.classList.add('message-field-grown');
    inputField.classList.add('input-grown');
    buttonSend.classList.add('button-grown');
  }
}

function blockFirst() {
  var reply = 'Интересно...';
  isTyping()
  window.setTimeout(isNotTyping, 700);
  window.setTimeout(function () {
    sendMessage('Привет! <br/>\
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, provident consequatur illum cupiditate consequuntur, aspernatur optio eos inventore laudantium sequi officia repudiandae quasi eum voluptatibus obcaecati, fuga nemo. Deleniti, impedit.');
  }, 1000);
  var t1 = window.setTimeout(function () {
    var showTextDelay = 150;
    var t2 = window.setTimeout(function () {
      showText('#phone', reply, 0, showTextDelay);
    }, 1000)
    timeouts.push(t2);
    document.querySelector('.button-send').classList.add('button-grow');
    document.querySelector('#phone').classList.add('input-grow');
    document.querySelector('.message-field').classList.add('message-field-grow');
    var t3 = window.setTimeout(function () {
      document.querySelector('.button-send').classList.add('button-pending');
      document.querySelector('.button-send').onclick = sendClick;
      $(document).on('keydown', function(e) {
        if (e.which == 13) sendClick();
      });
    }, 1000 + reply.length*showTextDelay );
    timeouts.push(t3);
  }, 4000);
  timeouts.push(t1);
  var t4 = window.setTimeout(function () {
    document.querySelector('#red-arrow').classList.remove('hidden');
  }, 19000);
  timeouts.push(t4);
}

function blockSecond() {
  checkFooterGrown();
  window.setTimeout(isTyping, 200);
  window.setTimeout(isNotTyping, 1000);
  window.setTimeout(function () {
    sendMessageInline(
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur consequuntur perspiciatis facere rerum, nemo laborum. Hic quae magni vel libero, incidunt eligendi est, enim harum, sint quod commodi ea quos? Что бы вы хотели узнать?',
      [
        {text:'Как это работает?', onclick:blockTrird},
        {text:'Почему это эффективно?', onclick:blockTrird}
      ]
    );
    changeFieldToPhone();
  }, 1200);
}

function blockTrird() {
  checkFooterGrown();
  document.querySelector('.button-send').classList.remove('button-pending');
  cancelTimeouts();
  window.setTimeout(isTyping, 200);
  window.setTimeout(isNotTyping, 1000);
  window.setTimeout(function () {
    sendMessageInline(
      'Что ещё Вас интересует?',
      [
        {text:'Заказать продвижение', onclick:openPromotion},
        {text:'Узнать цену', onclick:getPrice},
        {text:'Наша бот-воронка', link:'http://www.google.com/'}
      ],
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur consequuntur perspiciatis facere rerum, nemo laborum.'
    );
    changeFieldToPhone();
  }, 1200);
}

function getPrice() {
  checkFooterGrown();
  document.querySelector('.button-send').classList.remove('button-pending');
  cancelTimeouts();
  window.setTimeout(isTyping, 200);
  window.setTimeout(isNotTyping, 1000);
  window.setTimeout(function () {
    sendMessageInline(
      'Что ещё Вас интересует?',
      [
        {text:'Заказать продвижение', onclick:openPromotion},
        {text:'Узнать цену', onclick:getPrice},
        {text:'Наша бот-воронка', link:'http://www.google.com/'}
      ],
      '<img src="./resources/images/send-button.png" alt="prices">'
    );
    changeFieldToPhone();
  }, 1200);
}

function checkCloseDropdown() {
  var dropdown = document.querySelector('.menu-dropdown');
  if (!dropdown.classList.contains('menu-dropdown-hidden')) toggleDropdown();
}

function openPromotion() {
  checkCloseDropdown();

  var promotion = document.querySelector('.promotion-wrapper');
  promotion.classList.remove('hidden');
}

var exitPromotion = function(e) {
  if (e.target !== this)
    return;
  var promotion = document.querySelector('.promotion-wrapper');
  promotion.classList.add('hidden');
}

var closePromotion = function() {
  var promotion = document.querySelector('.promotion-wrapper');
  promotion.classList.add('hidden');
}

function enterBot() {
  window.open("http://www.google.com/");
}

function openContacts() {
  checkCloseDropdown();

  var promotion = document.querySelector('.contacts-wrapper');
  promotion.classList.remove('hidden');
}

var toggleDropdown = function() {
  var dropdown = document.querySelector('.menu-dropdown');
  var menu = document.querySelector('.menu');
  if(dropdown.classList.contains('menu-dropdown-hidden')) {
    dropdown.classList.remove('menu-dropdown-hidden');
    menu.classList.add('menu-pressed');
  } else {
    dropdown.classList.add('menu-dropdown-hidden');
    menu.classList.remove('menu-pressed');
  }
}

var exitContacts = function(e) {
  if (e.target !== this)
    return;
  var promotion = document.querySelector('.contacts-wrapper');
  promotion.classList.add('hidden');
}

var closeContacts = function() {
  var promotion = document.querySelector('.contacts-wrapper');
  promotion.classList.add('hidden');
}

function assignDropdown() {
  var dropDownItems = document.querySelectorAll('.menu-dropdown li');
  dropDownItems[0].onclick = blockTrird;
  dropDownItems[1].onclick = getPrice;
  dropDownItems[2].onclick = openPromotion;
  dropDownItems[3].onclick = enterBot;
  dropDownItems[4].onclick = openContacts;
}

$(document).ready(function(){
  cancelTimeouts(); // To prevent bug after reloading page
  document.querySelector('#phone').value = '';
  document.querySelector('#phone').disabled = true;
  document.querySelector('.menu').onclick = toggleDropdown;
  document.querySelector('.promotion-wrapper').onclick = exitPromotion;
  document.querySelector('.promotion-close').onclick = closePromotion;
  document.querySelector('.contacts-wrapper').onclick = exitContacts;
  document.querySelector('.contacts-close').onclick = closeContacts;
  assignDropdown();
  blockFirst();
  // blockTrird();
  
});

var menu = $('.menu');
var dropdown = $('.menu-dropdown');
$(document).mouseup(function(e) {
  if (!menu.is(e.target) // if the target of the click isn't the container...
  && menu.has(e.target).length === 0 // ... nor a descendant of the container
  && !dropdown.is(e.target) ) // ... nor the dropdown...
  {
    checkCloseDropdown()
  }
});