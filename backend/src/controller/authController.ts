import { Request, Response } from 'express';
import pool from '../config/database';

// Map para armazenar tokens temporários: { email: { token, expiresAt } }
const passwordResetTokens = new Map<string, { token: string; expiresAt: number }>();

// Limpar tokens expirados a cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of passwordResetTokens.entries()) {
    if (data.expiresAt < now) {
      passwordResetTokens.delete(email);
    }
  }
}, 5 * 60 * 1000);

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

      // Verifica se o usuário está ativo (cobre 0, '0' e false)
      if (Number(user.active) === 0) {
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

    // Verifica se o agente está ativo (cobre 0, '0' e false)
    if (Number(agent.active) === 0) {
      return res.status(403).json({ message: 'SEU USUÁRIO NÃO É CAPAZ DE REALIZAR O LOGIN, CONTATE O SUPORTE' });
    }

    if (agent.password !== password) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // Normaliza o userType para a interface frontend
    // Se for admin, retorna 'admin', caso contrário considera como 'medic'
    let userType = 'medic';
    if (agent.agent_type && String(agent.agent_type).toLowerCase() === 'admin') {
      userType = 'admin';
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
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutos

    // Armazenar token temporariamente
    passwordResetTokens.set(email, { token, expiresAt });

    console.log(`[RECUPERAÇÃO DE SENHA] Email: ${email} | Token: ${token}`);

    return res.status(200).json({ 
      message: 'Token gerado com sucesso',
      email: email
    });

  } catch (error) {
    console.error('Erro na recuperação de senha:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const verifyResetToken = async (req: Request, res: Response) => {
  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(400).json({ message: 'Email e token são obrigatórios' });
  }

  try {
    const stored = passwordResetTokens.get(email);

    if (!stored) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }

    if (Date.now() > stored.expiresAt) {
      passwordResetTokens.delete(email);
      return res.status(400).json({ message: 'Token expirado' });
    }

    if (stored.token !== token) {
      return res.status(400).json({ message: 'Token incorreto' });
    }

    return res.status(200).json({ message: 'Token válido' });

  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({ message: 'Email, token e nova senha são obrigatórios' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' });
  }

  try {
    const stored = passwordResetTokens.get(email);

    if (!stored) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }

    if (Date.now() > stored.expiresAt) {
      passwordResetTokens.delete(email);
      return res.status(400).json({ message: 'Token expirado' });
    }

    if (stored.token !== token) {
      return res.status(400).json({ message: 'Token incorreto' });
    }

    // Atualizar senha no banco
    await pool.request()
      .input('email', email)
      .input('newPassword', newPassword)
      .query('UPDATE patients SET password = @newPassword, updated_at = GETDATE() WHERE email = @email');

    // Remover token após uso bem-sucedido
    passwordResetTokens.delete(email);

    return res.status(200).json({ message: 'Senha atualizada com sucesso' });

  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};