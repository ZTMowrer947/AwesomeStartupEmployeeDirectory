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

    // Exclude the following fields that we don't need
    exc: "gender,login,registered,cell,nat",

    // Do not pass info along with request, we don't need it
    noinfo: true,
};

// Condense query parameters object into a single query string
const queryString = Object.keys(queryParameters)
    // Reduce array of query parameter keys into a single value
    .reduce(
        (queryString, paramKey, index) =>
            (queryString +=
                (index === 0 // If this is the first element,
                    ? "?" // Insert the starting question mark
                    : "&") + // Otherwise, insert the joining ampersand
                // Insert the key-value pair itself
                `${paramKey}=${queryParameters[paramKey]}`),
        ""
    ); // If there are no query parameters, set query string to an empty string

// Check status of response
const checkStatus = (response) => {
    // If the response was successful,
    if (response.ok) {
        // Resolve the promise, passing the response
        return Promise.resolve(response);
    } else {
        // Otherwise, something went wrong
        // Declare variable for error message
        let errorMessage;

        // Determine status code and act accordingly
        switch (response.status) {
            case 404: // If it was a 404,
                // Indicate that we could not find the requested url
                errorMessage = `Could not find "${response.url}".`;
                break;

            default:
                // Otherwise,
                // Try to get an error object from the response body
                try {
                    // Get error from response body
                    const error = response.json().error;

                    // Set error message to it
                    errorMessage = error;
                } catch (err) {
                    // If that doesn't work,
                    // Just say to try again later
                    errorMessage =
                        "An unexpected error occurred. Please try again later.";
                }
                break;
        }

        // Create error and reject promise
        return Promise.reject(new Error(errorMessage));
    }
};

// Handle API errors
const handleAPIError = (error) => {
    // Retrieve gallery element
    const gallery = document.querySelector("#gallery");

    // Add has-error class to gallery
    gallery.classList.add("has-error");

    const errorHtml = `
        <div class="error api-error">
            <h1>An error occured with accessing the database.</h1>
            <p>${error.message}</p>
        </div>
    `;

    // Append error to gallery
    gallery.insertAdjacentHTML("beforeend", errorHtml);
};

// Function for fetching data from the Random User API
const fetchUsers = () => {
    // Determine API endpoint from version and query string
    const endpoint = `${randomUserApiVersion}` + queryString;

    // Make a request to the API
    return (
        fetch(`https://randomuser.me/api/${endpoint}`)
            // Check status of response before continuing
            .then(checkStatus)
            // Convert the response into JSON and parse it
            .then((response) => response.json())
            // Catch any errors and log it to the console
            .catch(handleAPIError)
    );
};

// Create the cards for the given set of employees
const createEmployeeCards = (employees) => {
    // Remove all employee cards that currently exist
    document.querySelectorAll(".card").forEach((card) => card.remove());

    // For each employee in the set of data,
    employees.forEach((employee, index) => {
        // Interpolate their data into HTML markup
        const employeeHtml = `
            <div class="card-img-container">
                <img class="card-img" src="${employee.picture.medium}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            </div>
        `;

        // Create card for employee
        const employeeCard = document.createElement("div");
        employeeCard.classList.add("card");

        // Insert employee markup into card
        employeeCard.innerHTML = employeeHtml;

        // Append employee card to gallery
        const gallery = document.querySelector("#gallery");
        gallery.appendChild(employeeCard);

        // Event listener for click event on an employee item
        employeeCard.addEventListener("click", () =>
            createModalForEmployee(employees, index)
        );
    });
};

