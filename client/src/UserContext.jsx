import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  // TEMP: hard-coded user until we have real auth
  const [user, setUser] = useState({
    id: 1,
    username: "demo",
    points: 0,
  });

  function addPoints(pointsEarned, newTotalFromServer) {
    console.log("addPoints called with:", { pointsEarned, newTotalFromServer });

    setUser((prev) => {
      // if we somehow started with null, create a base user
      if (!prev) {
        return {
          id: 1,
          username: "demo",
          points:
            typeof newTotalFromServer === "number"
              ? newTotalFromServer
              : pointsEarned || 0,
        };
      }

      if (typeof newTotalFromServer === "number") {
        return { ...prev, points: newTotalFromServer };
      }

      return { ...prev, points: prev.points + (pointsEarned || 0) };
    });
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
