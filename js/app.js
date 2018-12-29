// Enable strict mode
"use strict";

/* 
    Version of Random User API to use. This ensures that data will always be returned
    in the way we expect. The current version at the time of coding is version 1.2
*/
const randomUserApiVersion = 1.2;

// Query Parameters to pass to the API request
const queryParameters = {
    // Nationality (for search functionality's sake)
    nat: "us",
    // Number of users to generate data for
    results: 12,
};

// Condense query parameters object into a single query string
const queryString = Object.keys(queryParameters)
    // Reduce array of query parameter keys into a single value
    .reduce((queryString, paramKey, index) =>
        queryString += (
                index === 0 ? // If this is the first element,
                "?" :         // Insert the starting question mark
                "&"           // Otherwise, insert the joining ampersand
            ) +
            // Insert the key-value pair itself
            `${paramKey}=${queryParameters[paramKey]}`,
        "");                  // If there are no query parameters, set query string to an empty string

// Function for fetching data from the Random User API
const fetchUsers = () => {
    // Determine API endpoint from version and query string
    const endpoint = `${randomUserApiVersion}` + queryString;

    // Make a request to the API
    return fetch(`https://randomuser.me/api/${endpoint}`)
        // Convert the response into JSON and parse it
        .then(response => response.json())
        // Catch any errors and log it to the console
        .catch(error => console.error(error));
}

// Create the cards for the given set of employees
const createEmployeeCards = employees => {
    // Remove all employee cards that currently exist
    $(".card").remove();

    // For each employee in the set of data,
    employees.forEach((employee, index) => {
        // Interpolate their data into HTML markup
        const employeeHtml = `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${employee.picture.medium}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="card-text">${employee.email}</p>
                    <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                </div>
            </div>
        `;

        // Create card for employee
        const $employeeCard = $(employeeHtml);

        // Append employee card to gallery
        $employeeCard
            .appendTo($("#gallery"));

        // Event listener for click event on an employee item
        $employeeCard
            .on("click", () => createModalForEmployee(employees, index));
    });
};

// Create modal display for the employee from the given array of employees with the given index
const createModalForEmployee = (employees, index) => {
    // Remove any currently displayed modal containers
    $(".modal-container").remove();

    // Get employee
    const employee = employees[index];

    // Employee full name
    const employeeName = `${employee.name.first} ${employee.name.last}`;

    // Get employee date of birth
    const dob = new Date(employee.dob.date);

    // Set formatting options
    const formatOptions = {
        // 2-digit day (00 to 31)
        day: "2-digit",
        // 2-digit month (00 to 12)
        month: "2-digit",
        // Numeric year (2018)
        year: "numeric",
    }

    // Format date of birth into expected format
    const dobString = dob.toLocaleDateString(undefined, formatOptions);

    // Capitalize parts of street address
    const capitalizedStreetAddress = employee.location.street
        // Split each parts of the street address separated by a string into an array
        .split(" ")
        // Capitalize each part of the address
        .map((streetPart) => capitalizeString(streetPart))
        // Join it back together with a space
        .join(" ");

    // HTML Markup for employee modal
    const modalHtml = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${employeeName}</h3>
                    <p class="modal-text">${employee.email}</p>
                    <p class="modal-text cap">${employee.location.city}</p>
                    <hr>
                    <p class="modal-text">${employee.phone}</p>
                    <p class="modal-text">
                        ${capitalizedStreetAddress}, 
                        ${capitalizeString(employee.location.city)}, 
                        ${stateAbbreviations[employee.location.state]}
                        ${employee.location.postcode}
                    </p>
                    <p class="modal-text">Birthday: ${dobString}</p>
                </div>
            </div>

            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;

    // Create modal and append to body
    const $modal = $(modalHtml)
        .appendTo($("body"));

    // Attach listener to close button
    $("#modal-close-btn")
        // Close modal on click
        .on("click", () => $modal.remove());

    // Declare variables for indexes (indices) for previous and next employee
    let prevIndex = index - 1;
    let nextIndex = index + 1;

    // Get prev and next buttons
    const $prevButton = $("#modal-prev");
    const $nextButton = $("#modal-next");

    // If the index of the next employee is out of bounds,
    if (nextIndex === employees.length) {
        // Wrap it around to zero (the first employee)
        nextIndex = 0;

        // Set text of next button to indicate the wrap-around
        $nextButton.text("First");
    } 

    // If the index of the previous employee is out of bounds,
    if (prevIndex < 0) {
        // Wrap it around the the highest index (the last employee)
        prevIndex = employees.length - 1;

        // Set text of next button to indicate the wrap-around
        $prevButton.text("Last");
    }

    // Handle click of previous and next buttons
    $("#modal-prev")
        .on("click", () => createModalForEmployee(employees, prevIndex));
    
    $("#modal-next")
        .on("click", () => createModalForEmployee(employees, nextIndex));
};

// Search the given set of employees and return the results
const searchDirectory = (searchQuery, employees) => {
    // Return the employees whose name includes the given search query
    return employees.filter(employee => {
        // Get employee full name
        const fullName = `${employee.name.first} ${employee.name.last}`;

        return fullName.includes(searchQuery)
    });
};

const handleSearch = (event, employees) => {
    // Get event target
    const $target = $(event.target);

    // Declare variable for search query
    let searchQuery;

    // If the target is the form,
    if ($target.is("form")) {
        // Prevent form submission
        event.preventDefault();

        // Get the search query from the child input
        searchQuery = $target.children("#search-input").val();
    } else // Otherwise, the target is the search input field
        // Get the query from the input directly
        searchQuery = $target.val();

    // Search the directory with the given search query
    const results = searchDirectory(searchQuery, employees);

    // Create the new set of cards for the results
    createEmployeeCards(results);
}

// Function to run on page load
const onPageLoad = () => {
    // Request for the set of random users
    fetchUsers().then(data => {
        // Get employee array from data
        const employees = data.results;

        // Search form HTML Markup
        const searchHtml = `
            <form method="get">
                <input type="search" id="search-input" class="search-input" placeholder="Search...">
                <label for="sort-by">Sort by:</label>
                <select name="sort-by" id="sort-by">
                    <option value="">Don't sort</option>
                    <option value="firstlastname-asc">First/Last name (A-Z)</option>
                    <option value="firstlastname-desc">First/Last name (Z-A)</option>
                    <option value="lastfirstname-asc">Last/First name (A-Z)</option>
                    <option value="lastfirstname-desc">Last/First name (Z-A)</option>
                </select>
                <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
            </form>
        `;

        // Create search form
        const $searchForm = $(searchHtml);

        // Set default sort option
        $searchForm
            // Get sort by select
            .children("#sort-by")
            // Get options
            .children()
            // Get first option
            .first()
            // Select it
            .prop("selected", true);

        // Append the form to the DOM
        $searchForm
            .appendTo(".search-container");

        // Handle form submission
        $searchForm.on("submit", event => handleSearch(event, employees));

        // Perform search when input changes
        $searchForm.children("#search-input").on("keyup", event => handleSearch(event, employees));

        // Create cards for employees
        createEmployeeCards(employees);
    });

}

// Run function on page load
$(onPageLoad);
