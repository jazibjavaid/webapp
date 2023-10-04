# webapp
## Introduction
Node.js is a server-side JavaScript runtime environment. It allows developers to build fast and scalable network applications...

Creating an API to perform post, get and update user data data.  

## Prerequisites

1.Visual studio code (IDE)

2.POSTMAN

3.Database - Postgres

4.Node.js

## Dependencies to be installed 

- npm install express 
- npm install pg sequilize 
- npm install bcrypt body-parser dotenv
- npm install --save-dev jest
- npm install --save-dev jest supertest

<h4>Important Commands to run the server and test</h4>

## Scripts
- `npm start`: starts the development server
- `npm test`: runs test suite

## Endpoints
The following endpoints are available for operations:

GET - http://localhost:8080/healthz/

GET - http://localhost:8080/v1/assignment/

POST - http://localhost:8080/v1/assignment/

PUT - http://localhost:8080/v1/assignment/{id}

GET - http://localhost:8080/v1/assignment/{id}

DELETE - http://localhost:8080/v1/assignment/{id}


## Responds with following HTTP messages

"400 Bad Request" - The server could not understand the request due to invalid syntax.

"500 Internal Server Error" - The server has encountered a situation it does not know how to handle.

"201 Created "- The request succeeded, and a new resource was created as a result. This is typically the response sent after POST requests, or some PUT requests

"200 OK "- The request succeeded.

"401 Unauthorized "- Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.

"204 No Content" - The HTTP 204 No Content success status response code indicates that a request has succeeded, but that the client doesn't need to navigate away from its current page.

"403 Forbidden "


<h4>Instructions:</h4>
Step 1: Clone the repository or download and unzip the source repository.

Step 2: Create appropriate files in the IDE and write the code to test the API call in Postman.

Step 3: Open Postman to Test the API's

Step 4: Check the Database after each and every API is called to see the status in Database.

## Test the Service
To check the service is up visit

GET - http://localhost:8080/healthz/, where you should see: "200 OK".

GET - http://localhost:8080/v1/assignment/, where you should see: "200 OK".

POST - http://localhost:8080/v1/assignment/, where you should see: "201 Created".

GET - http://localhost:8080/v1/assignment/{id}, where you should see: "200 OK".

PUT - http://localhost:8080/v1/assignment/{id}, where you should use: "204 Content".

DELETE - http://localhost:8080/v1/assignment/{id}, where you should use: "204 No Content".

