const dpConnector = require('./dbConnector');
const {faker} = require('@faker-js/faker');

ROWS = 10;

const seedProducts = async() => {
    for(i = 0; i < ROWS; i++){
        manufacturer = faker.company.name();
        productName = faker.commerce.product();

        maxPurchase = 10000;
        purchasePrice = faker.datatype.float({min:10, max:maxPurchase, percision:2});
        salesPrice = faker.datatype.float({min:purchasePrice, max:maxPurchase*2, percision:2});
        qtyOnHand = faker.datatype.number({min:1, max: 100});
        commissionPercentage = faker.datatype.number({min:1, max:30, precision:1}) * .01;
        
        await dpConnector.query(`
        INSERT INTO Products (
            Manufacturer,
            Product_Name,
            Purchase_Price,
            Sale_Price,
            Qty_On_Hand,
            Commission_Percentage
        )
        VALUES (
            "${manufacturer}",
            "${productName}",
            "${purchasePrice}",
            "${salesPrice}",
            "${qtyOnHand}",
            "${commissionPercentage}"
        );
        `);
    }
}

const seedProductsTable = async() =>{    
    try {
        const dropTableQuery = `DROP TABLE IF EXISTS Products`;
        const createTableQuery = `CREATE TABLE Products (
            ID INT UNIQUE PRIMARY KEY AUTO_INCREMENT,
            Manufacturer TEXT,
            Product_Name TEXT,
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