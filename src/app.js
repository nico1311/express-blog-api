const express = require('express'),
  cookieParser = require('cookie-parser'),
  cors = require('cors'),
  logger = require('morgan'),
  consola = require('consola'),
  swaggerUI = require('swagger-ui-express');

const swaggerSpec = require('./swagger');

const { sequelize } = require('./db');
const Category = require('./db/models/Category');
const Post = require('./db/models/Post');

const indexRouter = require('./routes/index'),
  apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(cors({
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// models setup
Category.init(sequelize);
Post.init(sequelize);

Category.hasMany(Post, {
  foreignKey: 'categoryId'
});

Post.belongsTo(Category, {
  foreignKey: 'categoryId'
});

// Routes
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const setup = async () => {
  await sequelize.authenticate();
  await Category.sync();
  await Post.sync();
};

module.exports = {
  app,
  setup
};
