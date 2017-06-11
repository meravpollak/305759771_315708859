var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var Connection = require('tedious').Connection;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());
var DButilsAzure = require('./DBUtils');
var squel = require("squel");
var moment = require('moment');

var config = {
    userName: 'meravpollak',
    password: 'mpBS1234',
    server: 'dbmeravp.database.windows.net',
    requestTimeout: 15000,
    options: {encrypt: true, database: 'db_meravp'}
};

//-------------------------------------------------------------------------------------------------------------------
//conecting to Azore
connection = new Connection(config);
var connected = false;
connection.on('connect', function(err) {
    if (err) {
        console.error('error connecting: ' + err.message);
    }
    else {
        console.log("Connected Azure");
        connected = true;
    }
});

//-------------------------------------------------------------------------------------------------------------------
app.use(function(req, res, next){
    if (connected)
        next();
    else
        res.status(503).send('Server is down');
});
//-------------------------------------------------------------------------------------------------------------------
//login function
app.post('/Login', function (req, res) {
    var UserName = req.body.UserName;
    var Password = req.body.Password;
    if (!UserName || !Password ) {
        console.log('faild to login');
        res.send({"result": false});
        res.end();
    }
    else{
        var query =(
            squel.select()
                .from("Clients")
                .where("UserName = ?", UserName)
                .where("Password = ?", Password)
                .toString()
        );
        DButilsAzure.Select(query)
            .then(function(result){
                if (result.length > 0) {
                    console.log ('login success');
                    res.send({"result": true});

                }
                else {
                    console.log('faild to login here');
                    res.send({"result": false});

                }
            });
    }
});

//-------------------------------------------------------------------------------------------------------------------
//set a new registeration to the web
app.post('/Register', function(req, res){
    var FirstName = req.body.FirstName;
    var LastName = req.body.LastName;
    var Adress = req.body.Adress;
    var City = req.body.City;
    var Country = req.body.Country;
    var Cellular = req.body.Cellular;
    var Mail = req.body.Mail;
    var CreditCardNumber = req.body.CreditCardNumber;
    var isADmin = req.body.isADmin;
    var Question = req.body.Question;
    var Answer = req.body.Answer;
    var UserName= req.body.UserName;
    var Password = req.body.Password;

    if( !UserName || !Password){
        console.log('faild to Register');
        res.send({"result": false});
    }
    else {
        var query="SELECT * FROM Clients WHERE UserName='"+UserName+"'";
        DButilsAzure.Select(query)
            .then(function(result){
                if (result.length > 0) {
                    console.log('The username exist');
                    res.send({"result": false});

                }
                else {
                    var query =(
                        squel.insert()
                            .into("Clients")
                            .set("FirstName", FirstName)
                            .set("LastName", LastName)
                            .set("Adress", Adress)
                            .set("City", City)
                            .set("Country", Country)
                            .set("Cellular", Cellular)
                            .set("Mail",Mail)
                            .set("CreditCardNumber", CreditCardNumber)
                            .set("isADmin",isADmin)
                            .set("Question", Question)
                            .set("Answer", Answer)
                            .set("UserName", UserName)
                            .set("Password", Password)
                            .toString()
                    );
                    DButilsAzure.Insert(query)
                        .then(function(result){
                            console.log(result);
                            console.log("The User was added to the database successfully")
                            res.send(result);
                        });
                }
            });

    }
});
//-------------------------------------------------------------------------------------------------------------------
//retrival the Password of a User
app.post('/RetrievalPassword-Password', function(req, res){
    var UserName = req.body.UserName;
    var Answer = req.body.Answer;
    var query="SELECT Password FROM Clients WHERE UserName='"+UserName+"' AND Answer='"+Answer+"'";
    DButilsAzure.Select(query)
        .then(function(result){
            if (result.length > 0) {
                console.log('Retrival Password success');
                res.send({"result": result});

            }
            else {
                console.log('faild to Retrival Password');
                res.send({"result": "Not the right answer"});

            }
        });
});
//-------------------------------------------------------------------------------------------------------------------
//retrival the Question of a User
app.get('/RetrievalPasswordQuestion/:UserName', function(req, res){
    var UserName = req.params.UserName;
    var query="SELECT Question FROM Clients WHERE UserName='"+UserName+"'";
    DButilsAzure.Select(query)
        .then(function(result){
            if (result.length > 0) {
                console.log('Retrival question success');
                res.send({"result": result});

            }
            else {
                console.log('faild retrival question');
                res.send({"result": false});

            }
        });
});
//-------------------------------------------------------------------------------------------------------------------
//send the 5 hot products for display
app.get('/HotProductsForDisplay',function (req,res) {
    var lastweek = moment().subtract(7,'days');
    var query = "Select * from Products Join (Select top 5 OrderProducts.ProductID, count(*) as cnt From OrderProducts JOIN Orders on Orders.OrderID=OrderProducts.OrderID where (Orders.OrderDate >'"+lastweek.toJSON()+"') GROUP BY OrderProducts.ProductID ORDER BY cnt DESC) as topFive on Products.ProductID=topFive.ProductID";
    DButilsAzure.Select(query)
        .then(function(result) {
            console.log ('GET news products success');
            res.send(result);
        })
        .catch(function (err){
            console.log(err.message);
            res.send(400)
        });
})
//-------------------------------------------------------------------------------------------------------------------
//send the new products in the website
app.get('/NewProductForDisplay',function (req,res){
    var lastmonth = moment().subtract(30,'days');
    var query = "Select * from Products  where Date>'"+lastmonth.toJSON()+"'" ;
    DButilsAzure.Select(query)
        .then(function(result) {
            console.log ('Get news product success');
            res.send(result);
        })
        .catch(function (err){
            console.log(err.message);
            res.send(400)
        });

})
//-------------------------------------------------------------------------------------------------------------------
//Is the user is admin
app.get('/IsUserAdmin/:UserName', function(req, res){
    var UserName = req.params.UserName;
    var query="SELECT isADmin FROM Clients WHERE UserName='"+UserName+"'";
    DButilsAzure.Select(query)
        .then(function(result){
            if (result.length > 0) {
                if(result="0"){
                    console.log('User is not admin');
                    res.send({"result": result});
                }
                else {
                    console.log('User is admin');
                    res.send({"result": result});
                }
            }
            else {
                console.log('faild retrival answer if the user isAdmin');
                res.send({"result": false});

            }
        });
});
//-------------------------------------------------------------------------------------------------------------------
// if there is enoght products in the investory
app.get('/IsVaildProduct/:ProductID', function(req, res){
    var ProductID = req.params.ProductID;
    var query="SELECT StokAmount FROM Products WHERE ProductID='"+ProductID+"'";
    DButilsAzure.Select(query)
        .then(function(result){
            if (result.length > 0) {

                if(result=="0"){
                    console.log('the product run out');
                    res.send({"result": result});
                }
                else {
                    console.log('the product is in the investory');
                    res.send({"result": result});
                }
            }
            else {
                console.log('faild retrival answer if the product is valid');
                res.send({"result": false});

            }
        });
});

