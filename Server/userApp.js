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



// read 
app.get('/getAll', (request, response) => {
    
    const db = userDbService.getUserDbServiceInstance();

    
    const result =  db.getAllData(); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


// Search by Username
app.get('/search/:username', (request, response) => { // we can debug by URL
    
    const {username} = request.params;
    
    console.log(username);

    const db = userDbService.getUserDbServiceInstance();

    let result;
    if(username === "all") { // in case we want to search all
       result = db.getAllData()
    } else { 
       result =  db.searchByUsername(username); // call a DB function
    }
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});



//search users by first name
app.get('/search/:firstname', (request, response) => {
    const {firstname} = request.query;
    console.log(firstname);

    const db = userDbService.getUserDbServiceInstance();

    let result;
    if (firstname === "") {
        // Return empty array if both firstname and lastname are empty
        result =  response.json({ data: [] });
    } else {
        // Proceed with searching by name
        result = db.searchByFirstName(firstname);
    }
    result

        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

//search users by last name
app.get('/search/:lastname', (request, response) => {
    const {lastname} = request.query;
    console.log(lastname);

    const db = userDbService.getUserDbServiceInstance();

    let result;
    if (lastname === "") {
        // Return empty array if both firstname and lastname are empty
        result = response.json({ data: [] });
    } else {
        // Proceed with searching by name
        result = db.searchByLasttname(lastname);
    }
    result

        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});


//search users by first name
app.get('/search/firstandlastname', (request, response) => {
    const {firstname} = request.query;
    console.log(firstname);

    const db = userDbService.getUserDbServiceInstance();

    let result;
    if (firstname === "") {
        // Return empty array if both firstname and lastname are empty
        result =  response.json({ data: [] });
    } else {
        // Proceed with searching by name
        result = db.searchByFirstName(firstname);
    }
    result

        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});


// //search users by first name
// app.get('/search/firstname', (request, response) => {
//     const {firstname} = request.query;
//     console.log(firstname);

//     const db = userDbService.getUserDbServiceInstance();
//     let result;

//     if (firstname === "") {
//         // Return empty array if both firstname are empty
//         result = db.getAllData();
//     } else {
//         // Proceed with searching by name
//         result = db.searchByFirstname(firstname);
//     }

//     result
//         .then(data => response.json({ data: data }))
//         .catch(err => console.log(err));
// });

/*
//search users by first name
app.get('/search/:lastname', (request, response) => {
    const {lastname} = request.query;
    console.log(lastname);

    const db = userDbService.getUserDbServiceInstance();
    let result;

    if (firstname === "") {
        // Return empty array if both lastname are empty
        result = db.getAllData();
    } else {
        // Proceed with searching by name
        result = db.searchByLastname(firstname);
    }

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});
*/


// search all users whose salary is between x and y
app.get('/search/:salary', (request, response) => {
    let { minSalary = 0, maxSalary = 999999999 } = request.query;

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
        result = db.searchBySalary(minSalary, maxSalary); // Call a DB function
    }

    result
        .then(data => response.json({ data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ error: "Database error occurred" });
        });
});

// Search all users whose age is between X and Y
app.get('/search/age', (request, response) => {
    let { minAge = 0, maxAge = 120 } = request.query;

    minAge = parseInt(minAge);
    maxAge = parseInt(maxAge);

    console.log(minAge);
    console.log(maxAge);

    const db = dbService.getDbServiceInstance();

    let result;
    if (minAge === 0 && maxAge === 120) {
        result = response,json({ data: []}); //return an emapty array
    } else {
        result = db.searchByAge(minAge, maxAge); // Call a DB function
    }

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// //search users who registered after john registered, where "john" is the user id
// app.get('/searchByRegistrationDate', async (request, response) => {
//     const { username } = request.query;

//     if (!username) {
//         return response.status(400).json({ error: "Username is required" });
//     }

//     try {
//         const db = userDbService.getUserDbServiceInstance();
//         const user = await db.searchByUsername(username);

//         if (!user) {
//             return response.json({ data: [] });
//         }

//         const registrationDate = user.registration_date;
//         const result = await db.searchByRegistrationDate(registrationDate);
//         return response.json({ data: result });
//     } catch (err) {
//         console.error(err);
//         return response.status(500).json({ error: "An error occurred while searching users." });
//     }
// });

//search users who registered after john registered, where "john" is the user id
// app.get('/search/:registerDate', async (request, response) => {
//     const { username } = request.query;

//     try {
//         const db = userDbService.getUserDbServiceInstance();
//         const user = await db.searchByUsername(username);

//         if (!user) {
//             return response.json({ data: [] });
//         }

//         const registrationDate = user.registration_date;
//         const result = await db.searchByRegistrationDate(registrationDate);
//         return response.json({ data: result });
//     } catch (err) {
//         console.error(err);
//         result = response.status(500).json({ error: "An error occurred or Username does not exist." });
//     }
// });

app.get('/search/:registerDate', (request, response) => {

    const { username, registerDate } = request.params;

    console.log(username);
    
    const db = userDbService.getUserDbServiceInstance();

    let result;
    if (user === "") {
        result = response.json({ data: [] });
    }

    const registrationDate = user.registration_date;
    result = db.searchByRegistrationDate(username,registrationDate);
    result = response.json({ data: result });

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});



// TODO: Combine this function to just work in Username search and return "User doesn't exist" instead
app.get('/searchNeverLoggedIn', async (request, response) => {
    const { username } = request.query;
    let result;
    
    const db = userDbService.getUserDbServiceInstance();

    result = await db.searchByNeverLoggedIn();
    result = response.json({ data: result });

    result
    console.error(err);
    result = response.status(500).json({ error: "An error occurred while searching users." });
    
});

// TODO: Alter this function to make a function that checks for user first
        // then check for their registation date
/*
        //search users who registered on the same day that john registered
app.get('/registeredSameDay', async (request, response) => {

    let result;
    try {
        const db = userDbService.getUserDbServiceInstance();
        const findUser = await db.searchByName("");     // find user

        if (!findUser) {
            result = response.json({ data: [] });
        }

        const registrationDate = johnUser.registration_date;
        const result = await db.searchBySameDay(registrationDate);
        
        result = response.json({ data: result });
    } catch (err) {
        console.error(err);
        result = response.status(500).json({ error: "An error occurred while searching users." });
    }
});
*/


//return the users who registered today
/*
app.get('/searchRegisteredToday', async (request, response) => {

    let result;
    try {
        const db = userDbService.getUserDbServiceInstance();
        const result = await db.searchByRegisteredToday();
        result = response.json({ data: result });
    } catch (err) {
        console.error(err);
        result = response.status(500).json({ error: "An error occurred while searching users." });
    }
    result
});
*/

//update
/*
app.patch('/update', 
     (request, response) => {
          console.log("app: update is called");
          //console.log(request.body);
          const{id, name} = request.body;
          console.log(id);
          console.log(name);
          const db = userDbService.getUserDbServiceInstance();

          const result = db.updateNameById(id, name);

          result.then(data => response.json({success: true}))
          .catch(err => console.log(err)); 

     }
);
*/


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
