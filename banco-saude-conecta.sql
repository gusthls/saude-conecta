CREATE DATABASE ClinicDB;
GO

USE ClinicDB;
GO

/* TABELA STATUS */
CREATE TABLE status (
    status_id INT PRIMARY KEY,
    status_name VARCHAR(10) NOT NULL
);
INSERT INTO status (status_id, status_name) VALUES
(1, 'Ativo'),
(0, 'Inativo');


/* TABELA CLIENTES */
CREATE TABLE clients (
    client_id INT IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(100) NOT NULL,
    rc VARCHAR(20) UNIQUE NOT NULL,
    status_id INT NOT NULL,

    FOREIGN KEY (status_id) REFERENCES status(status_id)
);


/* TABELA MEDICOS */
CREATE TABLE medics (
    medic_id INT IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(100) NOT NULL,
    rm VARCHAR(20) UNIQUE NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    status_id INT NOT NULL,

    FOREIGN KEY (status_id) REFERENCES status(status_id)
);



/* TABELA SECRETARIO */
CREATE TABLE secretaries (
    secretary_id INT IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(100) NOT NULL,
    rs VARCHAR(20) UNIQUE NOT NULL,
    status_id INT NOT NULL,

    FOREIGN KEY (status_id) REFERENCES status(status_id)
);


/* TABELA STATUS */
CREATE TABLE admins (
    admin_id INT IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(100) NOT NULL,
    ra VARCHAR(20) UNIQUE NOT NULL,
    status_id INT NOT NULL,

    FOREIGN KEY (status_id) REFERENCES status(status_id)
);


/* TABELA CONSULTAS AGENDADAS */
CREATE TABLE scheduled_appointments (
    appointment_id INT IDENTITY PRIMARY KEY,
    client_id INT NOT NULL,
    medic_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status_id INT NOT NULL,

    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (medic_id) REFERENCES medics(medic_id),
    FOREIGN KEY (status_id) REFERENCES status(status_id)
);


/* TABELA CONSULTAS CONCLUÍDAS */
CREATE TABLE completed_appointments (
    appointment_id INT IDENTITY PRIMARY KEY,
    client_id INT NOT NULL,
    medic_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    notes VARCHAR(255),
    status_id INT NOT NULL,

    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (medic_id) REFERENCES medics(medic_id),
    FOREIGN KEY (status_id) REFERENCES status(status_id)
);

GO
/* PROCEDURE CADASTRO CLIENTE */
CREATE PROCEDURE sp_insert_client
    @name VARCHAR(100),
    @cpf VARCHAR(14),
    @email VARCHAR(100),
    @phone VARCHAR(20),
    @password VARCHAR(100),
    @rc VARCHAR(20),
    @status_id INT
AS
BEGIN
    INSERT INTO clients (name, cpf, email, phone, password, rc, status_id)
    VALUES (@name, @cpf, @email, @phone, @password, @rc, @status_id);
END;
GO

/* PROCEDURE CRIAÇÃO MÉDICO */
CREATE PROCEDURE sp_insert_medic
    @name VARCHAR(100),
    @cpf VARCHAR(14),
    @email VARCHAR(100),
    @phone VARCHAR(20),
    @password VARCHAR(100),
    @rm VARCHAR(20),
    @specialty VARCHAR(100),
    @status_id INT
AS
BEGIN
    INSERT INTO medics (name, cpf, email, phone, password, rm, specialty, status_id)
    VALUES (@name, @cpf, @email, @phone, @password, @rm, @specialty, @status_id);
END;
GO

/* PROCEDURE CRIAÇÃO SECRETÁRIO */
CREATE PROCEDURE sp_insert_secretary
    @name VARCHAR(100),
    @cpf VARCHAR(14),
    @email VARCHAR(100),
    @phone VARCHAR(20),
    @password VARCHAR(100),
    @rs VARCHAR(20),
    @status_id INT
AS
BEGIN
    INSERT INTO secretaries (name, cpf, email, phone, password, rs, status_id)
    VALUES (@name, @cpf, @email, @phone, @password, @rs, @status_id);
END;
GO

/* PROCEDURE CRIAÇÃO DE ADMIN */
CREATE PROCEDURE sp_insert_admin
    @name VARCHAR(100),
    @cpf VARCHAR(14),
    @email VARCHAR(100),
    @phone VARCHAR(20),
    @password VARCHAR(100),
    @ra VARCHAR(20),
    @status_id INT
AS
BEGIN
    INSERT INTO admins (name, cpf, email, phone, password, ra, status_id)
    VALUES (@name, @cpf, @email, @phone, @password, @ra, @status_id);
END;
GO


/* CRIAÇÃO DE CONSULTA AGENDADA */
CREATE PROCEDURE sp_schedule_appointment
    @client_id INT,
    @medic_id INT,
    @appointment_date DATE,
    @appointment_time TIME,
    @status_id INT
AS
BEGIN
    INSERT INTO scheduled_appointments 
    (client_id, medic_id, appointment_date, appointment_time, status_id)
    VALUES 
    (@client_id, @medic_id, @appointment_date, @appointment_time, @status_id);
END;
GO

/* CRIAÇÃO DE CONSULTA CONCLUÍDA */
CREATE PROCEDURE sp_complete_appointment
    @client_id INT,
    @medic_id INT,
    @appointment_date DATE,
    @appointment_time TIME,
    @notes VARCHAR(255),
    @status_id INT
AS
BEGIN
    INSERT INTO completed_appointments 
    (client_id, medic_id, appointment_date, appointment_time, notes, status_id)
    VALUES 
    (@client_id, @medic_id, @appointment_date, @appointment_time, @notes, @status_id);
END;
GO