//-------------------------------------------------------------------------------------------------------------------
//get the information about a specific product
app.get('/getProduct/:ProductID',function (req,res) {
    var ProductID = req.params.ProductID;
    var query="SELECT * FROM Products WHERE ProductID='"+ProductID+"'";
    DButilsAzure.Select(query)
        .then(function(result){
            if (result.length > 0) {
                console.log('succeed send the information about the product');
                res.send({"result": result});
            }
            else {
                console.log('faild retrival the information about the product');
                res.send({"result": false});

            }
        });
})
//-------------------------------------------------------------------------------------------------------------------
//get the information about all the products
app.get('/getProductlist',function (req,res) {
    var query="SELECT * FROM Products";
    DButilsAzure.Select(query)
        .then(function(result){
            if (result.length > 0) {
                console.log('succeed send all the information about the products');
                res.send({"result": result});
            }
            else {
                console.log('faild retrival the information about all the products');
                res.send({"result": false});

            }
        });
})
//-------------------------------------------------------------------------------------------------------------------
//get the information about all the products from a specific category
app.get('/getProductlistByCategory/:CategoryID',function (req,res) {
    var CategoryID = req.params.CategoryID;
    var query="SELECT * FROM Products WHERE CategoryID='"+CategoryID+"'";
    DButilsAzure.Select(query)
        .then(function(result){
            if (result.length > 0) {
                console.log('succeed send all the products from this category');
                res.send({"result": result});
            }
            else {
                console.log('There is no products from this specific category');
                res.send({"result": false});

            }
        });
})

//-------------------------------------------------------------------------------------------------------------------
//get all categories
app.get('/getAllCategories',function (req,res){
    var Categories="Select CategoryID from Products GROUP BY CategoryID HAVING( COUNT (CategoryID) >0)";
    DButilsAzure.Select(Categories)
        .then(function(result){
            if (result.length > 0) {
                console.log('succeed send all the categories');
                res.send({"result": result});
            }
            else {
                console.log('There is no products from this specific category');
                res.send({"result": false});

            }
        });
})

//-------------------------------------------------------------------------------------------------------------------
//update the amount of products
app.put('/updateAmountOfAProduct',function (req,res){
    var ProductID = req.body.ProductID;
    var StokAmount = req.body.StokAmount;
    if (!ProductID || !StokAmount ) {
        console.log('faild to get parametes');
        res.send({"result": false});
        res.end();
    }
    else{
        var query="UPDATE Products SET StokAmount ='"+StokAmount+"' WHERE ProductID='"+ProductID+ "'";
        DButilsAzure.Select(query)
            .then(function(result){
                console.log('succeed update the amount of the product');
                res.send({"result": true});
            });
    }
})

