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
    
   // static postUserDbServiceInstance(){
   //    return instance? instance: new userDbService();
   // }

   /*
     This code defines an asynchronous function getAllData using the async/await syntax. 
     The purpose of this function is to retrieve all data from a database table named 
     "Users" using a SQL query.

     Let's break down the code step by step:
         - async getAllData() {: This line declares an asynchronous function named getAllData.

         - try {: The try block is used to wrap the code that might throw an exception 
            If any errors occur within the try block, they can be caught and handled in 
            the catch block.

         - const response = await new Promise((resolve, reject) => { ... });: 
            This line uses the await keyword to pause the execution of the function 
            until the Promise is resolved. Inside the await, there is a new Promise 
            being created that represents the asynchronous operation of querying the 
            database. resolve is called when the database query is successful, 
            and it passes the query results. reject is called if there is an error 
            during the query, and it passes an Error object with an error message.

         - The connection.query method is used to execute the SQL query on the database.

         - return response;: If the database query is successful, the function returns 
           the response, which contains the results of the query.

        - catch (error) {: The catch block is executed if an error occurs anywhere in 
           the try block. It logs the error to the console.

        - console.log(error);: This line logs the error to the console.   
    }: Closes the catch block.

    In summary, this function performs an asynchronous database query using await and a 
   Promise to fetch all data from the "Users" table. If the query is successful, 
   it returns the results; otherwise, it catches and logs any errors that occur 
   during the process. It's important to note that the await keyword is used here 
   to work with the asynchronous nature of the connection.query method, allowing 
   the function to pause until the query is completed.
   */
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
        
            // console.log("userDbServices.js: search result:");
            // console.log(response);  // for debugging to see the result of select
            return response;

        }  catch(error){
           console.log(error);
        }
   }


   async registerNewUser(username, password, firstname, lastname, salary, age){
         try {
            const registerDate = new Date();
            const timeLoggedIn = new Date();    // TODO: Change this to null for final version
            // use await to call an asynchronous function
            //const hashedPassword = bcrypt.hash(password, 10);
            const insertProfile = await new Promise((resolve, reject) => 
            {
               const query = "INSERT INTO Users (username, password, firstname, lastname, salary, age, registerday, signintime) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
               connection.query(query, [ username, password, firstname, lastname, salary, age, registerDate, timeLoggedIn], (err, results) => {
                   if(err) reject(new Error(err.message));
                   else resolve(results.insertProfile);
               });
            });
            console.log(insertProfile);  // for debugging to see the result of select
            //res.status(201).json({ message: 'User registered successfully!', data: results.insertProfile });
            return{
               username: username,
               password: password,
               firstname: firstname,
               lastname: lastname,
               salary: salary,
               age: age,
               registerDate: registerDate,
               timeLoggedIn: timeLoggedIn
            }
         } catch(error){
               console.log(error);
               throw error;
         }
   }

   // // Search users by user ID
   // async searchByAttribute(attribute, key) {
   //    try {
   //       // ?? is used to insert dynamic values into the query
   //       // ? is a placeholder for the actual value
   //       const query = "SELECT * FROM Users WHERE ?? = ?;";
   //       const response = await new Promise((resolve, reject) => {
   //          connection.query(query, [attribute, key], (err, results) => {
   //                if (err) reject(new Error(err.message));
   //                else resolve(results);
   //          });
   //       });
   //       return response;
   //    } catch (error) {
   //       console.error("Error in searchByAttribute:", error);
   //       throw error;
   //    }
   // }


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

   // Search users by first name
   async searchByLastname(lastname) {
      try {
         const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM Users WHERE lastname = ?;";
            connection.query(query, [lastname], (err, results) => {
               if (err) reject(new Error(err.message));
               else resolve(results);
            });
         });
         return response;
      } catch (error) {
         console.error("Error in searchByLastname:", error);
         throw error; // Ensure the error is propagated
      }
   }

   // Search users by first and/or last name
   async searchByFirstAndLastName(firstname, lastname) {
      try {
          const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM Users WHERE firstname = ? AND lastname = ?;";
            connection.query(query, [firstname, lastname], (err, results) => {
               if (err) reject(new Error(err.message));
               else resolve(results);
            });
         });
         return response;
      } catch (error) {
          console.error("Error in searchByFirstAndLastName:", error);
          throw error; // Ensure the error is propagated
      }
   }


