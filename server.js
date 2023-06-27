const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const query      = require('./dbFuntions/db');
const app = express();

// PERMITE O NODE A FAZER O PARSER DO JSON ENVIADO PELO CLIENTE
// BODY -> JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ME PERMITE GUARDAR ASSETS NUMA PASTA ESPECÍFICA
app.use(express.static('view'));

app.use(cors());

// Configurar o EJS como mecanismo de visualização
app.set('view engine', 'ejs');

usuarios = [
  {
    nome: 'Nadiana Kelly',
    idade: '0',
    endereco: 'Rua do caju',
    email: 'nadjk@gmail.com',
    telefone: '89623154',
    username: 'nad',
    senha: '123'
  }
]

// rota para usuario
app.get('/teste2', async (req, res) => {
  const { 
    cargo, nome_completo, data_nascimento, idade, endereco_completo, telefone, email, username, senha } = req.body;

  if( await query.criarUsuario(cargo, nome_completo, data_nascimento, idade, endereco_completo, telefone, email, username, senha)) {
      res.send('Sucesso');
  } else {
      res.send('Falha ao criar usuario');
  }
});

// rota para criar medico
app.get('/teste', async (req, res) => {
    const { nome, area_medica, descricao, username, senha } = req.body;
    console.log(req.body);
    if( await query.criarMedico(nome, area_medica, descricao, username, senha)) {
        res.send('Sucesso');
    } else {
        res.send('Falha ao criar medico');
    }
});

// rota para criar agedamento
app.get('/teste3', async (req, res) => {
  const { nome_medico, data_consulta, horario, convenio_medico, motivo_consulta } = req.body;
  console.log(req.body);
  if( await query.criarAgendamento(nome_medico, data_consulta, horario, convenio_medico, motivo_consulta )) {
      res.send('Sucesso');
  } else {
      res.send('Falha ao criar agendamento');
  }
});

// Rota para a página inicial
app.get('view/tela1-profissionais/index.html', (req, res) => {
    res.sendFile(__dirname + 'view/tela1-profissionais/index.html');
});

// serve os arquivos, com imagens, css e etc..
app.get('/view/:folder/:file', (req, res) => {
    res.sendFile(__dirname + `/view/${req.params.folder}/${req.params.file}`)
});

// Rota POST para criar uma conta de usuário
app.post('/usuarios/criar-conta', (req, res) => {
  const { nome, idade, endereco, email, telefone, username, senha } = req.body;

  for(user of usuarios) {
    if(user.username == username) {
        return res.status(200).json({
          message: 'Ja existe um usuario com esse username',
          username
        });
    }
  }

  usuarios.push({ nome, idade, endereco, email, telefone, username, senha });

  res.status(200).json({
    message: 'Usuario cadastrado com sucesso'
  });
});

app.post('/login', (req, res) => {
    const { username, senha } = req.body;

    for(user of usuarios){
        console.log(user)
        if(user.username == username && user.senha == senha) {
            data = {
                message: '/view/tela1-profissionais/index.html',
                result: 1
            }

            return res.json(data);
        }
    }

    data = {
      message: 'Usuario ou senha incorreta',
      result: 0
    }

    res.status(200).json(data)
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});