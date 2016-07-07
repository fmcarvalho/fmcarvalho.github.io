/*FeedEk jQuery RSS/ATOM Feed Plugin v2.0
* http://jquery-plugins.net/FeedEk/FeedEk.html  
* https://github.com/enginkizil/FeedEk
* Author : Engin KIZIL http://www.enginkizil.com */

(function ($) {
    $.fn.FeedEk = function (opt) {
        var def = $.extend({
            FeedUrl: "http://rss.cnn.com/rss/edition.rss",
            MaxCount: 300,
            ShowDesc: true,
            ShowPubDate: true,
            CharacterLimit: 0,
            TitleLinkTarget: "_blank",
            DateFormat: "",
            DateFormatLang: "en"
        }, opt);
        var id = $(this).attr("id"), i, s = "", dt;
        $("#" + id).empty().append('<center><img src="/assets/loading_spinner.gif" /></center>');
        $.ajax({
            url: "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + def.MaxCount + "&output=json&q=" + encodeURIComponent(def.FeedUrl) + "&hl=en&callback=?", dataType: "json", success: function (data) {
                $("#" + id).empty();
                
                var grades = ["[A+", "[A","[A-","[B+","[B","[B-","[C+","[C","[C-","[D+","[D","[D-","[E+","[E","[E-"]
                function keyOf(movie) {
                    var words = movie.link.split('/')
                    return words[words.length - 2]
                }
                var moviesGrades = data.responseData.feed.entries.reduce(
                    function(prev, curr){ 
                        var g = curr.content.split(']')[0]
                        prev[keyOf(curr)] = grades.indexOf(g)
                        return prev; 
                    },
                    {}
                )
                function gradeOf(movie) {
                    return moviesGrades[keyOf(movie)]
                }
                
                data.responseData.feed.entries.sort(function (a, b) { return gradeOf(a) - gradeOf(b); });
                $.each(data.responseData.feed.entries, function (e, item) {
                    s += '<li><div class="itemTitle"><a href="' + item.link + '" target="' + def.TitleLinkTarget + '" >' + item.title + "</a></div>";
                    if (def.ShowPubDate) {
                        dt = new Date(item.publishedDate);
                        if ($.trim(def.DateFormat).length > 0) {
                            try {
                                moment.lang(def.DateFormatLang);
                                s += '<div class="itemDate">' + moment(dt).format(def.DateFormat) + "</div>"
                            } catch (e) { s += '<div class="itemDate">' + dt.toLocaleDateString() + "</div>" }
                        } else { s += '<div class="itemDate">' + dt.toLocaleDateString() + "</div>" }
                    } if (def.ShowDesc) { if (def.DescCharacterLimit > 0 && item.content.length > def.DescCharacterLimit) { s += '<div class="itemContent">' + item.content.substr(0, def.DescCharacterLimit) + "...</div>" } else { s += '<div class="itemContent">' + item.content + "</div>" } }
                });
                $("#" + id).append('<ul class="feedEkList">' + s + "</ul>")
            }
        })
    }
})(jQuery);