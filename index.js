/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const productsRouter = require('./routes/productsRouter');
const brandsRouter = require('./routes/brandsRouter');
const categoryRouter = require('./routes/categoryRouter');
const userRouter = require('./routes/UserRouter');
const authRouter = require('./routes/authRouter');
const cartRouter = require('./routes/cartRouter');

const server = express();

// MIDDLEWARES
server.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  })
);

server.use(morgan('dev'));

server.use(express.json()); // to parse req.body
server.use('/products', productsRouter.router);
server.use('/categories', categoryRouter.router);
server.use('/brands', brandsRouter.router);
server.use('/users', userRouter.router);
server.use('/auth', authRouter.router);
server.use('/cart', cartRouter.router);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/ecommerce');
  // eslint-disable-next-line no-console
  console.log('Database connected Succesfully !!');
}

// eslint-disable-next-line no-console
main().catch(() => console.log('Could not connect to the database !!'));

server.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
  });
});

// server.post('/products', createProduct);

server.listen(8000, () => {
  // eslint-disable-next-line no-console
  console.log('Server Started !!');
});
