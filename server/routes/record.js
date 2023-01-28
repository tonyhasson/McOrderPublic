const express = require('express');
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require('mongodb').ObjectId;

// This section will help you get a list of all the records.
recordRoutes.route('/record').get(function (req, res) {
  let db_connect = dbo.getDb('McOrderData');
  db_connect
    .collection('CurrentOrder')
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// gets the user id
recordRoutes.route('/getUid').get(function (req, res) {
  let db_connect = dbo.getDb('McOrderData');
  db_connect
    .collection('UserID')
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});


// gets the CurrentOrder - used in case of malfunction in middle of order
recordRoutes.route('/getItems').get(function (req, res) {
  let db_connect = dbo.getDb('McOrderData');
  db_connect
    .collection('CurrentOrder')
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// // This section will help you get a single record by id
// recordRoutes.route('/record/:id').get(function (req, res) {
//   let db_connect = dbo.getDb('McOrderData');
//   let myquery = { _id: ObjectId(req.params.id) };
//   db_connect
//     .collection('CurrentOrder')
//     .findOne(myquery, function (err, result) {
//       if (err) throw err;
//       res.json(result);
//     });
// });

// This section will help you add a new item to CurrentOrder.
// recordRoutes.route('/record/add').post(function (req, response) {
//   let db_connect = dbo.getDb('McOrderData');
//   let myobj = {
//     order_details: req.body,
//   };
//   db_connect.collection('CurrentOrder').insertOne(myobj, function (err, res) {
//     if (err) throw err;
//     response.json(res);
//     console.log(res);
//   });
// });


//This section will update the CurrentOrder
recordRoutes.route('/record/add').put(function (req, response) {
  let db_connect = dbo.getDb('McOrderData');
  let myobj = {
    order_details: req.body,
  };
  db_connect.collection('CurrentOrder').updateOne({}, {$set: myobj}, {upsert: true}, function (err, res) {
    if (err) throw err;
    response.json(res);
    console.log(res);
  });
});




//updating userId by 1
recordRoutes.route('/updateUid').put(function (req, response) {
  let db_connect = dbo.getDb('McOrderData');
  let myquery = {};
  let newvalues = {
    $inc: {
      user_id: 1,
    },
  };
  db_connect
    .collection('UserID')
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log('1 document updated');
      response.json(res);
    });
});


//this section will insert into FinalOrders from CurrentOrder
recordRoutes.route('/record/add/final').post(function (req, response) {
  let db_connect = dbo.getDb('McOrderData');
  let myobj = {
    order_details: req.body,
  };
  db_connect.collection('FinalOrder').insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
    console.log(res);
  });
});


// This section will help you delete a record
recordRoutes.route('/delete/CurrentOrder').delete((req, response) => {
  let db_connect = dbo.getDb('McOrderData');
  let myquery = {};
  db_connect.collection('CurrentOrder').deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log('1 document deleted');
    response.json(obj);
  });
});


// // This section will help you update a record by id.
// recordRoutes.route('/update/:id').post(function (req, response) {
//   let db_connect = dbo.getDb('McOrderData');
//   let myquery = { _id: ObjectId(req.params.id) };
//   let newvalues = {
//     $set: {
//       order_details: req.body,
//     },
//   };
//   db_connect
//     .collection('CurrentOrder')
//     .updateOne(myquery, newvalues, function (err, res) {
//       if (err) throw err;
//       console.log('1 document updated');
//       response.json(res);
//     });
// });

// // This section will help you delete a record
// recordRoutes.route('/:id').delete((req, response) => {
//   let db_connect = dbo.getDb('McOrderData');
//   let myquery = { _id: ObjectId(req.params.id) };
//   db_connect.collection('CurrentOrder').deleteOne(myquery, function (err, obj) {
//     if (err) throw err;
//     console.log('1 document deleted');
//     response.json(obj);
//   });
// });

module.exports = recordRoutes;
