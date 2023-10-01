import { getStock } from './ScraipingStock.js'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  UpdateCommand,
  QueryCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)
const tableName = 'StockManagement'

export const handler = async () => {
  const pathId = 1
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': pathId,
    },
  })
  let response
  try {
    response = await docClient.send(command)
  } catch (err) {
    return {
      statusCode: 500,
    }
  }
  const data = response.Items
  const ticker = data.ticker
  let price

  try {
    let textPrice = await getStock(ticker)
    console.log(textPrice)
    price = parseInt(textPrice)
  } catch (err) {
    return {
      statusCode: 111,
      body: 'scraiping failed',
    }
  }

  const updateCommand = new UpdateCommand({
    TableName: tableName,
    Key: {
      id: pathId,
    },
    UpdateExpression: 'set price = :price',
    ExpressionAttributeValues: {
      ':price': price,
    },
  })

  try {
    const result = await docClient.send(updateCommand)
    return {
      statusCode: 200,
      body: 'success',
    }
  } catch (err) {
    return {
      statusCode: 5001,
      body: 'updating is failed',
    }
  }
}
