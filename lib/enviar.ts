/*
import * as StellarSdk from '@stellar/stellar-sdk';

// Configuración de la red
const NETWORK: 'TESTNET' | 'PUBLIC' = 'TESTNET';
const server = new StellarSdk.Horizon.Server(
  NETWORK === 'TESTNET' 
    ? 'https://horizon-testnet.stellar.org'
    : 'https://horizon.stellar.org'
);

// Clave secreta fija (cambiar por tu clave real)
const SOURCE_SECRET = 'SBQQSKE22VXWDJL43NCPCDMBPMPKGBYF7MWCOILZMA76WLPEOARK7USG';

interface TransactionResult {
  hash: string;
  ledger: number;
  sourceAccount: string;
  destinationAccount: string;
  amount: string;
}
*/

/**
 * Envía XLM de una billetera a otra
 * @param destinationPublicKey - Clave pública de la billetera destino
 * @param amount - Cantidad de XLM a enviar (como string)
 * @returns Hash de la transacción
 */
/*
export async function enviarXLM(
  destinationPublicKey: string,
  amount: string
): Promise<string> {
  try {
    // Validar dirección destino
    if (!destinationPublicKey || !destinationPublicKey.startsWith('G')) {
      throw new Error('Dirección de destino inválida');
    }

    // Validar cantidad
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Cantidad inválida');
    }

    // 1. Crear el keypair desde la clave secreta
    const sourceKeypair = StellarSdk.Keypair.fromSecret(SOURCE_SECRET);
    const sourcePublicKey = sourceKeypair.publicKey();
    
    console.log(`Enviando ${amount} XLM desde: ${sourcePublicKey}`);
    console.log(`Enviando a: ${destinationPublicKey}`);
    
    // 2. Cargar la cuenta origen desde la red
    const sourceAccount = await server.loadAccount(sourcePublicKey);
    
    // 3. Construir la transacción
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK === 'TESTNET' 
        ? StellarSdk.Networks.TESTNET 
        : StellarSdk.Networks.PUBLIC
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationPublicKey,
          asset: StellarSdk.Asset.native(), // XLM
          amount: amount
        })
      )
      .setTimeout(30) // Timeout de 30 segundos
      .build();
    
    // 4. Firmar la transacción
    transaction.sign(sourceKeypair);
    
    // 5. Enviar la transacción a la red
    console.log('Enviando transacción...');
    const result = await server.submitTransaction(transaction);
    
    console.log('✅ Transacción exitosa!');
    console.log(`Hash: ${result.hash}`);
    console.log(`Ledger: ${result.ledger}`);
    
    // Retornar solo el hash
    return result.hash;
    
  } catch (error: any) {
    console.error('❌ Error al enviar XLM:');
    
    if (error.response?.data) {
      console.error('Detalles del error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    
    throw error;
  }
}

/**
 * Versión extendida que retorna más información
 */
/*
export async function enviarXLMDetallado(
  destinationPublicKey: string,
  amount: string
): Promise<TransactionResult> {
  try {
    const sourceKeypair = StellarSdk.Keypair.fromSecret(SOURCE_SECRET);
    const sourcePublicKey = sourceKeypair.publicKey();
    
    const sourceAccount = await server.loadAccount(sourcePublicKey);
    
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK === 'TESTNET' 
        ? StellarSdk.Networks.TESTNET 
        : StellarSdk.Networks.PUBLIC
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationPublicKey,
          asset: StellarSdk.Asset.native(),
          amount: amount
        })
      )
      .setTimeout(30)
      .build();
    
    transaction.sign(sourceKeypair);
    
    const result = await server.submitTransaction(transaction);
    
    return {
      hash: result.hash,
      ledger: result.ledger,
      sourceAccount: sourcePublicKey,
      destinationAccount: destinationPublicKey,
      amount: amount
    };
    
  } catch (error: any) {
    console.error('Error al enviar XLM:', error.message);
    throw error;
  }
}

// Ejemplo de uso
async function ejemplo() {
  const destino = 'GAYR3DYYONOZMFQT5KA7VO4LHMDWEDMVOFXONGEPPLQAL5ZWQQXYAJUP';
  const cantidad = '1';
  
  try {
    const hash = await enviarXLM(destino, cantidad);
    console.log(`\n✅ Transacción completada con hash: ${hash}`);
  } catch (error: any) {
    console.error(`\n❌ Falló el envío: ${error.message}`);
  }
}

export default enviarXLM;

// Ejecutar ejemplo
//ejemplo();
*/