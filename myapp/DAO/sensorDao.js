let dbConnect = require('../common/database');
let conn = dbConnect.getConnection();
let q=require("q")
function addData(sensorName,data){
    let queryUrl= "INSERT INTO "+ sensorName+" SET ?";
    let query = conn.query(queryUrl,data,function(err,result){
        if(err){
            console.log("Đưa dữ liệu vào db thất bại");
            throw err;
        }
        else{
            console.log("Lưu dữ liệu thành công");
            console.log(result.insertId)
        }
    });
}
function getAllData(sensorName){
    var defer = q.defer();
    let queryUrl= "SELECT * FROM "+sensorName;
    conn.query(queryUrl,function(err,result){
        if(err){
            defer.reject(err);
        }
        else{
            console.log("Lấy dữ liệu thành công");
            
            defer.resolve(result);
        }
    });
    return defer.promise;
}
function findDataByDate(date){
    var defer = q.defer();
    let queryUrl= "SELECT * FROM sensor1"+" Where date= "+"'"+date+"'";
    console.log(queryUrl);
    conn.query(queryUrl,function(err,result){
        if(err){
            defer.reject(err);
        }
        else{
            console.log("Lấy dữ liệu thành công bằng date");
            defer.resolve(result);
        }
    });
    return defer.promise;
}
module.exports = {
    addData:addData,
    getAllData:getAllData,
    findDataByDate:findDataByDate
}