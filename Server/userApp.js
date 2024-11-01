// Server: application services, accessible by URIs

const express = require('express')
const cors = require ('cors')
const dotenv = require('dotenv')
dotenv.config()
const bodyParser = require('body-parser'); // Import body-parser

const app = express();
const userDbService = require('./userDbService');

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));



// read 
app.get('/getAll', (request, response) => {
    
    const db = userDbService.getUserDbServiceInstance();
    
    const result =  db.getAllData(); // call a DB function

    result
    .then(data => response.json({ data: data }))
    .catch(err => console.log(err));
});


// create
app.post('/register', async(request, response) => {
    console.log("userApp: insert a row.");
    //console.log(request.body); 
    try {
        const {username, password, firstname, lastname, age, salary} = request.body;

        // Check for missing fields
        if (!firstname || !lastname || !username || !password) {
            return response.status(400).json({ message: "All required fields must be filled." });
        }

        const db = userDbService.getUserDbServiceInstance();

        const result = await db.registerNewUser(username, password, firstname, lastname, salary, age);

        response.status(201).json({ message: "User registration successful!", data: result });
    }
    catch (error) {
        //.then(data => response.json({data: data})) // return the newly added row to frontend, which will show it
        //.then(data => console.log({data: data})) // debug first before return by response
        //.catch(err => console.log(err));
        console.error(error);
        response.status(500).json({ error: "An error occurred while registering user." });
    }
});


app.post('/login', async (request, response) => {

    app.use(bodyParser.json());

    const { username, password } = request.body;

    console.log("receiving username:", username); // debugging
    console.log("receiving password:", password); // debugging

    const db = userDbService.getUserDbServiceInstance();

    try {
        // Search for a user with both the matching username and password
        const result = await db.searchByUsernameAndPassword(username, password);

        // If no matching user is found, return an error
        if (!result) {
            return response.status(401).json({ error: "Invalid username or password" });
        }

        // Successful login
        response.json({ success: true });
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: "An error occurred while logging in." });
    }
});


app.get('/search/:firstname', (request, response) => { // we can debug by URL
    console.log("userApp.js - search by first name");
    const {firstname} = request.params;
    
    console.log(firstname);

    const db = userDbService.getUserDbServiceInstance();

    let result;
    if(firstname === "all") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByFirstname(firstname); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});



//search users by last name
app.get('/searchLastname/:lastname', (request, response) => {
    const { lastname } = request.params;
    //console.log(lastname);
    console.log(lastname);  // Debugging

    const db = userDbService.getUserDbServiceInstance();

    let result;
    if (lastname === "all") {
        // Return empty array if last name is not provided
        //result = Promise.resolve([]);
        result = db.getAllData()
    } else {
        // Proceed with searching by last name
        result = db.searchByLastname(lastname);
    }
    result

    .then(data => response.json({data: data}))
    .catch(err => console.log('Error: ', err));
});


//search users by first name and last name
app.get('/search/fullname/:firstname/:lastname', (request, response) => {
    const { firstname, lastname } = request.params;
    console.log(firstname, lastname);

    const db = userDbService.getUserDbServiceInstance();

    const result = db.searchByFirstAndLastName(firstname, lastname);

    result
        .then(data => response.json({ data: data }))
        .catch(err => {
            console.error("Error: ", err);
            response.status(500).json({ error: "An error occurred while searching users." });
    });
});


//search users by last name
app.get('/searchUsername/:username', (request, response) => {
    const { username } = request.params;
    console.log(username);  // Debugging

    const db = userDbService.getUserDbServiceInstance();

    let result;
    if (username === "all") {
        // Return empty array if last name is not provided
        //result = Promise.resolve([]);
        result = db.getAllData()
    } else {
        // Proceed with searching by last name
        result = db.searchByUsername(username);
    }
    result

    .then(data => response.json({data: data}))
    .catch(err => console.log('Error: ', err));
});


app.get('/search/salary/:min/:max', (request, response) => {
    const { min, max } = request.params;

    const db = userDbService.getUserDbServiceInstance();

    const result = db.searchBySalary(min, max);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Search users by age range
app.get('/search/age/:min/:max', (request, response) => {
    const { min, max } = request.params;
    
    const db = userDbService.getUserDbServiceInstance();

    const result = db.searchByAge(min, max);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Search users registered after specific user
app.get('/search/regAfter/:username', (request, response) => {
    const { username } = request.params;

    const db = userDbService.getUserDbServiceInstance();

    const result = db.searchAfterRegDate(username);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Search users registered same day as specific user
app.get('/search/regSameDay/:username', (request, response) => {
    const { username } = request.params;

    const db = userDbService.getUserDbServiceInstance();

    const result = db.searchSameDayRegDate(username);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});


// Search users who never signed in
app.get('/search/neverSignedIn', (request, response) => {

    const db = userDbService.getUserDbServiceInstance();

    const result = db.searchNeverSignedIn();

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Search users who never signed in
app.get('/search/regToday', (request, response) => {


    const db = userDbService.getUserDbServiceInstance();

    const result = db.searchRegToday();

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});



// Route for searching users registered today
app.get('/search/RegisteredToday', async (request, response) => {
    try {
        const db = userDbService.getUserDbServiceInstance();
        const result = await db.searchByRegisteredToday();
        //response.json({ data: data });
        response.json({ data: result });
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: "An error occurred while searching users." });
    }
});



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
