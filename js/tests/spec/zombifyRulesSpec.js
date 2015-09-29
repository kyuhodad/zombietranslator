define(['zombifyRules'], function(ZombifyRules){
  var zombifyRules = {};

  describe('Zombify Rules: Test each rules, individually', function () {
    beforeEach(function() {
      zombifyRules = new ZombifyRules;

      this.initSpec = function (ruleId, isRegularRule, additionalRulesId) {
        if (isRegularRule === undefined) isRegularRule = true;
        if (additionalRulesId  === undefined) additionalRulesId = 0;

        zombifyRules.initRules (ruleId | additionalRulesId);
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

    describe('Rule4: <e or E> --> <rr>', function() {
      beforeEach(function() {
        this.initSpec(ZombifyRules.RULE.ZR_eE_SIMPLE.id);
      });
      it('should replace e or E with rr.', function () {
        expect(zombifyRules.applyRules(true,'elEven')).toBe('rrlrrvrrn');
      });
      it('should work with multiple sentences.', function () {
        var ruleAppliedStr = zombifyRules.applyRules(true,'first sentece. second sentece? third sentece!');
        expect(ruleAppliedStr).toMatch(/^.+srrntrrcrr.+srr.+srrntrrcrr.+srrntrrcrr!$/);
      });
      it('should call zombify method of the rule function.', function () {
        expect(zombifyRules.applyRules(true,'first sentece.')).toBe('first srrntrrcrr.');
        expect(this.functionToSpy).toHaveBeenCalled();
      });
    });

    describe('Rule5: <i or I> --> <rrRr>', function() {
      beforeEach(function() {
        this.initSpec(ZombifyRules.RULE.ZR_iI_SIMPLE.id);
      });
      it('should replace i or I with rrRr.', function () {
        expect(zombifyRules.applyRules(true,'Iteration')).toBe('rrRrteratrrRron');
      });
      it('should work with multiple sentences.', function () {
        var ruleAppliedStr = zombifyRules.applyRules(true,'first sentece. second sentece? third sentece!');
        expect(ruleAppliedStr).toMatch(/^frrRrr.+hrrRrrd.+$/);
      });
      it('should call zombify method of the rule function.', function () {
        expect(zombifyRules.applyRules(true,'first sentece.')).toBe('frrRrrst sentece.');
        expect(this.functionToSpy).toHaveBeenCalled();
      });
    });

    describe('Rule6: <o or O> --> <rrrRr>', function() {
      beforeEach(function() {
        this.initSpec(ZombifyRules.RULE.ZR_oO_SIMPLE.id);
      });
      it('should replace o or O with rrrRr.', function () {
        expect(zombifyRules.applyRules(true,'Operation')).toBe('rrrRrperatirrrRrn');
      });
      it('should work with multiple sentences.', function () {
        var ruleAppliedStr = zombifyRules.applyRules(true,'first Option. second section? third piano!');
        expect(ruleAppliedStr).toMatch(/^.+\srrrRrptirrrRrn.+crrrRrn.+irrrRrn.+nrrrRr!$/);
      });
      it('should call zombify method of the rule function.', function () {
        expect(zombifyRules.applyRules(true,'first Option.')).toBe('first rrrRrptirrrRrn.');
        expect(this.functionToSpy).toHaveBeenCalled();
      });
    });

    describe('Rule7: <u or U> --> <rrrrRr>', function() {
      beforeEach(function() {
        this.initSpec(ZombifyRules.RULE.ZR_uU_SIMPLE.id);
      });
      it('should replace u or U with rrrrRr.', function () {
        expect(zombifyRules.applyRules(true,'Using tutorial')).toBe('rrrrRrsing trrrrRrtorial');
      });
      it('should work with multiple sentences.', function () {
        var ruleAppliedStr = zombifyRules.applyRules(true,'first tutorial. second Users? third union!');
        expect(ruleAppliedStr).toMatch(/^.+\strrrrRrt.+d\srrrrRrs.+d rrrrRrn.+$/);
      });
      it('should call zombify method of the rule function.', function () {
        expect(zombifyRules.applyRules(true,'Labor union')).toBe('Labor rrrrRrnion');
        expect(this.functionToSpy).toHaveBeenCalled();
      });
    });

    describe('Rule8: <r or R> --> <RR>', function() {
      it('should replace r or R with RR.', function () {
        this.initSpec(ZombifyRules.RULE.ZR_rR_SIMPLE.id);
        expect(zombifyRules.applyRules(true,'Recreation')).toBe('RRecRReation');
      });
      it('should have an except if r is at the end of a word while applying rule1.', function () {
        this.initSpec(ZombifyRules.RULE.ZR_rR_SIMPLE.id, true, ZombifyRules.RULE.ZR_r_AtEOW.id);
        var ruleAppliedStr = zombifyRules.applyRules(true,'Realtor lawyer');
        expect(ruleAppliedStr).toMatch(/^RRe.+orh.+erh$/);
      });
      it('should call zombify method of the rule function.', function () {
        this.initSpec(ZombifyRules.RULE.ZR_rR_SIMPLE.id);
        expect(zombifyRules.applyRules(true,'Relation')).toBe('RRelation');
        expect(this.functionToSpy).toHaveBeenCalled();
      });
    });

    describe('Rule9: <w or W> --> <wRw>', function() {
      beforeEach(function() {
        this.initSpec(ZombifyRules.RULE.ZR_wW_SIMPLE.id);
      });
      it('should replace w or W with wRw.', function () {
        expect(zombifyRules.applyRules(true,'Wonder twins')).toBe('wRwonder twRwins');
      });
      it('should work with multiple sentences.', function () {
        var ruleAppliedStr = zombifyRules.applyRules(true,'first window. second twin? third winers!');
        expect(ruleAppliedStr).toMatch(/^.+t wRwi.+owRw\..+twRwi.+d wRwi.+$/);
      });
      it('should call zombify method of the rule function.', function () {
        expect(zombifyRules.applyRules(true,'Tweaking rules')).toBe('TwRweaking rules');
        expect(this.functionToSpy).toHaveBeenCalled();
      });
    });

    describe('Rule10: <y or Y> --> <wwRy>', function() {
      beforeEach(function() {
        this.initSpec(ZombifyRules.RULE.ZR_yY_SIMPLE.id);
      });
      it('should replace w or W with wwRy.', function () {
        expect(zombifyRules.applyRules(true,'Yellow canary')).toBe('wwRyellow canarwwRy');
      });
      it('should work with multiple sentences.', function () {
        var ruleAppliedStr = zombifyRules.applyRules(true,'Toy story. Youtube history? you are the youngest!');
        expect(ruleAppliedStr).toMatch(/^TowwRy .+rwwRy\. wwRyo.+rwwRy\? wwRyo.+ wwRyo.+$/);
      });
      it('should call zombify method of the rule function.', function () {
        expect(zombifyRules.applyRules(true,'Typed the story')).toBe('TwwRyped the storwwRy');
        expect(this.functionToSpy).toHaveBeenCalled();
      });
    });

  });

});
