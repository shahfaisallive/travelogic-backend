const express = require ('express');
const router = express.Router();

const SearchControllers = require('../Controllers/SearchControllers')

router.get('/:string', SearchControllers.search)

module.exports = router
