var HIGHLIGHT_COLOR = 'rgba(255, 255, 204, 0.5)';
var options = {};

chrome.extension.sendMessage({type:'getPref', key:'domains'}, function(result) {
    var ret = result || ['wikipedia'];
    if (typeof ret === 'string') {
        ret = ret.split(', ');
    }
    options['domains'] = ret;
});

chrome.extension.sendMessage({type:'getPref', key:'number'}, function(result) {
    options['number'] = result || 'all';
});

chrome.extension.sendMessage({type:'getPref', key:'highlight'}, function(result) {
    options['highlight'] = result || false;
});

function move_results() {
    var results = [];
    for (var i = 0; i < options['domains'].length; i++) {
        var domain = options['domains'][i];
        if (options['number'] === 'first') {
            if (options['highlight'] === 'true') {
                results.push($('cite:contains("' + domain + '")').parents().eq(5).css('background', HIGHLIGHT_COLOR).remove());
            } else {
                results.push($('cite:contains("' + domain + '")').parents().eq(5).remove());
            }
        } else if (options['number'] === 'all') {
            $('cite:contains("' + domain + '")').each(function(i, e) {
                if (options['highlight'] === 'true') {
                    $(e).parents().eq(5).css('background', HIGHLIGHT_COLOR);
                }
                results.push($(e).parents().eq(5).remove());
            });
        }
    }
    $('#rso').prepend(results);
}

document.onreadystatechange = function() {
    if (document.readyState === "interactive") {
        console.log('Moving Wikipedia to #1');
        move_results();
    }
}
