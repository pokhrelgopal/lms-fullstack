import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
}

export default function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    let token = getCookie("access");
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const { exp } = decodedToken;
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime < exp) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}
