document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var query = document.getElementById('search').value;

    fetch('https://api.bing.microsoft.com/v7.0/images/search?q=' + encodeURIComponent(query), {
        headers: {
            'Ocp-Apim-Subscription-Key': import.meta.env.VITE_BING_API_KEY
        }
    })
    .then(response => response.json())
    .then(data => {
        images = data.value;
        console.log(data.value);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});