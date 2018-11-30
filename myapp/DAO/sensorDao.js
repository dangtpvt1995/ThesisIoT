let dbConnect = require('../common/database');
let conn = dbConnect.getConnection();
let q=require("q")
function addData(sensorName,data){
    let queryUrl= "INSERT INTO "+ sensorName+" SET ?";
    let query = conn.query(queryUrl,data,function(err,result){
        if(err){
            throw err;
        }
        else{
            console.log(result.insertId)
        }
    });
}
function logTime(vdkName,data){
    let queryUrl= "INSERT INTO "+ vdkName+" SET ?";
    let query = conn.query(queryUrl,data,function(err,result){
        if(err){
            throw err;
        }
        else{
            console.log(result.insertId)
        }
    });
}
function updateLogTime(vdkName,timeIn,timeOut){
    let queryUrl= 'UPDATE '+vdkName+ ' SET timeout=? WHERE timein=?';
    let query = conn.query(queryUrl,[timeOut,timeIn],function(err,result){
        if(err){
            throw err;
        }
        else{
            console.log(result.insertId)
        }
    });
}
function getLogTimeByDate(vdkName,date){
    var defer = q.defer();
    let queryUrl= "SELECT * FROM "+vdkName+" where date="+"'"+date+"'";
    conn.query(queryUrl,function(err,result){
        if(err){
            defer.reject(err);
        }
        else{
            defer.resolve(result);
        }
    });
    return defer.promise;
}

function getAllData(sensorName){
    var defer = q.defer();
    let queryUrl= "SELECT * FROM "+sensorName;
    conn.query(queryUrl,function(err,result){
        if(err){
            defer.reject(err);
        }
        else{
            defer.resolve(result);
        }
    });
    return defer.promise;
}
function findDataByDate(date,sensorName){
    var defer = q.defer();
    let queryUrl= "SELECT * FROM "+sensorName+" Where date= "+"'"+date+"'";
    conn.query(queryUrl,function(err,result){
        if(err){
            defer.reject(err);
        }
        else{
            defer.resolve(result);
        }
    });
    return defer.promise;
}
function findDataByDateTime(date,sensorName,frmTime,toTime){
    var defer = q.defer();
    let queryUrl= "SELECT * FROM "+sensorName+" Where date= "+"'"+date+"'"+" and(time>= "+"'"+frmTime+"'"+" and time<= "+"'"+toTime+"'"+")";
    conn.query(queryUrl,function(err,result){
        if(err){
            defer.reject(err);
        }
        else{
            defer.resolve(result);
        }
    });
    return defer.promise;
}

module.exports = {
    addData:addData,
    getAllData:getAllData,
    findDataByDate:findDataByDate,
    findDataByDateTime:findDataByDateTime,
    logTime:logTime,
    updateLogTime:updateLogTime,
    getLogTimeByDate:getLogTimeByDate
}