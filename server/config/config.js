module.exports = {
  development: {
    username: 'postgres',
    password: 'qwertyui',
    database: 'work-order-manufacturing-development',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: 'postgres',
    password: 'qwertyui',
    database: 'work-order-manufacturing-test',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    uri: process.env.PROD_DATABASE_URL,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
      },
    },
  },
};
