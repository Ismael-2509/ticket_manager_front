import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, role: Role) => boolean;
  logout: () => void;
  mockUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: User[] = [
  { id: '1', email: 'usuario@repara79.com', name: 'Juan Pérez', role: 'user' },
  { id: '2', email: 'admin@repara79.com', name: 'Lic. Laura Gómez', role: 'admin' },
  { id: '3', email: 'tec1@repara79.com', name: 'Ing. Carlos Mendoza', role: 'tech' },
  { id: '4', email: 'tec2@repara79.com', name: 'Mtro. Pedro Sánchez', role: 'tech' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Intentar recuperar sesión guardada en localStorage
    const saved = localStorage.getItem('repara_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, role: Role): boolean => {
    // Buscar si existe el usuario simulado
    const foundUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.role === role
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem('repara_user', JSON.stringify(foundUser));
      return true;
    }
    
    // Si no coincide exactamente, podemos crear una cuenta temporal para fines de simulación fluida
    const dummyUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: email.trim() || `${role}@repara79.com`,
      name: `Usuario [${role.toUpperCase()}]`,
      role: role
    };
    setCurrentUser(dummyUser);
    localStorage.setItem('repara_user', JSON.stringify(dummyUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('repara_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, mockUsers: MOCK_USERS }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
