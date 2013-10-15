var fs = require("fs"),
    exec = require('child_process').exec,
    certAddress = "~/.ssh/tdaf-rush-int.pem",
    originFile = "soak0201013.data",
    path = "async/";

function handleDownload(host, error) {
    if (error) {
        console.error("Error downloading code from " + host + ": " + error);
    } else {
        console.log("Downloaded code successfully from " + host);

        fs.readFile(path + host + ".out", "utf8", handleReadFile.bind(this, host));
    }
}

function handleReadFile(host, errorFs, data) {
    if (errorFs) {
        console.error("Error reading downloaded file [" + host + ".out]: " + errorFs);
    } else {
        var clearData = data.replace(/\|/g, " ")
            .replace(/ +/g, " ");

        fs.writeFile(path + host + ".csv", clearData, handleWrite.bind(this, host));
    }
}

function handleWrite(host, error) {
    if (error) {
        console.log("Couldn't clear data to disk for host [" + host + "]");
    } else {
        console.log("Data from host [" + host + "] processed successfully");

        var commandLineRm = "rm ./" + path + host + ".out";

        exec(commandLineRm, handleFinal.bind(this, host));
    }
}

function handleFinal(host, error) {
    if (error) {
        console.error("Origin data from [" + host + "] could not be removed");
    } else {
        console.log("Origin data from [" + host + "] removed");
    }
}

function downloadCode(host) {
    console.log ("Downloading code from " + host);

    var commandLine = "scp -i " + certAddress + " ec2-user@" + host + ":" + originFile + " ./" + path +  host + ".out";

    exec(commandLine, handleDownload.bind(this, host));
}

function readHostAddresses (addressFile, callback) {
    fs.readFile(addressFile, 'utf8', function (error, data) {
        if (error) {
            callback(error);
        } else {
            var hostList = data.split("\n");
            hostList.map(downloadCode);
        }
    });
}

readHostAddresses(path + "addressFiles", function (error, data) {
    if (error) {
        console.log("There was an error processing files: " + error);
    } else {
        console.log("Data successfully processed: " + data.length + " files");
    }
});