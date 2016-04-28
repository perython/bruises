var isProd = process.env.NODE_ENV === 'production';

var express = require('express');
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('./webpack.config');
var config = require('./server_config');

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var client_id = config.spotify.client_id;
var client_secret = config.spotify.client_secret;
var redirect_uri = config.spotify.redirect_uri;

var app = new express();
var port = isProd ? 8081 : 3000;

if (!isProd) {
  var compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: webpackConfig.output.publicPath}));
  app.use(webpackHotMiddleware(compiler));
}
app.use(cookieParser());

var indexPath;
if (isProd) {
  indexPath = __dirname + '/static/index.html';
} else {
  indexPath = __dirname + '/assets/index.html';
}

const getContent = function(options) {
  return new Promise((resolve, reject) => {
    request.get(options, function(error, response, body) {
      if (error) {
        reject(new Error('Error'));
      }
      resolve(body);
    });
  });
};

app.get('/', function(req, res) {
  res.sendFile(indexPath);
});

app.get('/api-bruises/login', function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  var scope = 'user-follow-read user-top-read user-library-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/api-bruises/callback', function(req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  var prefix = isProd ? '/bruises' : '/';

  if (state === null || state !== storedState) {

    res.redirect(prefix + '#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        res.redirect(prefix + '?' +
          querystring.stringify({
            access_token: body.access_token,
            refresh_token: body.refresh_token
          }));
      } else {
        res.redirect(prefix + '#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/api-bruises/refresh_token', function(req, res) {
  var refreshToken = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({access_token: body.access_token}));
    }
  });
});

app.get('/api-bruises/me', function(req, res) {
  var accessToken = req.query.access_token;

  if (accessToken) {
    var options = {
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    };

    Promise.all([
      getContent(Object.assign({}, {
        url: 'https://api.spotify.com/v1/me'
      }, options)),
      getContent(Object.assign({}, {
        url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50'
      }, options))
    ]).then((data) => {
      var result = Object.assign({}, data[0], {
        followed_artists: data[1].artists.items
      });
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(result));
    }).catch((error) => {
      console.log(error)
    });

  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({'error': 'Access token is required'}));
  }
});

app.get('/api-bruises/me/top/:type', function(req, res) {
  var accessToken = req.query.access_token;
  var type = req.params.type;

  if (accessToken) {
    var options = {
      url: 'https://api.spotify.com/v1/me/top/' + type,
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    };

    request.get(options, function(error, response, body) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(body));
    });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({'error': 'Access token is required'}));
  }
});

app.get('/api-bruises/artists/:id', function(req, res) {
  var accessToken = req.query.access_token;
  var id = req.params.id;

  if (accessToken) {
    var options = {
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    };

    Promise.all([
      getContent(Object.assign({}, {
        url: `https://api.spotify.com/v1/artists/${id}`
      }, options)),
      getContent(Object.assign({}, {
        url: `https://api.spotify.com/v1/artists/${id}/albums?market=US`
      }, options)),
      getContent(Object.assign({}, {
        url: `https://api.spotify.com/v1/artists/${id}/top-tracks?country=US`
      }, options)),
      getContent(Object.assign({}, {
        url: `https://api.spotify.com/v1/artists/${id}/related-artists`
      }, options))
    ]).then((data) => {
      var result = Object.assign({}, data[0], {
        albums: data[1].items,
        top_tracks: data[2].tracks,
        related_artists: data[3].artists
      });
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(result));
    }).catch((error) => {
      console.log(error)
    });

  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({'error': 'Access token is required'}));
  }
});

app.get('/api-bruises/me/tracks', function(req, res) {
  var accessToken = req.query.access_token;

  if (accessToken) {
    var options = {
      url: 'https://api.spotify.com/v1/me/tracks?limit=50',
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    };

    request.get(options, function(error, response, body) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(body));
    });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({'error': 'Access token is required'}));
  }
});

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});
