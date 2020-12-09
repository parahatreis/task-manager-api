// CRUD create read update delete

const {MongoClient, ObjectID} = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID();
console.log(id)

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
   if (error) {
      return console.log('Unable to connect to database !');
   }
   // connecting with database
   const db = client.db(databaseName);
   

   // db.collection('users').findOne({_id : new ObjectID("5fb26e1b49185f0510dd7f57")}, (error, user) => {
   //    if (error) return console.log('No user found');
   //    console.log(user);
   // });
   
   // db.collection('users').find({ age: 20 }).toArray((err, res) => {
   //    if (err) return console.log('No user found');
   //    console.log(res)
   // })

   // const updatePromise = db.collection('users').updateOne({
   //    _id: new ObjectID("5fb2669f39b9dd2fc451cc97")
   // }, {
   //       $inc: {
   //          age : 10
   //       }
   // })

   // updatePromise
   //    .then((result) => console.log(result))
   //    .catch((err) => console.log(err))

   // db.collection('tasks').updateOne({
   //    completed : false
   // }, {
   //    $set : {
   //       completed : true
   //    }
   // })
   //    .then((result) => console.log(result))
   //    .catch((err) => console.log(err))


   // db.collection('users').deleteMany({
   //    age : 33
   // })
   //    .then(res => console.log(res))
   //    .catch(err => console.log(err))
   
   db.collection('users').deleteOne({
         _id: new ObjectID("5fb26e1b49185f0510dd7f57")
      })
      .then(res => console.log(res))
      .catch(err => console.log(err))
   
});
