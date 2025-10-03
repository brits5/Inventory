CREATE DATABASE InventoryDB;
GO

USE InventoryDB;
GO

CREATE TABLE Products (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(500),
    Category NVARCHAR(100) NOT NULL,
    ImageUrl NVARCHAR(500),
    Price DECIMAL(18,2) NOT NULL,
    Stock INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);
GO

CREATE TABLE Transactions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Date DATETIME2 NOT NULL DEFAULT GETDATE(),
    Type NVARCHAR(50) NOT NULL CHECK (Type IN ('compra', 'venta')),
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    TotalPrice DECIMAL(18,2) NOT NULL,
    Details NVARCHAR(500),
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);
GO

CREATE INDEX IX_Transactions_ProductId ON Transactions(ProductId);
CREATE INDEX IX_Transactions_Date ON Transactions(Date);
CREATE INDEX IX_Transactions_Type ON Transactions(Type);
GO