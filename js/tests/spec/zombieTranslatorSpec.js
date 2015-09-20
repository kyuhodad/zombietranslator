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
  });
});
