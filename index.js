const express = require('express');
const sequelize = require('./connection.js');
const bodyParser = require('body-parser');
const assignmentroutes = require('./routes/assignment_routes.js');
const healthzroutes = require('./routes/healthz_routes.js');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const csvFilePath = './opt/users.csv';
const importCSV = require('./import_csv.js');
const basicAuthenticator = require('./middleware/basicAuthenticator.js');

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Apply basicAuthenticator middleware to all API requests

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Assignment API',
            description: "API for handling assignments",
            servers: ["http://localhost:8080"]
        }
    },

    apis: ["./routes/assignment_routes.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.set('Cache-control', 'no-cache');
    next();
});

app.use((req, res, next) => {
    sequelize
        .authenticate()
        .then(() => {
            app.use('/healthz', healthzroutes);
            importCSV(csvFilePath);
            app.use(basicAuthenticator);
            app.use('/v1/assignment', assignmentroutes);
            // If the database connection is successful, proceed with the next middleware
            next();
        })
        .catch((err) => {
            // If the database connection fails, send a 503 Service Unavailable response
            res.status(503).json({ message: 'Service Unavailable' });
        });
});


const server = app.listen(port, () => {
    console.log("Server is now listening at 8080");
});



sequelize
    .sync()
    .then(result => {
        console.log("database connected");
    })
    .catch(err => console.log(err));

module.exports = { app, server };