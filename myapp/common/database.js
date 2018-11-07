var mysql = require("mysql");
var config = require('config');
var conn = mysql.createConnection({
    host: config.get("mysql_config.host"),
    user: config.get("mysql_config.user"),
    password: config.get("mysql_config.password"),
    database: config.get("mysql_config.database"),
    connectionLimit: 10,
    multipleStatements: true
});
conn.connect();

function getConnection(){
    while(!conn){
        conn.connect();
    }
    console.log("Kết nối Database thành công");
    return conn;
}
module.exports={
    getConnection:getConnection
}




