// Enable strict mode
"use strict";

// Capitalize a string
function capitalizeString(string) {
    // Get first character and make it uppercase
    const firstChar = string.charAt(0).toUpperCase();

    // Get rest of string
    const restOfString = string.substring(1);

    // Combine the two and return the result
    return firstChar + restOfString;
}

// Abbreviations for the 50 U.S. States (for modal formatting)
const stateAbbreviations = {
    alabama: "AL",
    alaska: "AK",
    arkansas: "AR",
    arizona: "AZ",
    california: "CA",
    colorado: "CO",
    connecticut: "CT",
    delaware: "DE",
    florida: "FL",
    georgia: "GA",
    hawaii: "HI",
    idaho: "ID",
    illinois: "IL",
    indiana: "IN",
    iowa: "IA",
    kansas: "KS",
    kentucky: "KY",
    louisiana: "LA",
    maine: "ME",
    maryland: "MD",
    massachusetts: "MA",
    michigan: "MI",
    minnesota: "MN",
    mississippi: "MS",
    missouri: "MO",
    montana: "MT",
    nebraska: "NE",
    nevada: "NV",
    "new hampshire": "NH",
    "new jersey": "NJ",
    "new mexico": "NM",
    "new york": "NY",
    "north carolina": "NC",
    "north dakota": "ND",
    ohio: "OH",
    oklahoma: "OK",
    oregon: "OR",
    pennsylvania: "PA",
    "rhode island": "RI",
    "south carolina": "SC",
    "south dakota": "SD",
    tennessee: "TN",
    texas: "TX",
    utah: "UT",
    vermont: "VT",
    virginia: "VA",
    "west virginia": "WV",
    wisconsin: "WI",
    wyoming: "WY",
};

/*
    Implementation of spaceship operator (<=>) for sorting.
    Returns -1 if first argument (a) is less than second argument (b),
    0 if a equals b,
    and 1 if a is greater than b
*/
const spaceship = (a, b) => {
    if (a < b) return -1;
    else if (a > b) return 1;
    else return 0;
};

// Escapes HTML characters (<, >, and &) to prevent malicious HTML injection attacks
const encodeHTML = (input) =>
    input
        .replace(/&/g, "&#38;") // &
        .replace(/</g, "&#60;") // <
        .replace(/>/g, "&#62;") // >
        .replace(/"/g, "&#34;") // "
        .replace(/'/g, "&#39;"); // '
