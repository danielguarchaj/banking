import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleNewAccountFormInput, registerUser } from "../store/authSlice";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { newUserFormModel } from "../models/forms";

import { SafeAreaView } from "react-native";

export default function RegisterScreen({ navigation }) {
  const { newAccount, loading, errorMessage } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const handleLogin = () => {
    if (
      !newAccount.name ||
      !newAccount.lastname ||
      !newAccount.email ||
      !newAccount.username ||
      !newAccount.password
    ) {
      alert("Todos los campos son requeridos");
      return;
    }
    dispatch(registerUser(newAccount));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={"position"} keyboardVerticalOffset={0}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Crea una nueva cuenta</Text>

          {Object.keys(newUserFormModel).map((field, index) => (
            <TextInput
              inputMode={newUserFormModel[field].type}
              style={styles.textBox}
              onChangeText={(text) =>
                dispatch(handleNewAccountFormInput({ field, value: text }))
              }
              placeholder={newUserFormModel[field].fieldName}
              key={`new-account-field-${field}-${index}`}
              secureTextEntry={newUserFormModel[field].secure ?? false}
            />
          ))}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleLogin}
              style={{ ...styles.button, marginVertical: 0 }}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Crear Cuenta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={{
                ...styles.button,
                ...styles.loginButton,
                marginVertical: 0,
              }}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                Ya tienes cuenta? Ingresa aca
              </Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <Text style={styles.message}>Procesando...</Text>
          ) : errorMessage ? (
            <Text style={styles.message}>{errorMessage}</Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 20,
  },
  textBox: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "rgba(0,0,0,0.3)",
    marginBottom: 15,
    fontSize: 18,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  loginButton: {
    backgroundColor: "#0398fc",
  },
  button: {
    borderRadius: 5,
    marginVertical: 20,
    alignSelf: "flex-start",
    backgroundColor: "#68b31e",
  },
  buttonText: {
    color: "white",
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  message: {
    color: "tomato",
    fontSize: 17,
  },
});