// Search users by salary range (between x and y)
async searchBySalary(minSalary, maxSalary) {
   try {
      const response = await new Promise((resolve, reject) =>
      {
         const query = "SELECT * FROM Users WHERE salary BETWEEN ? AND ?;";
         connection.query(query, [minSalary || 0, maxSalary || Number.MAX_SAFE_INTEGER], (err, results) => {
            if (err) reject(new Error(err.message));
            else resolve(results);
      });
   });
      console.log(response);  // for debugging to see the result of select
      return response ;

   }  catch (error) {
         console.error("Error in searchBySalary:", error);
         throw error;
   }
}

// Search users by age range (between x and y)
async searchByAge(minAge, maxAge) {
   try {
       const response = await new Promise((resolve, reject) => {
         const query = "SELECT * FROM Users WHERE age BETWEEN ? AND ?;";
            connection.query(query, [minAge || 0, maxAge || 200], (err, results) => {
               if (err) reject(new Error(err.message));
               else resolve(results);
            });
         }
      );
      console.log(response);  // for debugging to see the result of select
      return response;

   } catch (error) {
      console.error("Error in searchByAgeRange:", error);
      throw error;
   }
}

// Search users by age range (between x and y)
async searchByRegistrationDate(username, registerday) {
   try {
       const response = await new Promise((resolve, reject) => {
         const query = "SELECT registerDate FROM Users WHERE username = ? AND registerday < username.register;";
            connection.query(query, [minAge || 0, maxAge || 200], (err, results) => {
               if (err) reject(new Error(err.message));
               else resolve(results);
            });
         }
      );
      console.log(response);  // for debugging to see the result of select
      return response;

   } catch (error) {
      console.error("Error in searchByRegistrationRange:", error);
      throw error;
   }
}

//search users who registered after john registered where john is the userid
async searchAfterJohn(johnId) {
   try {
       const query = "SELECT * FROM Users WHERE registerday > (SELECT registerday FROM Users WHERE username =?) ORDER BY registerday ASC;";
       const response = await new Promise((resolve, reject) => {
           connection.query(query, [johnId], (err, results) => {
               if (err) reject(new Error(err.message));
               else resolve(results);
           });
       });
       return response;
   } catch (error) {
       console.error("Error in searchAfterJohn:", error);
       throw error;
   }
}

   //search users who never signed in
   async searchByNeverLoggedIn(){
         try{
            // use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => 
               {
                  const query = "SELECT * FROM Users WHERE signintime = '0000-00-00 00:00:00';";
                  connection.query(query, (err, results) => {
                           if(err) reject(new Error(err.message));
                           else resolve(results);
                  });
               }
               );

               // console.log("userDbServices.js: search result:");
               // console.log(response);  // for debugging to see the result of select
               return response;

         }  catch(error){
            console.log(error);
         }
      }

   //search users who registered on the same day that john registered
   async searchBySameDayAsJohn(johnId){
        try{
           // use await to call an asynchronous function
           const response = await new Promise((resolve, reject) => 
              {
                 const query = "SELECT * FROM Users WHERE DATEDIFF(registerday, (SELECT registerday FROM Users WHERE username =?)) = 0 AND username!=?;";
                 connection.query(query, [johnId, johnId], (err, results) => {
                         if(err) reject(new Error(err.message));
                         else resolve(results);
                 });
              }
            );

            // console.log("userDbServices.js: search result:");
            // console.log(response);  // for debugging to see the result of select
            return response;

        }  catch(error){
           console.log(error);
        }
   }


   async searchByRegisteredToday() {
      const today = new Date();
      
      // Get the start and end of today in the correct format
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // 00:00:00
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // 23:59:59
      
      //const query = "SELECT * FROM Users WHERE registerday >= $1 AND registerday <= $2";
      try {
      //const response = await new Promise((resolve, reject) =>
         //{
         const query = "SELECT * FROM Users WHERE registerday >= $1 AND registerday <= $2";
          const result = await pool.query(query, [startOfDay, endOfDay]);
          return result.rows; // Return the array of users registered today
      } catch (error) {
          console.error('Error executing query:', error); // Log the query error
          throw error; // Rethrow for handling in app.js
      }
   }


