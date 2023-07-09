const express = require('express');
const mongoose = require('mongoose');

const server = express();

async function main() {
  await mongoose.connect('mongodb://localhost:27017/');
  console.log('Database connected Succesfully !!');
}

main().catch(() => console.log('Could not connect to the database !!'));

server.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
  });
});

server.listen(8000, () => {
  console.log('Server Started !!');
});
