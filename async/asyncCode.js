var fs = require("fs"),
    exec = require('child_process').exec,
    apply = require("async").apply,
    async = require("async"),
    certAddress = "~/.ssh/tdaf-rush-int.pem",
    originFile = "soak0201013.data",
    path = "async/";

function downloadData(host, callback) {
    console.log ("Downloading code from " + host);

    var commandLine = "scp -i " + certAddress + " ec2-user@" + host + ":" + originFile + " ./async/" + host + ".out";

    exec(commandLine, callback);
}

function processData(data, callback) {
    var clearData = data.replace(/\|/g, " ")
        .replace(/ +/g, " ")
        .replace(/M/g, "");

    callback(null, clearData);
}

function cleanData(host, callback) {
    var commandLine = "rm ./async/" + host + ".out";

    exec(commandLine, callback);
}

/**
 * This code perform the following tasks:
 * - Makes an scp to download a file from a remote host.
 * - Reads the downloaded file.
 * - Makes some modificaciones (replacing some unwanted characters)
 * - Write the results to a new file.
 */
function processFile(host, callback) {
    async.waterfall([
        apply(downloadData, host),
        async.apply(fs.readFile, path + host + ".out", "utf8"),
        processData,
        apply(fs.writeFile, path + host + ".csv"),
        apply(cleanData, host)
    ], callback);
}

function downloadAndProcess(addressFile, callback) {
    fs.readFile(addressFile, 'utf8', function (error, data) {
        async.map(data.split("\n"), processFile, callback);
    });
}

downloadAndProcess(path + "addressFiles", function (error, data) {
    if (error) {
        console.log("There was an error processing files: " + error);
    } else {
        console.log("Data successfully processed: " + data.length + " files");
    }
});