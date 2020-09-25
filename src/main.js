require('file-loader?name=[name].[ext]!./index.html');
import './assets/css/animate.css';
import './assets/css/lineicons.css';
import './assets/css/bootstrap.min.css';
import './assets/css/default.css';
import './assets/css/style.css';
import './assets/css/gametab.css';
import Logo from './assets/images/logo.svg';
import Background from './assets/images/background.png';
import Download_Shape from './assets/images/download-shape.svg';
import Email from './assets/images/email.svg';
import Footer_Shape from './assets/images/footer-shape.svg';
import Logo_swanz from './assets/images/logo_swanz.svg';
import 'bootstrap';

"use strict";

var io = require("socket.io-client");
var socket = io('http://localhost:8001');
var $ = require('jquery');
var jQuery = require('jquery');
var WOW = require('wowjs');

var wow = new WOW.WOW({
    live: false
});
wow.init();

var defaultStyle = {
  color: 'blue'
}
var defaultUsername = 'Bob';

var username = defaultUsername;
var style = defaultStyle;

socket.on('connect', () => {
  console.log('Connected to the servers!');
});

$(document).ready(function() {


  $('.preloader').delay(500).fadeOut(500);

  $(window).on('scroll', function (event) {
      var scroll = $(window).scrollTop();
      if (scroll < 20) {
          $(".navbar-area").removeClass("sticky");
      } else {
          $(".navbar-area").addClass("sticky");
      }
  });



    //===== Section Menu Active

  var scrollLink = $('.page-scroll');
  // Active link switching
  $(window).scroll(function () {
      var scrollbarLocation = $(this).scrollTop();

      scrollLink.each(function () {

          var sectionOffset = $(this.hash).offset().top - 73;

          if (sectionOffset <= scrollbarLocation) {
              $(this).parent().addClass('active');
              $(this).parent().siblings().removeClass('active');
          }
      });
  });


    //===== close navbar-collapse when a  clicked

  $(".navbar-nav a").on('click', function () {
      $(".navbar-collapse").removeClass("show");
  });

  $(".navbar-toggler").on('click', function () {
      $(this).toggleClass("active");
  });

  $(".navbar-nav a").on('click', function () {
      $(".navbar-toggler").removeClass('active');
  });




    //===== Back to top

    // Show or hide the sticky footer button
  $(window).on('scroll', function (event) {
      if ($(this).scrollTop() > 600) {
          $('.back-to-top').fadeIn(200)
      } else {
          $('.back-to-top').fadeOut(200)
      }
  });


    //Animate the scroll to yop
  $('.back-to-top').on('click', function (event) {
      event.preventDefault();

      $('html, body').animate({
          scrollTop: 0,
      }, 1500);
  });


    //===== Svg

  jQuery('img.svg').each(function () {
      var $img = jQuery(this);
      var imgID = $img.attr('id');
      var imgClass = $img.attr('class');
      var imgURL = $img.attr('src');

      jQuery.get(imgURL, function (data) {
          // Get the SVG tag, ignore the rest
          var $svg = jQuery(data).find('svg');

          // Add replaced image's ID to the new SVG
          if (typeof imgID !== 'undefined') {
              $svg = $svg.attr('id', imgID);
          }
          // Add replaced image's classes to the new SVG
          if (typeof imgClass !== 'undefined') {
              $svg = $svg.attr('class', imgClass + ' replaced-svg');
          }

          // Remove any invalid XML tags as per http://validator.w3.org
          $svg = $svg.removeAttr('xmlns:a');

          // Replace image with new SVG
          $img.replaceWith($svg);

      }, 'xml');

  });

  var createGameSection = document.getElementById('startup');
  var lobbySection = document.getElementById('lobby');
  //var preLobbySection = document.getElementById('preLobby');
  var gameSettingSection = document.getElementById('gameSettings');
  var joinGameSection = document.getElementById('joinlobby');

  document.getElementById('logo').src = Logo;
  document.getElementById('footer-shape').src = Footer_Shape;
  document.getElementById('footer-shape-1').src = Footer_Shape;
  document.getElementById('createlobby').onclick = function() {
    socket.emit('createNewGame', {username: username, style: style});
  }
  document.getElementById('joinlobby').onclick = function() {
    var requestedLobbyUrl = window.location.pathname.replace("/", "").replace("?", "");
    socket.emit('join', {username: username, style: style, requestedLobbyUrl: requestedLobbyUrl});
  }
  document.getElementById('nick').addEventListener('input', function (evt) {
    username = this.value || defaultUsername;
  });

  showHomeStage();

  var path = window.location.pathname.replace("/", "").replace("?", "");
  if(path.length > 0) {
    showJoinStage();
  }

  function showSection(section, b) {
    section.style.display = b ?  "block" : "none";
  }

  function showHomeStage() {
    showSection(createGameSection, true);
    showSection(lobbySection, false);
    showSection(joinGameSection, false);
  }

  function showJoinStage() {
    showSection(createGameSection, false);
    showSection(joinGameSection, true);
  }

  function showLobbyStage() {
    showSection(createGameSection, false);
    showSection(joinGameSection, false);
    showSection(lobbySection, true);
  }

  function createPTag(text) {
    var para = document.createElement("P");
    para.innerText = text;
    return para;
  }

  var joined = false;
  socket.on('join', function(data) {
    if(!joined) {
      joined = true;
      var joinUrl = window.location.origin + "/" + data.url;
      showLobbyStage();
      document.getElementById("joinLink").innerText = "Send this link to your friends: " + joinUrl;
      document.getElementById("joinLink").href = joinUrl;
    }

    var players = data.players;
    var playerSection = document.getElementById('players');
    playerSection.innerHTML = "";
    for(let i = 0; i < players.length; i++) {
      playerSection.appendChild(createPTag(players[i].username + (players[i].admin ? " (admin)" : "")));
    }

    if(data.admin) {
      document.getElementById("rounds").disabled = false;
      document.getElementById("questionQuantity").disabled = false;
      document.getElementById("timer").disabled = false;
    }
  });

  socket.on('reloadPage', function() {
    location.reload();
  });

});
