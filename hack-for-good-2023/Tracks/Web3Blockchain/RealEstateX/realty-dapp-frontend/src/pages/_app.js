import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'

function getLibrary(provider) {
    return new Web3(provider);
}

export default function MyApp({ Component, pageProps }) {
    return (
        <Web3ReactProvider getLibrary={getLibrary} >
            <Component {...pageProps} />
        </Web3ReactProvider>
    )
}