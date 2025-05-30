const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
//const { check, validationResult } = require('express-validator')

const getAll = async (req, res) => {
    //#swagger.tags=['Users']
    const result = await mongodb.getDatabase().db().collection('users').find();
    result.toArray().then((users) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    });
}

//GET
const getSingle = async (req, res) => {
    //#swagger.tags=['Users']

    try {
    
        // Defensive: Validate ID format
        if (!ObjectId.isValid(req.params.id)) {
          return res.status(400).json({ message: 'Invalid product ID format' });
        }
    
        const userId = new ObjectId(req.params.id);
    
        const user = await mongodb.getDatabase().db().collection('users').find({ _id: userId });
    
        // If product doesn't exist
        if (!user) {
          return res.status(400).json({ message: 'Product not found in list' });
        }
    
        // Product found
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    
      } catch {
        res.status(500).json({ message: 'Server error'});
      }
    /*const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('users').find({ _id: userId });
    result.toArray().then((users) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users[0]);
    });*/
};

//POST
const createUser = async (req, res) =>
{
    //#swagger.tags=['Users']
    try{
        const {fname, lname, email, bday} = req.body;

        if (!fname || !lname || !email || !bday) {
            return res.status(400).json({message: "Fields are incomplete"})
        }

        const user = {fname, lname, email, bday};
        const response = await mongodb.getDatabase().db().collection('users').insertOne(user);
        if (response.acknowledged){
            res.status(204).send({message : "User created successfully."});
        } else {
            res.status(500).json({message : "Something didn't quite work with the database..."});
        }
        
    } catch
    {
        res.status(500).json({message: "Server error."});
    }
    
}

//PUT
const updateUser = async (req, res) =>
{
    //#swagger.tags=['Users']
    try{

        const {fname, lname, email, bday} = req.body;

        

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Not valid"})
        }

        if (!fname || !lname || !email || !bday) {
            return res.status(400).json({message: "Fields are incomplete"})
        }

        const userId = new ObjectId(req.params.id);
        const user = {fname, lname, email, bday};
        
        const response = await mongodb.getDatabase().db().collection('users').replaceOne({_id : userId}, user);

        if (response.modifiedCount > 0){
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "Some error occurred while updating the user.");
        }
        
    } catch
    {
        res.status(500).json({message: "Server error"});
    }
    
}

//DELETE
const deleteUser = async (req, res) =>
{
    //#swagger.tags=['Users']
    try{
        if (!ObjectId.isValid(req.params.id))
        {
            res.status(400).json('Error, not a valid contact ID')
        }
        
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('users').deleteOne({_id : userId});
        if (response.deletedCount > 0){
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "Some error occurred while updating the user.");
        }
    } catch {
        res.status(500).json({message: "Server error"});
    }
}

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
}