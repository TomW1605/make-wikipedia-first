const StorageAreaSync = chrome.storage.sync;
const StorageAreaLocal = chrome.storage.local;

function save_options() {
  $('#status').hide();

  let domains = $('#domains').val().split(',').map(function(item) {
    return item.trim();
  });
  StorageAreaLocal.set(
    {
      'domains': domains,
      'number': $('#number').val(),
      'highlight': $('#highlight').is(':checked'),
      'highlightColor': $('#highlightColor').val()
    }
  );

  $('#status').html('Options Saved.').slideDown();
  setTimeout(function() {
    $('#status').slideUp().empty();
  }, 1000);
}

function restore_options() {
  StorageAreaLocal.get(null, function (options) {
    $('#domains').val(options['domains'].join(',') || 'wikipedia');
    $('#number').val(options['number'] || 'all');
    $('#highlight').prop('checked', options['highlight'] || false);
    $('#highlightColor').val(options['highlightColor'] || '#FFFFCC');
  });
}

function light_default() {
  $('#highlightColor').val('#FFFFCC');
}
function dark_default() {
  $('#highlightColor').val('#3D3D00');
}

function sync_to_account() {
  save_options();
  StorageAreaLocal.get(null, function (options) {
    StorageAreaSync.set({
      'domains': options['domains'] || [],
      'number': options['number'] || 'all',
      'highlight': options['highlight'] || false,
      'highlightColor': options['highlightColor'] || '#FFFFCC'
    }).then(() => {
      $('#status').html('Options synced to account.').slideDown();
      setTimeout(function() {
        $('#status').slideUp().empty();
      }, 1000);
    });
  });
}

function sync_from_account() {
  StorageAreaSync.get(null, function (options) {
    StorageAreaLocal.set({
    'domains': options['domains'] || [],
    'number': options['number'] || 'all',
    'highlight': options['highlight'] || false,
    'highlightColor': options['highlightColor'] || '#FFFFCC'
    }).then(() => {
    $('#status').html('Options synced from account.').slideDown();
      setTimeout(function() {
        $('#status').slideUp().empty();
      }, 1000);
    });
  });
    restore_options();
}

$(restore_options);
$('#save').click(save_options);
$('#lightDefault').click(light_default);
$('#darkDefault').click(dark_default);
$('#syncToAccount').click(sync_to_account);
$('#syncFromAccount').click(sync_from_account);