var Crawler = require("crawler");
var request = require("request");
var spider = require("./crawl");

function save(id, json) {
    console.log("id", id);
    console.log(JSON.stringify(json));
    console.log("----");
}

var c;
var detailC;

c = new Crawler({
    maxConnections: 10,
    rateLimit: 1000,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            if (res.$) {
                // $ is Cheerio by default
                //a lean implementation of core jQuery designed specifically for the server
                spider.processor(res, res.$, save, c.queue.bind(c), detailC.queue.bind(detailC));
            } else {
                spider.processJSON(res, res.body, save, c.queue.bind(c), detailC.queue.bind(detailC));
            }
        }
        done();
    }
});

detailC = new Crawler({
    maxConnections: 10,
    rateLimit: 1000,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            if (res.$) {
                // $ is Cheerio by default
                //a lean implementation of core jQuery designed specifically for the server
                spider.processDetail(res, res.$, save, c.queue.bind(c), detailC.queue.bind(detailC));
            } else {
                spider.processDetailJSON(res, res.body, save, c.queue.bind(c), detailC.queue.bind(detailC));
            }
        }
        done();
    }
});

// Queue just one URL, with default callback
// Pre-flight request
var pareFlightRequest = Array.isArray(spider.defaultURL) ? spider.defaultURL[0] : spider.defaultURL;
request(pareFlightRequest, function (error, res, body) {
    c.queue(spider.defaultURL);
});
