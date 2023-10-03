const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

function list(req, res) {
    res.json({ data: orders });
}

function bodyDataHas(propertyName) {
        return function (req, res, next) {
        const { data = {} } = req.body;
        if (data[propertyName]) {
        return next();
        }
        next({ status: 400, message: `Dish must include a ${propertyName}` });
        };
        }

function hasQuantity(req, res, next) {
            const { data: { quantity } = {} } = req.body;
            if (isNaN(quantity) || price <= 0) {
            return next({
            status: 400,
            message: "Dish must have a quantity that is a positive number",
            });
            }
            next();
            }

function hasDishes(req, res, next){
    const { data: { dishes } = {} } = req.body;
    if (dishes==[] || dishes.length>0) {
    return next({
    status: 400,
    message: "dish",
    });
    }
    next();
    }

function orderExists(req, res, next) {
               const orderId = req.params.orderId;
        const foundOrder=orders.find((order)=>order.id===orderId)
      
    if (foundOrder) {
      res.locals.order = foundOrder;
    return next();
    }
    next({
    status: 404,
    message: `Order does not exist: ${orderId}.`,
    });
            }

function create(req, res) {
                const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
                const newOrder = {
                id: nextId(), // Generate a new ID
                deliverTo,
                mobileNumber,
                status,
                dishes,
                };
                orders.push(newOrder);
                res.status(201).json({ data: newOrder });
                }
 
function read(req, res, next){
    const order = res.locals.order;
    res.json({data: order});
}
      
     

function priceExists(req, res, next){
    const {data: {price} = {}} = req.body;

    if(!price){
        next({
            status: 400,
            message: "Dish must include a price",
        })
    }
    else if(price <= 0){
        next({
            status: 400,
            message: "Dish must have a price greater than 0.",
        });
    }
    else if(typeof price != "number"){
        next({
            status: 400,
            message: "The Dish price must be a number.",
        })
    }

    return next();
}

module.exports={
        list,
        create: [bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("status"),
        bodyDataHas("dishes"),
        hasQuantity,
        hasDishes,
        create],
        read: [orderExists, read],
    }