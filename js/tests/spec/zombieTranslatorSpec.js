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

  });


});
