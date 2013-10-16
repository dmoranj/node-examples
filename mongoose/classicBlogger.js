var mongo = require("mongodb").MongoClient,
    async = require("async");



// Save things
//----------------------------------------------------------
function cleanUsers(db, callback) {
    console.log("Cleaning users");
    db.dropCollection('user', function (error) {
        console.log("Returning from cleant");
        callback(null);
    });
}

function createUser(collection, user, callback) {
    console.log("Creating user: " + user.name);
    collection.insert(user, function (error, result) {
        console.log("User created");
        callback(error, result);
    });
}

function createDuplicateUser(collection, callback) {
    console.log("Creating duplicated user");
    collection.insert(require("./userDuplicate.json"), callback);
}

function createWrongUser(collection, callback) {
    console.log("Creating wrong user");
    collection.insert(require("./userWrongTypes.json"), callback);
}


// Find things
//----------------------------------------------------------
function returnSome(collection, callback) {
    collection.findOne({ name: "Ted"}, function (error, user) {
        if (error) {
            callback(error);
        } else {
            console.log("The returned user is: " + user.login);
            callback(null);
        }
    });
}

mongo.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    console.log("Database created");

    function handleExit(error, results) {
        if (error) {
            console.log("Error writing to the database: " + error);
        } else {
            console.log("Successfully completed operations");
        }

        db.close();
    }

    db.collection('user', function (error, collection) {
        if (error) {
            console.error("Error writing to database: " + error);
        } else {
            async.series([
                async.apply(cleanUsers, db),
                async.apply(createUser, collection, require("./user1.json")),
                async.apply(createUser, collection, require("./user2.json")),
                async.apply(createDuplicateUser, collection),
                async.apply(createWrongUser, collection),
                async.apply(returnSome, collection)
            ], handleExit);
        }
    });
});

