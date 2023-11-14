const pool = require('../conn/postgresql');

const criarMedico = async function(nome, area_medica, descricao, username, senha, foto) {
    try {
        var client = await pool.connect();
        const result = await client.query('SELECT EXISTS (SELECT 1 FROM usuarios_registrados WHERE username = $1)', [username]);

        if(!result.rows[0].exists) {
            await client.query('INSERT INTO medicos (nome, area_medica, descricao, username, senha, foto) VALUES ($1, $2, $3, $4, $5, $6)', [nome, area_medica, descricao, username, senha, foto]);
            client.release();
            return 1;
        } else {
          client.release();
          return 0;
        }
    } catch(err) {
        return 0;
    }
};

const listarMedicos = async function () {
  try {
    const client = await pool.connect();
    const resultado = await client.query('SELECT * FROM medicos');
    client.release();
    return resultado.rows; // Retorna true se houver uma correspondência, caso contrário, retorna false.
  } catch (err) {
    console.error(err);
    return false;
  }
};

const editarMedico = async function (id, nome, descricao, foto) {
  try {
    const client = await pool.connect();
    const resultado = await client.query('UPDATE medicos SET nome = $1, descricao = $2, foto = $3 WHERE id = $4', [nome, descricao, foto, id]);
    client.release();
    return resultado.rows; // Retorna true se houver uma correspondência, caso contrário, retorna false.
  } catch (err) {
    console.error(err);
    return false;
  }
};

const perfilMedico = async function (id_medico) {
  try {
    const client = await pool.connect();
    const resultado = await client.query('SELECT * FROM medicos WHERE ID = $1', [id_medico]);
    client.release();
    return resultado.rows; // Retorna true se houver uma correspondência, caso contrário, retorna false.
  } catch (err) {
    console.error(err);
    return false;
  }
};

const validarMedico = async function(username, senha) {
    try {
        var client = await pool.connect();
        const res = await client.query(`SELECT * FROM medicos WHERE username = $1 AND senha = $2`, [username, senha]);
        client.release();
        return res.rows[0];
    } catch(err) {
        return false;
    }
}

const criarUsuario = async function(cargo, nome_completo, data_nascimento, idade, endereco_completo, telefone, email, username, senha) {
    try {
        var client = await pool.connect();
        const result = await client.query('SELECT EXISTS (SELECT 1 FROM medicos WHERE username = $1)', [username]);

        if(!result.rows[0].exists) {
          await client.query(`INSERT INTO usuarios_registrados (cargo, nome_completo, data_nascimento, idade, endereco_completo, telefone, email, username, senha) VALUES ('${cargo}', '${nome_completo}', '${data_nascimento}', '${idade}', '${endereco_completo}', '${telefone}', '${email}', '${username}', '${senha}')`);
          client.release();
          return 1;
        } else {
          client.release();
          return 0;
        }
    } catch(err) {
        return 0;
    }
};

const marcarHorario = async function(id_medico, data, horario) {
    try {
        var client = await pool.connect();
        await client.query(`INSERT INTO horarios (id_medico, data, horario) VALUES ($1, $2, $3)`, [id_medico, data, horario]);
        client.release();
        return 1;
    } catch(err) {
        return 0;
    }
}

const limparHorarios = async function(id_medico) {
  try {
      var client = await pool.connect();
      await client.query(`DELETE FROM horarios WHERE id_medico = $1`, [id_medico]);
      client.release();
      return 1;
  } catch(err) {
      return 0;
  }
}

const listarHorarios = async function(id_medico) {
    try {
        var client = await pool.connect();
        const horarios = await client.query(`SELECT * FROM horarios WHERE (horarios.horario, horarios.data) NOT IN (SELECT agendamento.horario, agendamento.data FROM agendamento WHERE id_medico = $1) AND id_medico = $1`, [id_medico]);
        client.release();
        return horarios.rows;
    } catch(err) {
        return [];
    }
}

const listarTodosHorarios = async function(id_medico) {
  try {
      var client = await pool.connect();
      const horarios = await client.query(`SELECT * FROM horarios WHERE id_medico = $1`, [id_medico]);
      client.release();
      return horarios.rows;
  } catch(err) {
      return false;
  }
}

