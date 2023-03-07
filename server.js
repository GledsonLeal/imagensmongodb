const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

// Configurações do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage });

// Configurações do Ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Conexão com o banco de dados MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true });

// Definição do modelo de imagem com Mongoose
const Image = mongoose.model('Image', { 
  name: String,
  path: String 
});

// Rota principal, exibe o formulário de upload
app.get('/', (req, res) => {
    Image.find()
    .then((images) => res.render('home', { images }))
    .catch((err) => console.log(err));
  //res.render('home');
});

// Rota de upload, salva a imagem no servidor e no banco de dados
app.post('/upload', upload.single('image'), (req, res) => {
  const image = new Image({
    name: req.file.originalname,
    path: req.file.path
  });
  image.save()
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err));
});

// Rota de visualização das imagens salvas
app.get('/images', (req, res) => {
  Image.find()
    .then((images) => res.render('images', { images }))
    .catch((err) => console.log(err));
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
