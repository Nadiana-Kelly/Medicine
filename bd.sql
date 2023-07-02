-- -- Database: medicine

-- -- DROP DATABASE IF EXISTS medicine;

-- -- CREATE DATABASE medicine
-- --     WITH
-- --     OWNER = postgres
-- --     ENCODING = 'UTF8'
-- --     LC_COLLATE = 'Portuguese_Brazil.1252'
-- --     LC_CTYPE = 'Portuguese_Brazil.1252'
-- --     TABLESPACE = pg_default
-- --     CONNECTION LIMIT = -1
-- --     IS_TEMPLATE = False;
	
-- CREATE TABLE usuarios_registrados (
-- 	ID SERIAL PRIMARY KEY,
-- 	cargo INTEGER DEFAULT 0,
-- 	nome_completo VARCHAR(100),
-- 	data_nascimento DATE,
-- 	idade INTEGER,
-- 	endereco_completo VARCHAR(200),
-- 	telefone VARCHAR(20),
-- 	email VARCHAR(100),
-- 	username VARCHAR(50) UNIQUE,
-- 	senha VARCHAR(50)
-- );

-- CREATE TABLE agendamento (
--    ID SERIAL PRIMARY KEY,
--    nome_medico VARCHAR(100),
--    data_consulta DATE,
--    horario TIME,
--    convenio_medico VARCHAR(100),
--    motivo_consulta VARCHAR(300),
--    id_paciente INTEGER,
--    id_medico INTEGER,
--    diasemana VARCHAR(20)
-- );

-- CREATE TABLE horarios(
-- 	ID SERIAL PRIMARY KEY,
-- 	id_medico INTEGER,
-- 	diaSemana VARCHAR(20),
-- 	horario TIME
-- );

-- CREATE TABLE medicos (
--  ID SERIAL PRIMARY KEY,
-- 	nome VARCHAR(100),
-- 	area_medica VARCHAR(100),
-- 	descricao VARCHAR(200),
-- 	username VARCHAR(50) UNIQUE,
-- 	senha VARCHAR(50),
-- 	foto VARCHAR(200)
-- );
