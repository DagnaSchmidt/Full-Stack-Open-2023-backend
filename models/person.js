import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.MONGODB_URL;

mongoose.set('strictQuery', false);

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })  
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message) 
    })

const personSchema = new mongoose.Schema({
        name: String,
        phone: Number
    });
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id
        delete returnedObject.__v
    }
    });

const Person = mongoose.model('Person', personSchema);
export default Person;