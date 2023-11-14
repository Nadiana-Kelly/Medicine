const express = require('express');
const cors = require('cors');
const multer = require("multer");
const fs = require("fs");
const bodyParser = require('body-parser');
const query      = require('./dbFuntions/db');
const app = express();

app.use(express.json());
// PERMITE O NODE A FAZER O PARSER DO JSON ENVIADO PELO CLIENTE
// BODY -> JSON
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

// ME PERMITE GUARDAR ASSETS NUMA PASTA ESPECÍFICA
app.use(express.static('view'));

app.use(cors());

app.use(function(req, res, next) {
    console.log(req.path);
    next();
});

// Configurar o EJS como mecanismo de visualização
app.set('view engine', 'ejs');

// rota para usuario
app.get('/teste2', async (req, res) => {
  const { 
    cargo, nome_completo, data_nascimento, idade, endereco_completo, telefone, email, username, senha } = req.body;

  if( await query.criarUsuario(cargo, nome_completo, data_nascimento, idade, endereco_completo, telefone, email, username, senha)) {
      res.send('Sucesso');
  } else {
      res.status(500).send('Falha ao criar usuario');
  }
});

// rota para criar medico
app.post('/criarMedico', async (req, res) => {
  try {
      const { nome, area_medica, descricao, username, senha, foto } = req.body;
      console.log(req.body);
      if( await query.criarMedico(nome, area_medica, descricao, username, senha, foto)) {
          res.send('Sucesso');
      } else {
          res.send('Falha ao criar medico');
      }
  } catch(err) {
      res.send("Algum erro ocorreu");
  }
});

app.get('/listarMedicos', async (req, res) => {
    try {
        const result = await query.listarMedicos();
        if(result) {
            res.send(result);
        } else {
            res.send({});
        }
    } catch(err) {
      res.send('Algum erro correu');
    }
})

app.get('/perfilMedico/:id', async (req, res) => {
    try {
        const result = await query.perfilMedico(req.params.id);
        if(result) {
            res.send(result);
        } else {
            res.send({});
        }
    } catch(err) {
      res.send('Algum erro correu');
      console.log(err);
    }
})

app.post('/editarMedico', async (req, res) => {
    try {
        const {id, nome, descricao, foto} = req.body;
        const result = await query.editarMedico(id, nome, descricao, foto);
        if(result) {
            res.send(result);
        } else {
            res.send({});
        }
    } catch(err) {
      res.send('Algum erro correu');
      console.log(err);
    }
})

// rota para criar agedamento
app.post('/agendamento', async (req, res) => {
    try {
        const { nome_medico, horario, convenio_medico, motivo_consulta, id_paciente, id_medico, data } = req.body;
        if (await query.criarAgendamento(nome_medico, horario, convenio_medico, motivo_consulta, id_paciente, id_medico, data)) {
            res.send('Sucesso');
        } else {
            res.send('Falha ao criar agendamento');
        }
    } catch(err) {
        res.status(400).send('Algo errado ocorreu');
    }
});

// rota para listar agendamento
app.get('/listarAgendamentos/:id', async (req, res) => {
    try {
        var agendamentos = await query.listarAgendamentos(req.params.id);
        console.log(agendamentos);
        res.send(agendamentos);
    } catch(err) {
        res.send(err);
    }
});

app.get('/listarAgendamentosMedico/:id', async (req, res) => {
    try {
        var agendamentos = await query.listarAgendamentosMedico(req.params.id);
        res.send(agendamentos);
    } catch(err) {
        res.send(err);
    }
});

app.delete('/removerAgendamentos/:id', async (req, res) => {
    try {
        await query.removerAgendamentos(req.params.id);
        res.send('Sucesso');
    } catch(err) {
        res.status(400).send();
    }
});

