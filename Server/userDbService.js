// database services, accessbile by userDbService methods.

const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config(); // read from .env file

let instance = null; 

// if you use .env to configure

console.log("HOST: " + process.env.HOST);
console.log("DB USER: " + process.env.DB_USER);
console.log("PASSWORD: " + process.env.PASSWORD);
console.log("DATABASE: " + process.env.DATABASE);
console.log("DB PORT: " + process.env.DB_PORT);
const connection = mysql.createConnection({
     host: process.env.HOST,
     user: process.env.DB_USER,        
     password: process.env.PASSWORD,
     database: process.env.DATABASE,
     port: process.env.DB_PORT
});


//if you configure directly in this file, there is a security issue, but it will work
// const connection = mysql.createConnection({
//    host:"localhost",
//    user:"root",        
//    password:"",
//    database:"web_app",
//    port:3306
// });

connection.connect((err) => {
     if(err){
        console.log(err.message);
     }
     console.log('db ' + connection.state);    // to see if the DB is connected or not
});

// the following are database functions, 


class userDbService{
   static getUserDbServiceInstance(){
      return instance? instance: new userDbService();
   }
    
    async getAllData(){
        try{
           // use await to call an asynchronous function
           const response = await new Promise((resolve, reject) => 
              {
                  const query = "SELECT * FROM Users;";
                  connection.query(query, 
                       (err, results) => {
                             if(err) reject(new Error(err.message));
                             else resolve(results);
                       }
                  );
               }
            );
            return response;

        }  catch(error){
           console.log(error);
        }
   }


   async registerNewUser(username, password, firstname, lastname, salary, age){
         try {
            const registerDate = new Date().toISOString().split('T')[0];
            console.log("registerDate: ", registerDate);
            let timeLoggedIn = new Date('0000-00-00 00:00:00.00');
            //let timeLoggedIn = null;
            const insertProfile = await new Promise((resolve, reject) => 
            {
               const query = "INSERT INTO Users (username, password, firstname, lastname, salary, age, registerday, signintime) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
               connection.query(query, [ username, password, firstname, lastname, salary, age, registerDate, timeLoggedIn], (err, results) => {
                   if(err) reject(new Error(err.message));
                   else resolve(results.insertProfile);
               });
            });
            console.log(insertProfile);  // for debugging to see the result of select
            return{
               username: username,
               password: password,
               firstname: firstname,
               lastname: lastname,
               salary: salary,
               age: age,
               registerday: registerDate,
               signintime: timeLoggedIn
            }
         } catch(error){
               console.log(error);
               throw error;
         }
   }


   async searchByUsername(username){
      try{
         // use await to call an asynchronous function
         const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM Users WHERE username = ?;";
            connection.query(query, [username], (err, results) => {
               if(err) reject(new Error(err.message));
               else resolve(results);
            });
         });
         // console.log(response);  // for debugging to see the result of select
         return response;
      }  catch(error) {
         console.error("Error: ", error);
      }
   }


   // Search users by first name
   async searchByFirstname(firstname) {
      try {
         const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM Users WHERE firstname LIKE ?;";
            connection.query(query, [firstname], (err, results) => {
               if (err) reject(new Error(err.message));
               else resolve(results);
            });
         });
         return response;
      } catch (error) {
         console.log(error);
         //console.error("Error in searchByFirstname: ", error);
         //throw error; // Ensure the error is propagated
      }
   }

   // Search users by last name
   async searchByLastname(lastname) {
      try {
         const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM Users WHERE lastname LIKE ?;";
            connection.query(query, [lastname], (err, results) => {
               if (err) reject(new Error(err.message));
               else resolve(results);
            });
         });
         return response;
      } catch (error) {
         console.error("Error in searchByLastname:", error);
      }
   }

    // Search users by first and last name
    async searchByFirstAndLastName(firstname, lastname) {
      try {
          const response = await new Promise((resolve, reject) => {
              const query = "SELECT * FROM Users WHERE firstname LIKE ? AND lastname LIKE ?;";
              connection.query(query, [`%${firstname}%`, `%${lastname}%`], (err, results) => {
                  if (err) reject(new Error(err.message));
                  else resolve(results);
              });
          });
          return response;
      } catch (error) {
          console.log(error);
      }
  }

   // Search users by username
   async searchByUsername(username) {
      try {
         const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM Users WHERE username LIKE ?;";
            connection.query(query, [username], (err, results) => {
               if (err) reject(new Error(err.message));
               else resolve(results);
            });
         });
         return response;
      } catch (error) {
         console.error("Error in searchByUsername:", error);
      }
   }


