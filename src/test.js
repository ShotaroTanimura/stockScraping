import { getStock } from './ScrapingStock.js'

async function displayStock() {
  try {
    const result = await getStock('AA');
    console.log(result);
  } catch (error) {
    console.error('Error fetching stock:', error);
  }
}

displayStock();