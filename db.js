import mysql2 from 'mysql2/promise';

async function connect() {
    if (global.connection) {
        return global.connection;
    }

    const connection = await mysql2.createConnection("mysql://root:@localhost:3306/vune");
    console.log("Conectado ao SGBD MySQL");
    global.connection = connection;
    return connection;
}

export default connect
