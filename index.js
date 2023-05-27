import express from 'express';
import { uid } from 'uid';
const app = express();

app.use(express.json());

let db = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
  });

app.get('/info', (request, response) => {
    const persons = db.length;
    const date = new Date();
    response.send(`<p>Phone book have info for ${persons} persons</p><p>${date}</p>`);
  });

  
app.get('/api/db', (request, response) => {
    response.json(db);
    console.log(response.json(db));
  });


const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});