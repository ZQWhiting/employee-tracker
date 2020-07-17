# Employee Tracker
![license](https://img.shields.io/badge/License-ISC-blue)

<a name='description'></a>
## Description
Employee Tracker is a content management system using a command-line interface designed to help manage a company's employee database.

## Table of Contents
* [Description](#Description)
* [Prerequisites](#Prerequisites)
* [Installation](#Installation)
* [Usage](#Usage)
* [License](#License)
* [Contributing](#Contributing)
* [Tests](#Tests)
* [Questions](#Questions)
* [Credits](#Credits)

<a name='Prerequisites'></a>
## Prerequisites:
* [Node](https://nodejs.org/en/)
* [MySQL](https://www.mysql.com/)

<a name='installation'></a>
## Installation:
1. Clone the repository.
2. Navigate to the repository in the terminal and run `npm i`.
3. Login to mysql in the terminal with `mysql -u root -p`,
    where 'root' is your username (default: root),
    and enter your password at the prompt.
4. In mysql, create the database:
    ```
    mysql> SOURCE db/schema.sql;
    ```
5. (Optional) Popualte the database with test data:
    ```
    mysql> SOURCE db/seeds.sql;
    ```
6. (Optional) Create a new mysql user with permissions on the database:
    ```
    mysql> CREATE USER 'user'@'localhost' IDENTIFIED BY 'some_pass';
    mysql> GRANT ALL PRIVILEGES ON employee.* TO 'user'@'localhost';
    ```
7. Exit mysql with `mysql > quit;` or `mysql > exit;`.
8. Enter your mysql user and password in the `config.txt` file.
9. Run `npm start` in the terminal to run the server.
10. Open a new terminal and navigate to the repository.
11. Run `npm run app` in the new terminal to run the app.

<a name='usage'></a>
## Usage
* Run the server in the terminal using `npm start`.
* Run the app in the terminal using `npm run app`.
* Select an option from the menu.
* Enter information as necessary.

<a name='license'></a>
## License
Licensed under the [ISC](./docs/LICENSE.txt) license.

<a name='contributing'></a>
## Contributing
[Contributor Covenant](./docs/contributor-covenant.txt)

<a name='tests'></a>
## Tests
```
 npm test
```
(Uses [Jest](https://www.npmjs.com/package/jest))

<a name='questions'></a>
## Questions
Reach me at my github or email!

[GitHub](https://github.com/ZQWhiting)

<zach.whiting@icloud.com>

<a name='credits'></a>
## Credits
Developed by Zachary Q. Whiting (ZQWhiting).