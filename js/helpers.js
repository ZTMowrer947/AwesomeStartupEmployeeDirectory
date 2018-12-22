// Enable strict mode
"use strict";

// Function to capitalize a string
function capitalizeString(string) {
    // Get first character and make it uppercase
    const firstChar = string.charAt(0).toUpperCase();

    // Get rest of string
    const restOfString = string.substring(1);

    // Combine the two and return the result
    return firstChar + restOfString;
}