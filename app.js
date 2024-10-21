const express = require('express')
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const  ejs = require('ejs');

const app = express()
const port = 3000

// database connection 
const db = require("./dbconnection");

const categoryRoutes = require("./route/routes/category");
const productRoutes = require("./route/routes/product");



// configure middleware
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(path.join(__dirname, 'public', 'dashboard','css')));
app.use(express.static(publicDirectory));


//------------------------------------ Routes Parts ----------------------------------//
app.use("/category",categoryRoutes);
app.use("/product",productRoutes);
//------------------------------------ (HomeRoute) ----------------------------------//



app.get('/', (req, res) => {
  const productQuery = "SELECT * FROM product INNER JOIN category WHERE category = category.idc";
  const categoryQuery = "SELECT * FROM category";

  Promise.all([
      new Promise((resolve, reject) => {
          db.query(productQuery, (err, rows) => {
              if (err) return reject(err);
              resolve(rows);
          });
      }),
      new Promise((resolve, reject) => {
          db.query(categoryQuery, (err, rows) => {
              if (err) return reject(err);
              resolve(rows);
          });
      })
  ])
  .then(([products, categories]) => {
      res.render('index', {
          title: 'ecommerce',
          rows: products,
          categories: categories
      });
  })
  .catch(err => {
      console.error(err);
      res.status(500).send('Error en la base de datos');
  });
});


app.listen(port, () => {
  console.log(`Escuchar el app listening at http://localhost:${port}`)
})