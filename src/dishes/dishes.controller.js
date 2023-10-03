const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function list(req, res) {
    res.json({ data: dishes });
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
    
    function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
    id: nextId(), // Generate a new ID
    name,
    description,
    price,
    image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
    }
    
    function hasPrice(req, res, next){
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
    
    function dishExists(req, res, next) {
    const dishId = req.params.dishId;
    const foundDish = dishes.find((dish) => dish.id === dishId);
      
    if (foundDish) {
      res.locals.dish = foundDish;
    return next();
    }
    next({
    status: 404,
    message: `Dish does not exist: ${dishId}.`,
    });
    }
    
    function update(req, res, next){
    const dish = res.locals.dish;
    const {dishId} = req.params;
    const {data: {id, name, description, price, image_url} = {}} = req.body;

    if(!id || dishId === id){
        const updatedDish = {
            id: dishId,
            name,
            description,
            price,
            image_url,
        }

        res.json({data: updatedDish});
    }

    next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    })
}

function read(req, res, next){
    const dish = res.locals.dish;
    res.json({data: dish});
}


  module.exports ={
    list,
    create: [  bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    hasPrice,
    create],
    update: [ dishExists,
                 hasPrice, 
      bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    update],
    read: [dishExists, read],


  }