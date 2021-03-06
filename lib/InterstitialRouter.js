var express = require('express');

function InterstitialRouter(scriptPath, downloadPrefix) {
    // @todo rate limiting
    var interstitialApp = express.Router(); // @todo restrict domain

    // everything else is the interstitial page
    interstitialApp.get(/^\/(.*)$/, function (req, res) {
        var path = req.params[0];

        // generate relative path back to client-visible top path
        // not using absolute path to be extra resilient to URL rewriting proxies, etc
        var scriptPathParts = [ '..' ];
        var separatorCount = path.split(/\//g).length - 1;
        while (separatorCount > 0) {
            separatorCount -= 1;
            scriptPathParts.push('..');
        }

        var initStatementList = [
            'DOWNLOAD_PATH=' + JSON.stringify(scriptPathParts.join('/') + downloadPrefix + '/' + path)
        ];

        res.setHeader('Content-Type', 'text/html');
        res.send([
            '<html>',
            '<head>',
            '<link rel="icon" href="about:blank" />',
            '<script>' + initStatementList.join(';') + '</script>',
            '<script src="' + scriptPathParts.join('/') + scriptPath + '"></script>',
            '</head>',
            '</html>'
        ].join(''));
    });

    return interstitialApp;
}

module.exports = InterstitialRouter;
