const dpConnector = require('./dbConnector');

ROWS = 10;

const seedProducts = async() => {
    for(i = 0; i < ROWS; i++){
        await dpConnector.query(`
        INSERT INTO Products (Manufacturer) VALUES ('Nestle')
        `);
    }
}

const seedProductsTable = async(req,res) =>{    
    try {
        const dropTableQuery = `DROP TABLE IF EXISTS Products`;
        const createTableQuery = `CREATE TABLE Products (
            ID INT UNIQUE PRIMARY KEY AUTO_INCREMENT,
            Manufacturer TEXT,
            Style TEXT,
            Purchase_Price FLOAT,
            Sale_Price FLOAT,
            Qty_On_Hand INT,
            Commission_Percentage FLOAT)`;
        await dpConnector.query(dropTableQuery);
        await dpConnector.query(createTableQuery);
        
        seedProducts();
        await dpConnector.query("SELECT * FROM Products");
        
    } catch (err) {
        console.error(err.message);
    }
}

seedProductsTable();
