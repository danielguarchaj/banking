import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native";
import { loginFormModel } from "../models/forms";
import { handleLoginFormInput } from "../store/authSlice";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const {
    loginForm: { username, password },
    loading,
    errorMessage,
  } = useSelector((state) => state.auth);

  const handleLogin = () => {
    console.log("username, password in handleLogin", username, password);
    if (!username || !password) {
      alert("Ingrese su usuario y contraseña");
      return;
    }
    dispatch(loginUser({ username, password }));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Ingresa a tu cuenta</Text>

        {Object.keys(loginFormModel).map((field, index) => (
          <TextInput
            inputMode={loginFormModel[field].type}
            style={styles.textBox}
            onChangeText={(text) =>
              dispatch(handleLoginFormInput({ field, value: text }))
            }
            placeholder={loginFormModel[field].fieldName}
            key={`login-field-${field}-${index}`}
            secureTextEntry={loginFormModel[field].secure ?? false}
          />
        ))}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleLogin}
            style={{ ...styles.button, marginVertical: 0 }}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Registro")}
            style={{
              ...styles.button,
              ...styles.registerButton,
              marginVertical: 0,
            }}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              Aun no tienes cuenta? Registrate
            </Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <Text style={styles.message}>Procesando...</Text>
        ) : errorMessage ? (
          <Text style={styles.message}>{errorMessage}</Text>
        ) : null}
      </View>
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
  button: {
    borderRadius: 5,
    marginVertical: 20,
    alignSelf: "flex-start",
    backgroundColor: "#68b31e",
  },
  registerButton: {
    backgroundColor: "#0398fc",
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
