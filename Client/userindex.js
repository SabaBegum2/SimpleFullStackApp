
// This is the frontEnd that modifies the HTML page directly
// event-based programming,such as document load, click a button

/*
What is a Promise in Javascript? 

A Promise can be in one of three states:

    - Pending: The initial state; the promise is neither fulfilled nor rejected.

    - Fulfilled: The operation completed successfully, and the promise has a 
      resulting value.

    - Rejected: The operation failed, and the promise has a reason for the failure.

Promises have two main methods: then and catch.

    - The then method is used to handle the successful fulfillment of a promise. 
    It takes a callback function that will be called when the promise is resolved, 
    and it receives the resulting value.

    - The catch method is used to handle the rejection of a promise. It takes a 
    callback function that will be called when the promise is rejected, and it 
    receives the reason for the rejection.

What is a promise chain? 
    The Promise chain starts with some asyncOperation1(), which returns a promise, 
    and each subsequent ``then`` is used to handle the result of the previous Promise.

    The catch is used at the end to catch any errors that might occur at any point 
    in the chain.

    Each then returns a new Promise, allowing you to chain additional ``then`` calls to 
    handle subsequent results.

What is an arrow function?

    An arrow function in JavaScript is a concise way to write anonymous function 
    expressions.

    Traditional function syntax: 
        const add = function(x, y) {
           return x + y;
        };

    Arrow function syntax:
        const add = (x, y) => x + y;
    
    
Arrow functions have a few notable features:

    - Shorter Syntax: Arrow functions eliminate the need for the function keyword, 
      curly braces {}, and the return keyword in certain cases, making the syntax 
      more concise.

    - Implicit Return: If the arrow function consists of a single expression, it is 
      implicitly returned without needing the return keyword.

    - Lexical this: Arrow functions do not have their own this context; instead, they 
      inherit this from the surrounding code. This can be beneficial in certain situations,
      especially when dealing with callbacks and event handlers.
*/


// fetch call is to call the server
document.addEventListener('DOMContentLoaded', function() {
    // one can point your browser to http://localhost:5050/getAll to check what it returns first.
    fetch('http://localhost:5050/getAll')     
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
});


// when the addBtn is clicked
const addBtn = document.querySelector('#add-username-btn');
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
}

