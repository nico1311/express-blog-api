/**
 * Module dependencies.
 */
 require('dotenv').config();
 const debug = require('debug')('blog-api:server'); // eslint-disable-line no-unused-vars
 const consola = require('consola');
 const http = require('http');
 const { app, setup } = require('./app');

 /**
  * Normalize a port into a number, string, or false.
  */
 function normalizePort(val) {
   const port = parseInt(val, 10);

   if (Number.isNaN(port)) {
     // named pipe
     return val;
   }

   if (port >= 0) {
     // port number
     return port;
   }

   return false;
 }

 /**
  * Get port from environment and store in Express.
  */
 const port = normalizePort(process.env.PORT || '3001');
 app.set('port', port);

 /**
   * Create HTTP server.
   */
 const server = http.createServer(app);

 /**
  * Event listener for HTTP server "error" event.
  */
 function onError(error) {
   if (error.syscall !== 'listen') {
     throw error;
   }

   const bind = typeof port === 'string'
     ? `Pipe ${port}`
     : `Port ${port}`;

   // handle specific listen errors with friendly messages
   switch (error.code) {
     case 'EACCES':
       consola.fatal(`${bind} requires elevated privileges`);
       process.exit(1);
       break;
     case 'EADDRINUSE':
       consola.fatal(`${bind} is already in use`);
       process.exit(1);
       break;
     default:
       throw error;
   }
 }

 /**
  * Event listener for HTTP server "listening" event.
  */
 function onListening() {
   const addr = server.address();
   const bind = typeof addr === 'string'
     ? `pipe ${addr}`
     : `http://localhost:${addr.port}`;
   consola.info(`Server listening on ${bind}`);
 }

 server.on('error', onError);
 server.on('listening', onListening);

 const boot = async () => {
   try {
     consola.info('Starting API server');
     await setup();
     consola.success('Connected to the database');
     server.listen(port);
   } catch (err) {
     consola.fatal(err);
     process.exit(1);
   }
 };

 boot();
