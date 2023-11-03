const fetch = require('node-fetch')

fetch('/dashboard')
     .then((response) => response.json())
     .then((data) => {
       // Aquí puedes trabajar con los datos obtenidos
       console.log(data);
     })
     .catch((error) => {
       console.log(error);
     });