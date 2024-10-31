
// This is the frontEnd calls that interact with the HTML pages directly
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = document.body.getAttribute('data-page');  // Identify the current page
    console.log(`Current page: ${currentPage}`);


    // Execute the correct setup function based on the page
    if(currentPage === 'LoginPage') {
            const loginForm = document.getElementById("login-form");
            loginForm.addEventListener("submit", submitLoginForm);
            submitLoginForm();  // Fetch data for the search page
    }
    else if (currentPage === 'RegistrationPage') {
            const registrationForm = document.getElementById('registrationForm');
            registrationForm.addEventListener("submit", submitRegistrationForm);
            submitRegistrationForm();  // Setup registration form event
    }

    fetch('http://localhost:5050/getall')     
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));

});

// document.addEventListener('DOMContentLoaded', function () {
//     fetch('http://localhost:5050/getall')     
//     .then(response => response.json())
//     .then(data => loadHTMLTable(data['data']));

// });

//// PURPOSE: LOGIN FORM
function submitLoginForm(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById("username-input").value;
    const password = document.getElementById("password-input").value;

    console.log("username:", username); // debugging
    console.log("password:", password); // debugging

    // Send the login data to the server
    fetch('http://localhost:5050/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login successful');
            window.location.href = 'http://127.0.0.1:5501/Client/SearchDirectory.html'; // Redirect after successful login
        } else {
            alert(data.error); // Show error message from the server
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during login. Please try again.');
    });
}



//// PURPOSE: REGISTRATION FORM

