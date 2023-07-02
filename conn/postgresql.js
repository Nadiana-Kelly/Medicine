const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'teste',
  password: '123',
  port: 5432 // porta padrão do PostgreSQL
  // port: 5432 //great
});

module.exports = pool;