//-------------------------------------------------------------------------------------------------------------------
//get all products in search by Product Name
app.get('/getProductByNameForSearch/:Name',function (req,res){
    var Name = req.params.Name;
    if (!Name) {
        console.log('faild to get parameter');
        res.send({"result": false});
        res.end();
    }
    else{
        var query="SELECT * FROM Products WHERE Name='"+Name+"'";
        DButilsAzure.Select(query)
            .then(function(result){
                if (result.length > 0) {
                    console.log('succeed send the details about the specific product');
                    res.send({"result": result});
                }
                else {
                    console.log('the specific product doesnt exsist');
                    res.send({"result": false});

                }
            });
    }

})
//-------------------------------------------------------------------------------------------------------------------
// add a order to the database
app.post('/orderProducts', function(req, res){
    var ClientID = req.body.ClientID;
    var OrderDate = req.body.OrderDate;
    var ShipmentDate=req.body.ShipmentDate;
    var Currency=req.body.Currency;
    var TotalAmount=req.body.TotalAmount;

    if( !ClientID || !OrderDate ||!ShipmentDate ||!Currency||!TotalAmount){
        console.log('faild to order product');
        res.send({"result": false});
    }
    else {
        var query =(
            squel.insert()
                .into("Orders")
                .set("ClientID", ClientID)
                .set("OrderDate", OrderDate)
                .set("ShipmentDate", ShipmentDate)
                .set("Currency", Currency)
                .set("TotalAmount", TotalAmount)
                .toString()
        );
        DButilsAzure.Insert(query)
            .then(function(result){
                console.log(result);
                console.log("The Order was added to the database successfully")
                res.send(result);
            });
    }
});
//-------------------------------------------------------------------------------------------------------------------
//add to the order Products table , the product to a specific order
app.post('/setProductToOrder', function(req, res){
    var OrderID = req.body.OrderID;
    var ProductID = req.body.ProductID;
    var Amount= req.body.Amount;
    var OrderDate=req.body.OrderDate;

    if( !OrderID || !ProductID ||!Amount||!OrderDate){
        console.log('faild to set products to Order');
        res.send({"result": false});
    }
    else {
        var query =(
            squel.insert()
                .into("OrderProducts")
                .set("OrderID", OrderID)
                .set("ProductID", ProductID)
                .set("Amount", Amount)
                .set("OrderDate", OrderDate)
                .toString()
        );
        DButilsAzure.Insert(query)
            .then(function(result){
                console.log(result);
                console.log("successfully set all the products to spesific order ")
                res.send(result);
            });
    }
});
//-------------------------------------------------------------------------------------------------------------------
//get the orders of the user
app.get('/listOrdersOfUser/:ClientID',function (req,res) {
    var ClientID = req.params.ClientID;
    if (!ClientID) {
        console.log('faild to get parameter');
        res.send({"result": false});
        res.end();
    }else{
        var OrderIDs=[];
        var check=false;
        var query ="SELECT OrderID FROM Orders WHERE ClientID='"+ClientID+"'";
        DButilsAzure.Select(query)
            .then(function (result) {
                if (result.length > 0) {
                    console.log('succeed get all the OrderIDs of the user');
                    res.send({"result": result});
                }
                else {
                    console.log('the specific OrderID doesnt exsist');
                    res.send({"result": false});

                }
        });
    }

})
//-------------------------------------------------------------------------------------------------------------------
//for each orderID get the products in this order
app.get('/listProductsOfUserAOrders/:OrderID',function (req,res) {

    var OrderID = req.params.OrderID;
    if(!OrderID){
        console.log('faild to get parameter');
        res.send({"result": false});
        res.end();
    }else {
        var query1 = "SELECT ProductID FROM OrderProducts WHERE OrderID='" + OrderID + "'";
        DButilsAzure.Select(query1)
            .then(function (result) {
                if (result.length > 0) {
                    res.send({"result": result});
                    console.log('succeed get all the Products that the user order in the website');
                }
                else {
                    console.log('the Order dont have products');
                    res.send({"result": false});
                }
            });
    }
})
//-------------------------------------------------------------------------------------------------------------------
//for each orderID get the products in this order
app.get('/checkIfTheProductIsInOrders/:ProductID',function (req,res) {

    var ProductID = req.params.ProductID;

    if(!ProductID){
        console.log('faild to get parameter');
        res.send({"result": false});
        res.end();
    }

    else {
        var query = "SELECT ProductID FROM OrderProducts WHERE ProductID='" + ProductID +"'";
        DButilsAzure.Select(query)
            .then(function (result) {
                if (result.length > 0) {
                    res.send({"result": true});
                    console.log('the product allready bought in the past, can recommad this product');
                }
                else {
                    console.log('the OrderProduct table dont have this product');
                    res.send({"result": false});
                }
            });
    }
})
//-------------------------------------------------------------------------------------------------------------------
//get a category of a product
app.get('/getCategoryToProduct/:ProductID',function (req,res) {

    var ProductID = req.params.ProductID;

    if(!ProductID){
        console.log('faild to get parameter');
        res.send({"result": false});
        res.end();
    }
    else {
        var query = "SELECT CategoryID FROM Products WHERE ProductID='" + ProductID + "'";
        DButilsAzure.Select(query)
            .then(function (result) {
                if (result.length > 0) {
                    res.send({"result": result});
                    console.log('succeed get the category of the product');
                }
                else {
                    console.log('faild get the category');
                    res.send({"result": false});
                }
            });
    }
})

//-------------------------------------------------------------------------------------------------------------------
var port = 4000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});