function submitRegistrationForm(event) {

        // prevent the default reload action of the page
        event.preventDefault();

        // Get the registration form inputs
        const username = document.querySelector('#username-input').value.trim();
        const password = document.querySelector('#password-input').value.trim();
        const firstname = document.querySelector('#firstname-input').value.trim();
        const lastname = document.querySelector('#lastname-input').value.trim();
        const age = parseInt(document.querySelector('#age-input').value.trim()) || 0;
        const salary = parseInt(document.querySelector('#salary-input').value.trim()) || 0;

        // Check values against these characters
        const invalidChars = /[@#$%^&*()_+=[\]{};:"\\|,.<>/?]+/;
        const invalidUsernameChars = /[@#$%^&*()+=[\]{};:"\\|,.<>/?]+/;
        const invalidPasswordChars = /[[\]{};:\\|,<>/?]+/;

        // Check if firstname or lastname is less than 2 characters
        if (firstname.length < 2 || lastname.length < 2) {          // Check if firstname is less than 2 characters
            alert("Not enough characters in first or last name.");  // Throw error to user
            return; // Exit function
        }
        // Check if first or last name contains special characters
        if (invalidChars.test(firstname) || invalidChars.test(lastname)) {
            alert("First or Last name cannot contain special characters"); // Throw error to user
            return;
        }

        // Check if username has whitespace
        if (username.includes(" ")) { // Check if username contains whitespace
            alert("Username cannot contain whitespace"); // Throw error to user
            return; // Exit function
        }
        // Check if username is less than 4 characters
        if (username.length < 4) { // Check if username is less than 2 characters
            alert("Username must be at least 2 characters"); // Throw error to user
            return; // Exit function
        }
        // Check if username contains special characters
        if (invalidUsernameChars.test(username)) {
            alert("Username cannot contain special characters"); // Throw error to user
            return;
        }

        // Check if password has whitespace
        if (password.includes(" ")) { // Check if password contains whitespace
            alert("Password cannot contain whitespace"); // Throw error to user
            return;
        }
        // Check if password is less than 8 characters
        if (password.length < 8) { // Check if password is less than 8 characters
            alert("Password must be at least 8 characters"); // Throw error to user
            return; // Exit function
        }
        // Check if password contains special characters
        if (invalidPasswordChars.test(password)) {
            alert("Password cannot contain these special characters: []{};:\\|.<>/?"); // Throw error to user
            return;
        }

        // Check valid age range
        if (age < 1 || age > 200) { 
            alert("Please enter valid age."); // Throw error to user
            return;
        }
 
        fetch('http://localhost:5050/register', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({username, password, firstname, lastname, salary, age})
        })
        .then(response => response.json())
        .then(data => {
            alert("User registration successful!");
            console.log(data);  // debugging
            window.location.href = 'http://127.0.0.1:5501/Client/LoginPage.html'; // Redirect after successful login
        })
        .catch(error => console.error("Error: ", error));
    //}
}


// when the searchBtn is clicked
const searchBtn =  document.querySelector('#search-btn');
searchBtn.onclick = function (){
    console.log("Search button clicked for firstname");
    const searchInput = document.querySelector('#search-input');
    console.log("Search input: ", searchInput);
    const searchValue = searchInput.value;
    console.log("Search value: ", searchValue);
    searchInput.value = "";

    fetch('http://localhost:5050/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    console.log("Search button clicked for firstname");
}

// when the searchBtn is clicked
const searchLastnameBtn =  document.querySelector('#search-lastname-btn');
searchLastnameBtn.onclick = function (){
    console.log("Search button clicked for lastname");
    const searchInput = document.querySelector('#search-lastname-input');
    console.log("Search input: ", searchInput);
    const searchValue = searchInput.value;
    console.log("Search value: ", searchValue);
    searchInput.value = "";

    fetch('http://localhost:5050/searchLastname/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    console.log("Search button clicked for lastname");
}



/*const addBtn = document.querySelector('#add-user-btn');
addBtn.onclick = function (){
    const usernameInput = document.querySelector('#username-input');
    const username = usernameInput.value;
    usernameInput.value = "";

    fetch('http://localhost:5050/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({username: username})
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}*/

//const searchBtn = document.querySelector('searchInput');


// PURPOSE: SEARCH DATABASE FOR VALUES
// When the searchBtn is clicked
//function submitSearchDirectory(event) {

        //if (!searchBtn) return;

        //event.preventDefault();

        //const searchBtn = document.querySelector('#searchInput');
        // searchBtn.onclick = async function(event) {
        //     const selectOption = document.querySelector('#select-option').value;
        //     const option = selectOption;

        //     console.log("/Select option: ", selectOption);

        //     const searchInput = document.querySelector('#search-input').value.trim();
        //     const inputValue = searchInput;
        //     searchInput.value = "";

        //     console.log("Search input: ", searchInput);
        //     console.log("input Value: ", inputValue);

        //     try {
        //         fetch('http://localhost:5050/search/' + inputValue)
        //         .then(response => response.json())
        //         .then(data => loadHTMLTable(data['data']));


        //     //const response = await fetch('http://localhost:5050/search/' + address );

        //     //console.log("Response: ", response);
        //     //const response = await fetch('http://localhost:5050/search/' + searchInput);
        //     //const data = await response.json();
        //     // console.log(data);
        //     // loadHTMLTable(data['data']);
        //     } catch (error) {
        //         debug("Search input: ", searchInput);
        //         console.error("Error: ", error);
        //     }
        // }


    //const searchBtn = document.querySelector('#searchInput');
    //searchBtn.onclick = async function(event) {
    // searchBtn.addEventListener('click', async function() {
    //     // const selectOption = document.querySelector('#select-option');
    //     // const option = selectOption.value;
    //     // selectOption.value = "";

    //     // console.log("/Select option: ", selectOption);

    //     // const searchInput = document.querySelector('#search-input').trim();
    //     // const inputValue = searchInput.value;
    //     // searchInput.value = "";

    //     const selectOption = document.querySelector('select-option').value;
    //     const searchInput = document.querySelector('search-input').value.trim();
    //     const response = '';
    //     console.log("Search input: ", searchInput);

    //     //let address = "";
    //     try {
    //         switch(selectOption) {
    //             case "1":
    //                 console.log("Search by first name: ", searchInput);
    //                 fetch('http://localhost:5050/search/' + searchInput)
    //                 .then(response => response.json())
    //                 .then(data => loadHTMLTable(data['data']));

    //                 //address = inputValue;
    //                 //address = "firsname?firstname=" + searchInput ;
    //                 break;
    //             case "2":
    //                 //address = searchInput;
    //                 fetch('http://localhost:5050/search/' + searchInput)
    //                 .then(response => response.json())
    //                 .then(data => loadHTMLTable(data['data']));
    //                 //address = "lastname?lastname=" + searchInput ;
    //                 break;
    //             case "3":
    //                 address = "firstandlastname";
    //                 const firstnameVal = "firstname=" + document.querySelector('#first-box').value.trim();
    //                 const lastnameVal = "lastname=" + document.querySelector('#last-box').value.trim();
    //                 if (!firstnameVal || !lastnameVal) {
    //                     alert("Please enter both first and last name.");
    //                     return;
    //                 }
    //                 address = searchInput;
    //                 //address = selectOption + "?" + firstnameVal + "&" + lastnameVal;
    //                 break;
    //             case "4":
    //                 address = searchInput;
    //                 //selectOption = "username";
    //                 //address = selectOption + "?" + selectOption + "=" + searchInput ;
    //                 break;
    //             case "5":
    //                 //selectOption = "age";
    //                 address = searchInput;
    //                 //address = selectOption + "?" + selectOption + "=" + searchInput ;
    //                 break;
    //             case "6":
    //                 //selectOption = "salary";
    //                 address = searchInput;
    //                 const minSalary = document.querySelector('#first-box').value.trim();
    //                 const maxSalary = document.querySelector('#last-box').value.trim();
    //                 //address = selectOption + "?" + selectOption + "=" + searchInput ;
    //                 break;
    //             case "7":
    //                 // TODO: Implement registerday with 2 params
    //                 //selectOption = "registerday";
    //                 //address = selectOption + "?" + selectOption + "=" + searchInput ;
    //                 address = searchInput;
    //                 break;
    //             case "8":
    //                 //selectOption = "neverLoggedIn";
    //                 address = searchInput;
    //                 //address = selectOption + "?" + selectOption + "=" + searchInput ;
    //                 break;
    //             case "9":
    //                 //selectOption = "registeredToday";
    //                 address = searchInput;
    //                 break;
    //             default:
    //                 console.log("Invalid search option: " + selectOption);
    //                 return; // Exit function if invalid option
    //         }
            
    //         //searchInput = "";

    //         // fetch('http://localhost:5050/search/', {
    //         //     method: 'GET',
    //         //     headers: {
    //         //         'Content-Type': 'application/json',
    //         //     },
    //         //     body: JSON.stringify({ data: data }),
    //         // })
    //         // .then(response => response.json())
    //         // .then(data => {
    //         //     if (data.success) {
    //         //         alert('Search successful');
    //         //     } else {
    //         //         alert(data.error); // Show error message from the server
    //         //     }
    //         // })

    //         //console.log("Address: ", address);
    //         //const response = await fetch('http://localhost:5050/search/' + address );
    //         //const response = await fetch('http://localhost:5050/search/${name}');
    //         //console.log("Response: ", response);
    //         //const response = await fetch('http://localhost:5050/search/' + searchInput);
    //         //const data = await response.json();
    //         //console.log(data);
    //         //loadHTMLTable(data['data']);
    //         // fetch('http://localhost:5050/search/' + selectInput)
    //         // .then(response => response.json())
    //         // .then(data => loadHTMLTable(data['data']));
    //     } catch (error) {
    //         console.error("Error: ", error);
    //     }
    // });
//};

//when the user selects registered today option in the drop down list
// document.getElementById("select-option").addEventListener("change", async (event) => {
//     if (event.target.value === "9") { // Check if "Registered Today" is selected
//         try {
//             const response = await fetch('/search/RegisteredToday');
//             const result = await response.json();
//             displayUsers(result.data); // Call the function to display user data on the page
//         } catch (error) {
//             console.error("Error fetching today's registered users:", error);
//         }
//     }
// });

// // Function to display the users in the table
// function displayUsers(users) {
//     const userTableBody = document.getElementById("userTableBody"); // Target your user table body
//     userTableBody.innerHTML = ''; // Clear previous results

//     users.forEach(user => {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td>${user.username}</td>
//             <td>${user.password}</td> <!-- Consider displaying hashed password or omitting for security -->
//             <td>${user.firstname}</td>
//             <td>${user.lastname}</td>
//             <td>${user.age}</td>
//             <td>${user.salary}</td>
//             <td>${user.registerday}</td>
//             <td>${user.signedIn ? 'Yes' : 'No'}</td> <!-- Adjust based on your user object structure -->
//         `;
//         userTableBody.appendChild(row);
//     });
// }



// function todayRegisters() {
//     const userTableBody = document.getElementById('table').querySelector('tbody'); // Access tbody directly
//     const searchBtn = document.getElementById('search-btn');
    
//     searchBtn.addEventListener('click', async () => { // Use addEventListener
//         const selectOption = document.getElementById('select-option');
//         const searchInput = document.getElementById('search-input');
//         const selectedValue = selectOption.value;

//         console.log('Selected input:', searchInput); // Log the selected input
//         console.log('Selected value:', selectedValue); // Log the selected value

//         // Clear previous results in the table
//         userTableBody.innerHTML = '';

//         if (selectedValue === '9') { // Registered Today option
//             try {
//                 const response = await fetch('/search/RegisteredToday');
//                 console.log("Response: ", response);
                
//                 // Check if the response is OK before parsing
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }

//                 const data = await response.json();
//                 console.log('Fetched data:', data); // Log the fetched data

//                 // Check if data exists
//                 if (data.data.length === 0) {
//                     userTableBody.innerHTML = '<tr><td colspan="8">No users registered today.</td></tr>';
//                 } else {
//                     loadHTMLTable(data.data); // Assuming loadHTMLTable is defined to add rows
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//                 alert('An error occurred while fetching data. Please try again.');
//             }
//         } else {
//             const query = searchInput.value;
//         }
//     });
// }




// //when the search by username button is clicked
// const searchByUsernameBtn =  document.querySelector('#search-btn');
// searchByUsernameBtn.onclick = function (){
//     const usernameInput = document.querySelector('#username-input');
//     const username = usernameInput.value;
//     usernameInput.value = "";

//     fetch('http://localhost:5050/search/username/' + username)
//     .then(response => response.json())
//     .then(data => loadHTMLTable([data['data']]));
// }


// const searchFirstnameBtn =  document.querySelector('#search-btn');
// searchFirstnameBtn.onclick = function() {
//     //event.target.classList.contains("search-by-firstname-btn");

//     const firstnameInput = document.querySelector('#firstname-input').value;
//     try {
//         console.log("First name input: ", firstnameInput);
//         fetch('http://localhost:5050/search/firstname?' + firstnameInput)
//         .then(response => response.json())
//         .then(data => loadHTMLTable(data['data']));
//     }
//     catch (error) {
//         console.error("Error: ", error);
//     }
// };


// TODO: This needs to be reformatted to work for salary-input min and/or max
    // There aren't min and max queries so this will only have regular salary to work off of.
    // Will need to use conditional statements to check against the input checks
/*
//search all users whole salary is between x and y
//when the search-by-salary button is clicked
const searchBySalaryBtn =  document.querySelector('#search-by-salary-btn');
searchBySalaryBtn.onclick = function () {

    const minSalaryInput = document.querySelector('#min-salary-input');
    const maxSalaryInput = document.querySelector('#max-salary-input');

    const minSalary = minSalaryInput.value || 0;
    const maxSalary = maxSalaryInput.value || 99999999;

    minSalaryInput.value = "";
    maxSalaryInput.value = "";

    fetch(`http://localhost:5050/search/salary?minSalary=${minSalary}&maxSalary=${maxSalary}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
};


//search all users whose ages are between x and y
const searchByAgeBtn =  document.querySelector('#search-by-age-btn');
searchByAgeBtn.onclick = function () {
    const minAgeInput = document.querySelector('#min-age-input');
    const maxAgeInput = document.querySelector('#max-age-input');

    const minAge = minAgeInput.value || 0;
    const maxAge = maxAgeInput.value || 9999;

    minAgeInput.value = "";
    maxAgeInput.value = "";

    fetch(`http://localhost:5050/search/age?minAge=${minAge}&maxAge=${maxAge}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
};

//search useres who registered after john registered, where john is the username
const searchByRegisteredAfterBtn =  document.querySelector('#search-by-registered-after-btn');
searchByRegisteredAfterBtn.onclick = function () {
    const usernameInput = document.querySelector('#username-input');

    const username = usernameInput.value;

    usernameInput.value = "";

    fetch(`http://localhost:5050/searchByRegisteredAfter/${username}`)
       .then(response => response.json())
       .then(data => loadHTMLTable(data['data']));
};

//search users who never signed in
const searchByNeverLoggedInBtn =  document.querySelector('#search-by-never-logged-in-btn');
searchByNeverLoggedInBtn.onclick = function () {
    fetch('http://localhost:5050/searchNeverLoggedIn')
       .then(response => response.json())
       .then(data => loadHTMLTable(data['data']));
};

//search users who registered on the same day that john registered
const searchBySameDayRegisteredBtn =  document.querySelector('#search-by-same-day-registered-btn');
searchBySameDayRegisteredBtn.onclick = function () {
    const usernameInput = document.querySelector('#user-id-input');

    const username = usernameInput.value;

    usernameInput.value = "";

    fetch(`http://localhost:5050/searchBySameDayRegistered/${username}`)
       .then(response => response.json())
       .then(data => loadHTMLTable(data['data']));
};

//return the users who registed today
const searchByTodayRegisteredBtn =  document.querySelector('#search-by-today-registered-btn');
searchByTodayRegisteredBtn.onclick = function () {
    fetch('http://localhost:5050/searchByTodayRegistered')
       .then(response => response.json())
       .then(data => loadHTMLTable(data['data']));
};
*/

//let rowToDelete; 

// when the delete button is clicked, since it is not part of the DOM tree, we need to do it differently
// document.querySelector('table tbody').addEventListener('click', 
//       function(event){
//         if(event.target.className === "delete-row-btn"){

//             deleteRowByUsername(event.target.dataset.username);   
//             rowToDelete = event.target.parentNode.parentNode.rowIndex;    
//             debug("delete which one:");
//             debug(rowToDelete);
//         }   
//         if(event.target.className === "edit-row-btn"){
//             showEditRowInterface(event.target.dataset.username); // display the edit row interface
//         }
//       }
// );

// function deleteRowByusername(username){
//     // debug(username);
//     fetch('http://localhost:5050/delete/' + username,
//        { 
//         method: 'DELETE'
//        }
//     )
//     .then(response => response.json())
//     .then(
//          data => {
//              if(data.success){
//                 document.getElementByusername("table").deleteRow(rowToDelete);
//                 // location.reload();
//              }
//          }
//     );
// }

// let usernameToUpdate = 0;

// function showEditRowInterface(username){
//     debug("username clicked: ");
//     debug(username);
//     document.querySelector('#update-username-input').value = ""; // clear this field
//     const updateSection = document.querySelector("#update-row");  
//     updateSection.hidden = false;
//     // we assign the username to the update button as its username attribute value
//     usernameToUpdate = username;
//     debug("username set!");
//     debug(usernameToUpdate+"");
// }


// when the update button on the update interface is clicked
// const updateBtn = document.querySelector('#update-row-btn');

// updateBtn.onclick = function(){
//     debug("update clicked");
//     debug("Got the username: ");
//     debug(updateBtn.value);
    
//     const updatedUsernameInput = document.querySelector('#update-username-input');

//     fetch('http://localhost:5050/update',
//           {
//             headers: {
//                 'Content-type': 'application/json'
//             },
//             method: 'PATCH',
//             body: JSON.stringify(
//                   {
//                     username: usernameToUpdate,
//                     username: updatedUsernameInput.value
//                   }
//             )
//           }
//     ) 
//     .then(response => response.json())
//     .then(data => {
//         if(data.success){
//             location.reload();
//         }
//         else 
//            debug("No update occurred");
//     })
// }


// this function is used for debugging only, and should be deleted afterwards
function debug(data)
{
    fetch('http://localhost:5050/debug', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({debug: data})
    })
}


// Insert new row into the table from the Registration page
function insertRowIntoTable(data){

   debug("userindex.js: insertRowIntoTable called: ");
   debug(data);

   const table = document.querySelector('table tbody');
   debug(table);

   const isTableData = table.querySelector('.no-data');

   // debug(isTableData);

   let tableHtml = "<tr>";
   
   for(var key in data){                // iterating over the each property key of an object data
      if(data.hasOwnProperty(key)){     // key is a direct property for data
            if(key === 'registerday'){  // the property is 'registerday'
                data[key] = new Date(data[key]).toLocaleString(); // format to javascript string
            }
            else if (key === 'signintime'){
                data[key] = new Date(data[key]).toLocaleString(); // format to javascript string
            }
            tableHtml += `<td>${data[key]}</td>`;
      }
   }

//    tableHtml +=`<td><button class="delete-row-btn" data-username=${data.username}>Delete</td>`;
//    tableHtml += `<td><button class="edit-row-btn" data-username=${data.username}>Edit</td>`;

   tableHtml += "</tr>";

    if(isTableData){
       debug("case 1");
       table.innerHTML = tableHtml;
    }
    else {
        debug("case 2");
        // debug(tableHtml);

        const newrow = table.insertRow();
        newrow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data){
    debug("userindex.js: loadHTMLTable called.");

    const table = document.querySelector('table tbody'); 
    
    if(data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='8'>No Data</td></tr>";
        return;
    }
  
    /*
    In the following JavaScript code, the forEach method is used to iterate over the 
    elements of the data array. The forEach method is a higher-order function 
    that takes a callback function as its argument. The callback function is 
    executed once for each element in the array.
    
    In this case, the callback function takes a single argument, which is an object 
    destructuring pattern:


    function ({username, password, firstname, lastname, salary, age, registerday, signintime) {
        // ... code inside the callback function
    }

    This pattern is used to extract the username, password, firstname, lastname, salary, age, registerday, signintime properties from each 
    element of the data array. The callback function is then executed for each element
    in the array, and within the function, you can access these properties directly 
    as variables (username, password, firstname, lastname, salary, age, registerday, signintime).

    
    In summary, the forEach method is a convenient way to iterate over each element in 
    an array and perform some operation or execute a function for each element. 
    The provided callback function is what gets executed for each element in the 
    data array.
    */

    let tableHtml = "";
    data.forEach(function ({username, password, firstname, lastname, age, salary, registerday, signintime}){
         tableHtml += "<tr>";
         tableHtml +=`<td>${username}</td>`;
         tableHtml +=`<td>${password}</td>`;
         tableHtml +=`<td>${firstname}</td>`;
         tableHtml +=`<td>${lastname}</td>`;
         tableHtml +=`<td>${salary}</td>`;
         tableHtml +=`<td>${age}</td>`;
         tableHtml +=`<td>${new Date(registerday).toLocaleString()}</td>`;
         tableHtml +=`<td>${new Date(signintime).toLocaleString()}</td>`;
         tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}