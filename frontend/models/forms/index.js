export const newUserFormModel = {
  name: {
    fieldName: "Nombres",
    type: "text",
  },
  lastname: {
    fieldName: "Apellidos",
    type: "text",
  },
  email: {
    fieldName: "Correo",
    type: "email",
  },
  username: {
    fieldName: "Usuario",
    type: "text",
  },
  password: {
    fieldName: "Contraseña",
    type: "text",
    secure: true,
  },
};

export const loginFormModel = {
  username: {
    fieldName: "Usuario",
    type: "text",
  },
  password: {
    fieldName: "Contraseña",
    type: "text",
    secure: true,
  },
};


export const transferFormModel = {
  amount: {
    fieldName: "Monto",
    type: "numeric",
  },
  targetAccountNumber: {
    fieldName: "Numero de cuenta destino",
    type: "numeric",
  },
}