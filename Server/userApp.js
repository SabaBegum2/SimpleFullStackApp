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


// Search users by first name and last name
app.get('/search-by-fullname/:firstname?/:lastname?', async (request, response) => {
    const { firstname, lastname } = request.params;
    console.log('Searching for:', firstname, lastname);

    const db = userDbService.getUserDbServiceInstance();
    let result;

    if (!firstname && !lastname) {
        return response.json({ data: [] }); // Return empty array if both names are empty
    }

    try {
        if (firstname && lastname) {
            result = await db.searchByFirstAndLastName(firstname, lastname);
        } else if (firstname) {
            result = await db.searchByFirstname(firstname);
        } else {
            result = await db.searchByLastname(lastname);
        }

        return response.json({ data: result });
    } catch (err) {
        console.error("Error searching by full name:", err);
        return response.status(500).json({ error: "An error occurred while searching by full name." });
    }
});

// Search user by username
app.get('/search-by-username/:username', async (request, response) => {
    const { username } = request.params;
    console.log('Searching for username:', username);

    const db = userDbService.getUserDbServiceInstance();
    
    try {
        const user = await db.searchByUsername(username);

        if (!user) {
            return response.status(404).json({ message: "User not found." });
        }

        return response.json({ data: user });
    } catch (err) {
        console.error("Error searching by username:", err);
        return response.status(500).json({ error: "An error occurred while searching by username." });
    }
});

// Search users whose salary is between x and y
app.get('/search-by-salary/:minSalary?/:maxSalary?', async (request, response) => {
    let { minSalary = 0, maxSalary = 999999999 } = request.params;

    const db = userDbService.getUserDbServiceInstance();
    minSalary = parseFloat(minSalary);
    maxSalary = parseFloat(maxSalary);

    // Validate salary range
    if (isNaN(minSalary) || isNaN(maxSalary) || minSalary > maxSalary) {
        return response.status(400).json({ error: "Invalid salary range." });
    }

    console.log('Min Salary:', minSalary, 'Max Salary:', maxSalary);

    try {
        const result = await db.searchBySalary(minSalary, maxSalary);
        return response.json({ data: result });
    } catch (err) {
        console.error("Error searching by salary:", err);
        return response.status(500).json({ error: "Database error occurred." });
    }
});

// Search users whose age is between X and Y
app.get('/search-by-age/:minAge?/:maxAge?', async (request, response) => {
    let { minAge = 0, maxAge = 200 } = request.params;

    minAge = parseInt(minAge);
    maxAge = parseInt(maxAge);

    console.log('Min Age:', minAge, 'Max Age:', maxAge);

    const db = userDbService.getUserDbServiceInstance();

    try {
        const result = await db.searchByAge(minAge, maxAge);
        return response.json({ data: result });
    } catch (err) {
        console.error("Error searching by age:", err);
        return response.status(500).json({ error: "Database error occurred." });
    }
});

//users who registered after a spefic user
app.get('/search-by-registered-after/:username', async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: "Username is required." });
    }

    try {
        const db = userDbService.getUserDbServiceInstance();
        const user = await db.searchByUsername(username);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const result = await db.searchByRegisteredAfterUser(user.id);
        return res.json({ data: result });
    } catch (err) {
        console.error("Error fetching users registered after:", err);
        return res.status(500).json({ error: "An error occurred while searching users." });
    }
});
// Users who registered on the same day as a specific username
app.get('/search-by-users/:username', async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: "Username is required." });
    }

    try {
        const db = userDbService.getUserDbServiceInstance();
        const user = await db.searchByUsername(username);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const result = await db.searchBySameDayAsUser(user.id);
        return res.json({ data: result });
    } catch (err) {
        console.error("Error fetching users by same registration day:", err);
        return res.status(500).json({ error: "An error occurred while searching users." });
    }
});

// Users who never signed in
app.get('/search-users-never-signed-in', async (req, res) => {
    try {
        const db = userDbService.getUserDbServiceInstance();
        const result = await db.searchByNoLogin();

        if (result.length === 0) {
            return res.status(404).json({ message: "No users found who have never signed in." });
        }

        return res.json({ data: result });
    } catch (err) {
        console.error("Error fetching users who never signed in:", err);
        return res.status(500).json({ error: "An error occurred while searching for users." });
    }
});

// Users who registered today
app.get('/search-users-registered-today', async (req, res) => {
    try {
        const db = userDbService.getUserDbServiceInstance();
        const result = await db.searchByRegisteredToday();

        if (result.length === 0) {
            return res.status(404).json({ message: "No users found who registered today." });
        }

        return res.json({ data: result });
    } catch (err) {
        console.error("Error fetching users who registered today:", err);
        return res.status(500).json({ error: "An error occurred while searching for users." });
    }
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






// TODO: Combine this function to just work in Username search and return "User doesn't exist" instead
app.get('/searchNeverLoggedIn/', async (request, response) => {
    const { username } = request.params;
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
//when the user selects the register today option in dropdown in search directory page, return the users who registered today

// app.get('/search/RegisteredToday', async (request, response) => {

//     let result;
//     try {
//         const db = userDbService.getUserDbServiceInstance();
//         const result = await db.searchByRegisteredToday();
//         result = response.json({ data: result });
//     } catch (err) {
//         console.error(err);
//         result = response.status(500).json({ error: "An error occurred while searching users." });
//     }
//     result
// });

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
