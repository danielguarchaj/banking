import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { transferFormModel } from "../models/forms";
import {
  handleTransferFormInput,
  performTransaction,
  getUserData,
  toggleModelOpen,
  getTransactions,
} from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";

const PerformTransferModal = ({ isOpen, closeModal }) => {
  const { loadingTransfer, transactionForm, transferErrorMessage, modalOpen } =
    useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handlePerformTransfer = async () => {
    console.log("transactionForm", transactionForm);
    if (!transactionForm.amount || !transactionForm.targetAccountNumber) {
      alert("Ingrese el monto y la cuenta destino");
      return;
    }
    await dispatch(
      performTransaction({ token, transferData: transactionForm })
    ).unwrap();
    await dispatch(getUserData(token)).unwrap();
    await dispatch(getTransactions(token)).unwrap();
  };

  const handleCloseModal = () => {
    dispatch(toggleModelOpen(false));
  };

  return (
    <Modal
      visible={modalOpen}
      onRequestClose={handleCloseModal}
      animationType="slide"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Realizar transferencia</Text>

        {Object.keys(transferFormModel).map((field, index) => (
          <TextInput
            key={`transfer-field-${field}-${index}`}
            inputMode={transferFormModel[field].type}
            style={styles.textBox}
            onChangeText={(text) =>
              dispatch(handleTransferFormInput({ field, value: text }))
            }
            placeholder={transferFormModel[field].fieldName}
            secureTextEntry={transferFormModel[field].secure ?? false}
          />
        ))}

        {transferErrorMessage ? (
          <Text style={styles.message}>{transferErrorMessage}</Text>
        ) : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handlePerformTransfer}
            style={{ ...styles.button, marginVertical: 0 }}
            disabled={loadingTransfer}
          >
            <Text style={styles.buttonText}>Confirmar Transferencia</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCloseModal}
            style={{
              ...styles.button,
              marginVertical: 0,
              marginLeft: 10,
              backgroundColor: "tomato",
            }}
            disabled={loadingTransfer}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
        {loadingTransfer && <Loader />}
      </View>
    </Modal>
  );
};

export default PerformTransferModal;

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
