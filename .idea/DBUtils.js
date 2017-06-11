//this is only an example, handling everything is yours responsibilty !

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var Connection = require('tedious').Connection;
//----------------------------------------------------------------------------------------------------------------------
var config = {
    userName: 'meravpollak',
    password: 'mpBS1234',
    server: 'dbmeravp.database.windows.net',
    requestTimeout: 15000,
    options: {encrypt: true, database: 'db_meravp'}
};

var connect;
exports.Select = function(query) {
    return new Promise(function(resolve,reject) {
        connect = new Connection(config);

        connect.on('connect', function(err) {
            if (err) {
                console.error('error at connecting: ' + err.message);
                reject(err);
            }
            console.log('connected');
            var dbReq = new Request(query, function (err, rowCount) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
            });

            dbReq.on('columnMetadata', function (columns) {
                columns.forEach(function (column) {
                    if (column.colName != null)
                        properties.push(column.colName);
                });
            });
            var res = [];
            var properties = [];
            dbReq.on('row', function (row) {
                var item = {};
                for (i=0; i<row.length; i++) {
                    item[properties[i]] = row[i].value;
                }
                res.push(item);
            });

            dbReq.on('requestCompleted', function () {
                console.log('request Completed:');
                connect.close();
                resolve(res);

            });
            connect.execSql(dbReq);
        });
    });
};
//------------------------------------------------------------------------------------------------------------------

exports.Insert = function(query) {
    return new Promise(function(resolve,reject) {
        connect = new Connection(config);


        connect.on('connect', function(err) {
            if (err) {
                console.error('error connecting: ' + err.message);
                reject(err);
            }
            console.log('connected');
            var dbReq = new Request(query, function (err, rowCount) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
            });


            dbReq.on('requestCompleted', function () {
                console.log('request Completed!');
                connect.close();
                var ans=[];
                resolve(ans);

            });
            connect.execSql(dbReq);
        });
    });
};

//----------------------------------------------------------------------------------------------------------------------
exports.Update = function(query) {
    return new Promise(function(resolve,reject) {
        connect = new Connection(config);


        connect.on('connect', function(err) {
            if (err) {
                console.error('error connecting: ' + err.message);
                reject(err);
            }
            console.log('connected');
            var dbReq = new Request(query, function (err, rowCount) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
            });


            dbReq.on('requestCompleted', function () {
                console.log('request Completed!');
                connect.close();
                var res=[];
                resolve(res);

            });
            connect.execSql(dbReq);
        });
    });
};

//----------------------------------------------------------------------------------------------------------------------










