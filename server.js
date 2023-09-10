require('dotenv').config();

const CompaniesDB = require("./modules/companiesDB.js");
const db = new CompaniesDB()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json())

// Define a GET route that returns the JSON object
app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
      console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch((err)=>{
  console.log(err);
});

// Routes -----------------------

// Add new Company
app.post('/api/companies', (req, res) => {
  const newCompany = req.body;
  db.addNewCompany(newCompany)
    .then((result) => {
      if (result) {
        res.status(201).json(result); // Successfully created and return the new company
      } else {
        res.status(500).json({ error: 'Failed to add company' }); // Server error
      }
    })
    .catch((err) => {
      console.error('Error adding company:', err);
      res.status(500).json({ error: 'Failed to add company' }); // Server error
    });
});

// GET company
app.get('/api/companies', (req, res) => {
  const { page, perPage, tag } = req.query;
  db.getAllCompanies(page, perPage, tag)
    .then((companies) => {
      res.json(companies); // Successfully retrieved companies
    })
    .catch((err) => {
      console.error('Error getting companies:', err);
      res.status(500).json({ error: 'Failed to get companies' }); // Server error
    });
});

// GET company name
app.get('/api/company/:name', (req, res) => {
  const name = req.params.name;
  db.getCompanyByName(name)
    .then((company) => {
      if (company) {
        res.json(company); // Successfully retrieved company
      } else {
        res.status(204).json({ message: 'Company not found' }); // No content
      }
    })
    .catch((err) => {
      console.error('Error getting company:', err);
      res.status(500).json({ error: 'Failed to get company' }); // Server error
    });
});

// PUT company
app.get('/api/company/:name', (req, res) => {
  const name = req.params.name;
  db.updateCompanyByName(req.body, name)
    .then(() => {
      res.json({ message: 'Company updated successfully' }); // Successfully updated company
    })
    .catch((err) => {
      console.error('Error updating company:', err);
      res.status(500).json({ error: 'Failed to update company' }); // Server error
    });
});

// DELETE company
app.delete('/api/company/:name', (req, res) => {
  const name = req.params.name;
  db.deleteCompanyByName(name)
    .then(() => {
      res.json({ message: 'Company deleted successfully' }); // Successfully deleted company
    })
    .catch((err) => {
      console.error('Error deleting company:', err);
      res.status(500).json({ error: 'Failed to delete company' }); // Server error
    });
});

// ---------------------------------------------

// resource not found
app.use((req, res) => {
  res.status(404).send("Resource not found");
});