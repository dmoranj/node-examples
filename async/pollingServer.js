var express = require('express'),
    http = require('http'),
    path = require('path');

var currentIndex = 0;
var tasks= {};

var app = express();

function createTask(req, res) {
    var task = {
        id: currentIndex++,
        status: "pending"
    }

    tasks[task.id] = task;
    res.json(200, task);

    setTimeout(function() {
        tasks[task.id].status = "completed";
        console.log("Task completed");
    }, 12000);
}

function pollTask(req, res) {
    res.json(200, tasks[req.params.id])
}

function signupRoutes(appServer) {
    appServer.post('/task', createTask);
    appServer.get('/task/:id', pollTask);
}

function start() {
    app.configure(function () {
        app.set('port', process.env.PORT || 4000);
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static(path.join(__dirname, 'public')));
    });

    app.configure('development', function () {
        app.use(express.errorHandler());
    });

    signupRoutes(app);

    http.createServer(app).listen(app.get('port'), function () {
        console.log("Express server listening on port " + app.get('port'));
    });
}

start();