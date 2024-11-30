import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toggleModelOpen, getTransactions } from "../store/userSlice";
import PerformTransferModal from "./PerformTransferModal";
import Loader from "../components/Loader";
import { formatCurrency } from "../utils/helpers";

const TransactionsScreen = () => {
  const dispatch = useDispatch();

  const {
    modalOpen,
    transactions,
    loadingTransactions,
    transfersErrorMessage,
  } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getTransactions(token));
    }
  }, [token]);

  const toggleModal = () => {
    dispatch(toggleModelOpen(true));
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleModal} style={styles.button}>
          <Text style={styles.buttonText}>Realizar transacción</Text>
        </TouchableOpacity>

        {transactions.map((data, index) => (
          <View key={data.transactionId} style={styles.userListContainer}>
            <Text style={styles.name}>
              ID de la transacción: {data.transactionId}
            </Text>
            <Text style={styles.listItem}>
              Fecha y hora:{" "}
              {new Date(data.createdAt).toLocaleString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text
              style={{
                ...styles.listItem,
                color: data.type === "Débito" ? "tomato" : "black",
              }}
            >
              Monto: {formatCurrency(data.amount)}
            </Text>
            <Text style={styles.listItem}>
              Cuenta debitada: {data.sourceAccountNumber}
            </Text>
            <Text style={styles.listItem}>
              Cuenta acreditada: {data.targetAccountNumber}
            </Text>
            <Text style={styles.listItem}>Tipo de operacion: {data.type}</Text>
          </View>
        ))}

        {loadingTransactions ? (
          <Loader />
        ) : transfersErrorMessage ? (
          <Text style={styles.message}>{transfersErrorMessage}</Text>
        ) : null}

        {modalOpen && <PerformTransferModal isOpen={modalOpen} />}
      </View>
    </ScrollView>
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
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
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  userListContainer: {
    marginBottom: 25,
    elevation: 4,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  listItem: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  message: {
    color: "tomato",
    fontSize: 17,
  },
});
