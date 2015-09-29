# Zombie Translator

This project translates English to Zombie language based on the following 10 rules. The rule is implemented by using RegExp.

  1. Lower-case "r" at the end of words replaced with "rh".
  2. An "a" or "A" by itself will be replaced with "hra".
  3. The starts of sentences are capitalized. The "start of a sentence" means
    - Case1: The first visible letter of whole string to translate.
    - Case2: Any occurrence of ".!?", followed by a space, followed by a letter.
  4. "e" or "E" is replaced by "rr".
  5. "i" or "I" is replaced by "rrRr".
  6. "o" or "O" is replaced by "rrrRr".
  7. "u" or "U" is replaced by "rrrrRr".
  8. "r" or "R' is replaced by "RR"
  9. "w" or "W' is replaced by "wRw"
  10. "y" or "Y' is replaced by "wwRy"

### Code Structure
```
+-- index.html (Main html of the application)
+-- karma.conf.js (Karma configuration file)
+-- README.md
+-- test-main.js (Karna testing main)
+-- js
|   +-- app
|   |   +-- translatorMain.js (Application main. It gets called from js/app.js.)
|   |   +-- zombieTranslator.js (Provides two methods, translate() and translateBack().)
|   |   +-- zombifyRules.js (Defines 10 translate rules and apply the rules to given string.)
|   +-- tests
|   |   +-- spec (Folder for all test codes)
|   |   |   +-- test-main.js (Main codes for Jasmine based test)
|   |   |   +-- zombieTranslatorSpec.js (Test codes for zombify() and unzombify() of zombieTranslator module)
|   |   |   +-- zombifyRulesSpec.js (Test codes for individual rules of zombifyRules module)
|   |   +-- index.html (Html for Jasmine test)
|   +-- vendors
+-- css
```
### Tests

There are two specs for the testing, `zombifyRulesSpec` and `zombieTranslatorSpec`.
  * `zombifyRulesSpec`: Test all the rules individually. The test is done with enabling only one rule at a time. In this way, it can be made sure each rule working properly without any interference from other rules.
    - `toBe()`, `toMatch()`, and `toHaveBeenCalled()` are used in all the specs.
    - `toBe()`: Test to check for simple word testing.
    - `toMatch()`: Test to check for long sentences testing.
    - `toHaveBeenCalled()`: Test to see if a proper rule function gets called.

  * `zombieTranslatorSpec`: Test for the rules all together. It tests various cases for each rules with simple words and multiple sentences. Also, this test includes round trip test for unzombify testing. This tests, mainly, uses `toBe()` and `toMatch()` functions.
