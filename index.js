const express = require('express');
const mongoose = require('mongoose');
const { createProduct } = require('./controller/Product');

const server = express();

// MIDDLEWARES
server.use(express.json()); // to parse req.body

async function main() {
  await mongoose.connect('mongodb://localhost:27017/ecommerce');
  console.log('Database connected Succesfully !!');
}

main().catch(() => console.log('Could not connect to the database !!'));

server.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
  });
});

server.post('/products', createProduct);

server.listen(8000, () => {
  console.log('Server Started !!');
});
