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

// Create modal display for the employee from the given array of employees with the given index
const createModalForEmployee = (employees, index) => {
    // Remove any currently displayed modal containers
    $(".modal-container").remove();

    // Get employee
    const employee = employees[index];

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
                    <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
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

    // If the index of the next employee is out of bounds,
    if (nextIndex === employees.length) {
        // Wrap it around to zero (the first employee)
        nextIndex = 0;
    } 

    // If the index of the previous employee is out of bounds,
    if (prevIndex < 0) {
        // Wrap it around the the highest index (the last employee)
        prevIndex = employees.length - 1;
    }

    // Handle click of previous and next buttons
    $("#modal-prev")
        .on("click", () => createModalForEmployee(employees, prevIndex));
    
    $("#modal-next")
        .on("click", () => createModalForEmployee(employees, nextIndex));
}

// Function to run on page load
const onPageLoad = () => {
    // Request for the set of random users
    fetchUsers().then(data => {
        const employees = data.results;

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

            /* Insert search functionality with following format:
                <form action="#" method="get">
                    <input type="search" id="search-input" class="search-input" placeholder="Search...">
                    <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
                </form>
            */
        });
    });

}

// Run function on page load
$(onPageLoad);
