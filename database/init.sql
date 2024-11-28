CREATE TABLE Lot(
   name VARCHAR(50),
   PRIMARY KEY(name)
);

CREATE TABLE Grave(
   ID SMALLINT,
   state BYTE,
   name VARCHAR(50) NOT NULL,
   PRIMARY KEY(ID),
   FOREIGN KEY(name) REFERENCES Lot(name)
);

CREATE TABLE Dead(
   ID COUNTER,
   firstname VARCHAR(50),
   lastname VARCHAR(50) NOT NULL,
   entryDate VARCHAR(7),
   GraveID SMALLINT NOT NULL,
   PRIMARY KEY(ID),
   FOREIGN KEY(GraveID) REFERENCES Grave(ID)
);