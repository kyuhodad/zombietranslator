define ( [
  'zombifyRules'
],
function (ZombifyRules) {
  var ZombieTranslator = function () {
    var zombifyRules = new ZombifyRules ();
    this.translate = function (inputStr){
      return zombifyRules.applyRules (true, inputStr);
    };
    this.translateBack = function (inputStr){
      return zombifyRules.applyRules (false, inputStr);
    };
  };

  return ZombieTranslator;
});
