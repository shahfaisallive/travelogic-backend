const express = require ('express');
const router = express.Router();

const RouteControllers = require('../Controllers/RouteControllers')

router.post('/', RouteControllers.createRoute)
router.get('/', RouteControllers.getRoutes)
router.get('/admin', RouteControllers.getRoutesAdmin)
router.post('/route', RouteControllers.doesRouteExist)
router.delete('/:id',RouteControllers.deleteRouteById)

module.exports = router
