const fs = require('fs');
const path = require('path')
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const rootDir = require('../helper/path')
const filePath = path.join(rootDir, 'data', 'internetBankingCharge.json')

export const readFileData = async (): Promise<any> => {
    try {
      const chargeData: string = await readFile(filePath, 'utf8');
  
      if (!chargeData) {
        return {};
      }
  
      return JSON.parse(chargeData);
    } catch (err) {
      console.error(err);
      throw err; // Rethrow the error to be caught by the caller
    }
  };
  
// export const getInternetBankingCharge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const charge = await readFileData();
  
//       res.json({...charge});
//       await writeFile(filePath, JSON.stringify({}));
//     } catch (err) {
//       console.error(err);
//       // Handle error as needed, maybe send an error response
//     //   res.status(500).send('Internal Server Error');
//     // throw err
//       return; // Return to avoid calling next() after sending the response
//     }
//     next(); // Call next() only if everything is successful
//   };