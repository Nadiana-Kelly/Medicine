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

const criarAgendamento = async function(nome_medico, data_consulta, horario, convenio_medico, motivo_consulta) {
    try {
        var client = await pool.connect();
        await client.query(`INSERT INTO agendamento (nome_medico, data_consulta, horario, convenio_medico, motivo_consulta) VALUES ('${nome_medico}', '${data_consulta}', '${horario}', '${convenio_medico}', '${motivo_consulta}')`);
        client.release();
        return 1;
    } catch(err) {
        return 0;
    }
};

const validarLogin = async function(username, senha){
    try {
        var client = await pool.connect();
        var resultado = await client.query(`SELECT username, senha FROM usuarios_registrados WHERE username = '${username}' and senha = '${senha}')`);
        client.release();
        return 1;
    } catch(err) {
        return 0;
    }
};

module.exports = {criarMedico, criarUsuario, criarAgendamento, validarLogin};

