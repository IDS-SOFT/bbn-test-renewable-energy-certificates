
## Setup details -

**1. Project Setup**

```shell
npm install

```
**2. Create a new .env file and write below configuration**

```shell
ACCOUNT_ADDRESS = "YOUR_ACCOUNT_ADDRESS"
PRIVATE_KEY = "YOUR_PRIVATE_KEY"
CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"
RPC_NODE_URL = "https://idspeer1.test.bharatblockchain.io:15021"
```

**3. Smart Contract Compile**

```shell
npx hardhat compile
```

**4. Deploy the Smart Contract**

```shell
npx hardhat run ./scripts/deploy.ts --network bbn_testnet
```
 
**5. Update the deployed smart contract address in .env file from deployedAddresses.json file.**

**6. Interact with Smart Contract**

Create an Account, Check Balance, Account Count, Account Addresses.

```shell
npx hardhat run ./scripts/interact.ts --network bbn_testnet
```

**7. Check your txs on BBN Testnet Explorer**

http://testnet.bharatblockchain.io/

