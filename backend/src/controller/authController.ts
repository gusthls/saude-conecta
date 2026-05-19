import { Request, Response } from 'express';
import pool from '../config/database';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await pool
      .request()
      .input('email', email)
      .query('SELECT password FROM clients WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Email não encontrado' });
    }

    const user = result.recordset[0];

    if (user.password !== password) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }
    return res.status(200).json({ message: 'Login realizado com sucesso!' });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};