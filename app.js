const path = require("path");
const fs = require("fs");
let bodyParser = require('body-parser');
let express = require('express');

//create server
let app = express();
let http = require('http').Server(app);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

//public folder
app.use('/', express.static(__dirname + '/public'));

//save tree
app.post('/save', function (req, res) {
    fs.writeFile("./public/data.json", JSON.stringify(req.body), function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
        res.end('ok');
    });
});

//start server
http.listen(8080, function () {
    console.log('Server ready at port 8080');
});