var request = require("request"),
    async = require("async");


function waitForTaskCompletion(task) {
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
        if (error) {
            console.log("Error ending loop:" + error);
        } else {
            console.log("Task completed");
        }
    }

    async.whilst(
        condition,
        action,
        loopEnd
    );
}

function createTask() {
    var options = {
            url: "http://localhost:4000/task",
            method: "POST",
            json: { }
        };

    request(options, function (error, response, body) {
        waitForTaskCompletion(body);
    });
}

createTask()