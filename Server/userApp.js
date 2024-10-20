// Server: application services, accessible by URIs


const express = require('express')
const cors = require ('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express();
const userDbService = require('./userDbService');


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

// create
app.post('/insert', (request, response) => {
    console.log("userApp: insert a row.");
    //console.log(request.body); 

    const {username} = request.body;
    const db = userDbService.getUserDbServiceInstance();

    const result = db.insertNewName(username);
 
    // note that result is a promise
    result 
    .then(data => response.json({data: data})) // return the newly added row to frontend, which will show it
    .then(data => console.log({data: data})) // debug first before return by response
    .catch(err => console.log(err));
});




// read 
app.get('/getAll', (request, response) => {
    
    const db = userDbService.getUserDbServiceInstance();

    
    const result =  db.getAllData(); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


app.get('/search/:username', (request, response) => { // we can debug by URL
    
    const {name} = request.params;
    
    console.log(name);

    const db = userDbService.getUserDbServiceInstance();

    let result;
    if(name === "all") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByName(name); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


// update
// app.patch('/update', 
//      (request, response) => {
//           console.log("app: update is called");
//           //console.log(request.body);
//           const{id, name} = request.body;
//           console.log(id);
//           console.log(name);
//           const db = userDbService.getUserDbServiceInstance();

//           const result = db.updateNameById(id, name);

//           result.then(data => response.json({success: true}))
//           .catch(err => console.log(err)); 

//      }
// );

// delete service
app.delete('/delete/:username', 
     (request, response) => {     
        const {username} = request.params;
        console.log("delete");
        console.log(username);
        const db = userDbService.getUserDbServiceInstance();

        const result = db.deleteRowById(username);

        result.then(data => response.json({success: true}))
        .catch(err => console.log(err));
     }
)   

// debug function, will be deleted later
app.post('/debug', (request, response) => {
    // console.log(request.body); 

    const {debug} = request.body;
    console.log(debug);

    return response.json({success: true});
});   

// debug function: use http://localhost:5050/testdb to try a DB function
// should be deleted finally
app.get('/testdb', (request, response) => {
    
    const db = userDbService.getUserDbServiceInstance();

    
    const result =  db.deleteByUsername("14"); // call a DB function here, change it to the one you want

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


  



// If port isn't set, then defaults to 5050
// This was my workaround to force my computer to recognize 
// the backend server without changing file Users
const port = process.env.PORT || 5050;
// set up the web server listener
app.listen(port,
    () => {
        console.log("I am listening on the configured port " + process.env.PORT)
    }
);
