const { validarMedico, 
        criarUsuario, 
        pool, 
        removerAgendamentos,
        criarAgendamento,
        listarMedicos
} = require('./db');

describe('Validar medico', () => {
    test('Testando se a função de validar médico está OK', async () => {
        const medico = {
            id: 2,
            nome: 'Cristina Yang2',
            area_medica: 'Cirurgiã cardiovascular',
            descricao: 'Eu sou Cristina Yang, cirurgiã cardiovascular dedicada. Com habilidades excepcionais e foco implacável, enfrento desafios médicos com determinação, buscando inovação e sucesso na sala de cirurgia.',
            username: 'yang',
            senha: '123',
            foto: '../fotos/b391c39e-f9bb-41da-926d-6a2646b81b58.jpg',
            preco: '180.00000'
        };

        expect((await validarMedico('yang', '123'))).toEqual(medico);
    }),
    test('Testando se a função de validar médico está OK', async () => {
        expect((await validarMedico('joao', '123'))).toBeFalsy();
    })
});

describe('Criar um usuário', () => {
    beforeEach(async () => {
        var client = await pool.connect();
        await client.query(`DELETE FROM usuarios_registrados WHERE username = $1`, ['patolino']);
    });

    afterEach(async () => {
        var client = await pool.connect();
        await client.query(`DELETE FROM usuarios_registrados WHERE username = $1`, ['patolino']);
    });

    test('Testando se a criação de usuário está OK', async () => {
        expect((await criarUsuario( 0, 'joao da silva', '1996-11-17', 27, 
                                    'patassauro 431', '85986932205',
                                    'patolino@gmail.com', 'patolino', '123' ))).toBe(1);
    },)
});

describe('Criar agendamento', () => {
    beforeAll(async () => {
        var client = await pool.connect();
        const record = await client.query(`SELECT (id) FROM agendamento WHERE data = $1 and id_medico = $2 and id_paciente = $3`, ['20/11', 2, 1]);
        await removerAgendamentos(record.rows[0].id);
    });

    afterAll(async () => {
        var client = await pool.connect();
        const record = await client.query(`SELECT (id) FROM agendamento WHERE data = $1 and id_medico = $2 and id_paciente = $3`, ['20/11', 2, 1]);
        await removerAgendamentos(record.rows[0].id);
    });

    test('Testando se a criação de agendamento está OK', async () => {
        expect(await criarAgendamento(  'Cristina Yang2', '08:00:00', 'SUS',
                                        'Dor de cabeça', 1, 2, "20/11")).toBe(1);
    },)
});

describe('Listar médicos', () => {
    test('Testando se a listagem de médicos está OK', async () => {
        const medico = {
            id: 2,
            nome: 'Cristina Yang2',
            area_medica: 'Cirurgiã cardiovascular',
            descricao: 'Eu sou Cristina Yang, cirurgiã cardiovascular dedicada. Com habilidades excepcionais e foco implacável, enfrento desafios médicos com determinação, buscando inovação e sucesso na sala de cirurgia.',
            username: 'yang',
            senha: '123',
            foto: '../fotos/b391c39e-f9bb-41da-926d-6a2646b81b58.jpg',
            preco: '180.00000'
        };

        expect(await listarMedicos()).toContainEqual(medico);
    },)
});