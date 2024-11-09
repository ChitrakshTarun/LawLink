import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";

const AUTH0_DOMAIN = process.env.EXPO_PUBLIC_AUTH0_DOMAIN_URL!;
const AUTH0_CLIENT_ID = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID!;

type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

type Auth0ProviderProps = {
  children: ReactNode;
};

// Create the auth request
const useAuth0Request = () => {
  // Log the redirect URI to help with debugging
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "myapp",
    path: "callback", // Add explicit callback path
  });

  return AuthSession.useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      scopes: ["openid", "profile", "email"],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      },
    },
    {
      authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize`,
      tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
      revocationEndpoint: `https://${AUTH0_DOMAIN}/oauth/revoke`,
    }
  );
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export function Auth0Provider({ children }: Auth0ProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = useAuth0Request();

  useEffect(() => {
    if (response?.type === "error") {
      console.error("Auth response error:", response.error);
      setError(response.error?.message || "Authentication failed");
    } else if (response?.type === "success") {
      const { code } = response.params;
      exchangeCodeForToken(code);
    }
  }, [response]);

  const exchangeCodeForToken = async (code: string) => {
    try {
      setError(null);
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "myapp",
        path: "callback",
      });

      const tokenResult = await AuthSession.exchangeCodeAsync(
        {
          code,
          clientId: AUTH0_CLIENT_ID,
          redirectUri,
          extraParams: {
            code_verifier: request?.codeVerifier || "",
          },
        },
        {
          tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
        }
      );

      await SecureStore.setItemAsync("auth_tokens", JSON.stringify(tokenResult));

      const userInfoResponse = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
        headers: {
          Authorization: `Bearer ${tokenResult.accessToken}`,
        },
      });

      if (!userInfoResponse.ok) {
        throw new Error(`Failed to fetch user info: ${userInfoResponse.statusText}`);
      }

      const userInfo = await userInfoResponse.json();
      setUser(userInfo);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Token exchange error:", error);
      setError(error instanceof Error ? error.message : "Failed to complete authentication");
    }
  };

  const login = async () => {
    try {
      setError(null);
      if (!request) {
        throw new Error("Auth request not initialized");
      }
      const result = await promptAsync();
      if (result.type === "error") {
        throw new Error(result.error?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Login failed");
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await SecureStore.deleteItemAsync("auth_tokens");

      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "myapp",
        path: "callback",
      });

      const logoutUrl = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(
        redirectUri
      )}`;

      await WebBrowser.openAuthSessionAsync(logoutUrl, redirectUri);

      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      setError(error instanceof Error ? error.message : "Logout failed");
    }
  };

  useEffect(() => {
    async function checkAuthState() {
      try {
        setError(null);
        const tokensString = await SecureStore.getItemAsync("auth_tokens");
        if (tokensString) {
          const tokens = JSON.parse(tokensString);

          const userInfoResponse = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          });

          if (userInfoResponse.ok) {
            const userInfo = await userInfoResponse.json();
            setUser(userInfo);
            setIsAuthenticated(true);
          } else {
            // Token might be expired or invalid
            await SecureStore.deleteItemAsync("auth_tokens");
          }
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        setError(error instanceof Error ? error.message : "Failed to check auth state");
      } finally {
        setLoading(false);
      }
    }

    checkAuthState();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
