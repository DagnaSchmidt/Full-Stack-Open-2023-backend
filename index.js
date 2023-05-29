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

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

morgan.token('data', function getData (req) { return JSON.stringify(req.body.content) });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
});

// let db = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "phone": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "phone": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "phone": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "phone": "39-23-6423122"
//     }
// ];

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'wrong format of id' })
    }else if(error.name === 'ValidationError') {    
      return response.status(400).json({ error: error.message })  
    }
    next(error)
  };

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
  });

app.get('/info', (request, response) => {
    const date = new Date();
  Person.find({}).then(persons => {
    response.send(`<p>Phone book have info for ${persons.length} persons</p><p>${date}</p>`);
    });
  });

app.get('/api/db', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  })
});

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

app.delete('/api/db/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error))
});

app.post('/api/db', (request, response, next) => {
      const body = request.body;
      const name = body.name;
      const phone = Number(body.phone);

      const person = new Person({
        name: name,
        phone: phone
      })

      person.save()
      .then(savedPerson => {
        response.json(savedPerson);
      })
      .catch(error => next(error))
  });

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});