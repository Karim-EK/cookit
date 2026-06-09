-- Cancellazione del database se già esistente per evitare conflitti di sovrascrittura
DROP DATABASE IF EXISTS COOKIT;
CREATE DATABASE COOKIT;
USE COOKIT;

-- 1. TABELLA UTENTI
CREATE TABLE UTENTI (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Cognome VARCHAR(100) NOT NULL,
    Data_Nascita DATE NOT NULL,
    Immagine_Profilo LONGTEXT, 
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Data_Iscrizione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELLA PONTE: FOLLOWERS (Relazione Molti-a-Molti tra Utenti)
CREATE TABLE FOLLOWERS (
    Follower_Id INT NOT NULL,  -- L'utente che segue
    Followed_Id INT NOT NULL,  -- L'utente seguito
    Data_Seguito TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Follower_Id, Followed_Id),
    FOREIGN KEY (Follower_Id) REFERENCES UTENTI(Id) ON DELETE CASCADE,
    FOREIGN KEY (Followed_Id) REFERENCES UTENTI(Id) ON DELETE CASCADE
);

-- 3. TABELLA RICETTE
CREATE TABLE RICETTE (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Utente_Id INT NOT NULL,
    Nome VARCHAR(255) NOT NULL,
    Difficolta ENUM('facile', 'medio', 'difficile') NOT NULL,
    Tempo_Preparazione INT NOT NULL, -- Espresso in minuti interi
    Immagine LONGTEXT,               -- Supporta stringhe Base64 o percorsi URL lunghi
    Ingredienti JSON NOT NULL,       -- Struttura dati array [Nome, Qta, Unita]
    Preparazione TEXT NOT NULL,
    Data_Pubblicazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Utente_Id) REFERENCES UTENTI(Id) ON DELETE CASCADE
);

-- 4. TABELLA PONTE: LIKES (Relazione Molti-a-Molti tra Utenti e Ricette)
CREATE TABLE LIKES (
    Utente_Id INT NOT NULL,
    Ricetta_Id INT NOT NULL,
    Data_Like TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Utente_Id, Ricetta_Id),
    FOREIGN KEY (Utente_Id) REFERENCES UTENTI(Id) ON DELETE CASCADE,
    FOREIGN KEY (Ricetta_Id) REFERENCES RICETTE(Id) ON DELETE CASCADE
);

-- 5. TABELLA CARRELLI (Relazione 1-a-1 con Utenti per la lista della spesa persistente)
CREATE TABLE CARRELLI (
    Utente_Id INT PRIMARY KEY,
    Lista_Ingredienti JSON NOT NULL,  -- Lista della spesa salvata in formato strutturato JSON
    Ultimo_Aggiornamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Utente_Id) REFERENCES UTENTI(Id) ON DELETE CASCADE
);