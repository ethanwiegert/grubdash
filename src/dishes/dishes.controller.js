const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function list(req, res) {
   res.json({ data: dishes});
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

  function hasPrice(req, res, next) {
    const { data: {price} ={}}=req.body
  
   if (!(isNaN(price)) || price>=0 ) {
       next({ status: 400, message: "Dish must have a price that is an integer greater than 0" })
    }
     return next();
  }

  function dishExists(req, res, next){
    const dishId =Number(req.params.dishId)
    const foundDish=dishes.find((dish)=>dish.id===dishId)
    if(foundDish){
        return next()
    }
    next({
        status: 404,
        message: `Dish does not exist: ${req.params.dishId}.`,
    })
  }


  function read(req, res) {
    const dishId = Number(req.params.dishId);
    const foundDish=dishes.find((dish)=>dish.id===dishId)
  
    res.json({ data: foundDish });
  }

  function create(req, res){
    const { data: { name, description, price, image_url } ={}}=req.body
    const newDish={
        id: nextId(),
        name,
        description,
        price,
        image_url,
    }
    dishes.push(newDish)
    res.status(201).json({ data: newDish })

  }

  function update(req, res, next){
    const dishId =req.params.dishId
    const foundDish=dishes.find((dish)=>dish.id===dishId)

    const { data: { name, description, price, image_url } ={}}=req.body
    foundDish.name=name
    foundDish.description=description
    foundDish.price=price
    foundDish.image_url=image_url
    res.json({ data: foundDish });

    
  }

  module.exports ={
    list,
    create: [  bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    hasPrice,
    create],
    update: [bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    hasPrice,
    dishExists, 
    update],
    read: [dishExists, read],


  }