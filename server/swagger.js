import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js']; // Replace with the actual path to your route files

const swaggerOptions = {
  info: {
    title: 'Mocco API',
    description: 'Mocco API Description',
    version: '1.0.0',
  },
  host: 'localhost:5555', // Replace with your API's host
  basePath: '/',
  schemes: ['http', 'https'],
};

swaggerAutogen()(outputFile, endpointsFiles, swaggerOptions);