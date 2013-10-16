var redis = require("redis"),
    async = require("async");

function getRedisConnection() {
    cli = redis.createClient("6379", "localhost");

    cli.select(0);

    cli.on('error', function(err){
        console.log("Unrecoverable redis error: " + err);
        process.exit(1);
    });

    return cli;
}

var conn = getRedisConnection();

async.series([
    conn.lpush.bind(conn, "colaPruebas", "elemento1"),
    conn.lpush.bind(conn, "colaPruebas", "elemento2"),
    conn.llen.bind(conn, "colaPruebas"),
    conn.lrange.bind(conn, "colaPruebas", 0, 2),
    conn.lpop.bind(conn, "colaPruebas"),
    conn.lpop.bind(conn, "colaPruebas"),
    conn.llen.bind(conn, "colaPruebas")
], function endSeries(err, results) {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(results));
    }

    conn.quit();
})
