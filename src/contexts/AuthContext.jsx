import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This now simulates a multi-company auth system.
    // In a real app with Supabase, this would check the session.
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Simulating login
  const login = (companyId, email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
        if (foundUser.status === 'inactive') {
            return { success: false, error: 'User account is inactive' };
        }
      const userWithoutPassword = { ...foundUser };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  // Simulating company registration
  const registerCompany = (companyData) => {
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    if(companies.find(c => c.email === companyData.email)) {
        return { success: false, error: 'Company with this email already exists.' };
    }

    const newCompany = {
        id: Date.now().toString(),
        ...companyData,
        status: 'active',
        created_at: new Date().toISOString()
    };
    companies.push(newCompany);
    localStorage.setItem('companies', JSON.stringify(companies));

    return { success: true, company: newCompany };
  };

  const signup = (email, password, role) => {
    // This is the old signup, now company registration is primary.
    // We can keep it for a generic user type if needed, or deprecate it.
    // For now, let's keep it but note it's for 'admin'/'user' roles, not company roles.
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }
    const newUser = { id: Date.now().toString(), email, password, role, created_at: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, registerCompany }}>
      {children}
    </AuthContext.Provider>
  );
};