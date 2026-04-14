/* EXEMPLOS DE INSERÇÃO POR PROCEDURE */

/* Inserção de cliente */
EXEC sp_insert_client 
'Gabriel Silva', '123.456.789-00', 'gabriel@email.com',
'11999999999', '123456', 'RC001', 1;

/* Inserção de Médico */
'Dr. Carlos Mendes', '222.333.444-55', 'carlos@email.com',
'11966666666', '123456', 'RM001', 'Cardiology', 1;

/* Inserção de Secretário */
EXEC sp_insert_secretary 
'Fernanda Alves', '555.666.777-88', 'fernanda@email.com',
'11933333333', '123456', 'RS001', 1;

/* Inserção de Admin */
EXEC sp_insert_admin 
'Admin Master', '777.888.999-00', 'admin@email.com',
'11911111111', '123456', 'RA001', 1;

/* Inserção de consulta (appointment) agendada */
EXEC sp_schedule_appointment 
1, 1, '2026-05-10', '14:00', 1;

/* Inserção de consulta concluída */
EXEC sp_complete_appointment 
1, 1, '2026-04-01', '15:00', 'Routine check-up OK', 1;