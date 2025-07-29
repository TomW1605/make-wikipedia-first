const StorageArea = chrome.storage.local;

function move_results() {
    StorageArea.get(null, function (options) {
        const results = [];
        for (let i = 0; i < options['domains'].length; i++) {
            const domain = options['domains'][i];
            if (options['number'] === 'first') {
                if (options['highlight']) {
                    results.push($('cite:contains("' + domain + '")').parents().eq(10).css('background', HIGHLIGHT_COLOR));
                } else {
                    results.push($('cite:contains("' + domain + '")').parents().eq(10));
                }
            } else if (options['number'] === 'all') {
                $('cite:contains("' + domain + '")').each(function (i, e) {
                    if ($(e).css('visibility') === "visible") {
                        if (options['highlight']) {
                            $(e).parents().eq(10).css('background', options['highlightColor']);
                        }
                        results.push($(e).parents().eq(10));
                    }
                });
            }
        }
        $('#rso').prepend(results);
    });
}

document.onreadystatechange = function() {
    if (document.readyState === "interactive") {
        console.log('Moving Wikipedia to #1');
        move_results();
    }
}
