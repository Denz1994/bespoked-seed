const dpConnector = require('./dbConnector');
const {faker} = require('@faker-js/faker');

ROWS = 10;

const seedProducts = async() => {
    for(let i = 0; i < ROWS*5; i++){
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
    } catch (err) {
        console.error(err.message);
    }
}

const seedSalespersons = async() => {
    for(let i = 0; i < ROWS; i++){
        firstName = faker.name.firstName();
        lastName = faker.name.lastName();
        address = faker.address.streetAddress();
        phone = faker.phone.number('###-###-####');         
        startDate = faker.date.between('2013-03-01T00:00:00.000Z','2023-01-26T00:00:00.000Z').toISOString().split('T')[0];
        terminationDate = faker.date.between(startDate,'2023-01-26T00:00:00.000Z').toISOString().split('T')[0];
        manager = faker.name.fullName();

        await dpConnector.query(`
        INSERT INTO Salespersons (
            First_Name,
            Last_Name,
            Address,
            Phone,
            Start_Date,
            Termination_Date,
            Manager
        )
        VALUES (
            "${firstName}",
            "${lastName}",
            "${address}",
            "${phone}",
            "${startDate}",
            "${terminationDate}",
            "${manager}"
        );
        `);
    }
}

const seedSalespersonsTable = async() =>{    
    try {
        const dropTableQuery = `DROP TABLE IF EXISTS Salespersons`;
        const createTableQuery = `CREATE TABLE Salespersons (
            ID INT UNIQUE PRIMARY KEY AUTO_INCREMENT,
            First_Name TEXT,
            Last_Name TEXT,
            Address TEXT,
            Phone TEXT,
            Start_Date DATE,
            Termination_Date DATE,
            Manager TEXT
            )`;
        await dpConnector.query(dropTableQuery);
        await dpConnector.query(createTableQuery);
        
    } catch (err) {
        console.error(err.message);
    }
}

const seedCustomers = async() => {
    for(let i = 0; i < ROWS*50; i++){
        firstName = faker.name.firstName();
        lastName = faker.name.lastName();
        address = faker.address.streetAddress();
        phone = faker.phone.number('###-###-####');         
        startDate = faker.date.between('2013-03-01T00:00:00.000Z','2023-01-26T00:00:00.000Z').toISOString().split('T')[0];

        await dpConnector.query(`
        INSERT INTO Customers (
            First_Name,
            Last_Name,
            Address,
            Phone,
            Start_Date
        )
        VALUES (
            "${firstName}",
            "${lastName}",
            "${address}",
            "${phone}",
            "${startDate}"
        );
        `);
    }
}

const seedCustomersTable = async() =>{    
    try {
        const dropTableQuery = `DROP TABLE IF EXISTS Customers`;
        const createTableQuery = `CREATE TABLE Customers (
            ID INT UNIQUE PRIMARY KEY AUTO_INCREMENT,
            First_Name TEXT,
            Last_Name TEXT,
            Address TEXT,
            Phone TEXT,
            Start_Date DATE
            )`;
        await dpConnector.query(dropTableQuery);
        await dpConnector.query(createTableQuery);
        
    } catch (err) {
        console.error(err.message);
    }
}

const fillSales = async() => {
    // for(let i = 0; i < ROWS; i++){

        await dpConnector.query(`INSERT INTO Sales (Product) SELECT ID From Products;`);
        await dpConnector.query(`INSERT INTO Sales (Salesperson) SELECT ID From Salespersons;`);
        await dpConnector.query(`INSERT INTO Sales (Customer) SELECT ID From Customers;`);
    // }
}

const buildSalesTable = async() =>{    
    try {
        const dropTableQuery = `DROP TABLE IF EXISTS Sales`;
        const createTableQuery = `CREATE TABLE Sales(
            ID INT UNIQUE PRIMARY KEY AUTO_INCREMENT,
            Product TEXT NOT NULL REFERENCES Products(ID) ON DELETE CASCADE ON UPDATE CASCADE,
            Salesperson TEXT NOT NULL REFERENCES Salespersons(ID) ON DELETE CASCADE ON UPDATE CASCADE,
            Customer TEXT NOT NULL REFERENCES Customers(ID) ON DELETE CASCADE ON UPDATE CASCADE
            )`;
        await dpConnector.query(dropTableQuery);
        await dpConnector.query(createTableQuery);
        
    } catch (err) {
        console.error(err.message);
    }
}


const fillTables= async()=>{
    try{
        console.log('Seeding DB Tables...')
        await seedProducts();
        await seedSalespersons();
        await seedCustomers();
        // await fillSales();

        console.log('Seeded DB Tables...')
    }
    catch(err){
        console.error(err.message)
    }
}
const buildAllTables = async()=>{
    console.log('Building DB Tables...');
    await seedProductsTable();
    await seedSalespersonsTable();
    await seedCustomersTable();
    await buildSalesTable();
    console.log('Built DB Tables...');
}

const startSeed = async()=>{
    await buildAllTables();
    await fillTables();
    
}
module.exports = {startSeed};