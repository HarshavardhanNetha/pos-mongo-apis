import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import { useRef, useState } from "react";
import Confetti from "react-confetti";
import request from "request";


export async function getServerSideProps(context) {
  try {
    await clientPromise
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands
    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default function Home({
  isConnected,
}) {
  const [backdropOpen, setBackDropOpen] = useState(false);
  const [validator, setValidator] = useState(false);
  const [stake, setStake] = useState(false);
  const [chooseValidator, setChooseValidator] = useState(false);
  const [showConfetti, setShowConfett] = useState(false);
  const [email,setEmail] = useState("")
  const [name,setName] = useState("")
  const [fee,setFee] = useState("")
  const [publicKey,setPublicKey] = useState("")


  const width = typeof window !== "undefined" ? window.innerWidth : 1000;
  const height = typeof window !== "undefined" ? window.innerHeight : 400;
  console.log({ width, height });

  const showConfFunc = () => {
    scrollToTop.current.scrollIntoView({ behavior: "smooth" });
    setShowConfett(true);
    setInterval(() => {
      setShowConfett(false);
    }, 20000);
  };

  const stepOneRef = useRef(null);
  const scrollToTop = useRef(null);

  const addValidatorAPICall = async () => {

    var options = { method: 'POST',
      url: "/api/addValidator",
      headers: 
      {'content-type': 'application/json' },
      body: 
      { email: email,
        name: name,
        fee: fee,
        publicKey: publicKey },
      json: true };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });

  }

  return (
    <div>
    <Head>
      <title>Proof of Stake</title>
      <meta name="description" content="Proof of Stake Implementation" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className="max-w-6xl py-10 m-auto space-y-20 text-gray-700">
      {showConfetti && <Confetti width={width} height={height} />}
      <div className="flex flex-col md:flex-row w-full rounded-sm bg-gray-700">
        <div ref={scrollToTop} className="p-10 w-full md:w-1/2 space-y-2 text-gray-50">
          <h1 className="text-2xl">Proof of Stake</h1>
          <p>
            Is a consensus mechanism that is developed to address the problems
            with Proof of Work like Energy Consumption, 51% Attack, etc. Below
            is a basic implementation of Proof Of Stake to choose a validator
            who adds the next block to the chain.
          </p>
          <button
            onClick={() => {
              stepOneRef.current.scrollIntoView({ behavior: "smooth" });
              // window.scrollTo(0, stepOneRef.current.offsetTop);
            }}
            className="bg-gray-300 text-gray-800 px-2 py-1 shadow-md rounded-sm"
          >
            Continue
          </button>
        </div>
        <div className="md:w-1/2 w-full bg-gray-500 m-10"></div>
      </div>

      <div
        ref={stepOneRef}
        className="flex flex-col md:flex-row w-full md:justify-between items-center"
      >
        <div className="w-full md:w-1/3 space-y-2">
          <h1 className="text-2xl">STEP 1</h1>
          <p>
            The first step is to add a validator with basic details.A user
            stakes some of the native tokens of the network which makes that
            node eligible for mining. The probability of a node being selected
            as a miner depends on the amount it Staked.
          </p>
          <p>To simulate the process, fill the form and submit.</p>
          <div className="flex space-x-10 pt-4">
            <button className="px-4 py-2 w-full bg-gray-200 text-gray-600 border border-gray-400" onClick={addValidatorAPICall}>
              SUBMIT 
            </button>
            <button className="px-4 py-2 w-full bg-white border text-gray-600 ">
              CLEAR
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-3">
          <h1 className="text-textColor">Add Validator</h1>
          <input
            className="border w-full outline-none p-2 rounded-sm text-sm text-gray-700"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
          <input
            className="border w-full outline-none p-2 rounded-sm text-sm text-gray-700"
            placeholder="FullName"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
          <input
            className="border w-full outline-none p-2 rounded-sm text-sm text-gray-700"
            placeholder="Public Key"
            value={publicKey}
            onChange={(e)=>setPublicKey(e.target.value)}
          />
          <input
            className="border w-full outline-none p-2 rounded-sm text-sm text-gray-700"
            placeholder="Amount Staked"
            value={fee}
            onChange={(e)=>setFee(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full md:justify-between ">
        <div className="w-full md:w-1/3 space-y-2">
          <h1 className="text-2xl">STEP 2</h1>
          <p>
            Followed by addition of user, we normalize the stake values and
            generate a roulette wheel to
          </p>
        </div>
        <div className="w-full md:w-1/2 space-y-3">Chart</div>
      </div>

      <div className="bg-gray-700 h-40 flex items-center justify-center">
        <button
          onClick={() => {
            showConfFunc();
          }}
          className="px-4 py-2 shadow-sm rounded-sm bg-gray-200 text-gray-600 border border-gray-400"
        >
          CLICK TO REVEAL
        </button>
      </div>
    </div>
  </div>
  )
}