//    async searchByName(firstname){
//       try{
//         //TODO: check if this dateAdded is needed
//            //const dateAdded = new Date();
//            // use await to call an asynchronous function
//            const response = await new Promise((resolve, reject) => 
//                 {
//                    const query = "SELECT * FROM Users where firstname = ?;";
//                    connection.query(query, [firstname], (err, results) => {
//                        if(err) reject(new Error(err.message));
//                        else resolve(results);
//                    });
//                 }
//            );

//            // console.log(response);  // for debugging to see the result of select
//            return response;

//        }  catch(error){
//           console.log(error);
//        }
//  }



   //return users who registered today
   // async searchByToday(){
   //      try{
   //         // use await to call an asynchronous function
   //         const response = await new Promise((resolve, reject) => 
   //            {
   //               const query = "SELECT * FROM Users WHERE DAYOFYEAR(registerday) = DAYOFYEAR(CURDATE());";
   //               connection.query(query, (err, results) => {
   //                       if(err) reject(new Error(err.message));
   //                       else resolve(results);
   //               });
   //            }
   //          );

   //          // console.log("userDbServices.js: search result:");
   //          // console.log(response);  // for debugging to see the result of select
   //          return response;

   //      }  catch(error){
   //         console.log(error);
   //      }
   // }
   //return all the users who registered today
   // Return all the users who registered today
// async searchByRegisteredToday() {
//    const today = new Date();
   
//    // Get the start and end of today in the correct format
//    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // 00:00:00
//    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // 23:59:59

//    const query = 'SELECT * FROM Users WHERE registerday >= $1 AND registerday <= $2';
//    try {
//        const result = await pool.query(query, [startOfDay, endOfDay]);
//        return result.rows; // Return the array of users registered today
//    } catch (error) {
//        console.error('Error executing query:', error); // Log the query error
//        throw error; // Rethrow for handling in app.js
//    }
// }


   // async deleteRowByUsername(username){
   //       try{
   //          //id = parseInt(id, 10);
   //            // use await to call an asynchronous function
   //            const response = await new Promise((resolve, reject) => 
   //                {
   //                   const query = "DELETE FROM Users WHERE username = ?;";
   //                   connection.query(query, [username], (err, result) => {
   //                        if(err) reject(new Error(err.message));
   //                        else resolve(result.affectedRows);
   //                   });
   //                }
   //             );

   //             console.log(response);  // for debugging to see the result of select
   //             return response === 1? true: false;

   //       }  catch(error){
   //            console.log(error);
   //       }
   // }

  
//   async updateNameById(username, newName){
//       try{
//            console.log("userDbService: ");
//            console.log(username);
//            console.log(newName);
//            id = parseInt(id, 10);
//            // use await to call an asynchronous function
//            const response = await new Promise((resolve, reject) => 
//                {
//                   const query = "UPDATE Users SET name = ? WHERE id = ?;";
//                   connection.query(query, [newName, id], (err, result) => {
//                        if(err) reject(new Error(err.message));
//                        else resolve(result.affectedRows);
//                   });
//                }
//             );

//             // console.log(response);  // for debugging to see the result of select
//             return response === 1? true: false;
//       }  catch(error){
//          console.log(error);
//       }
//   }

   async searchByUsernameAndPassword(username, password) {
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