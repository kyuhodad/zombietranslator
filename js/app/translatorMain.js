define (
[
  "jquery",
  "zombieTranslator",
  "bootstrap"
],
function ($, ZombieTranslator) {
  this.zombieTranslator = new ZombieTranslator ();
  var thisVar = this;
  var $english = $('#english');
  var $zombie = $('#zombie');
  var $zombieOut = $('#zombie-out');
  var $englishOut = $('#english-out');

  $(document).ready(function(){
    $english.on("keyup", zombify);
    $zombie.on("keyup", unzombify);

    function zombify(){
      $zombieOut.val(zombieTranslator.translate ($english.val()));
    }

    function unzombify(){
      $englishOut.val(zombieTranslator.translateBack ($zombie.val()));
    }
  });
});
