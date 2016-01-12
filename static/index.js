(function(shops) {
  var Jscreen = document.getElementById('J_screen');
  var Jshake = document.getElementById('J_shake');
  var timer = null;

  var randomShop = function() {
    return shops[Math.random() * shops.length >>> 0];
  };

  var startRandom = function() {
    timer = setInterval(function() {
      var shop = randomShop();
      Jscreen.innerHTML = shop.name;
      Jscreen.setAttribute('href', shop.link);
    }, 100);
  };
  startRandom();

  var stopRandom = function() {
    clearInterval(timer);
    Jshake.innerHTML = '真的不喜欢？点这里重新来';
  };

  var myShakeEvent = new Shake({
    threshold: 15
  });
 
  myShakeEvent.start();

  window.addEventListener('shake', function() {
    stopRandom();
  }, false);

  Jshake.addEventListener('touchend', function() {
    startRandom();
    Jshake.innerHTML = '再摇下';
  });

}(shops));
