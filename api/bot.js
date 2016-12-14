
var api = { console: { autoLoad: true} };

var express = require('express'),
  router = api.router = express.Router(),
  docRouter = require('docrouter').docRouter,
  request = require('request'),
  users = require('../auth/users'),
  config = require('../config');

module.exports = api;

docRouter(router, "/api/bot", function (router) {

  router.post('/start', function (req, res) { 

    var width = req.query.width || '400px';
    var height = req.query.height || '600px';

    var botIframeHandle = config.bot.webchat.handle;
    var botIframeSecret = config.bot.webchat.secret;

    if (!botIframeHandle || !botIframeSecret) {
      var msg = 'Please provide BOT_IFRAME_HANDLE and BOT_IFRAME_SECRET environment variables';
      console.error(msg);
      return res.end(msg);
    }

    var botIframeUrl = 'https://webchat.botframework.com/embed/' + botIframeHandle + '?s=' + botIframeSecret;
    var iframe = "<iframe height='" + height + "' width='" + width + "' src='" + botIframeUrl + "'></iframe>";
  
    res.end(iframe);

  },
  {
      id: 'bot_start',
      name: 'start',
      usage: 'bot start [--width 400px --height 600px]',
      example: 'bot start',
      doc: 'starts a bot session',
      params: {
        "width": {
          "short": "w",
          "type": "string",
          "doc": "width for the bot window",
          "style": "query"
        },
        "height": {
          "short": "h",
          "type": "string",
          "doc": "height for the bot window",
          "style": "query"
        }
      },
      response: { representations: ['application/json'] }
    }
  );



  router.post('/reload', function (req, res) { 

    var url = config.bot.endpoint + '/reload';
    request(url, (err, result, body) => {
        if (err) return res.json({ err: err.message });
        return res.json({
            status: result.statusMessage,
            message: body
        });
    });
  },
  {
      id: 'bot_reload',
      name: 'reload',
      usage: 'bot reload',
      example: 'bot reload',
      doc: 'reloads configuration',
      params: {
      },
      response: { representations: ['application/json'] }
    }
  );


  router.post('/skype', function (req, res) { 

    var botAppId = config.bot.appId;
    var link = "<a href='https://join.skype.com/bot/" + botAppId + "' target='_blank'><img src='https://dev.botframework.com/Client/Images/Add-To-Skype-Buttons.png'/></a>";
    res.end(link);

  },
  {
      id: 'bot_skype',
      name: 'skype',
      usage: 'bot skype',
      example: 'bot skype',
      doc: 'gets a link to add the bot contact to skype',
      params: {},
      response: { representations: ['application/json'] }
    }
  );


});
