
var express = require('express');
var SW = require('songle-widget');

// Initialize the player and set music
var tokens = {
    accessToken: '00000005-UEXXuKd' // Access token
  , secretToken: '2XNyvxFcjKRjoaTAfFiLtdbQJF8rkPaV' // Secret token
};
var player = new SW.Player(tokens);
player.useMedia(
  new SW.Media.Headless("https://youtube.com/watch?v=xOKplMgHxxA")
);
player.addPlugin(new SW.Plugin.SongleSync());

// Rewind
function rewind() {
  console.log('seek to 0');
  player.seekTo(0);
  setTimeout(function () {
    console.log('play');
    player.play();
  }, 1000);
}
rewind();

// Rewind when the playback finishes
player.on('finish', rewind);

// Print playback position to the console
setInterval(function () {
  console.log('server time:', player.position);
}, 1000);

// HTTP server
var app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

app.get('/play', function (req, res) {
  player.play();
  res.json({ "message": "start playing" });
});

app.get('/pause', function (req, res) {
  player.pause();
  res.json({ "message": "pause playing" });
});

app.get('/rewind', function (req, res) {
  player.seekTo(0);
  res.json({ "message": "seek to the beginning" });
});

app.get('/', function (req, res) {
  res.render('index', tokens);
});

app.get('/json', function (req, res) {
  res.json({ "accessToken": tokens.accessToken });
});

app.listen(process.env.PORT || 8080);
