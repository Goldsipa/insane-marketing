///////////////////////////////////////////////////////////
//////////////// message sending functions ////////////////
///////////////////////////////////////////////////////////

//////////////// utils ////////////////

// block where messages are appended
var content = document.querySelector('.content');

function createMessageWrapper() {
  var mw = document.createElement('div');
  mw.classList.add('message-wrapper');
  return mw;
}

function createMessage(text, className) {
  var m = document.createElement('div');
  m.classList.add(className);
  m.innerHTML = text || '&nbsp';
  return m;
}

function playSound() {
  var sound = document.querySelector("#message-sound");
  sound.pause();
  sound.currentTime = 0;
  sound.play().catch( error => console.log(error.message) );
}

function scrollToTop() {
  content.scrollTop = content.scrollHeight*2;
}

// creates link button for inline message
function createLinkButton(link, text) {
  var button = document.createElement('a');
  button.classList.add('button-block');
  button.href = link;
  button.target = '_blank';
  button.innerHTML = text || '&nbsp';
  var arrow = document.createElement('img');
  arrow.src = './resources/images/arrow.png';
  arrow.alt = 'arrow';
  arrow.classList.add('button-arrow');
  button.appendChild(arrow);
  return button;
}

//////////////// self message ////////////////

function sendMessageSelf(text) {
  var messageWrapper = createMessageWrapper();

  var message = createMessage(text, 'message-self');
  messageWrapper.appendChild(message);

  content.appendChild(messageWrapper);
  scrollToTop();
}

//////////////// simple message ////////////////

function sendMessage(text) {
  var messageWrapper = createMessageWrapper();

  var message = createMessage(text, 'message');
  messageWrapper.appendChild(message);

  content.appendChild(messageWrapper);

  scrollToTop();
  playSound();
}

//////////////// message with premessage and buttons ////////////////

function sendMessageInline(text, buttons, pretext='') {
  var messageWrapper = createMessageWrapper();

  if(pretext) {
    var preMessage = createMessage(pretext, 'premessage-inline');
    messageWrapper.appendChild(preMessage);
  }

  var message = createMessage(text, 'message-inline');
  messageWrapper.appendChild(message);

  for (var i = 0; i < buttons.length; i++) {
    if(buttons[i].link) {
      var button = createLinkButton(buttons[i].link, buttons[i].text);
    } else {
      var button = document.createElement('div');
      button.classList.add('button-block');
      button.innerHTML = buttons[i].text || '&nbsp';
      if(buttons[i].onclick) button.onclick = buttons[i].onclick;
    }
    messageWrapper.appendChild(button);
  }

  content.appendChild(messageWrapper);

  scrollToTop();
  playSound();
}



///////////////////////////////////////////////////////
//////////////// menu & dropdown items ////////////////
///////////////////////////////////////////////////////

//////////////// menu & dropdown ////////////////

var dropdown = document.querySelector('.menu-dropdown');
var menu = document.querySelector('.menu');

var toggleDropdown = function() {
  if(dropdown.classList.contains('menu-dropdown-hidden')) {
    dropdown.classList.remove('menu-dropdown-hidden');
    menu.classList.add('menu-pressed');
  } else {
    dropdown.classList.add('menu-dropdown-hidden');
    menu.classList.remove('menu-pressed');
  }
}

function checkCloseDropdown() {
  if (!dropdown.classList.contains('menu-dropdown-hidden')) toggleDropdown();
}

//////////////// promotion ////////////////

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

//////////////// enter bot ////////////////

function enterBot() {
  window.open("http://www.google.com/");
}

//////////////// contacts ////////////////

function openContacts() {
  checkCloseDropdown();

  var promotion = document.querySelector('.contacts-wrapper');
  promotion.classList.remove('hidden');
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



//////////////////////////////////////////////////
//////////////// blocks & get price //////////////
//////////////////////////////////////////////////

//////////////// utils ////////////////

// array with setTimeouts to cancel if needed
var timeouts = [];

// canceles all setTimeouts
function cancelTimeouts() {
  while(timeouts.length > 0) clearTimeout(timeouts.pop());
}

// starts 'is typing' animation
function isTyping() {
  document.querySelector('.bot-label').classList.add('hidden');
  document.querySelector('.typing-wrapper').classList.remove('hidden');
}

// stops 'is typing' animation
function isNotTyping() {
  document.querySelector('.typing-wrapper').classList.add('hidden');
  document.querySelector('.bot-label').classList.remove('hidden');
}

// starts and stops 'is typing' animation after delay
function isTypingIsNotTyping(delayIs, delayIsNot) {
  window.setTimeout(isTyping, delayIs);
  window.setTimeout(isNotTyping, delayIsNot);
}

// collects user's phone number
var sendNumberClick = function () {
  if(!($('.phone').cleanVal().length == 10)) return;

  sendMessageSelf($('.phone').cleanVal())

  $('#phone').val('');

  isTypingIsNotTyping(0, 700);
  window.setTimeout(function () {
    sendMessage('Мы обязательно с Вами свяжемся!');
  }, 1000);
}

// changes input to masked input for phone number
function changeFieldToPhone() {
  document.querySelector('#phone').disabled = false;
  document.querySelector('#phone').placeholder = "Оставьте Ваш номер телефона для начала продвижения";

  $('.phone').val('');
  $('.phone').mask('(000)000-0000');
  $('#phone').on('keydown', function(e) {
    if (e.which == 13) sendNumberClick();
  });

  document.querySelector('.button-send').onclick = sendNumberClick;
}

// removes red arrow
function checkRedArrow() {
  var redArrow = document.querySelector('#red-arrow');
  if(!redArrow.classList.contains('hidden')) redArrow.classList.add('hidden');
}

// checks if footer has grown (in case original flow is disrupted)
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
    buttonSend.classList.remove('button-pending');
  }
}

