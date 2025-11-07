
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('project-ideia', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false,
    define: {
        timestamps: true,
        underscored: true,
    }
})

async function testConnection() {
    try {
        await sequelize.authenticate()
        console.log('Conexão estabelecida com sucesso!')
    } catch (error) {
        console.error('Erro ao conectar com o banco:', error)
    }
}

testConnection()

module.exports = sequelize
