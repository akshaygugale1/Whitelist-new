import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { ABI, WHITELIST_CONTARCT_ADDRESS } from "../constants/constants";

export default function Home() {
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelistt, setJoinedWhitelistt] = useState(false);

  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

  const checkIfAddressIsWhitelisted = async () => {
    try {
      const signer = await getProviderORSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTARCT_ADDRESS,
        ABI,
        signer
      );
      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelistt(_joinedWhitelist);
    } catch (error) {
      console.error(error);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      const signer = await getProviderORSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTARCT_ADDRESS,
        ABI,
        signer
      );
      const number = await whitelistContract.numWhitelistedAddresses();
      setNumberOfWhitelisted(number);
    } catch (error) {
      console.error(error);
    }
  };

  const addAdressToWhitelist = async () => {
    try {
      const signer = await getProviderORSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTARCT_ADDRESS,
        ABI,
        signer
      );
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumberOfWhitelisted();
      setJoinedWhitelistt(true);
    } catch (error) {
      console.error(error);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelistt) {
        return (
          <div className={styles.description}>Thanks for joining whitelist</div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAdressToWhitelist} className={styles.button}>
            Join Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect Wallet
        </button>
      );
    }
  };

  const getProviderORSigner = async (needSigner = false) => {
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const { chainId } = await web3Provider.getNetwork();
      if (chainId !== 5) {
        window.alert("Please cponnect to goerli");
        throw new Error("Please cponnect to goerli");
      }
      if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderORSigner();
      setWalletConnected(true);
      await checkIfAddressIsWhitelisted();
      await getNumberOfWhitelisted();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}