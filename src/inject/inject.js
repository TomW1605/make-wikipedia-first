const StorageArea = chrome.storage.local;

function saveDefaultSettings() {
    StorageArea.set({
        'domains': ['wikipedia'],
        'number': 'all',
        'highlight': false,
        'highlightColor': '#FFFFCC',
        'optionsUpdated': new Date().toISOString()
    });
    move_results();
}

function move_results() {
    StorageArea.get(null, function (options) {
        const results = [];

        if (!("optionsUpdated" in options)) {
            const newDiv = document.createElement("div");
            newDiv.innerHTML = `
                <div style="margin-bottom: 30px;">
                    <h3>
                        Important: Make Wikipedia #1 Settings Reset Due to Manifest V3 Update
                    </h3>
                    <p>
                        Due to Chrome's Manifest V3 requirements, your settings have been reset. 
                        To continue using the extension, please either accept the default settings or customise them in the options page.
                        This is a one-time action required to ensure compatibility with the latest Chrome security standards.
                    </p>
                    <div style="margin-top: 8px; margin-bottom: 8px;">
                        <button id="acceptDefault" style="background: #1a73e8; color: white; border: none; padding: 8px 16px; border-radius: 4px; margin-right: 12px; cursor: pointer">
                            Use Default Settings
                        </button>
                        <button id="openSettings" style="background: white; color: #1a73e8; border: 1px solid #1a73e8; padding: 8px 16px; border-radius: 4px; cursor: pointer">
                            Customize Settings
                        </button>
                    </div>
                </div>
            `;
            newDiv.querySelector('#acceptDefault').addEventListener('click', saveDefaultSettings);
            newDiv.querySelector('#openSettings').addEventListener('click', function () {
                window.open(chrome.runtime.getURL("src/options/index.html"), '_blank');
            });
            results.push(newDiv);
        }

        for (let i = 0; i < (options['domains'] || []).length; i++) {
            const domain = options['domains'][i];
            if (options['number'] === 'first') {
				let e = $('cite:contains("' + domain + '")')[0]
				if (typeof e === 'undefined') {
					continue;
				}
                if (options['highlight']) {
                    $(e).parents().eq(10).css('background', options['highlightColor']);
                }
				if (Array.prototype.indexOf.call($('#rso')[0].children, $(e).parents().eq(13)[0]) != 0) {
					if ($(e).parents().eq(9)[0].lastChild.getElementsByTagName('img').length > 1) {
						results.push($(e).parents().eq(13));
					} else {
						results.push($(e).parents().eq(12));
					}
                }
            } else if (options['number'] === 'all') {
                $('cite:contains("' + domain + '")').each(function (i, e) {
                    if ($(e).css('visibility') === "visible") {
                        if (options['highlight']) {
                            $(e).parents().eq(10).css('background', options['highlightColor']);
                        }
						if (Array.prototype.indexOf.call($('#rso')[0].children, $(e).parents().eq(13)[0]) != 0) {
							if ($(e).parents().eq(9)[0].lastChild.getElementsByTagName('img').length > 1) {
								results.push($(e).parents().eq(13));
							} else {
								results.push($(e).parents().eq(12));
							}
						}
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