// Create modal display for the employee from the given array of employees with the given index
const createModalForEmployee = (employees, index) => {
    // Remove any currently displayed modal containers
    document
        .querySelectorAll(".modal-container")
        .forEach((modal) => modal.remove());

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
    };

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

    // Create modal element
    const modal = document.createElement("div");
    modal.classList.add("modal-container");

    // HTML Markup for employee modal
    const modalHtml = `
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${
                    employee.picture.large
                }" alt="profile picture">
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
    `;

    // Insert HTML into modal
    modal.innerHTML = modalHtml;

    // Get close button
    const closeBtn = modal.querySelector("#modal-close-btn");

    // Attach click listener to close button, closing the modal on click
    closeBtn.addEventListener("click", () => modal.remove());

    // If the employee is not the only one currently displayed,
    if (employees.length > 1) {
        // Create modal nav element
        const modalNav = document.createElement("div");
        modalNav.classList.add("modal-btn-container");

        // Modal navigation HTML
        const modalNavHtml = `
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        `;

        // Insert HTML into nav
        modalNav.innerHTML = modalNavHtml;

        // Append nav to modal
        modal.appendChild(modalNav);

        // Declare variables for indexes (indices) for previous and next employee
        let prevIndex = index - 1;
        let nextIndex = index + 1;

        // Get prev and next buttons
        const prevButton = modalNav.querySelector("#modal-prev");
        const nextButton = modalNav.querySelector("#modal-next");

        // If the index of the next employee is out of bounds,
        if (nextIndex === employees.length) {
            // Wrap it around to zero (the first employee)
            nextIndex = 0;

            // Set text of next button to indicate the wrap-around
            nextButton.textContent = "First";
        }

        // If the index of the previous employee is out of bounds,
        if (prevIndex < 0) {
            // Wrap it around the the highest index (the last employee)
            prevIndex = employees.length - 1;

            // Set text of next button to indicate the wrap-around
            prevButton.textContent = "Last";
        }

        // Handle click of previous and next buttons
        prevButton.addEventListener("click", () =>
            createModalForEmployee(employees, prevIndex)
        );

        nextButton.addEventListener("click", () =>
            createModalForEmployee(employees, nextIndex)
        );
    }

    // In any case, append modal to DOM
    document.body.appendChild(modal);
};

// Search the given set of employees and return the results
const searchDirectory = (searchQuery, employees) => {
    // Return the employees whose name includes the given search query
    return employees.filter((employee) => {
        // Get employee full name
        const fullName = `${employee.name.first} ${employee.name.last}`;

        return fullName.includes(searchQuery);
    });
};

// Handle searching
const handleSearch = (searchQuery, employees) => {
    // Remove any "No result" error that might have previously occured
    document.querySelectorAll(".error").forEach((error) => error.remove());

    // Get employee gallery
    const gallery = document.querySelector("#gallery");

    // Search the directory with the given search query
    const results = searchDirectory(searchQuery, employees);

    if (results.length > 0) {
        // Remove has-error class from gallery
        gallery.classList.remove("has-error");

        // Create the new set of cards for the results
        createEmployeeCards(results);
    } else {
        // Otherwise,
        // Remove all employee cards
        document.querySelectorAll(".card").forEach((card) => card.remove());

        // Add has-error class to gallery
        gallery.classList.add("has-error");

        // Model a "No results" error in HTML
        const errorHtml = `
            <div class="error">
                <h1>No results found</h1>
                <p>The search term "${encodeHTML(
                    searchQuery
                )}" matched no results.</p>
            </div>
        `;

        // Append error HTML to gallery div
        gallery.insertAdjacentHTML("beforeend", errorHtml);
    }
};

