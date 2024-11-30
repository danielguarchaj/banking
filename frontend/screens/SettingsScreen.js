import * as React from "react";
import { useDispatch } from "react-redux";
import { setToken, logout } from "../store/authSlice";
import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import Mybutton from "../components/Mybutton";

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    alert("Sesion finalizada correctamente");
  };
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Mybutton
        style={{ fontSize: 25 }}
        title="Cerrar Sesion"
        customClick={handleLogout}
      />
    </View>
  );
}
