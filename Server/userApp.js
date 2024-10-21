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

//search users by first and/or last name
app.get('/searchByFirstAndLastName', (request, response) => {
    const {firstname , lastname} = request.query;
    console.log(firstname);
    console.log(lastname);

    const db = userDbService.getUserDbServiceInstance();
    let result;

    if (firstname === "" && lastname === "") {
        // Return empty array if both firstname and lastname are empty
        return response.json({ data: [] });
    } else {
        // Proceed with searching by name
        result = db.searchUsersByName(firstname, lastname);
    }

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

//search users by user id
app.get('/searchUsersByUserID', (request, response) => {
    const { id = "" } = request.query;
    console.log(id);

    const db = userDbService.getUserDbServiceInstance();
    let result;

    if (id === "") {
        // Return empty array if user id is empty
        return response.json({ data: [] });
    } else {
        // Proceed with searching by user id
        result = db.searchUsersByUserId(id);
    }

    result
       .then(data => response.json({ data: data }))
       .catch(err => console.log(err));
});

//search all users whose salary is between x and y
app.get('/searchUsersBySalary', (request, response) => {
    let { minSalary = 0, maxSalary = 99999999 } = request.query;

    // Convert to floats and handle potential invalid input
    minSalary = parseFloat(minSalary);
    maxSalary = parseFloat(maxSalary);

    // Basic validation to ensure numbers are valid
    if (isNaN(minSalary) || isNaN(maxSalary)) {
        return response.status(400).json({ error: "Invalid salary range" });
    }

    console.log('Min Salary:', minSalary);
    console.log('Max Salary:', maxSalary);

    const db = dbService.getDbServiceInstance();

    let result;
    if (minSalary === 0 && maxSalary === 99999999) {
        //result = db.getAllData(); // Fetch all data if no salary range is provided
        return response.json({ data: []});
    } else {
        result = db.SearchUsersBySalary(minSalary, maxSalary); // Call a DB function
    }

    result
        .then(data => response.json({ data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ error: "Database error occurred" });
        });
});

// Search all users whose age is between X and Y
app.get('/searchUsersByAge', (request, response) => {
    let { minAge = 0, maxAge = 120 } = request.query;

    minAge = parseInt(minAge);
    maxAge = parseInt(maxAge);

    console.log(minAge);
    console.log(maxAge);

    const db = dbService.getDbServiceInstance();

    let result;
    if (minAge === 0 && maxAge === 120) {
        return response,json({ data: []}); //return an emapty array
    } else {
        result = db.SearchUsersByAge(minAge, maxAge); // Call a DB function
    }

    result
        .then(data => response.json({ data: data }))
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
