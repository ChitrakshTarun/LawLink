import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "@/providers/Auth0Provider";

export default function IndexScreen() {
  const { isAuthenticated, loading, login, logout, user, error } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0A84FF" />
        <Text style={styles.loadingText}>Loading auth state...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Auth Status:</Text>
        <Text style={[styles.statusValue, isAuthenticated ? styles.authenticatedText : styles.unauthenticatedText]}>
          {isAuthenticated ? "Authenticated" : "Not Authenticated"}
        </Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {isAuthenticated && user && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoTitle}>User Information:</Text>
          <Text style={styles.userInfoText}>Name: {user.name}</Text>
          <Text style={styles.userInfoText}>Email: {user.email}</Text>
          {user.picture && <Text style={styles.userInfoText}>Has Profile Picture: Yes</Text>}
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, isAuthenticated ? styles.logoutButton : styles.loginButton]}
        onPress={isAuthenticated ? logout : login}
      >
        <Text style={styles.buttonText}>{isAuthenticated ? "Logout" : "Login with Auth0"}</Text>
      </TouchableOpacity>

      {!isAuthenticated && <Text style={styles.helperText}>Press the button above to authenticate with Auth0</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  authenticatedText: {
    color: "#34C759",
  },
  unauthenticatedText: {
    color: "#FF3B30",
  },
  errorContainer: {
    backgroundColor: "#FFE5E5",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    marginBottom: 24,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    textAlign: "center",
  },
  userInfoContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1c1c1e",
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#3a3a3c",
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#0A84FF",
  },
  logoutButton: {
    backgroundColor: "#FF453A",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  helperText: {
    marginTop: 16,
    color: "#8e8e93",
    fontSize: 14,
    textAlign: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#8e8e93",
  },
});