app.post('/alterarAgendamentos/:id', async (req, res) => {
    try {
        const { horario, convenio_medico, motivo_consulta, id_paciente, id_medico, data } = req.body;
        console.log(req.body);
        await query.alterarAgendamentos(req.params.id, horario, convenio_medico, motivo_consulta, id_paciente, id_medico, data);
        res.send('Sucesso');
    } catch(err) {
        console.log(err);
        res.status(400).send();
    }
});

// Rota para a página inicial
app.get('/', (req, res) => {
    res.redirect('view/tela1-profissionais/index.html');
});
app.get('view/tela1-profissionais/index.html', (req, res) => {
    res.sendFile(__dirname + 'view/tela1-profissionais/index.html');
});

// serve os arquivos, com imagens, css e etc..
app.get('/view/:folder/:file', (req, res) => {
    res.sendFile(__dirname + `/view/${req.params.folder}/${req.params.file}`)
});

// Rota POST para criar uma conta de usuário
app.post('/usuarios/criar-conta', async (req, res) => {
    try {
        const { cargo, nome_completo, data_nascimento, idade, endereco_completo, telefone, email, username, senha } = req.body;
        if (await query.criarUsuario(cargo, nome_completo, data_nascimento, idade, endereco_completo, telefone, email, username, senha) == 1){
            res.status(200).send("Conta criada com sucesso!");
            res.send ();
        }else{
            res.status(500).send("Erro ao criar conta! Usuário já existe");
        }
    } catch(error) {
        res.status(500).send("Erro interno ao criar conta!");
    }
});

app.post('/marcarHorario', async (req, res) => {
    try {
        const {id_medico, horario} = req.body;

        await query.limparHorarios(id_medico);

        console.log(horario);

        for(dia of horario) {
            await query.marcarHorario(id_medico, dia.data, dia.horario);
        }

        await query.atualizarAgendas(id_medico);

        return res.send("Horarios marcados com sucesso");
    } catch(err) {
        return res.status(400).send("Algum erro ocorreu");
    }
});

app.get('/listarHorarios/:id', async (req, res) => {
    try {
      const id_medico = req.params.id;
      const horarios = await query.listarHorarios(id_medico);
      console.log(horarios);
      return res.send(horarios);
    } catch(err) {
        return res.status(400).send("Algum erro ocorreu");
    }
});

app.get('/listarTodosHorarios/:id', async (req, res) => {
    try {
      const id_medico = req.params.id;
      console.log('iniciou');
      const horarios = await query.listarTodosHorarios(id_medico);
      console.log('terminou');
      return res.send(horarios);
    } catch(err) {
        return res.status(400).send("Algum erro ocorreu");
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, senha } = req.body;
        const usuario = await query.validarLogin(username, senha);
        if (usuario) {
            const data = {
            type: 0,
            ...usuario,
            message: '/view/tela1-profissionais/index.html',
            result: 1,
            };
            return res.json(data);
        }

        const medico = await query.validarMedico(username, senha);

        if(medico) {
            const data = {
            type: 1,
            ...medico,
            message: '/view/tela7-horarios/index.html',
            result: 1,
            };
            return res.json(data);
        } else {
            const data = {
            message: 'Usuário ou senha incorreta',
            result: 0,
            };
            return res.json(data);
        }
    } catch (error) {
        res.status(400).json({ message: 'Erro ao processar a solicitação' });
    }
});

var upload = multer({ dest: './tmp/'});

// File input field name is simply 'file'
app.post('/upload', upload.single('foto'), function(req, res) {

  const { nome } = req.body;

  var file =  '../fotos/' + nome;

  console.log(`File: ${req.file}`)
  fs.rename(req.file.src, file, function(err) {
    if (err) {
      console.log(err);
      res.send(500);
    } else {
      res.json({
        message: 'File uploaded successfully',
        filename: req.file.src
      });
    }
  });
});

// Iniciar o servidor
app.listen(3011, () => {
    console.log('Servidor iniciado na porta 3011');
});