import React from "react";
import Head from "next/head";
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS
import { useWeb3React } from '@web3-react/core'
import { injected } from "@/components/wallet/connectors";
import { User } from 'react-feather'

export function Marketplace() {
  const { account, active, activate, chainId, connector, library, deactivate } = useWeb3React()

  async function handleWalletConnect() {
    try {
      await activate(injected);
    } catch (error) {
      console.error("Error while trying to connect wallet:", error);
    }
  }

  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <title>RealEstateX - Real Estate Dapp</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat:300,700,100,200,400,600" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css" />
        <link rel="stylesheet" type="text/css" href="./css/marketplace.css" />
        <link href="./css/styleguide.css" rel="stylesheet" />
      </Head>
      <div className="marketplace">
        <div className="div">
          <div className="ellipse" />
          <div className="frame">
            <div className="frame-wrapper">
              <div className="div-wrapper">
                <div className="frame-2">
                  <div className="frame-2">
                    <div className="real-estate">Real Estate Investing</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="investors-around-the">
              <span className="text-wrapper">
                Investors around the globe can buy into the real estate market through&nbsp;&nbsp;tokenized ownership.
                Powered by{" "}
              </span>
              <span className="span">blockchain</span>
              <span className="text-wrapper">.</span>
            </p>
            <div className="get-started-wrapper">
              <div className="get-started">Get Started</div>
            </div>
            <div className="frame-3">
              <div className="group">
                <div className="text-wrapper-2">RealEstateX</div>
              </div>
              <div className="navbar">
                <div className="text-wrapper-3"><a href="./">Buy</a></div>
                <div className="text-wrapper-4"><a href="./rent">Rent</a></div>
                <div className="text-wrapper-5"><a href="./agent">Agent</a></div>
                <div className="text-wrapper-6"><a href="./sell">Sell</a></div>
                <div className="text-wrapper-7"><a href="./marketplace">Marketplace</a></div>
              </div>
              <div className="frame-4">
                {
                  account ?
                    <button type="button" className="frame-5 text-wrapper-8 hover:bg-indigo-600">
                      <User
                        size={20}
                        strokeWidth={1.5}
                        className="hidden mr-2 md:flex"
                      />
                      {account.slice(0, -36)}...{account.substring(38)}
                    </button>
                    :
                    <button type="button" onClick={handleWalletConnect} className="frame-5 text-wrapper-8 hover:bg-indigo-600">
                      Connect Wallet
                    </button>
                }
              </div>
            </div>
          </div>
          <div className="HOW-WE-WORK">How We Work</div>
          <p className="a-property">
            <span className="text-wrapper-9">
              <br />
            </span>
            <span className="text-wrapper-10">
              <br />A property management company oversees each RealT property on behalf of the RealToken owners. The
              diverse set of RealToken owners don&#39;t have to worry about finding tenants, collecting rent, or handling
              maintenance because the property management firm takes care of everything. Rent payments are automatically
              sent to investors
              <br />
            </span>
          </p>
          <p className="r-offers-buyers-a">
            R Offers Buyers A Straightforward, Clever, And User-friendly Way To Invest In Fractional, Tokenized Homes.{" "}
            <br />
            ownership Of Each Property Is Distributed Across A Finite Number Of Representative Tokens. Based On Token
            Share, Owners Can Collect Revenue From Rent, And Vote On Property Decisions.
          </p>
          <p className="legal-entities-can">
            <span className="text-wrapper-9">
              <br />
            </span>
            <span className="text-wrapper-10">
              Legal entities can be tokenized directly, but real estate cannot. A corporation (either an Inc. or an LLC)
              owns each piece of real estate. Each business has its own set of RealTokens that are tokenized and made
              accessible for purchase Rent Payments Weekly. We no longer have to wait 30 days to get a bank transfer
              thanks to blockchain technology. You can receive weekly rent if you own property with RealT. Your Chain or
              Ethereum wallet will receive a rent payment.
            </span>
          </p>
          <div className="frame-6">
            <div className="overlap-group-wrapper">
              <div className="overlap-group">
                <img className="subtract" alt="Subtract" src="./img/subtract.svg" />
                <div className="EMAIL-ADDRESS">Email Address</div>
              </div>
            </div>
            <div className="subscribe-to-get">Subscribe To Get Updates</div>
            <div className="frame-7">
              <div className="text-wrapper-11">Subscribe</div>
            </div>
          </div>
          <img
            className="element"
            alt="Element"
            src="./img/1434-ahr0chm6ly9zmy5jb2ludgvszwdyyxbolmnvbs9zdg9yywdll3vwbg9hzhm.png"
          />
        </div>
      </div>
    </>
  );
};
