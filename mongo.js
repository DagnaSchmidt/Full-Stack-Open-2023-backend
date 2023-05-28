import mongoose from 'mongoose';

const userPassword = process.env.USER_PASSWORD;

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
  
const password = process.argv[2];
  
const url = `mongodb+srv://dagdagi889:${userPassword}@cluster0.qjeojyb.mongodb.net/?retryWrites=true&w=majority`
  
  mongoose.set('strictQuery',false);
  mongoose.connect(url);
  
  const personSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    id: Number
  });
  
  const Person = mongoose.model('Note', personSchema);
  
  const personExample = new Person({
        id: 1,
        name: "Arto Hellas", 
        phone: "040-123456"
  });
  
  personExample.save().then(result => {
    console.log('person added!');
    mongoose.connection.close();
  })