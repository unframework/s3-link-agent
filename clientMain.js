var vdomLive = require('vdom-live');

var ClientWidget = require('./lib/ClientWidget');
var Auth = require('./lib/Auth');
var AuthWallView = require('./lib/AuthWallView');

var LINK_AGENT_MAIN_ROUTE = '/s3-link-agent-main.js';

var downloadPath = window.DOWNLOAD_PATH;

// @todo fill console object as needed

function main() {
    new ClientWidget(LINK_AGENT_MAIN_ROUTE, function (baseURLPrefix) {
        var rootNode = null;

        vdomLive(function (renderLive, h) {
            var auth = new Auth(baseURLPrefix);

            var authView = new AuthWallView(auth, h, downloadPath);
            rootNode = renderLive(function () {
                return authView.render();
            });
        });

        return rootNode;
    }, function (baseURLPrefix, rootNode) {
        document.body.appendChild(rootNode);
    });
}

main();