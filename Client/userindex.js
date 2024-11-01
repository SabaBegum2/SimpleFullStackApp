
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
    else {
    fetch('http://localhost:5050/getall')     
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    }
});


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

// PURPOSE: SEARCH DATABASE FOR VALUES
// when the searchBtn is clicked
const searchBtn =  document.querySelector('#search-btn');
searchBtn.onclick = function (){
    console.log("Search button clicked for first name");
    const searchInput = document.querySelector('#search-input');
    console.log("Search input: ", searchInput);
    const searchValue = searchInput.value;
    console.log("Search value: ", searchValue);
    searchInput.value = "";

    fetch('http://localhost:5050/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    console.log("Search button clicked for first name");
}

// when the searchBtn is clicked
const searchLastnameBtn =  document.querySelector('#search-lastname-btn');
searchLastnameBtn.onclick = function (){
    console.log("Search button clicked for last name");
    const searchInput = document.querySelector('#search-lastname-input');
    console.log("Search input: ", searchInput);
    const searchValue = searchInput.value;
    console.log("Search value: ", searchValue);
    searchInput.value = "";

    fetch('http://localhost:5050/searchLastname/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    console.log("Search button clicked for last name");
}


// when the searchBtn is clicked
const searchFullNameBtn =  document.querySelector('#search-full-name-btn');
searchFullNameBtn.onclick = function (){
    const firstInput = document.querySelector('#firstname-input');
    const firstname = firstInput.value;
    firstInput.value = "";

    const lastInput = document.querySelector('#lastname-input');
    const lastname = lastInput.value;
    lastInput.value = "";

    fetch(`http://localhost:5050/search/fullname/${firstname}/${lastname}`)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}


// When Username search button is clicked
const searchUsernameBtn =  document.querySelector('#search-username-btn');
searchUsernameBtn.onclick = function (){
    console.log("Search button clicked for username");
    const searchInput = document.querySelector('#search-username-input');
    console.log("Search input: ", searchInput);
    const searchValue = searchInput.value;
    console.log("Search value: ", searchValue);
    searchInput.value = "";

    fetch('http://localhost:5050/searchUsername/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    console.log("Search button clicked for last name");
}


// When Salary search button is clicked
const searchSalaryBtn =  document.querySelector('#search-salary-btn');
searchSalaryBtn.onclick = function (){
    const minInput = document.querySelector('#min-salary-input');
    const minSalary = minInput.value;
    minInput.value = "";

    const maxInput = document.querySelector('#max-salary-input');
    const maxSalary = maxInput.value;
    maxInput.value = "";

    fetch(`http://localhost:5050/search/salary/${minSalary}/${maxSalary}`)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}


// When Salary search button is clicked
const searchAgeBtn =  document.querySelector('#search-age-btn');
searchAgeBtn.onclick = function (){
    const minInput = document.querySelector('#min-age-input');
    const minAge = minInput.value;
    minInput.value = "";

    const maxInput = document.querySelector('#max-age-input');
    const maxAge = maxInput.value;
    maxInput.value = "";

    fetch(`http://localhost:5050/search/age/${minAge}/${maxAge}`)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}


// Search registered after a specific user
const searchRegAfterUserBtn = document.querySelector('#search-reg-after-btn');
searchRegAfterUserBtn.onclick = function () {
    const usernameInput = document.querySelector('#after-reg-input');
    const username = usernameInput.value;
    usernameInput.value = "";

    fetch(`http://localhost:5050/search/regAfter/${username}`)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}


// Search registered on same day as a specific user
const searchRegSameDayAsUserBtn = document.querySelector('#search-same-day-reg-btn');
searchRegSameDayAsUserBtn.onclick = function () {
    const usernameInput = document.querySelector('#same-day-reg-input');
    const username = usernameInput.value;
    usernameInput.value = "";

    fetch(`http://localhost:5050/search/regSameDay/${username}`)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}


// Search users who never signed in
const searchNeverSignedInBtn = document.querySelector('#search-never-signedin-btn');
searchNeverSignedInBtn.onclick = function () {
    fetch(`http://localhost:5050/search/neverSignedIn`)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

// Search users who never signed in
const searchRegToday = document.querySelector('#search-new-reg-btn');
searchRegToday.onclick = function () {

    fetch(`http://localhost:5050/search/regToday`)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}



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
                data[key] = new Date(data[key]).toISOString().split('T')[0];
            }
            else if (key === 'signintime'){
                data[key] = new Date(data[key]).toLocaleString(); // format to javascript string
            }
            tableHtml += `<td>${data[key]}</td>`;
      }
   }

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

    let tableHtml = "";
    data.forEach(function ({username, password, firstname, lastname, age, salary, registerday, signintime}){
         tableHtml += "<tr>";
         tableHtml +=`<td>${username}</td>`;
         tableHtml +=`<td>${password}</td>`;
         tableHtml +=`<td>${firstname}</td>`;
         tableHtml +=`<td>${lastname}</td>`;
         tableHtml +=`<td>${salary}</td>`;
         tableHtml +=`<td>${age}</td>`;
         tableHtml +=`<td>${new Date(registerday).toISOString().split('T')[0]}</td>`;
         tableHtml +=`<td>${signintime ? new Date(signintime).toLocaleString() : "" }</td>`;
         tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}