# AwesomeStartupEmployeeDirectory
Treehouse FSJS Techdegree Unit 5 Project

## Description
This project is an employee directory for a fantasy startup company consisting of 12 randomly generated employees using data from the Random Users API.

## Criteria
### Requirements being met
#### API Usage
- 12 random users are pulled from the API.
- New employee data is generated each time the page is refreshed.

#### Directory
- The directory displays the 12 users pulled from the API, including the following information:
    - Image
    - First and Last name
    - Email
    - Location

#### Modal
- The modal window for a user displays the following additional information about them:
    - Phone Number
    - Address (Street Address, City, State, Postal Code)
    - Date of Birth

- The modal can be closed.

#### Structure, style, and CSS
- The major elements of the directory and modal are in place and almost exactly match the mockups (in terms of structure).

### Requirements being exceeded (as listed on Treehouse)
#### Directory
- Employees can be filtered by name with a dynamically added search feature.

#### Modal
- Functionality is present to switch back and forth between employees while the modal is present.
- No errors occur in the console when the beginning or the end is reached.

#### Structure, style, and CSS
- In the modal, the state is formatted as a 2-letter state code.
    - Note: The requirements state that I did not have to do this, but I initially did not notice this. I found this out after already implementing the 2-letter code format. I decided to leave it in to match the mockups more closely.

- In the modal, the date of birth has a 4-digit year (as compared to the 2-digit year present in the mockups)

- Styles have been modified for additional touches that will be noted in the next section.

### Other things of note
- A loading message is added to the DOM prior to the employee data being present, and is removed once the data is retrieved.
- If an error occurs with retrieving data from the API, the application displays error information and halts.
- A sorting feature has been added to the search functionality, allowing the following methods of sorting:
    - Unsorted (just as they were generated from the API)
    - First/Last name (ascending or descending)
    - Last/First name (ascending or descending)
- If a search query returns no results, a message appears to indicate such.
    - Note: The search query text is displayed within the message, so HTML characters within it are escaped to prevent HTML injection attacks.
- When the modal navigation reaches the beginning or end of the list, the respective button text changes to reflect this, and when clicked, the modal navigation wraps around to the other end of the list.