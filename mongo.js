import mongoose from 'mongoose';

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
  
const password = process.argv[2];
const name = process.argv[3];
const phone = process.argv[4];
  
const url = `mongodb+srv://dagdagi889:${password}@cluster0.qjeojyb.mongodb.net/PhoneBook?retryWrites=true&w=majority`
  
  mongoose.set('strictQuery',false);
  mongoose.connect(url);
  
  const personSchema = new mongoose.Schema({
    name: String,
    phone: Number
  });
  
  const Person = mongoose.model('Person', personSchema);
  
  const person = new Person({
        name: name, 
        phone: phone
  });

  if(!name && !phone){
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
  }else{
    person.save().then(result => {
        console.log(`added ${name} number ${phone} to phone book`);
        mongoose.connection.close();
      });
  }