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
   const { data: { dishes } = {} } = req.body

  dishes.forEach((dish) => {
    const quantity = dish.quantity

    if (!quantity || quantity <= 0 || typeof quantity !== "number") {
      return next({
        status: 400,
        message: `dish ${dish.id} must have quantity property, quantity must be an integer, and it must not be equal to or less than 0`,
      })
    }
  })
  next()}


function dishesHasValidArray(req, res, next){
      const { data: { dishes } = {} } = req.body;
    if (!Array.isArray(res.locals.dishes) || res.locals.dishes.length == 0) {
    return next({
    status: 400,
    message: "Order must include at least one dish",
    });
    }
    next();
    }



function hasDishes(req, res, next){
   const { data: { dishes } = {} } = req.body

  if (dishes) {
    res.locals.dishes = dishes
    return next()
  }
  next({
    status: 400,
    message: `A 'dishes' property is required.`,
  })
}

function dishesArrayIsValid(req, res, next) {
  const { data: { dishes } = {} } = req.body
  if (!Array.isArray(res.locals.dishes) || res.locals.dishes.length == 0) {
    next({
      status: 400,
      message: `invalid dishes property: dishes property must be non-empty array`,
    })
  }
  next()
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

 function update(req, res, next){
    const order = res.locals.order;
    const {orderId} = req.params;
     const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } = req.body;

    if(!id || orderId === id){
        const updatedOrder = {
            id: orderId,
            deliverTo,
            mobileNumber,
            status,
            dishes,
        }

        res.json({data: updatedOrder});
    }

    next({
        status: 400,
        message: `Order id does not match route id. Dish: ${id}, Route: ${orderId}`,
    })
}

function checkStatus(req, res, next) {
    const { data: { status } = {} } = req.body
  if (!status || status==="") {
    next({
      status: 400,
      message: `Order must have a status of pending, preparing, out-for-delivery, delivered`,
    })
  }
  else if(status==="delivered"){
      next({
      status: 400,
      message: `A delivered order cannot be changed`,
    })
  }
  next()
}

function destroy(req, res, next) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === Number(orderId));
  if (index > -1) {
    orders.splice(index, 1);
  }
  res.sendStatus(204);
}
      
     


module.exports={
        list,
        create: [bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("dishes"),
        hasDishes,
        dishesArrayIsValid,
        hasQuantity,
        create],
        update: [bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("dishes"),
        hasDishes,
        dishesArrayIsValid,
        hasQuantity,
        orderExists,
        checkStatus,
        update],
        read: [orderExists, read],
        delete: [orderExists, destroy],
    }