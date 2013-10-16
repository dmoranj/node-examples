var mongoose = require("mongoose"),
    async = require("async"),
    Schema = mongoose.Schema;

// Initialize
//----------------------------------------------------------
var db = mongoose.createConnection("localhost", "test-blogger");


// Define the classes
//----------------------------------------------------------
var UserSchema = new Schema({
    "login" : {type: "String", unique: true},
    "name" : {type: "String", trim: true, index:true},
    "surname" : {type: "String", trim: true},
    "age": "Number",
    "blogs" : [
        {
            "title" : { type: "String", trim: "true" },
            "text" : "String"
        }
    ]
});

var User = db.model("User", UserSchema);


// Save things
//----------------------------------------------------------
function cleanUsers(callback) {
    User.remove({}, callback);
}

function createUser(user, callback) {
    var user1 = new User(user);
    user1.save(callback);
}

function createDuplicateUser(callback) {
    var user2 = new User(require("./userDuplicate.json"));
    user2.save(function (error) {
        console.log("Inserting a duplicate user got: " + error);
        callback(null);
    });
}

function createWrongUser(callback) {
    var user3 = new User(require("./userWrongTypes.json"));
    user3.save(function (error) {
        console.log("Inserting a user with missing attributes got: " + error);
        callback(null);
    });
}

function handleEnd(error) {
    if (error) {
        console.log("Finished with error: " + error);
    } else {
        console.log("Successfully completed");
    }

    mongoose.disconnect();
}

// ManageThings
//----------------------------------------------------------
function returnSome(callback) {
    User.findOne({ name: "Ted"}, function (error, user) {
        if (error) {
            callback(error);
        } else {
            console.log("The returned user is: " + user.login);
            callback(null);
        }
    });
}

// Execute synchronously
//----------------------------------------------------------
async.series([
    cleanUsers,
    async.apply(createUser, require("./user1.json")),
    async.apply(createUser, require("./user2.json")),
    createWrongUser,
    createDuplicateUser,
    returnSome
], handleEnd);