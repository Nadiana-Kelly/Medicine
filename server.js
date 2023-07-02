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

// rota para criar agedamento
app.post('/agendamento', async (req, res) => {
  const { nome_medico, data_consulta, horario, convenio_medico, motivo_consulta, id_paciente, id_medico, diasemana } = req.body;
  if( await query.criarAgendamento(nome_medico, data_consulta, horario, convenio_medico, motivo_consulta, id_paciente, id_medico, diasemana)) {
      res.send('Sucesso');
  } else {
      res.send('Falha ao criar agendamento');
  }
});

// rota para listar agendamento
app.get('/listarAgendamentos/:id', async (req, res) => {
    var agendamentos = await query.listarAgendamentos(req.params.id);
    res.send(agendamentos);
});

app.get('/listarAgendamentosMedico/:id', async (req, res) => {
    var agendamentos = await query.listarAgendamentosMedico(req.params.id);
    res.send(agendamentos);
});

app.delete('/removerAgendamentos/:id', async (req, res) => {
    try {
        await query.removerAgendamentos(req.params.id)
        res.send('Sucesso');
    } catch(err) {
      res.status(400).send();
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
app.post('/usuarios/criar-conta', async (req, res) => {
    try{
        const { cargo, nome_completo, data_nascimento, idade, endereco_completo, telefone, email, username, senha } = req.body;
        if(await query.criarUsuario(cargo, nome_completo, data_nascimento, idade, endereco_completo, telefone, email, username, senha)){
            res.send ("Conta criada com sucesso");
        }else{
            res.send("Erro ao criar conta");
        }
    } catch(error) {
        res.send("Algum erro ocorreu");
    }
});

app.post('/marcarHorario', async (req, res) => {
    try {
        const {id_medico, horario} = req.body;

        await query.limparHorarios(id_medico);

        for(dia of horario) {
            for(hora of dia) {
                if('diaSemana' in hora) {
                    await query.marcarHorario(id_medico, hora.diaSemana, hora.horario);
                }
            }
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
      return res.send(horarios);
    } catch(err) {
        return res.status(400).send("Algum erro ocorreu");
    }
});

app.get('/listarTodosHorarios/:id', async (req, res) => {
    try {
      const id_medico = req.params.id;
      const horarios = await query.listarTodosHorarios(id_medico);
      return res.send(horarios);
    } catch(err) {
        return res.status(400).send("Algum erro ocorreu");
    }
});

app.post('/login', async (req, res) => {
  const { username, senha } = req.body;

  try {
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


// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});