
requirejs.config({
  "baseUrl": "js/app",

  "paths": {
    "bootstrap":  "../vendors/bootstrap.min",
    "jquery":     "../vendors/jquery.min"
  },

  "shim": {
      "bootstrap": ["jquery"]
  }
});

requirejs(["translatorMain"]);
