import { Request, Response } from 'express';
import pool from '../config/database';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Primeiro tenta encontrar o usuário na tabela patients
    const patientResult = await pool
      .request()
      .input('email', email)
      .query('SELECT id, email, password, name, active FROM patients WHERE email = @email');

    if (patientResult.recordset.length > 0) {
      const user = patientResult.recordset[0];

      // Verifica se o usuário está ativo
      if (user.active === 0) {
        return res.status(403).json({ message: 'SEU USUÁRIO NÃO É CAPAZ DE REALIZAR O LOGIN, CONTATE O SUPORTE' });
      }

      if (user.password !== password) {
        return res.status(401).json({ message: 'Senha incorreta' });
      }

      return res.status(200).json({
        message: 'Login realizado com sucesso!',
        user: { id: user.id, email: user.email, name: user.name },
        userType: 'patient',
      });
    }

    // Se não for paciente, tenta na tabela agents
    const agentResult = await pool
      .request()
      .input('email', email)
      .query('SELECT id, email, password, agent_type, active FROM agents WHERE email = @email');

    if (agentResult.recordset.length === 0) {
      return res.status(401).json({ message: 'Email não encontrado' });
    }

    const agent = agentResult.recordset[0];

    // Verifica se o agente está ativo
    if (agent.active === 0) {
      return res.status(403).json({ message: 'SEU USUÁRIO NÃO É CAPAZ DE REALIZAR O LOGIN, CONTATE O SUPORTE' });
    }

    if (agent.password !== password) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // Normaliza o userType para a interface frontend
    let userType = agent.agent_type ? String(agent.agent_type).toLowerCase() : 'agent';

    // Mantém compatibilidade com o frontend que usa 'medic'
    if (userType === 'medic') {
      userType = 'medic';
    }

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: { id: agent.id, email: agent.email, agent_type: agent.agent_type },
      userType,
    });

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
      .query('SELECT * FROM patients WHERE email = @email');

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