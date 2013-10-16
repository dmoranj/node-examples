var request = require("request"),
    async = require("async");


function waitForTaskCompletion(task, callback) {
    var currentTask = task;

    function condition() {
        return currentTask.status != "completed";
    }

    function action(callback) {
        var options= {
            url: "http://localhost:4000/task/" + task.id,
            method: "GET"
        }

        console.log("Testing task");
        setTimeout(request.bind(request, options, function (error, response, body) {
            currentTask = JSON.parse(body);

            callback(error, body);
        }), 2000);
    }

    function loopEnd(error, response, body) {
        if (!error) {
            console.log("Task completed");
        }

        callback(error, body);
    }

    async.whilst(
        condition,
        action,
        loopEnd
    );
}

function createTask(callback) {
    var options = {
            url: "http://localhost:4000/task",
            method: "POST",
            json: { }
        };

    request(options, function (error, response, body) {
        waitForTaskCompletion(body, callback);
    });
}

async.forever(createTask, function crashHandler(error) {
    console.log("Exiting program due to error: " + error);
});
