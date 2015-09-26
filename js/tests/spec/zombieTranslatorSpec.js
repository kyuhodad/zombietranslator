define(['zombieTranslator'], function(ZombieTranslator){
  var translator = {};

  describe('Zombie Translator', function () {
    beforeEach (function () {
      transletor = new ZombieTranslator ();
    });

    describe('Rule1: <r> at the end of words --> <rh>', function () {
      it ('should add "rh" if a wrod ends with "r"', function () {
        expect(transletor.translate("color"))
        .toBe(transletor.translate("colo") + "rh")
      });
      it ('should not add "rh" if "r" is not the end of a word', function () {
        expect(transletor.translate("colors"))
        .not.toMatch("rh");
        expect(transletor.translate("turn"))
        .not.toMatch("rh");
      });
      it ('should add "rh" to the all words which end with "r"', function () {
        var splitWith_rh = transletor.translate("What is the color of the flower, silver or ivory?").split("rh");
        expect(splitWith_rh.length).toBe(5);
        expect(transletor.translate("What is the color"))
        .toMatch(splitWith_rh[0]);
        expect(transletor.translate("What is the color of the flower"))
        .toMatch(splitWith_rh[0]+"rh"+splitWith_rh[1]+"rh");
      });
    });

    // an "a" or "A" by itself will be replaced with "hra".
    describe('Rule2: <a or A> itself --> <hra>', function () {
      it ('should add "hra" if "a" or "A" itself is a word', function () {
        var testStrings = ["This is a pen.", "This is A pen."];
        for (var i=0; i<testStrings.length; i++) {
          var splitWithSpace = transletor.translate(testStrings[i]).split(" ");
          expect(splitWithSpace.length).toBe(4);
          expect(transletor.translate(testStrings[i]))
          .toBe(splitWithSpace[0] + " " + splitWithSpace[1] + " " + "hra " + splitWithSpace[3]);
        }
      });

      it ('should not add "hra" if "a" or "A" itself is not a word', function () {
        var testStrings = ["He is an Irish.", "Another person joined my group.", "Beautiful day."];
        for (var i=0; i<testStrings.length; i++) {
          expect(transletor.translate(testStrings[i]))
          .not.toMatch("hra");
        }
      });

      it ('should handle multiple appearances of "a" or "A" as a word.', function () {
        var splitWithSpace = transletor.translate("A Korean friend brought a gift to me.").split(/\s+/);
        expect(splitWithSpace.length).toBe(8);
        expect(splitWithSpace[0]).toBe("Hra");
        expect(splitWithSpace[4]).toBe("hra");
      });
    });

    // Capitalize the first character of sentences.
    describe('Rule3: Capitalize the first character of sentences', function () {

      it ('should capitalize the first visible letter.', function () {
        var testStrings = ["begins with lower-case letter", "  begins with white spaces"];
        for (var i=0; i<testStrings.length; i++) {
          expect(isFirstVisibleCharUpperCase(transletor.translate(testStrings[i]))).toBe(true);
        }
      });

      it ('should capitalize the first visible letter of sentences.', function () {
        var testString = "First sentece. second one? now third one! finally last one.";
        var splitWithEOS = transletor.translate(testString).split(/[\.!\?]/);
        for(var i=0; i<splitWithEOS.length; i++) {
          expect(isFirstVisibleCharUpperCase(splitWithEOS[i])).toBe(true);
        }
      });

      it ('should change only the first visible letter of sentences.', function () {
        var testString = "First sentece. second one? now third one! finally last one.";
        var testStringWithoutEOSMark = testString.replace(/[\.!\?]/g, "_");
        var splitWithEOS = transletor.translate(testString).split(/[\.!\?]\s*/);
        var splitWith_ = transletor.translate(testStringWithoutEOSMark).split(/_\s*/);

        expect(splitWithEOS.length).toEqual(splitWith_.length);
        for(var i=0; i<splitWithEOS.length; i++) {
          expect(splitWithEOS[i].substring(1)).toEqual(splitWith_[i].substring(1));
        }
      });

      function isFirstVisibleCharUpperCase (str) {
        var trimmedStr = str.trim();
        if (trimmedStr.length === 0) return true;
        return trimmedStr.charAt(0) === trimmedStr.charAt(0).toUpperCase();
      }
    });


    // Capitalize the first character of sentences.
    describe('Rule4: <e or E> --> <rr>', function () {
      it ('should work with simple words.', function () {
        var testStrings = ["Serve", "enter", "sleeve"];
        for (var i=0; i<testStrings.length; i++) {
          expect(checkSimpleReplace(testStrings[i], /e|E/g, "rr", "@")).toBe(true);
        }
      });
      it ('should work with a sentece.', function () {
        var testStrings = ["He needs to complete his homework.", "Enter the house."];
        for (var i=0; i<testStrings.length; i++) {
          expect(checkSimpleReplace(testStrings[i], /e|E/g, "rr", "@")).toBe(true);
        }
      });
      it ('should work with multiple sentences.', function () {
        var testString = "He needs to complete his homework. Enter the house.";
        expect(checkSimpleReplace(testString, /e|E/g, "rr", "@")).toBe(true);
      });
    });

    // ------------------------------------------------------------------------------------
    // Apply the rule replacing chToReplace with strReplaceWith to given string(strToTest)
    // Returns true if the rule is working.
    //  strToTest: String to test
    //  chToReplace: A character being replaced (it could be RegExp object)
    //  strReplaceWith: A string to replace with.
    // ------------------------------------------------------------------------------------
    function checkSimpleReplace (strToTest, chToReplace, strReplaceWith, convCh) {

      if (convCh === undefined) convCh = "@";
      var regexpToReplace;
      if      (typeof chToReplace === "string") regexpToReplace = new RegExp(chToReplace, "g");
      else if (chToReplace instanceof RegExp) regexpToReplace = chToReplace;
      else return false;

      // Replace the character to test (chToReplace) with special character(convCh)
      // NOTE: Assuming convCh doesn't appear in strToTest and it should be one of
      //       non-alpha-numeric character.
      // EX)  strToTest = "Enter the house."
      //      chToReplace = /e|E/g
      //      convCh = "_"
      //      Then, strConverted would be "_nt_r th_ hous_."
      strToTest = strToTest.trim();
      var strConverted = strToTest.replace(regexpToReplace, convCh);

      var original = transletor.translate(strToTest);
      var modified = transletor.translate(strConverted);

      var capStrReplaceWith = strReplaceWith.charAt(0).toUpperCase() + strReplaceWith.substring(1);
      var beginWithCapitalized = (strToTest.search(regexpToReplace) === 0);

      var currentStr = original;
      var splitModified = modified.split(convCh);
      for (var id=0; id<splitModified.length; id++) {
        var strToken = splitModified[id];

        var needCapitalized = false;
        if (strToken.length > 0) {
          // strToken should appear the beginning of currentStr string.
          var pos = currentStr.search(strToken);
          if (pos != 0) return false;

          // If strToken is the end of a sentece, next character needs to be replace with
          // capitalized.
          needCapitalized = /[\.|!|\?]\s*$/.test(strToken);
          // needCapitalized = strToken.test(/[\.|!|\?]\s*$/);
        } else if (id === 0) {
          // Check to see if the strToTest starts with chToReplace.
          needCapitalized = beginWithCapitalized;
        }

        // Extract remaining string followed by the strToken.
        var nextStr = currentStr.substring(strToken.length);
        if (nextStr.length === 0) break;

        // The nextStr should start with strReplaceWith.
        var searchStr = needCapitalized ? capStrReplaceWith : strReplaceWith;
        var posReplaceWith = nextStr.search(searchStr);
        if (posReplaceWith != 0) return false;

        currentStr = nextStr.substring(strReplaceWith.length);
        if (currentStr === undefined || currentStr.length == 0) break;
      }
      return true;
    }

  });


});
