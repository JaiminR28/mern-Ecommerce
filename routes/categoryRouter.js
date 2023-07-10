const express = require('express');
const {
  fetchAllCategories,
  createCategory,
} = require('../controller/Category');

const router = express.Router();

router.post('/', createCategory).get('/', fetchAllCategories);

exports.router = router;
