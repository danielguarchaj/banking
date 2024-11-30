const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const SECRET_KEY = "banking-app-secret-key-lk12jlk1j2lk12jl"; // Use a more secure way to store secrets

const generateRandomNumberString = (length) => {
  if (length <= 0) {
    throw new Error("Length must be a positive number.");
  }

  let result = "";
  const characters = "0123456789";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};

const getUser = async (credentials) => {
  const { username } = credentials; // User credentials
  // Find the user in DynamoDB (authentication logic)
  const params = {
    TableName: "users",
    Key: { username },
  };

  const result = await dynamoDB.get(params).promise();

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "User not found" }),
    };
  }

  return result.Item;
};

const generateToken = async (credentials) => {
  const { username, password } = credentials; // User credentials

  const user = await getUser({ username });

  if (!user) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "User not found" }),
    };
  }

  // Verify password (you should hash passwords in production)
  if (user.password !== password) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Invalid credentials" }),
    };
  }

  // Generate JWT token
  const token = jwt.sign(
    { username: user.username },
    SECRET_KEY, // Secret key for signing the token
    { expiresIn: "1h" } // Token expiration (optional)
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ token }),
  };
};

const createAccount = async (username) => {
  const params = {
    TableName: "account",
    Item: {
      accountNumber: generateRandomNumberString(6),
      username,
      accountType: "Monetaria",
      createdAt: new Date().getTime(),
      balance: 10000,
      active: true,
    },
  };

  try {
    await dynamoDB.put(params).promise();
    console.log(
      "Account created successfully:",
      params,
      JSON.stringify(params)
    );

    return {
      success: true,
      message: "Account created successfully",
      data: params,
    };
  } catch (error) {
    console.error("Error creating account:", error);
    return {
      success: false,
      message: "Error creating account",
      error: error.message,
    };
  }
};

const createUser = async (newUser) => {
  const { username, name, lastname, email, password } = newUser;
  console.log("createUser username", username);
  const existingUser = await getUser({ username });
  console.log("createUser existingUser", existingUser);
  if (existingUser?.statusCode === 404) {
    const params = {
      TableName: "users",
      Item: {
        username,
        name,
        lastname,
        email,
        password,
      },
    };
    await dynamoDB.put(params).promise();
    console.log("User created successfully:", params, JSON.stringify(params));
    await createAccount(username);
    const tokenResponse = await generateToken({
      username,
      password,
    });
    return tokenResponse;
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Ya existe un usuario registrado con estos datos",
    }),
  };
};

exports.handler = async (event) => {
  console.log("The Event Details", event);
  const eventBody = JSON.parse(event.body);

  try {
    switch (event.routeKey) {
      case "POST /banking-app/login":
        const tokenResponse = await generateToken({
          username: eventBody.username,
          password: eventBody.password,
        });
        return tokenResponse;
      case "POST /banking-app/register":
        const newUserResponse = await createUser(eventBody);
        console.log("newUserResponse", newUserResponse);
        return newUserResponse;
      default:
        break;
    }
  } catch (error) {
    console.error("Error during login:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "[banking-app-authenticator] Internal server error",
      }),
    };
  }
};
