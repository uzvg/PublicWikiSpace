/*\
title: $:/plugins/uzvg/twikoo/rawmarkup.js
type: application/javascript
module-type: startup

Loads the Twikoo script

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "twikoo-rawmarkup";
exports.platforms = ["browser"];
exports.after = ["startup"];
exports.synchronous = true;

exports.startup = function() {
    // Create a script element to load Twikoo
    var scriptElement = document.createElement("script");
    scriptElement.setAttribute("src", "https://cdn.jsdelivr.net/npm/twikoo@1.6.41/dist/twikoo.all.min.js");
    document.head.appendChild(scriptElement);
};

})();