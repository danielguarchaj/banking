import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/Loader";
import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import Mybutton from "../components/Mybutton";
import { SafeAreaView } from "react-native";
import { formatCurrency } from "../utils/helpers";
import { toggleModelOpen } from "../store/userSlice";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  if (user.loading || !user.profile || !user.account) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenido</Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.sectionTitle}>Información del Usuario</Text>
        <Text style={styles.infoText}>
          Nombre: {user.profile.name} {user.profile.lastname}
        </Text>
        <Text style={styles.infoText}>Usuario: {user.profile.username}</Text>
        <Text style={styles.infoText}>Correo: {user.profile.email}</Text>
      </View>

      <View style={styles.accountInfo}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <Text style={styles.infoText}>
          Tipo de cuenta: {user.account.accountType}
        </Text>
        <Text style={styles.infoText}>
          Número de cuenta: {user.account.accountNumber}
        </Text>
        <Text style={styles.infoText}>
          Saldo actual: {formatCurrency(user.account.balance)}
        </Text>
        <Text style={styles.infoText}>
          Estado: {user.account.active ? "Activa" : "Inactiva"}
        </Text>
      </View>

      <Mybutton
        style={styles.button}
        title="Transferir"
        customClick={() => {
          navigation.navigate("Transacciones");
          dispatch(toggleModelOpen(true));
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#444",
    marginBottom: 10,
  },
  userInfo: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  accountInfo: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
  },
});
