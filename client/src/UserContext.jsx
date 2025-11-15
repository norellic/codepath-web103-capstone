import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // { id, username, points }

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/me');  // you can adjust endpoint later
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadUser();
  }, []);

  function addPoints(pointsEarned, newTotal) {
    setUser(prev =>
      prev
        ? { ...prev, points: newTotal ?? prev.points + pointsEarned }
        : prev
    );
  }

  return (
    <UserContext.Provider value={{ user, addPoints }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
