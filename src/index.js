var taglib = require('taglib');
var path = require('path');
var mp3Path = path.join(__dirname, '../test/test.mp3');
var coverPath = path.join(__dirname, '../test/cover.jpg');
var getLyric = require('get-lyrics-api');
var Discogs = require('disconnect').Client;

//{
//  album: 'Jovem Nerd',
//  artist: 'NC353 - Alottoni, JP, Bluehand, Eduardo Spohr, Tucano e Azaghal',
//  comment: 'A história da guerra que dividiu a Coreia.',
//  genre: 'Podcast',
//  title: 'Nerdcast 353 - Coreia Style',
//  track: 0,
//  year: 2013
//}
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var artist = process.argv[2] || 'angra';
var song = process.argv[3] || 'time';
//var oAuth = new Discogs({
//  consumerKey: process.env.KEY,
//  consumerSecret: process.env.SECRET
//}).oauth();
//oAuth.getRequestToken(
//  process.env.KEY,
//  process.env.SECRET,
//  'http://your-script-url/callback',
//  function (err, requestData) {
//    // Persist "requestData" here so that the callback handler can
//    // access it later after returning from the authorize url
//    console.log(requestData, ' --- request');
//    rl.question("enter oauth_verifier", function (oauth_verifier) {
//      new Discogs(requestData).oauth().getAccessToken(
//        oauth_verifier, // Verification code sent back by Discogs
//        function (err, accessData) {
// Persist "accessData" here for following OAuth calls
//var dis = new Discogs(accessData);
var dis = new Discogs({
  method: 'oauth',
  level: 2,
  consumerKey: 'lNCWskkUTVsXZoVnXmaX',
  consumerSecret: 'lGtlNkBapacFPvrqhQPSmfvyjLKRdGkV',
  token: 'iPUymulsgFHqDzbHZYfZOgpkkxHrWBWkKcnWuPKK',
  tokenSecret: 'eBWpPFYqCfssngYNEiDYajnOfFhqTqTFAatopQsj'
});
get(artist, song, dis);
//          console.log(accessData);
//        }
//      );
//      rl.close();
//    });
//  }
//);

function callback(err, tag) {
    console.log();
    console.log();
    console.log(err, tag);
  }
  //taglib.tag(mp3Path, function (err, tag) {

function get(artist, song, dis) {
  var db = dis.database();
  getLyric.get(artist, song).then(function (obj) {
    var song = obj.song;
    db.search(artist + ' - ' + song.albumName, function (err, data) {
      if (data.results && data.results[0]) {
        db.release(data.results[0].id, function (err, release) {
          console.log(release.images[0].uri);
          var imageUriSplit = release.images[0].uri.split('/');
          console.log(imageUriSplit[imageUriSplit.length - 1]);
          db.image(imageUriSplit[imageUriSplit.length - 1], function (err, image, rateLimit) {
            //            Data contains the raw binary image data
            console.log(err);

//              var id3 = require('id3-writer');
//              var writer = new id3.Writer();
//
//              var mp3 = new id3.File(mp3Path);
//              var coverImage = new id3.Image(coverPath);
//
//              var meta = new id3.Meta({
//                artist: song.artistName,
//                title: song.name,
//                album: song.albumName,
//                year: parseInt(song.albumYear),
//                //lyric: song.lyric
//              }, [coverImage]);
//
//              writer.setFile(mp3).write(meta, function (err) {
//                console.log(err);
//                if (err) {
//                  // Handle the error
//                }
//
//                // Done
//              });
            require('fs').writeFile(imageUriSplit[imageUriSplit.length - 1], data, 'binary', function (err) {
              //data.pipe(fs.createWriteStream(mp3Path)).on('close', function (err) {
              // See your current limits
              console.log(err, rateLimit);
              console.log('Image saved!');
            });
          });
        });
      }
    });
    //    tag.artist = song.artistName;
    //    tag.title = song.name;
    //    tag.album = song.albumName;
    //    tag.year = song.albumYear;
    //    tag.lyrics = song.lyric;
    //    tag.saveSync();
    //    taglib.read(mp3Path, callback);
  });

  //});
  var fs = require('fs'),
    request = require('request');

  var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);

      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };
}
