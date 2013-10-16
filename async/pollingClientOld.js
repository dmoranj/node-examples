var request = require("request"),
    async = require("async");


function waitForTaskCompletion(task) {
    var currentTask = task
        that = this;

    function action(callback) {
        var options= {
            url: "http://localhost:4000/task/" + task.id,
            method: "GET"
        }

        console.log("Testing task");
        request(options, function (error, response, body) {
            if (error) {
                callback(error);
            } else {
                var currentTask = JSON.parse(body);

                if (currentTask.status == "pending") {
                    setTimeout(action.bind(that, callback), 2000);
                } else {
                    callback(error, body);
                }
            }
        });
    }

    function loopEnd(error, body) {
        if (error) {
            console.log("Error ending loop:" + error);
        } else {
            console.log("Task completed");
        }
    }

    action(loopEnd);
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