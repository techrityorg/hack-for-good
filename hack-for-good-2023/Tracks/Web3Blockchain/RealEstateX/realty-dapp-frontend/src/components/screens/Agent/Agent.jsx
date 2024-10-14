import React from "react";
import Head from "next/head";
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS
import { useWeb3React } from '@web3-react/core'
import { injected } from "@/components/wallet/connectors";
import { User } from 'react-feather'

export function Agent() {
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
        <link rel="stylesheet" type="text/css" href="./css/agent.css" />
        <link href="./css/styleguide.css" rel="stylesheet" />
      </Head>
      <div className="agent">
        <div className="div">
          <div className="frame" />
          <div className="frame-2" />
          <div className="overlap-group-wrapper">
            <div className="overlap-group">
              <div className="frame-3" />
              <div className="frame-wrapper">
                <div className="search-for-your-wrapper">
                  <p className="search-for-your">Search For Your Agent From More Than A Million Agents</p>
                </div>
              </div>
              <div className="div-wrapper">
                <div className="frame-4">
                  <div className="frame-4">
                    <div className="FIND-AN-AGENT">Find An Agent</div>
                  </div>
                </div>
              </div>
              <div className="frame-5">
                <div className="text-wrapper">Agent</div>
              </div>
              <div className="city-or-state-wrapper">
                <div className="text-wrapper">City Or State</div>
              </div>
              <div className="frame-6">
                <div className="text-wrapper">Agent Name</div>
              </div>
              <div className="frame-7">
                <div className="text-wrapper-2">Search</div>
              </div>
              <div className="frame-8">
                <div className="group">
                  <div className="text-wrapper-3">RealEstateX</div>
                </div>
                <div className="navbar">
                  <div className="text-wrapper-4"><a href="./">Buy</a></div>
                  <div className="text-wrapper-6"><a href="./rent">Rent</a></div>
                  <div className="text-wrapper-5"><a href="./agent">Agent</a></div>
                  <div className="text-wrapper-7"><a href="./sell">Sell</a></div>
                  <div className="text-wrapper-8"><a href="./marketplace">Marketplace</a></div>
                </div>
                <div className="frame-9">
                  {
                    account ?
                      <button type="button" className="frame-10 text-wrapper-9 hover:bg-indigo-600">
                        <User
                          size={20}
                          strokeWidth={1.5}
                          className="hidden mr-2 md:flex"
                        />
                        {account.slice(0, -36)}...{account.substring(38)}
                      </button>
                      :
                      <button type="button" onClick={handleWalletConnect} className="frame-10 text-wrapper-9 hover:bg-indigo-600">
                        Connect Wallet
                      </button>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="why-get-an-agent">Why Get An Agent?</div>
          <div className="text-wrapper-10">The Agent’s Advantage</div>
          <div className="overlap">
            <div className="consumer-protection">Consumer Protection</div>
            <p className="the-national">
              <br />
              the National Association Of Agents Works To Support Thriving Neighborhoods Where Agents Live And Work On
              Behalf Of Homebuyers.
            </p>
          </div>
          <p className="the-majority-of">
            <br />
            the Majority Of People&#39;s Largest Investment Will Be In A Home, But Not All Real Estate Brokers Are Created
            Equal.&nbsp;&nbsp;An Agent’s Experience And Education Will Help You Buy The House Of Your Dreams.
          </p>
        </div>
      </div>
    </>
  );
};
