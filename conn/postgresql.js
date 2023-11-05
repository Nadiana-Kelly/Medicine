const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'medicine',
  password: 'postgres',
  port: 5432 // porta padrão do PostgreSQL
});

module.exports = pool;