// when the searchBtn is clicked
const searchBtn =  document.querySelector('#search-btn');
searchBtn.onclick = function (){
    const searchInput = document.querySelector('#search-input');
    const searchValue = searchInput.value;
    searchInput.value = "";

    fetch('http://localhost:5050/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

//when the sear-by id button is clicked
const searchByIdBtn =  document.querySelector('#search-by-id-btn');
searchByIdBtn.onclick = function (){
    const idInput = document.querySelector('#id-input');
    const id = idInput.value;
    idInput.value = "";

    //fetch('http://localhost:5050/getById/' + id)
    fetch('http://localhost:5050/searchUsersByUserID/' + id)
    .then(response => response.json())
    .then(data => loadHTMLTable([data['data']]));
}

// When the searchBtn is clicked for searching users by first and last name
searchBtn.addEventListener('click', function(event) {
    // Check if the event is for searching by first and last name
    // Make sure this button has the class 'search-by-first-last-name-btn'
    if (event.target.classList.contains("search-by-first-last-name-btn")) {
        const firstNameInput = document.querySelector('#first-name-input');
        const lastNameInput = document.querySelector('#last-name-input');

        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;

        firstNameInput.value = "";
        lastNameInput.value = "";

        // Make sure to encode the query parameters to handle spaces and special characters
        const query = new URLSearchParams({ firstname: firstName, lastname: lastName }).toString();
        
        //fetch('http://localhost:5050/SearchUsersByName?' + query)
        fetch('http://localhost:5050/searchUsersByFirstAndLastName?' + query)
            .then(response => response.json())
            .then(data => loadHTMLTable(data['data']));
    }
});

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

    fetch(`http://localhost:5050/searchUsersBySalary?minSalary=${minSalary}&maxSalary=${maxSalary}`)
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

    fetch(`http://localhost:5050/searchUsersByAge?minAge=${minAge}&maxAge=${maxAge}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
};

//search useres who registered after john registered, where john is the userid
const searchByRegisteredAfterBtn =  document.querySelector('#search-by-registered-after-btn');
searchByRegisteredAfterBtn.onclick = function () {
    const userIdInput = document.querySelector('#user-id-input');

    const userId = userIdInput.value;

    userIdInput.value = "";

    fetch(`http://localhost:5050/searchUsersByRegisteredAfter/${userId}`)
       .then(response => response.json())
       .then(data => loadHTMLTable(data['data']));
};

//search users who never signed in
const searchByNeverLoggedInBtn =  document.querySelector('#search-by-never-logged-in-btn');
searchByNeverLoggedInBtn.onclick = function () {
    fetch('http://localhost:5050/searchUsersNeverLoggedIn')
       .then(response => response.json())
       .then(data => loadHTMLTable(data['data']));
};

//search users who registered on the same day that john registered
const searchBySameDayRegisteredBtn =  document.querySelector('#search-by-same-day-registered-btn');
searchBySameDayRegisteredBtn.onclick = function () {
    const userIdInput = document.querySelector('#user-id-input');

    const userId = userIdInput.value;

    userIdInput.value = "";

    fetch(`http://localhost:5050/searchUsersBySameDayRegistered/${userId}`)
       .then(response => response.json())
       .then(data => loadHTMLTable(data['data']));
};

//return the users who registed today
const searchByTodayRegisteredBtn =  document.querySelector('#search-by-today-registered-btn');
searchByTodayRegisteredBtn.onclick = function () {
    fetch('http://localhost:5050/searchUsersByTodayRegistered')
       .then(response => response.json())
       .then(data => loadHTMLTable(data['data']));
};

let rowToDelete; 

// when the delete button is clicked, since it is not part of the DOM tree, we need to do it differently
document.querySelector('table tbody').addEventListener('click', 
      function(event){
        if(event.target.className === "delete-row-btn"){

            deleteRowByUsername(event.target.dataset.username);   
            rowToDelete = event.target.parentNode.parentNode.rowIndex;    
            debug("delete which one:");
            debug(rowToDelete);
        }   
        if(event.target.className === "edit-row-btn"){
            showEditRowInterface(event.target.dataset.username); // display the edit row interface
        }
      }
);

function deleteRowByusername(username){
    // debug(username);
    fetch('http://localhost:5050/delete/' + username,
       { 
        method: 'DELETE'
       }
    )
    .then(response => response.json())
    .then(
         data => {
             if(data.success){
                document.getElementByusername("table").deleteRow(rowToDelete);
                // location.reload();
             }
         }
    );
}

let usernameToUpdate = 0;

function showEditRowInterface(username){
    debug("username clicked: ");
    debug(username);
    document.querySelector('#update-username-input').value = ""; // clear this field
    const updateSetction = document.querySelector("#update-row");  
    updateSetction.hidden = false;
    // we assign the username to the update button as its username attribute value
    usernameToUpdate = username;
    debug("username set!");
    debug(usernameToUpdate+"");
}


// when the update button on the update interface is clicked
const updateBtn = document.querySelector('#update-row-btn');

updateBtn.onclick = function(){
    debug("update clicked");
    debug("got the username: ");
    debug(updateBtn.value);
    
    const updatedusernameInput = document.querySelector('#update-username-input');

    fetch('http://localhost:5050/update',
          {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(
                  {
                    username: usernameToUpdate,
                    username: updatedusernameInput.value
                  }
            )
          }
    ) 
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
        else 
           debug("no update occurs");
    })
}


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

function insertRowIntoTable(data){

   debug("userindex.js: insertRowIntoTable called: ");
   debug(data);

   const table = document.querySelector('table tbody');
   debug(table);

   const isTableData = table.querySelector('.no-data');

  // debug(isTableData);

   let tableHtml = "<tr>";
   
   for(var key in data){ // iterating over the each property key of an object data
      if(data.hasOwnProperty(key)){   // key is a direct property for data
            if(key === 'dateAdded'){  // the property is 'dataAdded'
                data[key] = new Date(data[key]).toLocaleString(); // format to javascript string
            }
            tableHtml += `<td>${data[key]}</td>`;
      }
   }

   tableHtml +=`<td><button class="delete-row-btn" data-username=${data.username}>Delete</td>`;
   tableHtml += `<td><button class="edit-row-btn" data-username=${data.username}>Edit</td>`;

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
    data.forEach(function ({username, password, firstname, lastname, salary, age, registerday, signintime}){
         tableHtml += "<tr>";
         tableHtml +=`<td>${username}</td>`;
         tableHtml +=`<td>${password}</td>`;
         tableHtml +=`<td>${firstname}</td>`;
         tableHtml +=`<td>${lastname}</td>`;
         tableHtml +=`<td>${salary}</td>`;
         tableHtml +=`<td>${age}</td>`;
         tableHtml +=`<td>${new Date(registerday).toLocaleString()}</td>`;
         tableHtml +=`<td>${new Date(signintime).toLocaleString()}</td>`;
         tableHtml +=`<td><button class="delete-row-btn" data-username=${username}>Delete</button></td>`;
         tableHtml += `<td><button class="edit-row-btn" data-username=${username}>Edit</button></td>`;
         tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
} 