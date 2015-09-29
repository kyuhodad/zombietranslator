# Zombie Translator

This project translates English to Zombie language based on the following 10 rules.

  1. Lower-case "r" at the end of words replaced with "rh".
  2. An "a" or "A" by itself will be replaced with "hra".
  3. The starts of sentences are capitalised. The "start of a sentence" means
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
+-- karma.conf.js (Karma configuation file)
+-- README.md 
+-- test-main.js (Karna testing main)
+-- js
|   +-- app
|   |   +-- translatorMain.js (Application main. It gets called from js/app.js.)
|   |   +-- zombieTranslator.js (Provides two methods, zombify() and unzombify().)
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
