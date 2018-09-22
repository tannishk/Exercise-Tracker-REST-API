const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://admin:password123@ds261072.mlab.com:61072/freecodecamp' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Decalre Schemas 
const User = require('./models/User');
const Exercise = require('./models/Exercise');
// Decalre Paths

app.get("/api/exercise/users",(req,res)=>{
  console.log("hiiii");
  User.find()
  .then(users=>{
    res.json(users);
  })
  .catch(err=>{
    res.send('No User Registerd');
  })
});

app.post("/api/exercise/new-user",(req,res)=>{
  console.log(req.body.username);
  var user = new User ({
    username:req.body.username
  });
  user.save()
  .then(user => {
    res.json({username:user.username,_id:user._id});
  })
  .catch(err=>{
    res.send('username already taken');
  })
});

app.post("/api/exercise/add",(req,res)=>{
   let userId = req.body.userId;
  let description = req.body.description;
  let duration = req.body.duration;
  let date = req.body.date;
  if(userId === undefined || userId === ''){  
    res.send('Required Field(s) are missing.');
    
    }else if(isNaN(duration)){
       res.send('Duration should be a number')
    } else {
    User.findOne({_id:userId},(err,user)=>{
      if(err) { res.send('No Such User Exist'); }
      else {
        userId = user._id;
        duration = Number(duration);
        if(date === ''){
          date = new Date();
        } else {
          date = Date.parse(date);
        }
        let exercise = new Exercise({
          userId:userId,
          description:description,
          date:date,
          duration:duration
        });
        exercise.save()
        .then(exercise=>{
          res.json(exercise);
        })
        .catch(err=>{
          res.json(err);
        })
      }
    })
  }
});

app.get("/api/exercise/log",function(req,res){
  let userId = req.query.userId;
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;
  if(userId === undefined || userId === ''){
    return res.send('UserId is missing');
  }else {
    let query = {};
    query.userId = userId ;
    if(from!==undefined){
      from = new Date(from);
      query.date = { $gte:from}
    }
    if(to!==undefined){
      to = new Date(to);
      query.date = { $lt:from}
    }
    if(limit!==undefined){
      limit = Number(limit);
    }
    console.log(query);
    Exercise.find(query).limit(limit)
    .then(exercises=>{
          res.json(exercises);
    })
    .catch(err=>{
      res.json(err);
    })
  }
});
// Display all users 


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})


// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
