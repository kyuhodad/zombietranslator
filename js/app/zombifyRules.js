define ( [],
function () {
  // var ZombifyRules = function (rules) {
  var ZombifyRules = function (rules) {
    if (rules === undefined) rules = 0xffff;
    this.applyRules = _applyRules;
    this.initRules = _initRules;
    this.getRule = _getRule;

   _initRules (rules);
  };
  ZombifyRules.RULE = {
    ZR_r_AtEOW:     { id: 0x0001, newRule: newZombifyRule_End_r, args: null},
    ZR_aA_ALONE:    { id: 0x0002, newRule: newZombifyRule_aA, args: null},
    ZR_CAPITALIZE:  { id: 0x0004, newRule: ZombifyRule_CAP, args: null},
    ZR_eE_SIMPLE:   { id: 0x0008, newRule: newZombifyRule_Simple, args: ["e", "rr"] },
    ZR_iI_SIMPLE:   { id: 0x0010, newRule: newZombifyRule_Simple, args: ["i", "rrRr"] },
    ZR_oO_SIMPLE:   { id: 0x0020, newRule: newZombifyRule_Simple, args: ["o", "rrrRr"] },
    ZR_uU_SIMPLE:   { id: 0x0040, newRule: newZombifyRule_Simple, args: ["u", "rrrrRr"] },
    ZR_rR_SIMPLE:   { id: 0x0080, newRule: newZombifyRule_Simple, args: ["r", "RR"] },
    ZR_wW_SIMPLE:   { id: 0x0100, newRule: newZombifyRule_Simple, args: ["w", "wRw"] },
    ZR_yY_SIMPLE:   { id: 0x0200, newRule: newZombifyRule_Simple, args: ["y", "wwRy"] },
    ZR_DEFAULT:     { id: 0xffff, newRule: null }
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
  var regularRules = [];
  var endRules = [];

  function _initRules (rules) {
    regularRules.splice(0);
    endRules.splice(0);

    var regularRuleApplyingOrder = [
      ZombifyRules.RULE.ZR_r_AtEOW,
      ZombifyRules.RULE.ZR_aA_ALONE,
      ZombifyRules.RULE.ZR_rR_SIMPLE,
      ZombifyRules.RULE.ZR_yY_SIMPLE,
      ZombifyRules.RULE.ZR_wW_SIMPLE,
      ZombifyRules.RULE.ZR_uU_SIMPLE,
      ZombifyRules.RULE.ZR_oO_SIMPLE,
      ZombifyRules.RULE.ZR_iI_SIMPLE,
      ZombifyRules.RULE.ZR_eE_SIMPLE
    ];

    for (var i=0; i<regularRuleApplyingOrder.length; i++) {
      if ((rules & (regularRuleApplyingOrder[i].id)) != 0) {
        var args = regularRuleApplyingOrder[i].args;
        regularRules.push(regularRuleApplyingOrder[i].newRule(regularRuleApplyingOrder[i].id, args));
      }
    };

    if ((rules & ZombifyRules.RULE.ZR_CAPITALIZE.id) != 0) {
      endRules.push(new ZombifyRules.RULE.ZR_CAPITALIZE.newRule(ZombifyRules.RULE.ZR_CAPITALIZE.id));
    }
  }

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

  function _getRule(ruleId) {
    for(var i=0; i<regularRules.length; i++) {
      if (regularRules[i].id === ruleId) {
        return regularRules[i];
      }
    }
    return null;
  }

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
  function ZombifyRuleBase (id, regExpEtoZ, zomStr, regExpZtoE, engStr) {
    var _RegExpForEtoZ = regExpEtoZ;
    var _RegExpForZtoE = regExpZtoE;
    var _engStr = engStr;
    var _zomStr = zomStr;

    this.id = id;
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
  function newZombifyRule_Simple (id, args) {
    var engCh = args[0];
    var zomStr = args[1];
    var zomStrCap = capitalizeFirstChar(zomStr);
    return new ZombifyRuleBase( id,
      "([" + engCh + engCh.toUpperCase() + "])",    zomStr,
      "((?:" + zomStr + ")|(?:" + zomStrCap + "))", engCh);
  }

  //
  // Rule for 'r at the end of words'
  //
  function newZombifyRule_End_r(id) {
    return new ZombifyRuleBase(id, "(r\\b)", "rh", "(rh\\b)", "r");
  }

  //
  // Rule for 'a' or 'A' itself
  //
  function newZombifyRule_aA(id) {
    return new ZombifyRuleBase(id, "(\\b[aA]\\b)", "hra", "(\\b(?:hra)|(?:Hra)\\b)", "a");
  }

  //
  // Capitalize rule (need to be applied after all general rules)
  //
  function ZombifyRule_CAP(id) {
    this.id = id;
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
