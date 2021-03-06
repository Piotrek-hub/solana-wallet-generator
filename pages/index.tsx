import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
const {
  Keypair,
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction, 
  SystemProgram
} = require("@solana/web3.js");

import { useState } from "react"
import {
  Flex,
  Heading,
  Text,
  Button,
  Box,
  Input
} from "@chakra-ui/react"

const solanaWeb3 = require('@solana/web3.js');



const Home: NextPage = () => {
  const [account, setAccount] = useState<typeof Keypair>();
  const [balance, setBalance] = useState<Number>(0);
  const [publicKey, setPublicKey] = useState<String>("")
  const [privateKey, setPrivateKey] = useState<String>("")
  const [buttonStatus, setButtonStatus] = useState<boolean>(false)
  const [connection, setConnection] = useState();

  const createConnection = () => {
    return new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("testnet"))
  }

  const createAccount = () => {
    const keypair = Keypair.generate();
    console.log(Object.keys(keypair.secretKey))
    setAccount(keypair)
    setPublicKey(keypair.publicKey.toBase58())
    setPrivateKey(keypair.secretKey.toString())
    setBalance(0)
  }

  const getBalance = async (publicKey: typeof PublicKey | undefined) => {
    if (publicKey === undefined)
      return
    const connection = createConnection();

    const lamports = await connection.getBalance(publicKey).catch((err: Error) => {
      console.error(err)
    })
    return (lamports as number) / LAMPORTS_PER_SOL;
  }

  const requestAirdrop = async (publicKey: typeof PublicKey) => {
    setButtonStatus(true);
    const connection = createConnection();

    console.log("Public key: ", publicKey)
    const airdropSignature = await connection.requestAirdrop(
      publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);
    const newBalance = await getBalance(publicKey)
    setBalance((newBalance as number))
    setButtonStatus(false);
  };


  return (
    <div className={styles.container} >
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Solana Wallet Generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex w="100%" h="100vh" bg="white" alignItems="center" justifyContent="space-around" flexDirection="column">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Flex w="100%" alignItems="center" justifyContent="flex-start" flexDirection="column">
            <Heading size="lg" p="0" mb="4" >Public Key</Heading>
            <Text>
              {publicKey}
            </Text>
          </Flex>


          <Flex w="100%" alignItems="center" justifyContent="flex-start" flexDirection="column">
            <Heading size="lg" p="0"  mb="4">Secret Key</Heading>
            <Text>
              {privateKey}
            </Text>
          </Flex>
          <Flex w="100%" alignItems="center" justifyContent="flex-start" flexDirection="column">
            <Heading size="lg" p="0" mb="4" >Balance</Heading>
            <Text fontSize="lg" p="0" mb="10">{balance} SOL</Text>
          </Flex>
          <Button
            isLoading={buttonStatus}
            variant="solid"
            size="md"
            colorScheme="purple"
            mb="5"
            loadingText='Requesting Airdrop'
            onClick={() => { requestAirdrop(account?.publicKey) }}
          >
            REQUEST AIRDROP
          </Button>
          <Button variant="outline" size="md" colorScheme="purple" onClick={createAccount}>
            CREATE NEW ACCOUNT
          </Button>

        </Box>

      </Flex>
    </div>
  )
}

export default Home
/*
Av89JZDXnU8nfb5WZcsVasqWQnK2QHFik6m5TAp9ro2C
GeKvZ6cXMrrzxYD8RbZnquUD3Wi3EomGRaiJWwTdG1zc
*/