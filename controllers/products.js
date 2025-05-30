const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Products']
    const result = await mongodb.getDatabase().db().collection('products').find();
    result.toArray().then((products) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(products);
    });
}

//GET
const getSingle = async (req, res) => {
    //#swagger.tags=['Products']
    try {
    
        // Defensive: Validate ID format
        if (!ObjectId.isValid(req.params.id)) {
          return res.status(400).json({ message: 'Invalid product ID format' });
        }
    
        const productId = new ObjectId(req.params.id);
    
        const product = await mongodb.getDatabase().db().collection('products').find({ _id: productId });
    
        // If product doesn't exist
        if (!product) {
          return res.status(400).json({ message: 'Product not found in list' });
        }
    
        // Product found
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(product);
    
      } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    
    /*const productId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('products').find({ _id: productId });
    result.toArray().then((products) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(products[0]);
    });*/
};

//POST
const createProduct = async (req, res) =>
{
    //#swagger.tags=['Products']
    try {
        const {name, manufact, price, from, bulk, img, weight} = req.body;

        if (!name || !manufact || !price || !from || !bulk || !img || !weight)
        {
            return res.status(400).json({message: "Fields are incomplete"});
        }

        const product = {name, manufact, price, from, bulk, img, weight};
        const response = await mongodb.getDatabase().db().collection('products').insertOne(product);
        if (response.acknowledged){
            res.status(204).send({message : "Product created successfully."});
        } else {
            res.status(500).json({message : "Something didn't quite work with the database..."});
        }

    } catch {
        res.status(500).json({message: "Server error."});
    }
}

//PUT
const updateProduct = async (req, res) =>
{
    //#swagger.tags=['Products']
    try{
        const {name, manufact, price, from, bulk, img, weight} = req.body;
        if (!ObjectId.isValid(req.params.id))
        {
            res.status(400).json('Error, not a valid product ID!')
        }

        if (!name || !manufact || !price || !from || !bulk || !img || !weight)
        {
            return res.status(400).json({message: "Fields are incomplete"});
        }

        const productId = new ObjectId(req.params.id);
        const product = {name, manufact, price, from, bulk, img, weight};
        
        const response = await mongodb.getDatabase().db().collection('products').replaceOne({_id : productId}, product);
        if (response.modifiedCount > 0){
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "Some error occurred while updating the product.");
        }  
    } catch
    {
        res.status(500).json({message: "Server error"});
    }
}

const deleteProduct = async (req, res) =>
{
    //#swagger.tags=['Products']
    
    try{
        if (!ObjectId.isValid(req.params.id))
        {
            res.status(400).json('Error, not a valid contact ID')
        }
        const productId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('products').deleteOne({_id : productId});
        if (response.deletedCount > 0){
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "Some error occurred while updating the user.");
        }
    } catch {
        res.status(500).json({message: "Server error"});
    }
    /*const productId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('products').deleteOne({_id : productId});
    if (response.deletedCount > 0){
        res.status(204).send();
    } else {
        res.status(500).json(response.error || "Some error occurred while updating the product.");
    }*/
}

module.exports = {
    getAll,
    getSingle,
    createProduct,
    updateProduct,
    deleteProduct
}