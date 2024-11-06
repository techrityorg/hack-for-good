import { useCallback, useEffect, useMemo, useState } from 'react';
import './panes.css';
import { useTransaction } from 'wagmi'
import { curve, ec as EC } from 'elliptic';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BigNumber, ethers } from 'ethers';
import { base58, getAddress, keccak256, parseEther } from 'ethers/lib/utils.js';
import {
  useAccount,
  useBalance,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi';
import { VerxioPayABI} from '../abi/Registry.json';
import { registryAddress, explorer } from '../utils/constants';
import { calculateCrc } from '../utils/crc16';
import useDebounce from '../utils/debounce';
import { Connect } from './connect';
import initializeStreamr from '../utils/initiateStreamr';

const zero = BigNumber.from(0);
export function Send() {
  const ec = useMemo(() => {
    return new EC('secp256k1');
  }, []);

  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
    watch: true,
    cacheTime: 3_500,
  });
  
  const { chain } = useNetwork();

  const [xdcAddr, setxdcAddr] = useState<string>(
    ethers.constants.AddressZero
  );
  const [sharedSecretByte, setSharedSecretByte] = useState<string>('0x00');
  const [theirID, setTheirID] = useState<string>('');
  const [ephPublic, setEphPublic] = useState<curve.base.BasePoint>();
  const [VerxioIDError, setVerxioIDError] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>('0');
  const [amountWei, setAmountWei] = useState<BigNumber>(zero);
  const [hash] = useState<string>(window.location.hash);

  const debouncedAmount = useDebounce(amountWei, 500);
  const debouncedAddr = useDebounce(xdcAddr, 500);
  const explorerAddress = explorer[chain?.id || 100|| 10200];

  const {
    isError: isPrepareError,
    error: prepareError,
    config,
  } = usePrepareContractWrite({
    address: registryAddress[chain?.id || 0],
    abi: VerxioPayABI,
    functionName: 'publishAndSend',
    args: [
      '0x' + ephPublic?.getX().toString(16, 64),
      '0x' + ephPublic?.getY().toString(16, 64),
      '0x' + sharedSecretByte,
      debouncedAddr,
    ],
    value: debouncedAmount.toBigInt(),
    enabled: debouncedAmount.gt(zero),
  });

  const { data, isError, error, write, reset } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { data: transaction} = useTransaction({
    hash: data?.hash,
  })

// if (isSuccess){
//   const { hash: transactionHash, 
//     from: fromAddress, 
//     to: toAddress, 
//     value: txnAmount } = transaction || {};
  
    
//     const streamTransaction = {
//       transactionHash,
//       fromAddress,
//       toAddress,
//       amount: ethers.utils.formatEther(txnAmount!)
//     };

//       // Streamr function to Publish to Verxio Transaction pool
//   async function main() {
//     try {
//       const stream = await initializeStreamr();

//       // Publish your message (assuming msg is defined)
//       await stream.publish(streamTransaction);

//       console.log('Message published successfully: ', streamTransaction);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   }

