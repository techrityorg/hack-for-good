import React, { useState, useEffect } from 'react';
import { StreamrClient } from 'streamr-client';

import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';

function TransactionPool() {
  const [transactions, setTransactions] = useState([]);

  const streamr = new StreamrClient({
    auth: {
      privateKey: StreamrClient.generateEthereumAccount().privateKey,
    },
  });

  async function subscribeToStreamr() {
    try {
      const sub1 = await streamr.subscribe(
        {
          id: '0x546a5cb5c0add53efbc60000644aa70204b20576/VerxioPool',
          resend: {
            last: 5,
          },
        },
        (transaction) => {
          // 'transaction' contains the incoming data
          const incomingTransaction = transaction;

          // Use the functional form of setTransactions to ensure updates are batched correctly
          setTransactions((prevTransactions) => [
            ...prevTransactions,
            incomingTransaction,
          ]);

          console.log(' Resend Added txn successfully!');
        }
      );
      console.log('Subscribed to Streamr topic');
    } catch (error) {
      console.error('Error subscribing to Streamr:', error);
    }
  }

  useEffect(() => {
    subscribeToStreamr();
  }, []);
  

  const cellStyles = {
    color: 'white',
  };

  const headerStyles = {
    color: 'magenta',
  };

  function formatAddress(address) {
    if (!address) {
      return 'Invalid Address';
    }
    
    const firstThree = address.slice(0, 5);
    const lastFour = address.slice(-4);
    return `${firstThree}...${lastFour}`;
  }

  return (
    <TableContainer>
      <Table size="lg" variant="striped" colorScheme="black">
        <TableCaption>
          verxio transaction pool powered by{' '}
          <a style={{ color: 'white', textDecoration: 'underline' }} href="https://streamr.network/">
            streamr
          </a>
        </TableCaption>
        <Thead>
          <Tr>
            <Th style={headerStyles}>Txn Hash</Th>
            <Th style={headerStyles}>From</Th>
            <Th style={headerStyles}>To</Th>
            <Th style={headerStyles}>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.slice().reverse().map((transaction, index) => (
            <Tr key={index}>
              <Td style={cellStyles}>{<a 
                  href={`https://mumbai.polygonscan.com/tx/${transaction.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
              >
                {formatAddress(transaction.transactionHash)}</a>}</Td>
              <Td style={cellStyles}>{formatAddress(transaction.fromAddress)}</Td>
              <Td style={cellStyles}>{formatAddress(transaction.toAddress)}</Td>
              <Td style={cellStyles}>{transaction.amount}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default TransactionPool;
