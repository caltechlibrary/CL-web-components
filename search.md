

# CL-web-components

<link href="./pagefind/pagefind-ui.css" rel="stylesheet">
<script src="./pagefind/pagefind-ui.js" type="text/javascript"></script>
<div id="search"></div>
<script>
    const u = URL.parse(window.location.href);
    const basePath = u.pathname.replace(/search.html$/g, '');
    
    window.addEventListener('DOMContentLoaded', (event) => {
        new PagefindUI({ 
            element: "#search",
<<<<<<< HEAD
            basePath: "./",
=======
            baseUrl: basePath
>>>>>>> 415fa1fd2774830c9f3ade7bf6f65212fe938733
        });
    });
</script>
