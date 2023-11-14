const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123',
  port: 5437 // porta padrão do PostgreSQL
});

module.exports = pool;