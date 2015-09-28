define(['zombifyRules'], function(ZombifyRules){
  var zombifyRules = {};

  describe('Zombify Rules', function () {
    beforeEach(function() {
      zombifyRules = new ZombifyRules;
    });

    describe('Rule1: <r> at the end of words --> <rh>', function() {

      beforeEach(function() {
        var ruleId = ZombifyRules.RULE.ZR_r_AtEOW.id;
        zombifyRules.initRules (ruleId);
        this.ruleFunction = zombifyRules.getRule (ruleId);
        spyOn (this.ruleFunction, 'getReplaceStrForEtoZ').and.callThrough();
      });

      it('should replace r at the end of words with rh.', function () {
        expect(zombifyRules.applyRules(true,'incubator')).toBe('incubatorh');
      });
      it('should not apply on any r which is not at the end of words.', function () {
        expect(zombifyRules.applyRules(true,'rotate')).not.toMatch('rh');
      });
      it('should call zombify method of the rule function.', function () {
        expect(zombifyRules.applyRules(true,'Terror?')).toBe('Terrorh?');
        expect(this.ruleFunction.getReplaceStrForEtoZ).toHaveBeenCalled();
      });
    });

    describe('Rule2:  <a or A> itself --> <hra>', function() {
      beforeEach(function() {
        var ruleId = ZombifyRules.RULE.ZR_aA_ALONE.id;
        zombifyRules.initRules (ruleId);
        this.ruleFunction = zombifyRules.getRule (ruleId);
        spyOn (this.ruleFunction, 'getReplaceStrForEtoZ').and.callThrough();
      });

      it('should replace a with rha.', function () {
        expect(zombifyRules.applyRules(true,'a monitor')).toBe('hra monitor');
      });
      it('should not apply on any a which is not itself.', function () {
        expect(zombifyRules.applyRules(true,'rotate')).not.toMatch('hra');
      });
      it('should call zombify method of the rule function.', function () {
        expect(zombifyRules.applyRules(true,'Send me a cup of coffee.')).toBe('Send me hra cup of coffee.');
        expect(this.ruleFunction.getReplaceStrForEtoZ).toHaveBeenCalled();
      });
    });

  });

});
