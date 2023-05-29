import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import Person from './models/person.js';

dotenv.config();

const userPassword = process.env.USER_PASSWORD;

const url = `mongodb+srv://dagdagi889:${userPassword}@cluster0.qjeojyb.mongodb.net/PhoneBook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const app = express();

app.use(express.json());
app.use(express.static('build'));
app.use(cors());

morgan.token('data', function getData (req) { return JSON.stringify(req.body.content) });

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

let db = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "phone": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "phone": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "phone": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "phone": "39-23-6423122"
    }
];

morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  });

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'wrong format of id' })
    } 
    next(error)
  };

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
  });

app.get('/info', (request, response) => {
    const persons = db.length;
    const date = new Date();
    response.send(`<p>Phone book have info for ${persons} persons</p><p>${date}</p>`);
  });

app.get('/api/db', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  })
});
// app.get('/api/db', (request, response) => {
//     response.json(db);
//     console.log(response.json(db));
//   });


app.get('/api/db/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person);
      }else{
        response.status(404).end();
      }
    })
    .catch(error => next(error))
});
// app.get('/api/db/:id', (request, response) => {
//     const id = Number(request.params.id);
//     const person = db.filter(person => person.id === id);

//     if(person.length !== 0){
//         response.json(person);
//     }else{
//         response.status(404).end();
//     }
//   });

app.delete('/api/db/:id', (request, response) => {
    const id = Number(request.params.id);
    db = db.filter(note => note.id !== id);
  
    response.status(204).end();
  });


app.post('/api/db', (request, response) => {
      const body = request.body;
      const name = body.name;
      const phone = Number(body.phone);

      if (!body || !name || !phone) {
        return response.status(400).json({ 
          error: 'content missing' 
        });
      }

      const person = new Person({
        name: name,
        phone: phone
      })

      person.save().then(savedPerson => {
        response.json(savedPerson);
      })
  });
// app.post('/api/db', (request, response) => {
//     const body = request.body;
//     const name = body.content.name;
//     const number = body.content.number;

//     const check = () => {
//         for(let i = 0; i < db.length; i++){
//             if(name === db[i].name){
//                 return false;
//             }
//         }
//     }
  
//     if (!body.content || !name || !number) {
//       return response.status(400).json({ 
//         error: 'content missing' 
//       });
//     }
//     if(check() === false){
//         return response.status(404).json({
//             error: 'name already exist in phone book'
//         });
//     }
  
//     const person = {
//         id: Math.floor(Math.random() * 100000),
//         name: name,
//         number: number
//     };
  
//     db = db.concat(person);
  
//     response.json(person);
//   })

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});