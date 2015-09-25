define ( [],
function () {

  var ZombifyRules = function () {
    this.applyRules = _applyRules;
  };

  // 1. lower-case "r" at the end of words replaced with "rh".
  // 2. an "a" or "A" by itself will be replaced with "hra".
  // 3. the starts of sentences are capitalised
  //    : the "start of a sentence" is
  //      the first visible letter of whole string to translate, or
  //      any occurrence of ".!?", followed by a space, followed by a letter.
  // 4. "e" or "E" is replaced by "rr"
  // 5. "i" or "I" is replaced by "rrRr"
  // 6. "o" or "O" is replaced by "rrrRr"
  // 7. "u" or "U" is replaced by "rrrrRr"
  // 8. "r" or "R' is replaced by "RR"
  // 9. "w" or "W' is replaced by "wRw"
  //10. "y" or "Y' is replaced by "wwRy"
  var regularRules = [
    newZombifyRule_End_r (),
    newZombifyRule_aA (),
    newZombifyRule_Simple("r", "RR"),
    newZombifyRule_Simple("y", "wwRy"),
    newZombifyRule_Simple("w", "wRw"),
    newZombifyRule_Simple("u", "rrrrRr"),
    newZombifyRule_Simple("o", "rrrRr"),
    newZombifyRule_Simple("i", "rrRr"),
    newZombifyRule_Simple("e", "rr")
  ];

  var endRules = [
    new ZombifyRule_CAP ()
  ];

  //
  // Apply rules:
  //  First, apply regular rules and then end rules which need to be applied
  //  for the translate string (such as caputalizing).
  //
  function _applyRules (isZombify, inputStr){
    // Apply regular rules.
    var resultStr = applyRegularRules (isZombify, inputStr);

    // Apply end rules.
    for (var i=0; i<endRules.length; i++) {
      if (isZombify) {
        resultStr = endRules[i].zombify (resultStr);
      } else {
        resultStr = endRules[i].unzombify (resultStr);
      }
    }
    return resultStr;
  };

  //
  // Apply regular rules
  // This rules use string pattern matching and replacing method by RegExp.
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
  // Base class for the regular rules
  //
  function ZombifyRuleBase (regExpEtoZ, zomStr, regExpZtoE, engStr) {
    var _RegExpForEtoZ = regExpEtoZ;
    var _RegExpForZtoE = regExpZtoE;
    var _engStr = engStr;
    var _zomStr = zomStr;

    this.init = _initialize;
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

    function _initialize (regExpEtoZ, zomStr, regExpZtoE, engStr) {
      _RegExpForEtoZ = regExpEtoZ;
      _RegExpForZtoE = regExpZtoE;
      _engStr = engStr;
      _zomStr = zomStr;
    }
  }

  //
  // Function for the simple rule such as one-to-one direct translation.
  // (ex) 'e' or 'E' --> 'rr'
  //
  function newZombifyRule_Simple (engCh, zomStr) {
    var zomStrCap = capitalizeFirstChar(zomStr);
    return new ZombifyRuleBase(
      "([" + engCh + engCh.toUpperCase() + "])",    zomStr,
      "((?:" + zomStr + ")|(?:" + zomStrCap + "))", engCh);
  }

  //
  // Rule for 'r at the end of words'
  //
  function newZombifyRule_End_r() {
    return new ZombifyRuleBase("(r\\b)", "rh", "(rh\\b)", "r");
  }

  //
  // Rule for 'a' or 'A' itself
  //
  function newZombifyRule_aA() {
    return new ZombifyRuleBase("(\\b[aA]\\b)", "hra", "(\\b(?:hra)|(?:Hra)\\b)", "a");
  }

  //
  // Capitalize rule (need to be applied after all general rules)
  //
  function ZombifyRule_CAP() {
    this.zombify = function (strInput) {
      return capitalizeSentences (strInput);
    }
    this.unzombify = function (strInput) {
      return capitalizeSentences (strInput);
    }
  }

  //
  // Capitalize the first character of input string
  //
  function capitalizeFirstChar (str) {
    var cappedStr = str;
    if (!!str && (str.length > 0)) {
      cappedStr = "";
      var index = str.search(/\S/);
      if (index > 0) {
        cappedStr = str.substring(0, index-1);
      }
      cappedStr += str.charAt(index).toUpperCase();
      if (index < (str.length-1))
        cappedStr += str.substring(index+1);
    }
    return cappedStr;
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

  return ZombifyRules;
});
