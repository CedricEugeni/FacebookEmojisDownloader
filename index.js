var http = require('http');
var httpreq = require('httpreq');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var url = "http://emojipedia.org/messenger/1.0/";
var base = "http://emojipedia.org";
// JSDOM.fromURL(url, null).then(dom => {
//     console.log("zefouzehrgohzeriog");
//     console.log(dom.serialize());
// });
var paths = Array();
var images = Array();

function downloadImage(index) {
    httpreq.download(images[index], "images/" + index + ".png", function (err, progress) {
        if (err) {
            console.log(err);
        }
    }, function (err, res) {
        console.log("finished downloading image at index : " + index + " on " + images.length);
        if (err) {
            console.log(err);
        }
        if (index < images.length - 1) {
            downloadImage(index + 1);
        }
    });
};

function loadImageHtml(index) {
    http.get(paths[index], function(res) {
        var bodyp = '';
    
        res.on('data', function(chunk) {
            bodyp += chunk;
        });
    
        res.on('end', function() {
            console.log("finished downloading image HTML at index : " + index + " on " + paths.length);
            const domp = new JSDOM(bodyp);
            var $$ = require('jquery')(domp.window);
            var section = $$('.vendor-set-emoji-image');
            var child = section[0].children[0];
            //console.log(child.srcset.split(' ')[0]);
            images.push(child.srcset.split(' ')[0]);

            if (index < 15) {
                loadImageHtml(index + 1);
            } else {
                downloadImage(0);
            }
        });
    }).on('error', function(e){
        console.log("Got an error: ", e);
    });
};

http.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
        body += chunk;
    });

    res.on('end', function(){
        console.log("finished downloading first HTML");
        const dom = new JSDOM(body);
        var $ = require('jquery')(dom.window);
        var elements = $('.emoji-grid')[0].children;
        var i = 0;

        while (i < elements.length) {
            var elt = elements[i];
            var children = elt.children;
            paths.push(base + children[0].href);
            i++;
        }

        loadImageHtml(0);
    });
}).on('error', function(e){
    console.log("Got an error: ", e);
});