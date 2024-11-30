const jwt = require("jsonwebtoken");
const SECRET_KEY = "banking-app-secret-key-lk12jlk1j2lk12jl"; // Same secret key as in your login/registration function

exports.handler = async (event) => {
  console.log("The Event Details", event);
  const token = event.headers.authorization?.split(" ")[1]; // Get token from Authorization header

  console.log("TOKEN: ", token);

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Authorization token missing" }),
    };
  }

  try {
    console.log("Enter try");
    // Verify the token with the secret key
    const decoded = jwt.verify(token, SECRET_KEY);

    console.log("decoded", decoded);

    // Return the policy document for API Gateway
    const policy = {
      principalId: decoded.username,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: event.routeArn,
          },
        ],
      },
      context: {
        username: decoded.username,
      },
    };
    console.log("policy", policy, JSON.stringify(policy));
    return policy;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Invalid token" }),
    };
  }
};
