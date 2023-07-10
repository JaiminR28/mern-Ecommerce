const express = require('express');
const { fetchAllBrands, createBrand } = require('../controller/Brand');

const router = express.Router();

router.get('/');
router.post('/', createBrand).get('/', fetchAllBrands);

exports.router = router;
