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

// Function to run on page load
const onPageLoad = () => {
    // Request for the set of random users
    fetchUsers().then(data => {
        const users = data.results;

        // For each user in the set of data,
        users.forEach((user) => {
            // Interpolate their data into HTML markup
            const userHtml = `
                <div class="card">
                    <div class="card-img-container">
                        <img class="card-img" src="${user.picture.thumbnail}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                        <p class="card-text">${user.email}</p>
                        <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                    </div>
                </div>
            `;

            // Create the element and append to gallery
            $(userHtml)
                .appendTo($("#gallery"));

            // Event listener for click event on an employee item
                /* Create modal for employee in the following format:
                    <div class="modal-container">
                        <div class="modal">
                            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                            <div class="modal-info-container">
                                <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
                                <h3 id="name" class="modal-name cap">name</h3>
                                <p class="modal-text">email</p>
                                <p class="modal-text cap">city</p>
                                <hr>
                                <p class="modal-text">(555) 555-5555</p>
                                <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
                                <p class="modal-text">Birthday: 10/21/2015</p>
                            </div>
                        </div>

                        <div class="modal-btn-container">
                            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                            <button type="button" id="modal-next" class="modal-next btn">Next</button>
                        </div>
                    </div>
                */

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
