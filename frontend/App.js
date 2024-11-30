// In App.js in a new project
import * as React from "react";
import { useEffect } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "./store/store";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { getUserData } from "./store/userSlice";

import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import TransactionsScreen from "./screens/TransactionsScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Transacciones" component={TransactionsScreen} />
      <Tab.Screen name="Configuracion" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function PublicTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="Registro" component={RegisterScreen} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  let tabs = MyTabs;
  let tabsName = "MyTabs";

  if (!token) {
    tabs = PublicTabs;
    tabsName = "PublicTabs";
  }

  useEffect(() => {
    if (token) {
      dispatch(getUserData(token));
    }
  }, [token]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={tabsName}
          component={tabs}
          options={{ title: "BANCA EN LINEA" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function WrappedApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