//   main()
//   console.log("Data published successfully!")
// }


  const handleIDInput = (ev: React.FormEvent<HTMLInputElement>) => {
    setTheirID(ev.currentTarget.value);
    setVerxioIDError(false);
    reset();
  };

  const handleAmountInput = (event: React.FormEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value)
    setAmount(event.currentTarget.value);
    setAmountError(false);
  };


  const generateNewEphKey = useCallback(() => {
    if (!theirID) return;

    if (theirID.at(0) !== 'V') {
      setVerxioIDError(true);
      return;
    }

    const _theirID = theirID.slice(1);
    let decodedID: Uint8Array;
    try {
      decodedID = base58.decode(_theirID);
    } catch (e) {
      console.log('Invalid base58 encoding');
      setVerxioIDError(true);
      return;
    }

    if (decodedID.length !== 35) {
      setVerxioIDError(true);
      return;
    }

    const trueID = decodedID.subarray(0, 33);
    const crc = calculateCrc(trueID);
    if (!crc.every((x, idx) => x === decodedID[33 + idx])) {
      console.log('CRC error: ' + crc + '; ' + decodedID);
      setVerxioIDError(true);
      return;
    }

    try {
      const meta = ec.keyFromPublic(trueID, 'hex');

      // generate eph key
      const ephKey = ec.genKeyPair();
      setEphPublic(ephKey.getPublic());

      const ss = ephKey.derive(meta.getPublic());

      const hashed = ec.keyFromPrivate(keccak256(ss.toArray()));
      const pub = meta
        .getPublic()
        .add(hashed.getPublic())
        .encode('array', false);

      const addr = keccak256(pub.splice(1));

      setxdcAddr(
        getAddress('0x' + addr.substring(addr.length - 40, addr.length))
      );

      setSharedSecretByte(ss.toArray()[0].toString(16).padStart(2, '0'));

      console.log(
        `Current ephemeral pubkey: ${ephKey.getPublic().encode('hex', true)}`
      );
    } catch (e) {
      setVerxioIDError(true);
    }
  }, [theirID, ec]);

  useEffect(() => {
    if (!theirID) return;

    if (theirID.startsWith('https://verxio/#')) {
      setTheirID(theirID.replace('https://verxio/#', ''));
    } else {
      generateNewEphKey();
    }
  }, [theirID, generateNewEphKey]);

  useEffect(() => {
    generateNewEphKey();
  }, [isSuccess]);

  useEffect(() => {
    if (hash.length > 20) {
      setTheirID(hash.slice(1));
    }
  }, [hash]);

  useEffect(() => {
    try {
      const _amount = parseEther(amount);
      setAmountWei(_amount);

      if (balance) {
        if (_amount.gte(balance.value)) {
          setAmountError(true);
        }
      }
    } catch (e) {
      setAmountError(true);
    }
  }, [amount, balance]);

  useEffect(() => {
    if (isSuccess) {
      const { hash: transactionHash, 
        from: fromAddress, 
        to: toAddress, 
        value: txnAmount } = transaction || {};
  
      const streamTransaction = {
        transactionHash,
        fromAddress,
        toAddress,
        amount: ethers.utils.formatEther(txnAmount!)
      };
  
      // Streamr function to Publish to Verxio Transaction pool
      async function main() {
        try {
          const stream = await initializeStreamr();
  
          // Publish your message (assuming msg is defined)
          await stream.publish(streamTransaction);
  
          console.log('Message published successfully: ', streamTransaction);
        } catch (error) {
          console.error('Error:', error);
        }
      }
  
      main();
      console.log("Data published successfully!");
    }
  }, [isSuccess, transaction]);
  


  return (
    <div style={{ paddingTop: '1rem' }}>
      <p>
      {chain?.nativeCurrency.symbol || 'Crypto'} will be sent to a secret blockchain account that will hold the {chain?.nativeCurrency.symbol || 'crypto'} temporarily.
      The user who owns the Verxio ID will have control over the secret account.
      </p>
      <form
        className="lane"
        onSubmit={() => {
          return false;
        }}
      >
        <div className="input-container">
          <input
            type="text"
            id="xcryptID"
            value={theirID}
            disabled={!isConnected || isLoading}
            spellCheck="false"
            autoComplete="off"
            placeholder="Enter receiver Verxio ID"
            onChange={handleIDInput}
          />
          <label htmlFor="xcryptID">VERXIO ID</label>
        </div>
      </form>

      {!isConnected && (
             <>
  
        <div  style={{ marginTop: '1.5rem' }}>
        <Connect />
        </div>
     
   
        </>
      )}

      {isConnected && balance && (
        <>
          <div>
            <form
              className="lane"
              onSubmit={() => {
                return false;
              }}
            >
              <div className="header-item">
              <div className="input-container small">
                <input
                  type="text"
                  value={amount}
                  autoComplete="off"
                  id="amount"
                  disabled={isLoading}
                  style={{ textAlign: 'left' }}
                  className={amountError ? 'error-input' : ''}
                  placeholder="0.00"
                  onChange={handleAmountInput}
                />

                <label htmlFor="amount">
                  Amount ({chain?.nativeCurrency.symbol})
                </label>
              </div>
  

                <div className="input-container hint">
                  <input
                    value={`${Number(balance.formatted).toFixed(4)} ${
                      chain?.nativeCurrency.symbol
                    }`}
                    disabled
                  />
                  <label>Available</label>
                </div>
              </div>

              <button
                className="hbutton"
                color="success"
                disabled={!write || isLoading || amountError || VerxioIDError}
                onClick={(e) => {
                  e.preventDefault();
                  write?.();
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faArrowRight} />
                  &nbsp;
                  {isLoading
                    ? 'Sending...'
                    : `Send ${chain?.nativeCurrency.symbol}`}
                </span>
              </button>
            </form>
          </div>
          {VerxioIDError && (
            <div className="lane">
              <p className="message error">Invalid Verxio ID</p>
            </div>
          )}
          {isSuccess && !isError && !isPrepareError && (
            <div className="lane">
              <p className="message">
                <strong>Successfully sent!</strong>&nbsp;
                <a
                  href={`https://${explorerAddress}/tx/${data?.hash}`}
                  className="link-text"
                  target="_blank"
                  rel="noreferrer"
                >
                  View on {chain?.name.split(' ')[0]} Explorer{' '}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    transform={{ rotate: -45 }}
                  />
                </a>
              </p>
            </div>
          )}
          {(isPrepareError || isError) && (
            <div className="lane">
              <p className="message error">
                Error: {(prepareError || error)?.message}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
