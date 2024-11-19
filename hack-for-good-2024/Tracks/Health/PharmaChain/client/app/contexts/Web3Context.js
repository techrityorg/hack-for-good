"use client";

// src/contexts/Web3Context.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import myPharma from '../../src/contracts/Pharma.json';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [PharmaContract, setPharmaContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (window && window.ethereum) {
          const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(ethersProvider);

          const signer = ethersProvider.getSigner();

          const accounts = await signer.getAddress();
          setAccounts(accounts);

          // Create the contract instance with the signer
          // const contractInstance = new ethers.Contract(
          //   myPharma.address,
          //   myPharma.abi,
          //   signer
          // );

          const contractInstance = new ethers.Contract(
            '0x3038680642a28F66e586d75E20f815d93b72AD3F',
            myPharma.abi,
            signer
          );
          setPharmaContract(contractInstance);

          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccounts(accounts);
            window.location.reload();
          });

          // Listen for chain changes
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } else {
          alert('Please install MetaMask!');
        }
      } catch (error) {
        console.error(error);
        alert('A Logged in metamask is required for fun functionality');
      }
    };

    if (!provider) {
      init();
    }
  }, []);

  return (
    <Web3Context.Provider value={{ provider, accounts, PharmaContract }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);