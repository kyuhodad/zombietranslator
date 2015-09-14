define (
[
  "jquery", "bootstrap"
],
function ($) {

  $(document).ready(function(){
    $('#zombie-to-english-btn').click(function(event){
      unzombify();
      return false;
    });

    $('#english-to-zombie-btn').click(function(event){
      zombify();
      return false;
    });

    var regularRules = [
      new ZombifyRule_End_r (),
      new ZombifyRule_aA (),
      new ZombifyRule_rR (),
      new ZombifyRule_yY (),
      new ZombifyRule_wW (),
      new ZombifyRule_uU (),
      new ZombifyRule_oO (),
      new ZombifyRule_iI (),
      new ZombifyRule_eE ()
    ];
    var endRules = [
      new ZombifyRule_CAP ()
    ]

    function zombify(){
      // 1. lower-case "r" at the end of words replaced with "rh".
      // 2. an "a" or "A" by itself will be replaced with "hra".
      // 3. the starts of sentences are capitalised (the "start of a sentence" is any occurrence of
      //   ".!?", followed by a space, followed by a letter.)
      // 4. "e" or "E" is replaced by "rr"
      // 5. "i" or "I" is replaced by "rrRr"
      // 6. "o" or "O" is replaced by "rrrRr"
      // 7. "u" or "U" is replaced by "rrrrRr"
      // 8. "r" or "R' is replaced by "RR"
      // 9. "w" or "W' is replaced by "wRw"
      //10. "y" or "Y' is replaced by "wwRy"

      var inputStr = $('#english').val();

      // Apply regular rules.
      var resultStr = applyRegularRules (true, inputStr);

      // Apply end rules.
      for (var i=0; i<endRules.length; i++) {
        resultStr = endRules[i].zombify (resultStr);
      }

      $('#zombie').val(resultStr);
      $('#zombie2').val(resultStr);

      // Testing purpose!!!!
      unzombify ();
    }

    function unzombify(){
      var inputStr = $('#zombie').val();

      // Apply regular rules.
      var resultStr = applyRegularRules (false, inputStr);

      // Apply end rules.
      for (var i=0; i<endRules.length; i++) {
        resultStr = endRules[i].unzombify (resultStr);
      }

      $('#english2').val(resultStr);
    }

    //
    // Apply regular rules
    //
    function applyRegularRules (isZombify, inputStr) {
      var ruleRegExpStr = "";
      for (var i=0; i<regularRules.length; i++) {
        ruleRegExpStr += (isZombify)  ? regularRules[i].getRegExpForEtoZ ()
                                      : regularRules[i].getRegExpForZtoE ();
        if (i < (regularRules.length-1)) ruleRegExpStr += "|";
      }
      var ruleRegExp = new RegExp(ruleRegExpStr, "gm");

      var resultStr = "";
      var myArray;
      var currentPos = 0;
      while ((myArray = ruleRegExp.exec(inputStr)) !== null) {

        // Find matched rule and translated string.
        var strRepWith;
        for (var i=1; i<myArray.length; i++) {
          if (!!myArray[i] && !!regularRules[i-1]) {
            strRepWith = (isZombify)  ? regularRules[i-1].getReplaceStrForEtoZ()
                                      : regularRules[i-1].getReplaceStrForZtoE();
          }
        }

        // Compose new string from current position to matched position, and
        // append it to the zombified string.
        var matchedPos = myArray.index;
        var strToKeep = inputStr.substring (currentPos, matchedPos);
        var newStr = (!!strToKeep) ? strToKeep+strRepWith : strRepWith;
        resultStr += newStr;

        // Update current position.
        currentPos = ruleRegExp.lastIndex;
      }

      // If there is any remaining string to translate, do it here.
      if (currentPos < inputStr.length) {
        resultStr += inputStr.substring (currentPos, inputStr.length);
      }

      return resultStr;
    }

    
    //
    // Capitalize the first character of input string
    //
    function capitalizeFirstChar (str) {
      var capedStr = str;
      if (!!str && (str.length > 0)) {
        capedStr = str.charAt(0).toUpperCase();
        if (str.length > 1) {
          capedStr += str.substring(1);
        }
      }
      return capedStr;
    }

    //
    // Capitalize each sentences
    //
    function capitalizeSentences (str) {
      var inputStr = capitalizeFirstChar (str);

      var capitalisedStr = "";
      var currentPos = 0;
      var capRegExp = new RegExp ("(?:[.!?]\\s*)\\w","gm");
      while ((myArray = capRegExp.exec(inputStr)) !== null) {
        var matchedStr = myArray[0];
        var posLastChar = myArray.index + matchedStr.length - 1;

        capitalisedStr += inputStr.substring (currentPos, posLastChar) + matchedStr.charAt(matchedStr.length - 1).toUpperCase ();
        currentPos = capRegExp.lastIndex;
      }
      if (currentPos < inputStr.length) {
        capitalisedStr += inputStr.substring (currentPos, inputStr.length);
      }

      return capitalisedStr;
    }

    function ZombifyRule_End_r() {
      this.zombify = function (ch, idx, isEOS) {
        if (isEOS && (ch === 'r')) {
          return 'rh';
        }
        return null;
      }

      this.getRegExpForEtoZ = function () {
        return "(r\\b)";
      }
      this.getReplaceStrForEtoZ = function () {
        return "rh";
      }

      this.getRegExpForZtoE = function () {
        return "(rh\\b)"
      }
      this.getReplaceStrForZtoE = function () {
        return "r";
      }
    }

    function ZombifyRule_aA() {
      this.getRegExpForEtoZ = function () {
        return "(\\b[aA]\\b)";
      }
      this.getReplaceStrForEtoZ = function () {
        return "hra";
      }

      this.getRegExpForZtoE = function () {
        return "(\\b(?:hra)|(?:Hra)\\b)"
      }
      this.getReplaceStrForZtoE = function () {
        return "a";
      }
    }

    //
    // It handles a simple rule (one English character maps to zombie string)
    //
    function ZombifyRule_Simple (engCh, zomStr) {
      var zomStrCap = capitalizeFirstChar(zomStr);

      var _RegExpForEtoZ = "([" + engCh + engCh.toUpperCase() + "])";
      var _RegExpForZtoE = "((?:" + zomStr + ")|(?:" + zomStrCap + "))";
      var _engStr = engCh;
      var _zomStr = zomStr;
      this.getRegExpForEtoZ = function () {
        return _RegExpForEtoZ;
      }
      this.getReplaceStrForEtoZ = function () {
        return _zomStr;
      }
      this.getRegExpForZtoE = function () {
        return _RegExpForZtoE;
      }
      this.getReplaceStrForZtoE = function () {
        return _engStr;
      }
    }

    //
    // Rule for "e or E" --> "rr" (Derived from ZombifyRule_Simple)
    //
    function ZombifyRule_eE() {
      ZombifyRule_Simple.call(this, "e", "rr");
    }
    ZombifyRule_eE.prototype = Object.create(ZombifyRule_Simple.prototype);
    ZombifyRule_eE.prototype.constructor = ZombifyRule_eE;

    //
    // Rule for "i or I" --> "rrRr" (Derived from ZombifyRule_Simple)
    //
    function ZombifyRule_iI() {
      ZombifyRule_Simple.call(this, "i", "rrRr");
    }
    ZombifyRule_iI.prototype = Object.create(ZombifyRule_Simple.prototype);
    ZombifyRule_iI.prototype.constructor = ZombifyRule_iI;

    //
    // Rule for "o or O" --> "rrrRr" (Derived from ZombifyRule_Simple)
    //
    function ZombifyRule_oO() {
      ZombifyRule_Simple.call(this, "o", "rrrRr");
    }
    ZombifyRule_oO.prototype = Object.create(ZombifyRule_Simple.prototype);
    ZombifyRule_oO.prototype.constructor = ZombifyRule_oO;

    //
    // Rule for "u or U" --> "rrrrRr" (Derived from ZombifyRule_Simple)
    //
    function ZombifyRule_uU() {
      ZombifyRule_Simple.call(this, "u", "rrrrRr");
    }
    ZombifyRule_uU.prototype = Object.create(ZombifyRule_Simple.prototype);
    ZombifyRule_uU.prototype.constructor = ZombifyRule_uU;

    //
    // Rule for "r or R" --> "RR" (Derived from ZombifyRule_Simple)
    //
    function ZombifyRule_rR() {
      ZombifyRule_Simple.call(this, "r", "RR");
    }
    ZombifyRule_rR.prototype = Object.create(ZombifyRule_Simple.prototype);
    ZombifyRule_rR.prototype.constructor = ZombifyRule_rR;

    //
    // Rule for "w or W" --> "wRw" (Derived from ZombifyRule_Simple)
    //
    function ZombifyRule_wW() {
      ZombifyRule_Simple.call(this, "w", "wRw");
    }
    ZombifyRule_wW.prototype = Object.create(ZombifyRule_Simple.prototype);
    ZombifyRule_wW.prototype.constructor = ZombifyRule_wW;

    //
    // Rule for "y or Y" --> "wwRy" (Derived from ZombifyRule_Simple)
    //
    function ZombifyRule_yY() {
      ZombifyRule_Simple.call(this, "y", "wwRy");
    }
    ZombifyRule_yY.prototype = Object.create(ZombifyRule_Simple.prototype);
    ZombifyRule_yY.prototype.constructor = ZombifyRule_yY;

    function ZombifyRule_CAP() {
      this.zombify = function (strInput) {
        return capitalizeSentences (strInput);
      }
      this.unzombify = function (strInput) {
        return capitalizeSentences (strInput);
      }
    }

    $('#english').on("keyup", zombify);

  });
});
