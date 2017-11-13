var ajax = {
    get: function get(url, callback) {
        nanoajax.ajax({
            url: url,
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }, function (code, responseText) {
            callback(JSON.parse(responseText));
        });
    }
};