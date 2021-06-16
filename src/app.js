const express = require('express'),
  cookieParser = require('cookie-parser'),
  cors = require('cors'),
  logger = require('morgan'),
  consola = require('consola');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(cors({
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/', indexRouter);

const setup = async () => {
  // TODO: implement database connection
  return Promise.resolve();
};

module.exports = {
  app,
  setup
};
