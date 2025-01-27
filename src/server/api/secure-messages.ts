import { Request, Response } from 'express';
import { getDatabase } from '@/server/database';

export async function createSecureMessage(req: Request, res: Response) {
  try {
    const { encrypted_content, access_token, is_password } = req.body;
    const db = await getDatabase();

    // Insert the new secure message
    const result = await db.query(
      `INSERT INTO secure_messages (encrypted_content, access_token, is_password, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id`,
      [encrypted_content, access_token, is_password]
    );

    res.status(201).json({ 
      success: true, 
      id: result.rows[0].id,
      access_token 
    });
  } catch (error) {
    console.error('Error creating secure message:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to store secure message' 
    });
  }
}

export async function getSecureMessage(req: Request, res: Response) {
  try {
    const { token } = req.params;
    const db = await getDatabase();

    // Get the message and delete it in a transaction
    await db.query('BEGIN');

    const result = await db.query(
      `DELETE FROM secure_messages 
       WHERE access_token = $1 
       RETURNING encrypted_content, is_password`,
      [token]
    );

    await db.query('COMMIT');

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Message not found or already viewed' 
      });
    }

    res.json({ 
      success: true, 
      encrypted_content: result.rows[0].encrypted_content,
      is_password: result.rows[0].is_password 
    });
  } catch (error) {
    console.error('Error retrieving secure message:', error);
    await db.query('ROLLBACK');
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve secure message' 
    });
  }
}