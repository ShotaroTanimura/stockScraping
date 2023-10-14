import { getStock } from './ScrapingStock.js'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  GetCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb'
const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)
const tableName = 'StockManagement'
export const handler = async (event) => {
  const pathId = event.pathParameters
  const command = new GetCommand({
    TableName: tableName,
    Key: {
      id: pathId
    }
  })
  let response
  try {
    response = await docClient.send(command)
    console.log(response)
  } catch (err) {
    return {
      statusCode: 500,
    }
  }

  const data = response.Item
  const ticker = data.ticker
  let price

  try {
    let textPrice = await getStock(ticker)
    console.log(textPrice)
    price = parseFloat(textPrice)
  } catch (err) {
    return {
      statusCode: 500,
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
      statusCode: 500,
      body: 'updating is failed',
    }
  }
}
