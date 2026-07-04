import jwt from 'jsonwebtoken';
import { Admin_User, Soc_User } from './models.js';

const SECRET_KEY = "dev-secret-key"; 

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ msg: 'Access Denied. No token provided.' });
  }

  jwt.verify(token, SECRET_KEY, async (err, decodedPayload) => {
    if (err) {
      return res.status(403).json({ msg: 'Session expired or invalid token.' });
    }

    try {
      const { id, role } = decodedPayload;
      const UserModel = role === 'Admin' ? Admin_User : Soc_User;
      
      const userStillExists = await UserModel.findById(id);
      
      if (!userStillExists) {
        return res.status(401).json({ msg: 'Account no longer exists. Please log in again.' });
      }

      req.user = decodedPayload; 
      next(); 
      
    }
    catch (dbError) {
      return res.status(500).json({ msg: 'Server error while verifying user account.' });
    }
  });
};