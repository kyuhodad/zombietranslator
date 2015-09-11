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
    new ZombifyRule_eE (),
    new ZombifyRule_iI (),
    new ZombifyRule_oO (),
    new ZombifyRule_uU (),
    new ZombifyRule_rR ()
  ];
  var endRules = [
    new ZombifyRule_CAP ()
  ]
  var zombieStr = "";
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

    var engInput = $('#english').val();

    var zombifiedStrRegular = "";
    for (var i=0; i<engInput.length; i++) {
      var ch = engInput.charAt(i);
      var isEOS = (i === (engInput.length-1));
      var  resultStr = null;
      for (var j=0; j<regularRules.length; j++) {
        resultStr = regularRules[j].zombify (ch, i, isEOS);
        if (!!resultStr) break;
      }
      if (resultStr === null) resultStr = ch;
      zombifiedStrRegular = zombifiedStrRegular.concat (resultStr);
    }

    var zombifiedStr = "";
    for (var i=0; i<zombifiedStrRegular.length; i++) {
      var ch = zombifiedStrRegular.charAt(i);
      var isEOS = (i === (zombifiedStrRegular.length-1));
      var  resultStr = null;
      for (var j=0; j<endRules.length; j++) {
        resultStr = endRules[j].zombify (ch, i, isEOS);
        if (!!resultStr) break;
      }
      if (resultStr === null) resultStr = ch;
      zombifiedStr = zombifiedStr.concat (resultStr);
    }

    $('#zombie').val(zombifiedStr);
  }

  function unzombify(){

  }

  function ZombifyRule_End_r() {
    this.zombify = function (ch, idx, isEOS) {
      if (isEOS && (ch === 'r')) {
        return 'rh';
      }
      return null;
    }
  }
  function ZombifyRule_aA() {
    this.zombify = function (ch, idx, isEOS) {
      if ((ch === 'a') || (ch === 'A')) {
        return 'hra';
      }
      return null;
    }
  }
  function ZombifyRule_eE() {
    this.zombify = function (ch, idx, isEOS) {
      if ((ch === 'e') || (ch === 'E')) {
        return 'rr';
      }
      return null;
    }
  }
  function ZombifyRule_iI() {
    this.zombify = function (ch, idx, isEOS) {
      if ((ch === 'i') || (ch === 'I')) {
        return 'rrRr';
      }
      return null;
    }
  }
  function ZombifyRule_oO() {
    this.zombify = function (ch, idx, isEOS) {
      if ((ch === 'o') || (ch === 'O')) {
        return 'rrrRr';
      }
      return null;
    }
  }
  function ZombifyRule_uU() {
    this.zombify = function (ch, idx, isEOS) {
      if ((ch === 'u') || (ch === 'U')) {
        return 'rrrrRr';
      }
      return null;
    }
  }
  function ZombifyRule_rR() {
    this.zombify = function (ch, idx, isEOS) {
      if ((ch === 'r') || (ch === 'R')) {
        return 'RR';
      }
      return null;
    }
  }

  function ZombifyRule_CAP() {
    this.endOfSentense = true;

    this.zombify = function (ch, idx, isEOS) {
      if (idx === 0) this.endOfSentense = true;

      if (ch.search(/[.!?]/) === 0) {
        this.endOfSentense = true;
      } else if (this.endOfSentense) {
        if (ch.search(/\s/) === -1) {
          this.endOfSentense = false;
          if (ch.search(/a-z/)) {
            return ch.toUpperCase();
          }
        }
      }
      return null;
    }
  }

  $('#english').on("keyup", zombify);

});
