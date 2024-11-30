const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getUser = async (username) => {
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

async function getAccountById(accountNumber) {
  try {
    const params = {
      TableName: "account",
      FilterExpression: `accountNumber = :accountNumber`,
      ExpressionAttributeValues: {
        ":accountNumber": accountNumber,
      },
    };

    console.log("getAccountById params", JSON.stringify(params));

    const result = await dynamoDB.scan(params).promise();
    console.log("getAccountById result", JSON.stringify(result));
    console.log("getAccountById result.Items", JSON.stringify(result.Items));
    return result.Items;
  } catch (error) {
    console.error("Error in getAccountById while scanning the table:", error);
    throw error;
  }
}

async function getUserAccounts(username) {
  try {
    const params = {
      TableName: "account",
      FilterExpression: `username = :username`,
      ExpressionAttributeValues: {
        ":username": username,
      },
    };

    console.log("getUserAccounts params", JSON.stringify(params));

    const result = await dynamoDB.scan(params).promise();
    console.log("getUserAccounts result", JSON.stringify(result));
    console.log("getUserAccounts result.Items", JSON.stringify(result.Items));
    return result.Items;
  } catch (error) {
    console.error("Error scanning the table:", error);
    throw error;
  }
}

async function setAccountBalance(accountNumber, username, newBalance) {
  const params = {
    TableName: "account",
    Key: {
      accountNumber,
      username,
    },
    UpdateExpression: "SET #balance = :newBalance",
    ExpressionAttributeNames: {
      "#balance": "balance",
    },
    ExpressionAttributeValues: {
      ":newBalance": newBalance,
    },
    ReturnValues: "UPDATED_NEW",
  };

  console.log("setAccountBalance params", params);

  try {
    const result = await dynamoDB.update(params).promise();
    console.log("Update balance succeeded:", result);
  } catch (error) {
    console.error(
      "Unable to update item. Error JSON:",
      JSON.stringify(error, null, 2)
    );
    throw error;
  }
}

async function performTransaction(user, account, transactionData) {
  console.log(
    "performTransaction params -> user, account, transactionData",
    user,
    account,
    transactionData
  );
  if (account.balance < transactionData.amount) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Fondos insuficientes" }),
    };
  }

  const targetAccountItems = await getAccountById(
    transactionData.targetAccountNumber
  );

  if (targetAccountItems.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No existe la cuenta destino" }),
    };
  }

  const targetAccount = targetAccountItems[0];

  const params = {
    TableName: "transactions",
    Item: {
      transactionId: uuidv4(),
      sourceAccountNumber: account.accountNumber,
      targetAccountNumber: targetAccountItems[0].accountNumber,
      amount: transactionData.amount,
      createdAt: new Date().getTime(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    console.log(
      "Transaction created successfully:",
      params,
      JSON.stringify(params)
    );

    const sourceAccountNewBalance = account.balance - transactionData.amount;
    const targetAccountNewBalance =
      targetAccount.balance + transactionData.amount;

    await setAccountBalance(
      account.accountNumber,
      user.username,
      sourceAccountNewBalance
    );
    await setAccountBalance(
      targetAccount.accountNumber,
      targetAccount.username,
      targetAccountNewBalance
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Transferencia completada con exito" }),
    };
  } catch (error) {
    console.log("Error while performing transaction", error);
    throw error;
  }
}

async function getUserTransactions(accountNumber) {
  const params = {
    TableName: "transactions",
    FilterExpression:
      "sourceAccountNumber = :account OR targetAccountNumber = :account",
    ExpressionAttributeValues: {
      ":account": accountNumber,
    },
  };
  console.log("getUserTransactions params", params);
  try {
    const result = await dynamoDB.scan(params).promise();
    console.log("User transactions:", result.Items);

    const sortedTransactions = result.Items.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // Descending order
    );

    console.log("sortedTransactions", sortedTransactions);
    return sortedTransactions.map((transaction) => ({
      ...transaction,
      type:
        transaction.targetAccountNumber == accountNumber ? "Crédito" : "Débito",
    }));
  } catch (error) {
    console.error(
      "Unable to fetch transactions. Error JSON:",
      JSON.stringify(error, null, 2)
    );
    throw error;
  }
}

exports.handler = async (event) => {
  console.log("The Event Details", JSON.stringify(event));
  const username = event.requestContext?.authorizer?.lambda?.username;
  try {
    const user = await getUser(username);
    const accounts = await getUserAccounts(username);
    console.log("user, accounts", user, accounts);
    switch (event.routeKey) {
      case "POST /banking-app/user":
        return {
          user,
          accounts,
        };
      case "POST /banking-app/transaction":
        const eventBody = JSON.parse(event.body);
        return await performTransaction(user, accounts[0], eventBody);
      case "GET /banking-app/transactions":
        return await getUserTransactions(accounts[0].accountNumber);
      default:
        break;
    }
  } catch (error) {
    console.error("Error in banking-app handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "[banking-app] Internal server error" }),
    };
  }
};
