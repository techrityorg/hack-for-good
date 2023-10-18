import React from "react";
import Head from "next/head";
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS
import { useWeb3React } from '@web3-react/core'
import { injected } from "@/components/wallet/connectors";
import { User } from 'react-feather'

export function Buy() {
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
        <link rel="stylesheet" type="text/css" href="./css/buy.css" />
        <link href="./css/styleguide.css" rel="stylesheet" />
      </Head>
      <div className="buy">
        <div className="div">
          <div className="ellipse" />
          <div className="frame">
            <p className="text-wrapper">Browse Homes In Your Area</p>
          </div>
          <div className="div-wrapper">
            <div className="text-wrapper">Affordable Homes</div>
          </div>
          <div className="frame-2">
            <div className="text-wrapper">Luxury Home</div>
          </div>
          <div className="overlap">
            <div className="frame-3">
              <div className="text-wrapper-2">N2,000,000</div>
              <p className="p">
                11124 Grace Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element-bed">
                <span className="span">3 </span>
                <span className="text-wrapper-3">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">2 </span>
                <span className="text-wrapper-3">bath</span>
              </p>
              <p className="element-sqft">
                <span className="span">1,234 </span>
                <span className="text-wrapper-4">sqft</span>
              </p>
            </div>
            <div className="frame-4" />
          </div>
          <div className="overlap-group">
            <div className="frame-3">
              <div className="text-wrapper-2">N2,000,000</div>
              <p className="p">
                11124 Grace Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element-bed">
                <span className="span">3 </span>
                <span className="text-wrapper-3">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">2 </span>
                <span className="text-wrapper-3">bath</span>
              </p>
              <p className="element-sqft">
                <span className="span">1,234 </span>
                <span className="text-wrapper-4">sqft</span>
              </p>
            </div>
            <div className="frame-5" />
          </div>
          <div className="overlap-2">
            <div className="frame-3">
              <div className="text-wrapper-2">N2,000,000</div>
              <p className="p">
                11124 Grace Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element-bed">
                <span className="span">3 </span>
                <span className="text-wrapper-3">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">2 </span>
                <span className="text-wrapper-3">bath</span>
              </p>
              <p className="element-sqft">
                <span className="span">1,234 </span>
                <span className="text-wrapper-4">sqft</span>
              </p>
            </div>
            <div className="frame-6" />
          </div>
          <div className="overlap-3">
            <div className="frame-3">
              <div className="text-wrapper-5">N4,000,000</div>
              <p className="p">
                11124 Sdake Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element-bed-2">
                <span className="span">1 </span>
                <span className="text-wrapper-3">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">3 </span>
                <span className="text-wrapper-3">bath</span>
              </p>
              <p className="element-sqft-2">
                <span className="span">1,434 </span>
                <span className="text-wrapper-4">sqft</span>
              </p>
            </div>
            <div className="frame-7" />
          </div>
          <div className="overlap-4">
            <div className="frame-3">
              <div className="text-wrapper-5">N4,000,000</div>
              <p className="p">
                11124 Sdake Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element-bed-2">
                <span className="span">1 </span>
                <span className="text-wrapper-3">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">3 </span>
                <span className="text-wrapper-3">bath</span>
              </p>
              <p className="element-sqft-2">
                <span className="span">1,434 </span>
                <span className="text-wrapper-4">sqft</span>
              </p>
            </div>
            <div className="frame-8" />
          </div>
          <div className="overlap-5">
            <div className="frame-3">
              <div className="text-wrapper-5">N4,000,000</div>
              <p className="p">
                11124 Sdake Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element-bed-2">
                <span className="span">1 </span>
                <span className="text-wrapper-3">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">3 </span>
                <span className="text-wrapper-3">bath</span>
              </p>
              <p className="element-sqft-2">
                <span className="span">1,434 </span>
                <span className="text-wrapper-4">sqft</span>
              </p>
            </div>
            <div className="frame-9" />
          </div>
          <div className="overlap-6">
            <div className="frame-3">
              <div className="text-wrapper-2">N7,000,000</div>
              <p className="p">
                11124 Grace Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element">
                <span className="span">7</span>
                <span className="text-wrapper-3">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">3 </span>
                <span className="text-wrapper-3">bath</span>
              </p>
              <p className="element-sqft">
                <span className="span">1,679 </span>
                <span className="text-wrapper-4">sqft</span>
              </p>
            </div>
            <div className="frame-10" />
          </div>
          <div className="overlap-7">
            <div className="frame-3">
              <div className="text-wrapper-2">N7,000,000</div>
              <p className="p">
                11124 Grace Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element">
                <span className="span">7</span>
                <span className="text-wrapper-3">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">3 </span>
                <span className="text-wrapper-3">bath</span>
              </p>
              <p className="element-sqft">
                <span className="span">1,679 </span>
                <span className="text-wrapper-4">sqft</span>
              </p>
            </div>
            <div className="frame-4" />
          </div>
          <div className="overlap-8">
            <div className="frame-3">
              <div className="text-wrapper-2">N7,000,000</div>
              <p className="p">
                11124 Grace Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element">
                <span className="span">7</span>
                <span className="text-wrapper-3">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">3 </span>
                <span className="text-wrapper-3">bath</span>
              </p>
              <p className="element-sqft">
                <span className="span">1,679 </span>
                <span className="text-wrapper-4">sqft</span>
              </p>
            </div>
            <div className="frame-11" />
          </div>
          <div className="frame-12" />
          <div className="overlap-9">
            <div className="get-local-info-on-wrapper">
              <p className="text-wrapper">Get Local Info On House</p>
            </div>
            <p className="does-it-have-pet">
              Does It Have Pet-friendly Rentals? How Are The Schools In The Area? Get Important Local Information On The
              Area You&#39;re Most Interested In.
            </p>
            <div className="group">
              <div className="overlap-group-2">
                <div className="rectangle" />
                <button type="button" className="group-2">
                  <div className="ellipse-2 hover:bg-indigo-600" />
                  <img className="icon-search hover:bg-indigo-600" alt="Icon search" src="./img/icon-search.png" />
                </button>
                <input className="address-city-town" placeholder="Address, City, Town, State, Zip Code School" />
              </div>
            </div>
          </div>
          <div className="frame-13">
            <div className="frame-14">
              <div className="frame-15">
                <div className="frame-wrapper">
                  <div className="frame-15">
                    <div className="frame-15">
                      <div className="NFT-REAL-ESTATE">Nft Real Estate</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="buy-rent-sell-invest-wrapper">
                <div className="buy-rent-sell-invest">Buy | rent | sell | invest</div>
              </div>
            </div>
            <div className="overlap-group-wrapper">
              <div className="">
                <input className="address-city-town-2 overlap-group-3" placeholder="Address, City, Town, State, Zip Code School" />
                <button type="button" className="icon-search-wrapper hover:bg-indigo-600">
                  <img className="img" alt="Icon search" src="./img/icon-search.png" />
                </button>
              </div>
            </div>
            <div className="frame-16">
              <div className="group-3">
                <div className="text-wrapper-6">RealEstateX</div>
              </div>
              <div className="navbar">
                <div className="text-wrapper-7"><a href="./">Buy</a></div>
                <div className="text-wrapper-8"><a href="./rent">Rent</a></div>
                <div className="text-wrapper-9"><a href="./agent">Agent</a></div>
                <div className="text-wrapper-10"><a href="./sell">Sell</a></div>
                <div className="text-wrapper-11"><a href="./marketplace">Marketplace</a></div>
              </div>
              <div className="frame-17">
                {
                  account ?
                    <button type="button" className="frame-18 text-wrapper-12 hover:bg-indigo-600">
                      <User
                        size={20}
                        strokeWidth={1.5}
                        className="hidden mr-2 md:flex"
                      />
                      {account.slice(0, -36)}...{account.substring(38)}
                    </button>
                    :
                    <button type="button" onClick={handleWalletConnect} className="frame-18 text-wrapper-12 hover:bg-indigo-600">
                      Connect Wallet
                    </button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