// Search users by salary range
async searchBySalary(minSalary, maxSalary) {
   try {
       const response = await new Promise((resolve, reject) => {
           const query = "SELECT * FROM Users WHERE salary BETWEEN ? AND ?;";
           connection.query(query, [minSalary, maxSalary], (err, results) => {
               if (err) reject(new Error(err.message));
               else resolve(results);
           });
       });
       return response;
   } catch (error) {
       console.log(error);
   }
}

// Search users by age range
async searchByAge(minAge, maxAge) {
   try {
       const response = await new Promise((resolve, reject) => {
           const query = "SELECT * FROM Users WHERE age BETWEEN ? AND ?;";
           connection.query(query, [minAge, maxAge], (err, results) => {
               if (err) reject(new Error(err.message));
               else resolve(results);
           });
       });
       return response;
   } catch (error) {
       console.log(error);
   }
}

// Search users registered after specific user
async searchAfterRegDate(username) {
   try {
       const response = await new Promise((resolve, reject) => {
         const query = "SELECT * FROM Users WHERE registerday > (SELECT registerday FROM Users WHERE username = ?);";
            connection.query(query, [username], (err, results) => {
               if (err) reject(new Error(err.message));
               else resolve(results);
            });
         }
      );
      console.log(response);  // for debugging to see the result of select
      return response;
   } catch (error) {
      console.error(error);
   }
}

// Search users registered on same day as user
async searchSameDayRegDate(username) {
   try {
       const response = await new Promise((resolve, reject) => {
         const query = "SELECT * FROM Users WHERE registerday = (SELECT registerday FROM Users WHERE username = ?);";
            connection.query(query, [username], (err, results) => {
               if (err) reject(new Error(err.message));
               else resolve(results);
            });
         }
      );
      console.log(response);  // for debugging to see the result of select
      return response;
   } catch (error) {
      console.error(error);
   }
}

// Search users who never signed in
async searchNeverSignedIn() {
   //const emptyDate = '0000-00-00 00:00:00.00';
   let emptyDate = new Date('0000-00-00 00:00:00.00');

   //let emptyDate = 'null';
   //const emptyDate = "";
   try {
       const response = await new Promise((resolve, reject) => {
           const query = "SELECT * FROM Users WHERE signintime IS NULL;";
           connection.query(query, (err, results) => {
               if (err) reject(new Error(err.message));
               else resolve(results);
           });
       });
       return response;
   } catch (error) {
       console.log(error);
   }
}

// Search users who registered today
async searchRegToday() {
   try {
      const today = new Date().toISOString().split('T')[0];    // Get today's date in YYYY-MM-DD format
      const response = await new Promise((resolve, reject) => {
         const query = "SELECT * FROM Users WHERE registerday = ?;";
         connection.query(query, [today], (err, results) => {
            if (err) reject(new Error(err.message));
            else resolve(results);
         });
      });
      return response;
   } catch (error) {
      console.log(error);
   }
}


   async searchByUsernameAndPassword(username, password){
      const newSignInTime = new Date();

      try {
         const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM Users WHERE username = ? AND password = ?;";
            console.log("executing query:", query, [username, password]); // debugging
            connection.query(query, [username, password], (err, results) => {
                  if (err) {
                     reject(new Error(err.message));
                  } else {
                     resolve(results);
                  }
            });
            const datequery = "UPDATE Users SET signintime = ? WHERE username = ? AND password = ?;";
               console.log("executing sign in date query:", datequery, [newSignInTime, username, password]); // debugging
               connection.query(datequery, [newSignInTime, username, password], (err, results) => {
                  if (err) {
                     reject(new Error(err.message));
                  } else {
                      resolve(results);
                  }
            });
         });
         
         // If the response has results, return the first result (assuming usernames are unique)
         if (response.length > 0) {
            return response[0]; // Return the user object
         } else {
            return null; // No user found
         }
         
      } catch (error) {
         console.error("Database query error:", error);
         return null; // Return null on error
      }
   }
}

module.exports = userDbService;