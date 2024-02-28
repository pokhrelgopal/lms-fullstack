// useAuth.ts
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  user_id: string;
  email: string;
  role: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({ isLoggedIn: false });

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie("access");

      if (token) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          const { exp, user_id, email, role } = decodedToken;
          const currentTime = Math.floor(Date.now() / 1000);

          if (currentTime < exp) {
            setAuthState({
              isLoggedIn: true,
              user: {
                id: user_id,
                email,
                role,
              },
            });
            return;
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
      setAuthState({ isLoggedIn: false });
    };

    checkAuth();
  }, []);

  return authState;
};

export default useAuth;
