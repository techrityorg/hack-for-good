import React from "react";
import Head from "next/head";
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS
import { useWeb3React } from '@web3-react/core'
import { injected } from "@/components/wallet/connectors";
import { User } from 'react-feather'

export function Rent() {
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
        <link rel="stylesheet" type="text/css" href="./css/rent.css" />
        <link href="./css/styleguide.css" rel="stylesheet" />
      </Head>
      <div className="rent">
        <div className="div">
          <div className="overlap">
            <div className="overlap-group">
              <div className="frame">
                <div className="frame-wrapper">
                  <div className="div-wrapper">
                    <div className="div-wrapper">
                      <div className="discover-houses-for">Discover Houses For Rent</div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="search-nearby">Search Nearby Apartments, Condos, And Homes For Rent</p>
            </div>
            <div className="frame-2">
              <img className="icon-search" alt="Icon search" src="./img/icon-search.png" />
              <p className="address-city-town">Address, City, Town, State, Zip Code School</p>
            </div>
            <div className="frame-3">
              <div className="group">
                <div className="text-wrapper">RealEstateX</div>
              </div>
              <div className="navbar">
                <div className="text-wrapper-2"><a href="./">Buy</a></div>
                <div className="text-wrapper-3"><a href="./rent">Rent</a></div>
                <div className="text-wrapper-4"><a href="./agent">Agent</a></div>
                <div className="text-wrapper-5"><a href="./sell">Sell</a></div>
                <div className="text-wrapper-6"><a href="./marketplace">Marketplace</a></div>
              </div>
              <div className="frame-4">
                {
                  account ?
                    <button type="button" className="frame-5 text-wrapper-7 hover:bg-indigo-600">
                      <User
                        size={20}
                        strokeWidth={1.5}
                        className="hidden mr-2 md:flex"
                      />
                      {account.slice(0, -36)}...{account.substring(38)}
                    </button>
                    :
                    <button type="button" onClick={handleWalletConnect} className="frame-5 text-wrapper-7 hover:bg-indigo-600">
                      Connect Wallet
                    </button>
                }
              </div>
            </div>
          </div>
          <div className="ellipse" />
          <div className="frame-6">
            <div className="text-wrapper-8">Newest Listings</div>
          </div>
          <div className="see-the-most-up-to-wrapper">
            <p className="text-wrapper-9">See The Most Up-to-date Houses</p>
          </div>
          <div className="explore-clearwater-wrapper">
            <div className="explore-clearwater">Explore Clearwater Beach, Fl</div>
          </div>
          <div className="pet-friendly-rentals-wrapper">
            <div className="text-wrapper-9">Pet-friendly Rentals</div>
          </div>
          <div className="rentals-with-in-unit-wrapper">
            <div className="text-wrapper-8">Rentals With In-unit Laundry</div>
          </div>
          <div className="rentals-with-pools-wrapper">
            <div className="text-wrapper-8">Rentals With Pools</div>
          </div>
          <div className="overlap-2">
            <div className="frame-7">
              <div className="text-wrapper-10">N2,000,000</div>
              <p className="p">
                11124 Grace Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element-bed">
                <span className="span">3 </span>
                <span className="text-wrapper-11">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">2 </span>
                <span className="text-wrapper-11">bath</span>
              </p>
              <p className="element-sqft">
                <span className="span">1,234 </span>
                <span className="text-wrapper-12">sqft</span>
              </p>
            </div>
            <div className="frame-8" />
          </div>
          <div className="overlap-3">
            <div className="frame-7">
              <div className="text-wrapper-13">N9,000,000</div>
              <p className="p">
                11124 Grace Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element-bed">
                <span className="span">3 </span>
                <span className="text-wrapper-11">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">2 </span>
                <span className="text-wrapper-11">bath</span>
              </p>
              <p className="element-sqft">
                <span className="span">1,234 </span>
                <span className="text-wrapper-12">sqft</span>
              </p>
            </div>
            <div className="frame-9" />
          </div>
          <div className="overlap-4">
            <div className="frame-7">
              <div className="text-wrapper-14">N2,000,000</div>
              <p className="p">
                11124 Grace Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element-bed">
                <span className="span">3 </span>
                <span className="text-wrapper-11">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">2 </span>
                <span className="text-wrapper-11">bath</span>
              </p>
              <p className="element-sqft">
                <span className="span">1,234 </span>
                <span className="text-wrapper-12">sqft</span>
              </p>
            </div>
            <div className="frame-10" />
          </div>
          <div className="overlap-5">
            <div className="frame-7">
              <div className="text-wrapper-14">N2,000,000</div>
              <p className="p">
                11124 Grace Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element-bed">
                <span className="span">3 </span>
                <span className="text-wrapper-11">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">2 </span>
                <span className="text-wrapper-11">bath</span>
              </p>
              <p className="element-sqft">
                <span className="span">1,234 </span>
                <span className="text-wrapper-12">sqft</span>
              </p>
            </div>
            <div className="frame-11" />
          </div>
          <div className="overlap-6">
            <div className="frame-7">
              <div className="text-wrapper-15">N4,000,000</div>
              <p className="p">
                11124 Sdake Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element-bed-2">
                <span className="span">4 </span>
                <span className="text-wrapper-11">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">3 </span>
                <span className="text-wrapper-11">bath</span>
              </p>
              <p className="element-sqft-2">
                <span className="span">1,434 </span>
                <span className="text-wrapper-12">sqft</span>
              </p>
            </div>
            <div className="frame-12" />
          </div>
          <div className="overlap-7">
            <div className="frame-7">
              <div className="text-wrapper-16">N4,000,000</div>
              <p className="p">
                11124 Sdake Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element-bed-2">
                <span className="span">1 </span>
                <span className="text-wrapper-11">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">3 </span>
                <span className="text-wrapper-11">bath</span>
              </p>
              <p className="element-sqft-2">
                <span className="span">1,434 </span>
                <span className="text-wrapper-12">sqft</span>
              </p>
            </div>
            <div className="frame-13" />
          </div>
          <div className="overlap-8">
            <div className="frame-7">
              <div className="text-wrapper-16">N4,000,000</div>
              <p className="p">
                11124 Sdake Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element-bed-2">
                <span className="span">1 </span>
                <span className="text-wrapper-11">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">3 </span>
                <span className="text-wrapper-11">bath</span>
              </p>
              <p className="element-sqft-2">
                <span className="span">1,434 </span>
                <span className="text-wrapper-12">sqft</span>
              </p>
            </div>
            <div className="frame-14" />
          </div>
          <div className="overlap-group-2">
            <div className="frame-7">
              <div className="text-wrapper-16">N4,000,000</div>
              <p className="p">
                11124 Sdake Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element-bed-2">
                <span className="span">1 </span>
                <span className="text-wrapper-11">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">3 </span>
                <span className="text-wrapper-11">bath</span>
              </p>
              <p className="element-sqft-2">
                <span className="span">1,434 </span>
                <span className="text-wrapper-12">sqft</span>
              </p>
            </div>
            <div className="frame-15" />
          </div>
          <div className="overlap-9">
            <div className="frame-7">
              <div className="text-wrapper-17">N7,000,000</div>
              <p className="p">
                11124 Grace Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element">
                <span className="span">5 </span>
                <span className="text-wrapper-11">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">3 </span>
                <span className="text-wrapper-11">bath</span>
              </p>
              <p className="element-sqft">
                <span className="span">1,679 </span>
                <span className="text-wrapper-12">sqft</span>
              </p>
            </div>
            <div className="frame-16" />
          </div>
          <div className="overlap-10">
            <div className="frame-7">
              <div className="text-wrapper-14">N7,000,000</div>
              <p className="p">
                11124 Grace Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element">
                <span className="span">7</span>
                <span className="text-wrapper-11">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">3 </span>
                <span className="text-wrapper-11">bath</span>
              </p>
              <p className="element-sqft">
                <span className="span">1,679 </span>
                <span className="text-wrapper-12">sqft</span>
              </p>
            </div>
            <div className="frame-17" />
          </div>
          <div className="overlap-11">
            <div className="frame-7">
              <div className="text-wrapper-14">N7,000,000</div>
              <p className="p">
                11124 Grace Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element">
                <span className="span">7</span>
                <span className="text-wrapper-11">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">3 </span>
                <span className="text-wrapper-11">bath</span>
              </p>
              <p className="element-sqft">
                <span className="span">1,679 </span>
                <span className="text-wrapper-12">sqft</span>
              </p>
            </div>
            <div className="frame-18" />
          </div>
          <div className="overlap-12">
            <div className="frame-7">
              <div className="text-wrapper-14">N7,000,000</div>
              <p className="p">
                11124 Grace Avenue,
                <br />
                german Street, Sd 2025
              </p>
              <p className="element">
                <span className="span">7</span>
                <span className="text-wrapper-11">bed</span>
              </p>
              <p className="element-bath">
                <span className="span">3 </span>
                <span className="text-wrapper-11">bath</span>
              </p>
              <p className="element-sqft">
                <span className="span">1,679 </span>
                <span className="text-wrapper-12">sqft</span>
              </p>
            </div>
            <div className="frame-11" />
          </div>
        </div>
      </div>
    </>
  );
};
