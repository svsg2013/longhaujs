var urlSlug = require('url-slug');

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

module.exports = {
    defaultURL: {
        uri: 'http://www.longhau.com.vn/tin-tuc-su-kien?pagenumber=1',
        jar:true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
        },
    },
    processor: function (res, $, save, crawlList, crawlDetail) {
        var listTitle=[];
        var UriName= 'http://www.longhau.com.vn/';
        var getTitle= $('h2.title-news >a[href]').length;
        if (getTitle >0){
            $('h2.title-news').find('a').each(function () {
                listTitle.push($(this).attr('href'));
            })
        }
        //--------start
        // var list=[];
        // var tieude=$('h2.title-news').text();
        // var tieude=[];
        // var countTitle=$('h2.title-news > a').length;
        // var getThum= $('div.item-news >a.news-img img').length;
        // if (getThum > 0 && countTitle > 0){
        //     $('h2.title-news > a').each(function () {
        //         tieude.push($(this).text());
        //     });
        //     $('div.item-news >a.news-img').find('img').each(function () {
        //         list.push($(this).attr('src'));
        //     })
        // }
        //-----end
        var linkProd= listTitle.map(function (getlink) {
            return{
                uri: getlink,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
                },
            };
        });
        var linkName= 'http://www.longhau.com.vn/tin-tuc-su-kien?pagenumber=';
        var pagiNews=[];
        var i=0;
        for(i=2;i <= 63;i++){
            pagiNews.push(linkName+i);
            var getListNews= pagiNews.map(function (getLinkPagi) {
               return {
                   uri: getLinkPagi,
                   headers: {
                       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
                   },
               }
            });
        }
        crawlDetail(linkProd);
        // save({tieude:tieude,img:list});
        crawlList(getListNews);
    },
    processDetail: function (res, $, save, crawlList, crawlDetail) {
        var newsTitle= $('div.detail-news').find('h1').text();
        var dayNews= $('div.newsdate').text();
        var desNews= $('div.newstext >p span:nth-child(1)').text();
        var newsDetail= $('div.newstext').html();
        var listImgs=[];
        var domainName='http://longhau.com.vn';
        var getCountImg= $('div.newstext').find('img').length;
        if (getCountImg > 0){
            $('div.newstext').find('img').each(function () {
                listImgs.push(domainName + $(this).attr('src'));
            })
        }
        save('',{
            ngay: dayNews,
            tieude: newsTitle,
            mieuta: desNews,
            noidung: newsDetail
        });
    },
};
