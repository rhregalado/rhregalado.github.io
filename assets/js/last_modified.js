var xhr = new XMLHttpRequest();
xhr.open('HEAD', 'your_script.js', true);

xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            var lastModified = xhr.getResponseHeader('Last-Modified');
            console.log('Last modified date:', lastModified);
        } else {
            console.log('Request failed with status:', xhr.status);
        }
    }
};

xhr.send();
