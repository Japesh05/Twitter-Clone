const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "freddit",
    password: "8680japesh",
    port: 5432
})

module.exports = pool;
