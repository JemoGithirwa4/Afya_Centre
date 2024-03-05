let menu = document.querySelector('#menu-bars');
let navbar = document.querySelector('.navbar');
var links = document.querySelectorAll('.navbar a');
var sections = document.querySelectorAll('section');
let countdown;
const timerDisplay = document.getElementById('time-left');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const fastHourButtons = document.querySelectorAll('.fast-hour');
const startTime = document.getElementById('timer');
const endTime = document.getElementById('endTimer');
let timerInterval; // Variable to hold the timer interval
let timerRunning = false;

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

links.forEach(function(link) {
  link.addEventListener('click', function(event) {
      links.forEach(function(link) {
          link.classList.remove('active');
      });
      sections.forEach(function(section) {
        section.classList.remove('live');
      });

      this.classList.add('active');
      var targetSectionClass = this.getAttribute('href').substring(1);
      document.querySelector('.' + targetSectionClass).classList.add('live');
      //document.querySelector('.footer').style.display = "none";
  });
});

document.querySelector('.support-text a').onclick = () => {
  sup = document.querySelector('.order');
  home = document.querySelector('#home')
  home.classList.remove('live');
  sup.classList.add('live');
}

document.querySelector("#search-icon").onclick = () => {
    document.querySelector("#search-form").classList.toggle('active');
}

document.querySelector("#close").onclick = () => {
    document.querySelector("#search-form").classList.remove('active');
}

var swiper = new Swiper(".home-slider", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 7500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    loop:true,
  });

function updateTime() {
  const now = new Date();
  const options = { weekday: 'short', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
  const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
  startTime.textContent = timeString;
}

timerInterval = setInterval(updateTime, 1000);

updateTime();

fastHourButtons.forEach(button => {
  button.addEventListener('click', function() {
      fastHourButtons.forEach(b => {
          b.style.display = 'none';
      });

      document.querySelector('.heading2').textContent = "Let's go!!";
      this.style.display = 'inline-block';
      this.setAttribute('disabled', true);

      startButton.setAttribute('data-hours', this.textContent);
      if (timerRunning) {
          clearInterval(timerInterval); // Stop the timer if it's running
          timerRunning = false;
      }
  });
});

startButton.addEventListener('click', startTimer);

function startTimer() {   
          const hours = parseInt(startButton.getAttribute('data-hours'), 10);
          const now = new Date();
          const endTime2 = new Date(now.getTime() + hours * 60 * 60 * 1000); // Calculate the end time
          const options = { weekday: 'short', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
          const formattedEndTime = new Intl.DateTimeFormat('en-US', options).format(endTime2);
          
          endTime.textContent = `${formattedEndTime}`;  
          
          startButton.style.display = 'none';       
          
          if (timerInterval) {
              clearInterval(timerInterval); // Stop the timer if it's running
            }
          timerRunning = true;

          const endTimestamp = endTime2;

          countdown = setInterval(() => {
              const currentTimestamp = Date.now();
              const timeLeft = endTimestamp - currentTimestamp;
              if (timeLeft <= 0) {
                  clearInterval(countdown);
                  document.querySelector('.heading').textContent = "Fast Complete!";
                  startButton.style.display = "inline-block";
              } else {
                  const hours = Math.floor(timeLeft / 3600000);
                  const minutes = Math.floor((timeLeft % 3600000) / 60000);
                  const seconds = Math.floor((timeLeft % 60000) / 1000);
                  timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
              }
          }, 1000);

          //Loading circle
          const totalTimeFast = hours * 60 * 60 * 1000;
          const svgCircle = document.querySelector(".loading-circle");

          function startLoading() {
              svgCircle.style.animationDuration = totalTimeFast + "ms";
              setTimeout(function () {
                  // You can add code here to execute when the loading is complete
              }, totalTime);
          }
      
          startLoading();
}

resetButton.addEventListener('click', resetTimer);

function resetTimer() {
  location.reload()
}

(function(){

  const app = document.querySelector(".app");
  const socket = io();

  let uname;

  app.querySelector(".join-screen #join-user").addEventListener("click", function(){
      let username = app.querySelector(".join-screen #username").value;
      console.log("Username entered:", username);
      if(username.length == 0){
          return;
      }

      socket.emit("newuser", username);
      uname = username;
      app.querySelector(".join-screen").classList.remove("active-ch");
      app.querySelector(".chat-screen").classList.add("active-ch");
  });

  app.querySelector(".chat-screen #send-message").addEventListener("click", function(){
      let message = app.querySelector(".chat-screen #message-input").value;
      if(message.length == 0){
          return;
      }

      renderMessage("my", {
          username: uname,
          text: message
      });

      socket.emit("chat", {
          username: uname,
          text: message
      });

      app.querySelector(".chat-screen #message-input").value = "";
  });

  app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
      socket.emit("exituser", uname);
      window.location.href = window.location.href;
  });

  socket.on("update", function(update) {
      renderMessage("update", update);
  });

  socket.on("chat", function(message) {
      renderMessage("other", message);
  });

  function renderMessage(type, message) {
      let messageContainer = app.querySelector(".chat-screen .messages");
      if(type == "my"){
          let el = document.createElement("div");
          el.setAttribute("class", "message my-message");
          el.innerHTML = `
              <div>
                  <div class="name">You</div>
                  <div class="text">${message.text}</div>            
              </div>
          `;
          messageContainer.appendChild(el);
      } else if(type == "other") {
          let el = document.createElement("div");
          el.setAttribute("class", "message other-message");
          el.innerHTML = `
              <div>
                  <div class="name">${message.username}</div>
                  <div class="text">${message.text}</div>            
              </div>
          `;
          messageContainer.appendChild(el);
      } else if(type == "update") {
          let el = document.createElement("div");
          el.setAttribute("class", "update");
          el.innerText = message;
          messageContainer.appendChild(el);
      }
      // scroll chat to end
      messageContainer.scrollTop - messageContainer.scrollHeight - messageContainer.clientHeight;
  }    

})();