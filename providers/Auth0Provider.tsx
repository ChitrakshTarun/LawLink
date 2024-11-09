import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import { storage } from "@/store";

type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  updateUser: (updatedUser: { name?: string; picture?: string }) => Promise<void>;
};

type Auth0ProviderProps = {
  children: ReactNode;
};

const AUTH0_DOMAIN_URL = process.env.EXPO_PUBLIC_AUTH0_DOMAIN_URL!;
const AUTH0_CLIENT_ID = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID!;

const useAuth0Request = () => {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "myapp",
    path: "callback",
  });

  return AuthSession.useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      scopes: ["openid", "profile", "email"],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        audience: `https://${AUTH0_DOMAIN_URL}/api/v2/`,
      },
    },
    {
      authorizationEndpoint: `https://${AUTH0_DOMAIN_URL}/authorize`,
      tokenEndpoint: `https://${AUTH0_DOMAIN_URL}/oauth/token`,
      revocationEndpoint: `https://${AUTH0_DOMAIN_URL}/oauth/revoke`,
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
  updateUser: async () => {},
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
          tokenEndpoint: `https://${AUTH0_DOMAIN_URL}/oauth/token`,
        }
      );

      await SecureStore.setItemAsync("auth_tokens", JSON.stringify(tokenResult));

      const userInfoResponse = await fetch(`https://${AUTH0_DOMAIN_URL}/userinfo`, {
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
      storage.set("user.name", userInfo.nickname);
      storage.set("user.email", userInfo.email);
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

      const logoutUrl = `https://${AUTH0_DOMAIN_URL}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(
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

  const updateUser = async (updatedUser: { name?: string; picture?: string }) => {
    try {
      setError(null);
      const tokensString = await SecureStore.getItemAsync("auth_tokens");
      if (!tokensString) throw new Error("Not authenticated");

      const tokens = JSON.parse(tokensString);

      // This is only for demonstration purposes; updating user data requires Auth0 Management API.
      const response = await fetch(`https://${AUTH0_DOMAIN_URL}/api/v2/users/${user.sub}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_metadata: updatedUser }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Update local user state
      const updatedUserInfo = await response.json();
      setUser((prevUser: any) => ({ ...prevUser, ...updatedUserInfo }));
    } catch (error) {
      console.error("Update user error:", error);
      setError(error instanceof Error ? error.message : "Failed to update user profile");
    }
  };

  useEffect(() => {
    async function checkAuthState() {
      try {
        setError(null);
        const tokensString = await SecureStore.getItemAsync("auth_tokens");
        if (tokensString) {
          const tokens = JSON.parse(tokensString);

          const userInfoResponse = await fetch(`https://${AUTH0_DOMAIN_URL}/userinfo`, {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          });

          if (userInfoResponse.ok) {
            const userInfo = await userInfoResponse.json();
            setUser(userInfo);
            setIsAuthenticated(true);
            storage.set("user.name", userInfo.nickname);
            storage.set("user.email", userInfo.email);
          } else {
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
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
