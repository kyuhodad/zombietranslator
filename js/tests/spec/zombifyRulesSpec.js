define(['zombifyRules'], function(ZombifyRules){
  var zombifyRules = {};

  describe('Zombify Rules', function () {
    beforeEach(function() {
      zombifyRules = new ZombifyRules;

      this.initSpec = function (ruleId, isRegularRule) {
        if (isRegularRule === undefined) isRegularRule = true;

        zombifyRules.initRules (ruleId);
        var ruleFunction = zombifyRules.getRule (ruleId);
        var functionNameToSpy = isRegularRule ? 'getReplaceStrForEtoZ' : 'zombify';
        spyOn (ruleFunction, functionNameToSpy).and.callThrough();

        this.functionToSpy = isRegularRule ? ruleFunction.getReplaceStrForEtoZ
                                           : ruleFunction.zombify;
      };
    });

    describe('Rule1: <r> at the end of words --> <rh>', function() {

      beforeEach(function() {
        this.initSpec(ZombifyRules.RULE.ZR_r_AtEOW.id);
      });

      it('should replace r at the end of words with rh.', function () {
        expect(zombifyRules.applyRules(true,'incubator')).toBe('incubatorh');
      });
      it('should not apply on any r which is not at the end of words.', function () {
        expect(zombifyRules.applyRules(true,'rotate')).not.toMatch('rh');
      });
      it('should call zombify method of the rule function.', function () {
        expect(zombifyRules.applyRules(true,'Terror?')).toBe('Terrorh?');
        expect(this.functionToSpy).toHaveBeenCalled();
      });
    });

    describe('Rule2:  <a or A> itself --> <hra>', function() {
      beforeEach(function() {
        this.initSpec(ZombifyRules.RULE.ZR_aA_ALONE.id);
      });

      it('should replace a with rha.', function () {
        expect(zombifyRules.applyRules(true,'a monitor')).toBe('hra monitor');
      });
      it('should not apply on any a which is not itself.', function () {
        expect(zombifyRules.applyRules(true,'rotate')).not.toMatch('hra');
      });
      it('should call zombify method of the rule function.', function () {
        expect(zombifyRules.applyRules(true,'Send me a cup of coffee.')).toBe('Send me hra cup of coffee.');
        expect(this.functionToSpy).toHaveBeenCalled();
      });
    });

    describe('Rule3: Capitalize the first character of sentences', function() {
      beforeEach(function() {
        this.initSpec(ZombifyRules.RULE.ZR_CAPITALIZE.id, false);
      });

      it('should capitalize the first visible character of input string.', function () {
        expect(zombifyRules.applyRules(true,'a monitor')).toBe('A monitor');
        expect(zombifyRules.applyRules(true,'   a monitor')).toBe('   A monitor');
      });
      it('should capitalize the first visible character of sentences.', function () {
        var ruleAppliedStr = zombifyRules.applyRules(true,'first sentece. second sentece? third sentece! Now, final one.');
        expect(ruleAppliedStr).toMatch(/First.+Second.+Third.+Now/);
      });
      it('should call zombify method of the rule function.', function () {
        expect(zombifyRules.applyRules(true,'first sentece.')).toBe('First sentece.');
        expect(this.functionToSpy).toHaveBeenCalled();
      });
    });

  });

});
