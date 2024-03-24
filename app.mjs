import fs from 'fs/promises'; 
import path from 'path';

const basePath = './stores'; 
const salesTotalsPath = './salesTotals/total.txt';

async function calculTotal(files) {
  let totalSales = 0;
  for (let file of files) {
    const data = JSON.parse(await fs.readFile(file)); 
    totalSales += data.total;
  }
  return totalSales;
}

async function findSalesFiles(folder) {
  let salesFiles = [];
  async function findFiles(folder) {
    const items = await fs.readdir(folder, { withFileTypes: true });
    for (const item of items) {
      if (item.isDirectory()) {
        await findFiles(path.join(folder, item.name));
      } else {
        if (path.extname(item.name) === '.json') {
          salesFiles.push(path.join(folder, item.name));
        }
      }
    }
  }
  await findFiles(folder);
  return salesFiles;
}

async function main() {
 
    const salesFiles = await findSalesFiles(basePath);

    const totalSales = await calculTotal(salesFiles);
    if(!(salesTotalsPath == ' ')){
      console.log("salesTotals already exists.");
    }
    await fs.writeFile(salesTotalsPath, `${totalSales}€\n`, 'utf-8');
    console.log(`Wrote sales totals ${totalSales}€ to salesTotals`);

}

main();
