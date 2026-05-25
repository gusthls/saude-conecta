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

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email é obrigatório' });
  }

  try {
    const result = await pool
      .request()
      .input('email', email)
      .query('SELECT * FROM clients WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Email não encontrado' });
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`[RECUPERAÇÃO DE SENHA] Email: ${email} | Token: ${token}`);

    return res.status(200).json({ message: 'Token gerado com sucesso' });

  } catch (error) {
    console.error('Erro na recuperação de senha:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};