// Function to run on page load
const onPageLoad = () => {
    // Get gallery and loading class
    const gallery = document.querySelector("#gallery");
    gallery.classList.add("loading");

    // Create loading message
    let loadingMsg = document.createElement("h1");
    loadingMsg.classList.add("loading-message");
    loadingMsg.textContent = "Loading employee data...";

    // Append loading message to gallery
    gallery.appendChild(loadingMsg);

    // Request for the set of random users
    fetchUsers().then((data) => {
        // Remove loading message and class from gallery
        gallery.classList.remove("loading");
        loadingMsg = gallery.querySelector(".loading-message");
        loadingMsg.remove();

        // Model dark mode toggle
        const darkModeHtml = `
            <label for="dark_mode">Dark Mode</label>
            <input type="checkbox" name="dark_mode" id="dark_mode" />
        `;

        // Create it
        const darkModeToggle = document.createElement("div");
        darkModeToggle.classList.add("darkmode-toggle");

        // Insert HTML into toggle
        darkModeToggle.innerHTML = darkModeHtml;

        // Configure checkbox to toggle dark mode
        const darkModeCheckbox = darkModeToggle.querySelector("#dark_mode");

        darkModeCheckbox.addEventListener("change", (event) => {
            // If dark mode is checked,
            if (event.target.checked) {
                // Add dark class to body
                document.body.classList.add("dark");
            } else {
                // Otherwise, remove dark class from body
                document.body.classList.remove("dark");
            }
        });

        // Add to DOM before search container
        const searchContainer = document.querySelector(".search-container");
        searchContainer.insertAdjacentElement("beforebegin", darkModeToggle);

        // Get employee array from data, maintaining current employee order for unsorting purposes
        const unsortedEmployees = data.results;

        /*
            Deeply copy employee data into mutable set
            Thanks to https://stackoverflow.com/questions/18829099/copy-a-variables-value-into-another
        */
        let employees = unsortedEmployees.map((employee) =>
            Object.assign({}, employee)
        );

        // Search form HTML Markup
        const searchHtml = `
            <input type="search" id="search-input" class="search-input" placeholder="Search..." />
            <label for="sort-by">Sort by:</label>
            <select name="sort-by" id="sort-by">
                <option value="">Don't sort</option>
                <option value="firstlastname-asc">First/Last name (A-Z)</option>
                <option value="firstlastname-desc">First/Last name (Z-A)</option>
                <option value="lastfirstname-asc">Last/First name (A-Z)</option>
                <option value="lastfirstname-desc">Last/First name (Z-A)</option>
            </select>
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit" />
        `;

        // Create search form
        const searchForm = document.createElement("form");
        searchForm.innerHTML = searchHtml;

        const $searchForm = $(searchForm);

        // Get first sort option and select it
        searchForm
            .querySelector("#sort-by")
            .querySelector("option").selected = true;

        // Append the form to the DOM
        searchContainer.appendChild(searchForm);

        // Search and Sorting function
        const searchEmployeesAndSort = () => {
            // Get sorting mode
            const sortingMode = $("#sort-by").val();

            // If we are not sorting,
            if (sortingMode === "") {
                // Reset employees to original order
                employees = unsortedEmployees.map((employee) =>
                    Object.assign({}, employee)
                );
            } else {
                // Otherwise,
                // Declare variable for name formatting
                let nameFormat;

                // If we are sorting by first, then last name,
                if (sortingMode.startsWith("firstlastname"))
                    // Set format to such
                    nameFormat = "%first% %last%";
                // If we are sorting by last, then first name,
                else if (sortingMode.startsWith("lastfirstname"))
                    // Set format to such
                    nameFormat = "%last%, %first%";

                // Sort the employees by name in the given format
                employees = employees.sort((a, b) =>
                    sortByName(nameFormat, a, b)
                );

                // If we are sorting in descending order,
                if (sortingMode.endsWith("desc"))
                    // Reverse the order
                    employees = employees.reverse();
            }

            // Perform a search
            handleSearch($("#search-input").val(), employees);
        };

        // Handle selection for sorting
        $searchForm.children("#sort-by").on("change", searchEmployeesAndSort);

        // Perform search when input changes
        $searchForm
            .children("#search-input")
            .on("keyup", searchEmployeesAndSort);

        // Handle form submission
        $searchForm.on("submit", (event) => {
            // Prevent form submission
            event.preventDefault();

            // Search and optionally sort employees
            searchEmployeesAndSort();
        });

        // Create cards for employees
        createEmployeeCards(employees);
    });
};

// Run function on page load
$(onPageLoad);
