-- Création de la base de données
CREATE DATABASE cemetery;
USE cemetery;

-- Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Table des lots
CREATE TABLE lots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Table des états des tombes
-- Note : Utilisation d'un ENUM pour correspondre à l'enum GraveState en Go
CREATE TABLE graves (
    id VARCHAR(255) PRIMARY KEY,
    identifier VARCHAR(3) NOT NULL,
    state ENUM('EMPTY', 'RESERVED', 'PERPETUAL', 'FIFTEEN', 'THIRTY', 'FIFTY') NOT NULL,
    lot_id INT NOT NULL,
    FOREIGN KEY (lot_id) REFERENCES lots(id) ON DELETE CASCADE
);

-- Table des défunts
CREATE TABLE deads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    entrydate DATE NOT NULL,
    grave_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (grave_id) REFERENCES graves(id) ON DELETE CASCADE
);