const criarAgendamento = async function(nome_medico, horario, convenio_medico, motivo_consulta, id_paciente, id_medico, data) {
    try {
        var client = await pool.connect();
        const res = await client.query(`SELECT * FROM agendamento WHERE horario = $1 AND id_medico = $2 AND data = $3`, [horario, id_medico, data]);
        if(res.rowCount == 0) {
            await client.query(`SET datestyle = "ISO, DMY"; INSERT INTO agendamento (nome_medico, horario, convenio_medico, motivo_consulta, id_paciente, id_medico, data) VALUES ('${nome_medico}', '${horario}', '${convenio_medico}', '${motivo_consulta}', '${id_paciente}', '${id_medico}', '${data}')`);
            client.release();
            return 1;
        }

        return 0;
    } catch(err) {
        console.log('Error:', err);
        return 0;
    }
};

const alterarAgendamentos = async function(id_consulta, horario, convenio_medico, motivo_consulta, id_paciente, id_medico, data) {
  try {

      var client = await pool.connect();

      //var dados_consulta = await client.query(`SELECT * FROM agendamento WHERE id = ${id_consulta}`);      

      await client.query(`SET datestyle = "ISO, DMY"; UPDATE agendamento SET horario = '${horario}', convenio_medico = '${convenio_medico}', motivo_consulta = '${motivo_consulta}', data = '${data}' WHERE agendamento.id = '${id_consulta}'`);

      client.release();
      return 1;
  } catch(err) {
      console.log('Error:', err);
      return 0;
  }
};

const validarLogin = async function (username, senha) {
    try {
      const client = await pool.connect();
      const resultado = await client.query(`SELECT username, senha, id FROM usuarios_registrados WHERE username = $1 AND senha = $2`, [username, senha]);
      client.release();
      // console.log(resultado.rows)
      return resultado.rows[0]; // Retorna true se houver uma correspondência, caso contrário, retorna false.
    } catch (err) {
      console.error(err);
      return false;
    }
};

const listarAgendamentos = async function (id_paciente) {
    try {
      const client = await pool.connect();
      const resultado = await client.query(`SELECT * FROM agendamento WHERE id_paciente = $1`, [id_paciente]);
      client.release();
      return resultado.rows; // Retorna true se houver uma correspondência, caso contrário, retorna false.
    } catch (err) {
      console.error(err);
      return false;
    }
};

const listarAgendamentosMedico = async function (id_medico) {
  try {
    const client = await pool.connect();
    const resultado = await client.query(`SELECT horario, motivo_consulta, nome_completo
    FROM (SELECT * FROM agendamento JOIN usuarios_registrados ON usuarios_registrados.id = agendamento.id_paciente) AS subquery
    WHERE id_medico = $1;`, [id_medico]);
    // console.log(resultado.rows)
    //const resultado = await client.query(`SELECT * FROM agendamento WHERE id_medico = $1`, [id_medico]);
    client.release();
    return resultado.rows; // Retorna true se houver uma correspondência, caso contrário, retorna false.
  } catch (err) {
    console.error(err);
    return false;
  }
};

const removerAgendamentos = async function (id) {
  try {
    const client = await pool.connect();
    await client.query(`DELETE FROM agendamento WHERE id = $1`, [id]);
    client.release();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

async function atualizarAgendas(id_medico) {
  try {
      var client = await pool.connect();
      const res = await client.query(`SELECT * FROM agendamento WHERE id_medico = $1`, [id_medico]);

      for(data of res.rows) {
          const res2 = await client.query(`SELECT EXISTS (SELECT * FROM horarios WHERE data = $1 AND horario = $2 AND id_medico = $3)`, [data.data, data.horario, data.id_medico]);
          if(!res2.rows[0].exists) {
              await client.query(`DELETE from agendamento WHERE id = $1 AND data = $2 AND horario = $3`, [data.id, data.data, data.horario]);
          }
      }

      client.release();
  } catch(err) {
      console.log('error: ', err);
  }
}

module.exports = {
    criarMedico, 
    criarUsuario, 
    criarAgendamento, 
    validarLogin, 
    listarAgendamentos, 
    removerAgendamentos,
    alterarAgendamentos, 
    listarMedicos, 
    validarMedico,
    marcarHorario,
    limparHorarios,
    listarHorarios,
    listarAgendamentosMedico,
    atualizarAgendas,
    listarTodosHorarios,
    perfilMedico,
    editarMedico
};

