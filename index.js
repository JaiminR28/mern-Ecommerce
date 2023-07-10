const express = require('express');
const mongoose = require('mongoose');
const productsRouter = require('./routes/productsRouter');
const brandsRouter = require('./routes/brandsRouter');
const categoryRouter = require('./routes/categoryRouter');

const server = express();

// MIDDLEWARES
server.use(express.json()); // to parse req.body
server.use('/v1/products', productsRouter.router);
server.use('/v1/categories', categoryRouter.router);
server.use('/v1/brands', brandsRouter.router);

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