//////////////// first block ////////////////

// adds text letter by letter
var showText = function (target, message, index, interval) {   
  if (index < message.length) {
    document.querySelector(target).value += message[index++];
    var t = setTimeout(function () { showText(target, message, index, interval); }, interval);
    timeouts.push(t);
  }
}

// onclick event of first block
var sendClick = function () {
  sendMessageSelf($('#phone').val());

  $('#phone').val('');
  document.querySelector('.button-send').onclick = null;

  $(document).off("keydown");

  blockSecond();
};

function blockFirst() {
  isTypingIsNotTyping(0, 700);
  window.setTimeout(function () {
    sendMessage('Привет! <br/>\
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, provident consequatur illum cupiditate consequuntur, aspernatur optio eos inventore laudantium sequi officia repudiandae quasi eum voluptatibus obcaecati, fuga nemo. Deleniti, impedit.');
  }, 1000);

  var reply = 'Интересно...';
  var showTextDelay = 150;
  
  var t1 = window.setTimeout(function () {
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

//////////////// second block ////////////////

function blockSecond() {
  cancelTimeouts();
  checkFooterGrown();
  isTypingIsNotTyping(200, 1000);

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

//////////////// third block ////////////////

function blockTrird() {
  cancelTimeouts();
  checkFooterGrown();
  isTypingIsNotTyping(200, 1000);

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

//////////////// get price block ////////////////

function getPrice() {
  cancelTimeouts();
  checkFooterGrown();
  isTypingIsNotTyping(200, 1000);
  
  window.setTimeout(function () {
    sendMessageInline(
      'Что ещё Вас интересует?',
      [
        {text:'Заказать продвижение', onclick:openPromotion},
        {text:'Узнать цену', onclick:getPrice},
        {text:'Наша бот-воронка', link:'http://www.google.com/'}
      ],
      '<img src="./resources/images/send-button.png" alt="prices" onload="scrollToTop()">'
    );
    changeFieldToPhone();
  }, 1200);
}

////////////////////////////////////////////////////////////
//////////////// on document ready function ////////////////
////////////////////////////////////////////////////////////

//////////////// on document ready utils ////////////////

function assignMenuAndDropdown() {
  document.querySelector('.menu').onclick = toggleDropdown;

  var dropDownItems = document.querySelectorAll('.menu-dropdown li');
  dropDownItems[0].onclick = blockTrird;
  dropDownItems[1].onclick = getPrice;
  dropDownItems[2].onclick = openPromotion;
  dropDownItems[3].onclick = enterBot;
  dropDownItems[4].onclick = openContacts;
}

function assignPromotion() {
  document.querySelector('.promotion-wrapper').onclick = exitPromotion;
  document.querySelector('.promotion-close').onclick = closePromotion;
}

function assignContacts() {
  document.querySelector('.contacts-wrapper').onclick = exitContacts;
  document.querySelector('.contacts-close').onclick = closeContacts;
}

function assignMenuCloseOnDocumentMouseUp() {
  var menu = $('.menu');
  var dropdown = $('.menu-dropdown');
  $(document).mouseup(function(e) {
    // if the target of the click isn't the container, nor a descendant of the container,
    // nor the dropdown
    if (!menu.is(e.target) && menu.has(e.target).length === 0
    && !dropdown.is(e.target)) checkCloseDropdown();
  });
}

//////////////// on document ready itself ////////////////

$(document).ready(function(){
  cancelTimeouts();
  document.querySelector('#phone').value = '';
  document.querySelector('#phone').disabled = true;
  // To prevent bugs after reloading page

  assignMenuAndDropdown();
  assignPromotion();
  assignContacts();
  assignMenuCloseOnDocumentMouseUp();
  
  blockFirst();
});