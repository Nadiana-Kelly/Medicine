const pool = require('../conn/postgresql');

const criarMedico = async function(nome, area_medica, descricao, username, senha) {
    try {
        var client = await pool.connect();
        await client.query(`INSERT INTO medicos (nome, area_medica, descricao, username, senha) VALUES ('${nome}', '${area_medica}', '${descricao}', '${username}', '${senha}')`);
        client.release();
        return 1;
    } catch(err) {
        return 0;
    }
};

const criarUsuario = async function(cargo, nome_completo, data_nascimento, idade, endereco_completo, telefone, email, username, senha) {
    try {
        var client = await pool.connect();
        await client.query(`INSERT INTO usuarios_registrados (cargo, nome_completo, data_nascimento, idade, endereco_completo, telefone, email, username, senha) VALUES ('${cargo}', '${nome_completo}', '${data_nascimento}', '${idade}', '${endereco_completo}', '${telefone}', '${email}', '${username}', '${senha}')`);
        client.release();
        return 1;
    } catch(err) {
        return 0;
    }
};

const criarAgendamento = async function(nome_medico, data_consulta, horario, convenio_medico, motivo_consulta, id_paciente) {
    try {
        var client = await pool.connect();
        await client.query(`INSERT INTO agendamento (nome_medico, data_consulta, horario, convenio_medico, motivo_consulta, id_paciente) VALUES ('${nome_medico}', '${data_consulta}', '${horario}', '${convenio_medico}', '${motivo_consulta}', '${id_paciente}')`);
        client.release();
        return 1;
    } catch(err) {
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
      console.log(id_paciente)
      const client = await pool.connect();
      const resultado = await client.query(`SELECT * FROM agendamento WHERE id_paciente = $1`, [id_paciente]);
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
  

module.exports = {criarMedico, criarUsuario, criarAgendamento, validarLogin, listarAgendamentos, removerAgendamentos};

