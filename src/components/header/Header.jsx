import React from "react";
import * as nearAPI from "near-api-js";
import { NavLink } from "react-router-dom";
import TextTruncate from "react-text-truncate";

import { CHeaderToggler } from "@coreui/react";

import logo from "../../assets/images/logo.svg";
import avatar from "../../assets/images/avatar.svg";
import { Container, Image, Nav, Navbar } from "react-bootstrap";
import {
  BoxArrowRight,
  CartPlus,
  ClockHistory,
  CloudUpload,
  GraphUpArrow,
  HouseFill
} from "react-bootstrap-icons";

import { Link } from "react-router-dom";

import CIcon from "@coreui/icons-react";
import { cilHamburgerMenu } from "@coreui/icons";
import { useEffect, useState, useLayoutEffect } from "react";
import connectionConfig from "../../ConfigJson";
import { Button } from "@coreui/coreui";
import UAuth, { UserInfo } from '@uauth/js'
import { Modal } from "../utils";


const { keyStores, connect, WalletConnection, ConnectedWalletAccount, utils } =
  nearAPI;
const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();

export let accountt;

const Header = ({ openSideBar }) => {
  const [signedIn, setSignedIn] = useState("connect wallet");

  const [accountBalance, setAccountBalance] = useState(undefined);

  const [selected, setSelected] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [nearWallet, setNearWallet] = useState()


  const [connected, setConnected] = useState(false)

  const [udUser, setUdUser] = useState()
  const [uDauth, setUDauth] = useState()

  // function for setting neaer wallet connection to a usestate varialbe 
  const setNear = async () => {
    const nearConnection = await connect(connectionConfig);
    const walletConnection = new WalletConnection(nearConnection);
    setNearWallet(walletConnection)
  }

  useEffect(() => {
    setNear()
  }, [])

  // function for setting UD authenticator to a usestate varialbe  
  useEffect(() => {
    const uDauth = new UAuth({
      clientID: "772fa165-a309-400e-bb69-4a68a80e8087",
      redirectUri: `${location.origin}`,
      scope: "openid wallet email profile:optional social:optional"
    })
    setUDauth(uDauth)
  }, [])

  useEffect(() => {
    setSignedIn(udUser?.sub || "Connect Wallet")
  }, [connected])


  useEffect(() => {
    const signedUser = async () => {
      const nearConnection = await connect(connectionConfig);

      const walletConnection = new WalletConnection(nearConnection);
      setSignedIn(walletConnection.getAccountId() || "Connect Wallet");
      console.log(walletConnection.getAccountId());
      const account = await nearConnection.account(
        walletConnection.getAccountId()
      );

      console.log(
        utils.format.formatNearAmount(
          (await account.getAccountBalance()).available
        )
      );
      setAccountBalance(
        utils.format.formatNearAmount(
          (await account.getAccountBalance()).available
        )
      );
    };
    signedUser();
    // setSignedIn("Connect wallet");
  }, []);




  const connectNearWallet = (walletConnection) => {
    walletConnection.requestSignIn(
      "healthgo_admin_dashboard", // contract requesting access
      "Example App", // optional title
      "https://google.com", // optional redirect URL on success
      "localhost:3000" // optional redirect URL on failure
    );
  };

  const handleConnect = async () => {

    console.log('runnubg')
    async function check() {
      if (!connected) {
        setSelected(null)
        setIsOpen(true)
        return
      } else if (connected) {
        if (nearWallet?.isSignedIn()) {
          nearWallet.signOut()
        }
        if (udUser != undefined && uDauth != undefined) {
          await uDauth.logout()
          location.reload()
        }
        setConnected(false)
        setSelected(null)
        return
      }

      setSelected(null)
      setIsOpen(true)
    }

    check()

  }

  // login 
  useEffect(() => {
    async function login() {

      if (selected == 'UD' && udUser == undefined && uDauth != undefined) {
        try {
          await uDauth.loginWithPopup()
          location.reload()
        } catch (error) {
          console.log(error)
        }
      }

      if (selected == 'NEAR' && !nearWallet.isSignedIn()) {
        try {
          connectNearWallet(nearWallet)
        } catch (err) {
          console.log(err)
        }
      }
    }

    login()
  }, [selected])


  useEffect(() => {
    if (udUser != undefined || nearWallet?.isSignedIn()) {
      setConnected(true)
    } else {
      setConnected(false)
    }
  }, [nearWallet?.isSignedIn(), udUser])

  useEffect(() => {
    if (uDauth != undefined && udUser == undefined) {
      try {
        uDauth.user()
          .then((user) => {
            setUdUser(user)
          })
          .catch((e) => {
            console.log(e)
          })
      } catch (err) {
        // console.log(err)
      }
    }
  }, [uDauth])



  return (
    <Navbar
      className="bg-primary d-flex shadow-sm"
      fixed="top"
      style={{ display: "flex", height: "100px" }}
    >
      <Container fluid className="d-flex">
        <CHeaderToggler className="mr-5" onClick={openSideBar}>
          <CIcon icon={cilHamburgerMenu} size="xl" />
        </CHeaderToggler>

        <Navbar.Brand>
          <Link to="/" className="link text-primary">
            <Image src={logo} />
            HealthGo Admin Dashboard
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {/* <div className="">
            <Image
              src={avatar}
              className="rounded-circle border-primary p-1"
              style={{ margin: "0px 10px 0px 0px " }}
            />
          </div> */}
          <div
            className="p-3 rounded-lg mr-[55px] w-auto cursor-pointer border-primary border-3"
            onClick={handleConnect}
          >
            <div className="text-primary flex align-center items-center">
              <span className="mr-3" >{signedIn}</span>
              <BoxArrowRight size={20} />
            </div>
          </div>

          {/* <Navbar.Text
            className="text-primary"
            onClick={async () => {
              const nearConnection = await connect(connectionConfig);
              const walletConnection = new WalletConnection(nearConnection);
              if (walletConnection.isSignedIn()) {
                walletConnection.signOut();
                setSignedIn("Connect Wallet");
              } else if (!walletConnection.isSignedIn()) {
                connectWallet();
              }
            }}
          >
            <TextTruncate
              line={1}
              element="span"
              truncateText="…"
              text={signedIn}
              // textTruncateChild={<a href="#">Read on</a>}
              // maxCalculateTimes={30}
            />
          </Navbar.Text> */}
          <Modal isOpen={isOpen} setSelected={setSelected} setIsOpen={setIsOpen} />

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;



