define(['zombieTranslator'], function(ZombieTranslator){
  var translator = {};

  describe('Zombie Translator: Tests with applying all rules.', function () {
    beforeEach (function () {
      translator = new ZombieTranslator ();
    });

    // lower-case "r" at the end of words replaced with "rh".
    describe('Rule1: <r> at the end of words --> <rh>', function () {
      it ('should add "rh" if a wrod ends with "r"', function () {
        expect(translator.translate("color"))
        .toBe(translator.translate("colo") + "rh")
      });
      it ('should not add "rh" if "r" is not the end of a word', function () {
        expect(translator.translate("colors"))
        .not.toMatch("rh");
        expect(translator.translate("turn"))
        .not.toMatch("rh");
      });
      it ('should add "rh" to the all words which end with "r"', function () {
        var splitWith_rh = translator.translate("What is the color of the flower, silver or ivory?").split("rh");
        expect(splitWith_rh.length).toBe(5);
        expect(translator.translate("What is the color"))
        .toMatch(splitWith_rh[0]);
        expect(translator.translate("What is the color of the flower"))
        .toMatch(splitWith_rh[0]+"rh"+splitWith_rh[1]+"rh");
      });
    });

    // an "a" or "A" by itself will be replaced with "hra".
    describe('Rule2: <a or A> itself --> <hra>', function () {
      it ('should add "hra" if "a" or "A" itself is a word', function () {
        var testStrings = ["This is a pen.", "This is A pen."];
        for (var i=0; i<testStrings.length; i++) {
          var splitWithSpace = translator.translate(testStrings[i]).split(" ");
          expect(splitWithSpace.length).toBe(4);
          expect(translator.translate(testStrings[i]))
          .toBe(splitWithSpace[0] + " " + splitWithSpace[1] + " " + "hra " + splitWithSpace[3]);
        }
      });

      it ('should not add "hra" if "a" or "A" itself is not a word', function () {
        var testStrings = ["He is an Irish.", "Another person joined my group.", "Beautiful day."];
        for (var i=0; i<testStrings.length; i++) {
          expect(translator.translate(testStrings[i]))
          .not.toMatch("hra");
        }
      });

      it ('should handle multiple appearances of "a" or "A" as a word.', function () {
        var splitWithSpace = translator.translate("A Korean friend brought a gift to me.").split(/\s+/);
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
          expect(isFirstVisibleCharUpperCase(translator.translate(testStrings[i]))).toBe(true);
        }
      });

      it ('should capitalize the first visible letter of sentences.', function () {
        var testString = "First sentece. second one? now third one! finally last one.";
        var splitWithEOS = translator.translate(testString).split(/[\.!\?]/);
        for(var i=0; i<splitWithEOS.length; i++) {
          expect(isFirstVisibleCharUpperCase(splitWithEOS[i])).toBe(true);
        }
      });

      it ('should change only the first visible letter of sentences.', function () {
        var testString = "First sentece. second one? now third one! finally last one.";
        var testStringWithoutEOSMark = testString.replace(/[\.!\?]/g, "_");
        var splitWithEOS = translator.translate(testString).split(/[\.!\?]\s*/);
        var splitWith_ = translator.translate(testStringWithoutEOSMark).split(/_\s*/);

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

    // "e" or "E" is replaced by "rr"
    describe('Rule4: <e or E> --> <rr>', function () {
      it ('should work with simple words.', function () {
        var testStrings = ["Serve", "enter", "sleeve"];
        expect(checkWithSimpleRule(testStrings, /e|E/g, "rr")).toBe(true);
      });
      it ('should work with a sentece.', function () {
        var testStrings = ["He needs to complete his homework.", "Enter the house."];
        expect(checkWithSimpleRule(testStrings, /e|E/g, "rr")).toBe(true);
      });
      it ('should work with multiple sentences.', function () {
        var testString = "He needs to complete his homework. Enter the house.";
        expect(checkWithSimpleRule(testString, /e|E/g, "rr")).toBe(true);
      });
    });

    // "i" or "I" is replaced by "rrRr"
    describe('Rule5: <i or I> --> <rrRr>', function () {
      it ('should work with simple words.', function () {
        var testStrings = ["Tire", "iterative", "certify"];
        expect(checkWithSimpleRule (testStrings, /i|I/g, "rrRr")).toBe(true);
      });
      it ('should work with a sentece.', function () {
        var testStrings = ["His favorit winter sport is ski.", "In the stromy wind, she was still there."];
        expect(checkWithSimpleRule (testStrings, /i|I/g, "rrRr")).toBe(true);
      });
      it ('should work with multiple sentences.', function () {
        var testString = "His favorit winter sport is ski. In the stromy wind, she was still there.";
        expect(checkWithSimpleRule (testString, /i|I/g, "rrRr")).toBe(true);
      });
    });

    // "o" or "O" is replaced by "rrrRr"
    describe('Rule6: <o or O> --> <rrrRr>', function () {
      it ('should work with simple words.', function () {
        var testStrings = ["Boston", "objective", "piano"];
        expect(checkWithSimpleRule (testStrings, /o|O/g, "rrrRr")).toBe(true);
      });
      it ('should work with a sentece.', function () {
        var testStrings = [
          "Open those windows!",
          "Optimization software CD is on the table.",
          "Google Chrome is open on tying karam start."
        ];
        expect(checkWithSimpleRule (testStrings, /o|O/g, "rrrRr")).toBe(true);
      });
      it ('should work with multiple sentences.', function () {
        var testString =  "Open those windows! " +
                          "Optimization software CD is on the table. " +
                          "Google Chrome is open on tying karam start.";
        expect(checkWithSimpleRule (testString, /o|O/g, "rrrRr")).toBe(true);
      });
    });

    // "u" or "U" is replaced by "rrrrRr"
    describe('Rule7: <u or U> --> <rrrrRr>', function () {
      it ('should work with simple words.', function () {
        var testStrings = ["Undeground", "tunner", "CPU"];
        expect(checkWithSimpleRule (testStrings, /u|U/g, "rrrrRr")).toBe(true);
      });
      it ('should work with a sentece.', function () {
        var testStrings = [
          "Do you know what unary operator?",
          "Under the cucumber slice, I found a coin.",
          "I LOVE U :)"
        ];
        expect(checkWithSimpleRule (testStrings, /u|U/g, "rrrrRr")).toBe(true);
      });
      it ('should work with multiple sentences.', function () {
        var testString =  "Do you know what unary operator? " +
                          "Under the cucumber slice, I found a coin. " +
                          "I LOVE U :)"
        expect(checkWithSimpleRule (testString, /u|U/g, "rrrrRr")).toBe(true);
      });
    });

    // "r" or "R' is replaced by "RR" excep for the "r" which is at the end of words.
    describe('Rule8: <r or R> --> <RR>', function () {
      it ('should work with simple words.', function () {
        var testStrings = ["radio", "serious"];
        expect(checkWithSimpleRule (testStrings, /r|R/g, "RR")).toBe(true);
      });

      it ('should not replace thr "r" at the end of a word.', function () {
        var translatedStr = translator.translate("render");
        expect(translatedStr.substr(0,2)).toBe("RR");
        expect(translatedStr.substr(translatedStr.length-3,2)).not.toBe("RR");
      });

      it ('should work with a sentece.', function () {
        var testStrings = [
          "My all relatives are living in Korea.",
          "How are you?",
          "Relational database are commonly used in industry."
        ];
        expect(checkWithSimpleRule (testStrings, /r|R/g, "RR")).toBe(true);
      });
      it ('should work with multiple sentences.', function () {
        var testString =  "My all relatives are living in Korea. " +
                          "How are you? " +
                          "Relational database are commonly used in industry."
        expect(checkWithSimpleRule (testString, /r|R/g, "RR")).toBe(true);
      });
    });

    // "w" or "W' is replaced by "wRw"
    describe('Rule9: <w or W> --> <wRw>', function () {
      it ('should work with simple words.', function () {
        var testStrings = ["World", "window", "Downy"];
        expect(checkWithSimpleRule (testStrings, /w|W/g, "wRw")).toBe(true);
      });
      it ('should work with a sentece.', function () {
        var testStrings = [
          "Now, it is a show time!",
          "Would you, please, open the window?",
          "I would like to hear today news."
        ];
        expect(checkWithSimpleRule (testStrings, /w|W/g, "wRw")).toBe(true);
      });
      it ('should work with multiple sentences.', function () {
        var testString =  "Now, it is a show time! " +
                          "Would you, please, open the window? " +
                          "I would like to hear today news."
        expect(checkWithSimpleRule (testString, /w|W/g, "wRw")).toBe(true);
      });
    });

    //10. "y" or "Y' is replaced by "wwRy"
    describe('Rule10: <y or Y> --> <wwRy>', function () {
      it ('should work with simple words.', function () {
        var testStrings = ["Yellow", "envy", "Toyota"];
        expect(checkWithSimpleRule (testStrings, /y|Y/g, "wwRy")).toBe(true);
      });
      it ('should work with a sentece.', function () {
        var testStrings = [
          "Young in heart.",
          "Did you buy the yellow yarn.",
          "I couldn\'t stop yawning during the meeting."
        ];
        expect(checkWithSimpleRule (testStrings, /y|Y/g, "wwRy")).toBe(true);
      });
      it ('should work with multiple sentences.', function () {
        var testString =  "Young in heart." +
                          "Did you buy the yellow yarn. " +
                          "I couldn\'t stop yawning during the meeting.";
        expect(checkWithSimpleRule (testString, /y|Y/g, "wwRy")).toBe(true);
      });
    });

    // ------------------------------------------------------------------------------------
    // Apply the rule replacing chToReplace with strReplaceWith to given string(strToTest)
    // Returns true if the rule is working.
    //  strToTest: String to test
    //  chToReplace: A character being replaced (it could be RegExp object)
    //  strReplaceWith: A string to replace with.
    // ------------------------------------------------------------------------------------
    function checkWithSimpleRule (testStrings, chToReplace, strReplaceWith) {
      if (typeof testStrings === 'string') {
        return _checkWithSimpleRule (testStrings, chToReplace, strReplaceWith);
      } else {
        for (var i=0; i<testStrings.length; i++) {
          var isOK = _checkWithSimpleRule(testStrings[i], chToReplace, strReplaceWith);
          if (!isOK) return false;
        }
        return true;
      }
    }

    function _checkWithSimpleRule (strToTest, chToReplace, strReplaceWith) {

      var convCh = "_";
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

      var original = translator.translate(strToTest);
      var modified = translator.translate(strConverted);

      var capStrReplaceWith = strReplaceWith.charAt(0).toUpperCase() + strReplaceWith.substring(1);
      var beginWithCapitalized = (strToTest.search(regexpToReplace) === 0);

      var currentStr = original;
      var splitModified = modified.split(convCh);
      for (var id=0; id<splitModified.length; id++) {
        var strToken = splitModified[id];

        var needCapitalized = false;
        if (strToken.length > 0) {
          // strToken should appear the beginning of currentStr string.
          if (currentStr.substr(0, strToken.length) != strToken) return false;

          // If strToken is the end of a sentece, next character needs to be replace with
          // capitalized.
          needCapitalized = /[\.|!|\?]\s*$/.test(strToken);
        } else if (id === 0) {
          // Check to see if the strToTest starts with chToReplace.
          needCapitalized = beginWithCapitalized;
        }

        // Extract remaining string followed by the strToken.
        var nextStr = currentStr.substr(strToken.length);
        if (nextStr.length === 0) break;

        // The nextStr should start with strReplaceWith.
        var searchStr = needCapitalized ? capStrReplaceWith : strReplaceWith;
        if (nextStr.substr(0, searchStr.length) != searchStr) return false;

        currentStr = nextStr.substr(strReplaceWith.length);
        if (currentStr === undefined || currentStr.length == 0) break;
      }
      return true;
    }

  });


});
