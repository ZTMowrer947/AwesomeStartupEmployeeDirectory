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
}