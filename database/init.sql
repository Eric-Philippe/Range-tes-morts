CREATE TABLE Lot(
   name VARCHAR(50),
   PRIMARY KEY(name)
);

CREATE TABLE Grave(
   Id_Grave SMALLINT,
   state BYTE,
   name VARCHAR(50) NOT NULL,
   PRIMARY KEY(Id_Grave),
   FOREIGN KEY(name) REFERENCES Lot(name)
);

CREATE TABLE Dead(
   Id_Dead COUNTER,
   firstname VARCHAR(50),
   lastname VARCHAR(50) NOT NULL,
   entryDate VARCHAR(7),
   Id_Grave SMALLINT NOT NULL,
   PRIMARY KEY(Id_Dead),
   FOREIGN KEY(Id_Grave) REFERENCES Grave(Id_Grave)
);
