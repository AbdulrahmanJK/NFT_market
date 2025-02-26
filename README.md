

## Technology

This demo uses:

- Metamask
- Hardhat
- Pinato
- ReactJs
- Tailwind CSS
- Solidity
- EthersJs
- Faucet

## Running the demo

To run the demo follow these steps:

1. Clone the project with the code below.

   ```sh

   # Make sure you have the above prerequisites installed already!
   git clone https://github.com/Daltonic/dappAuction
   cd dappAution # Navigate to the new folder.
   yarn install # Installs all the dependencies.
   ```
2. Head to [Pinato] and create an IPFS project.

3. Create another `.env` file in the api directory and enter the following details.
   ```sh
   INFURIA_PID=<PROJECT_ID>
   INFURIA_API=PROJECT_API_SECRET>
   ```

2. Head to [CometChat](https://try.cometchat.com/daltonic) and create a project.

3. Update `.env` file to include the following details.
   ```sh
   REACT_APP_COMETCHAT_APP_ID=<APP_ID>
   REACT_APP_COMETCHAT_AUTH_KEY=<AUTH_KEY>
   REACT_APP_COMETCHAT_REGION=<REGION>
   ```
4. On one terminal `CD` into the `api` directory and run `node app.js`

5. On a second terminal, run `yarn start` to spin up the app on the browser.
   <br/>


