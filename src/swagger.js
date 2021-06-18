const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '0.1.0',
      description: 'Simple REST API built with Node, Express and Sequelize',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      }
    }
  },
  apis: [
    './src/controllers/*.js',
    './src/db/models/*.js'
  ]
};

const specs = swaggerJSDoc(options);
module.exports = specs;
