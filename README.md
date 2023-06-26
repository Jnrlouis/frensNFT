# BTC-FRENS-NFT

By sending BTC to the `authority` address, frens NFT would be minted to the account on the Stacks Blockchain. Powered by `chainhooks`.


## How to use

Start a local Devnet with the command:

```bash
$ clarinet integrate
```

In another console, change the directory to `./serverless/`. After running

```bash
$ yarn global add serverless    # Install serverless globally
$ yarn                          # Install dependencies
```

and making sure that the command `serverless` is available in your `$PATH`, the lambda functions can be started locally with the following command:

```bash
$ serverless offline --verbose --printOutput
```

- `deployments/btc-sendNFT.devnet-plan.yaml`: a BTC transaction is being performed, using the following parameters:
```yaml
        - btc-transfer:
            expected-sender: mjSrB3wS4xab3kYqFktwBzfTdPg367ZJ2d
            recipient: mr1iPkD9N3RJZZxXRk7xF9d36gffa6exNC
            sats-amount: 100000000
            sats-per-byte: 10
```
A chainhook, present in `chainhooks/wrap-btc.chainhook.yaml` is observing BTC transfers being performed to the address `mr1iPkD9N3RJZZxXRk7xF9d36gffa6exNC` thanks to the following configuration:
```yaml
networks:
  regtest:
    predicate:
      scope: outputs
      p2pkh:
        equals: mr1iPkD9N3RJZZxXRk7xF9d36gffa6exNC
```

and then, a frens `mint` NFT transaction would be sent:

```javascript
  const txOptions = {
    contractAddress: frensToken.contractAddress,
    contractName: frensToken.contractName,
    functionName: "mint",
    functionArgs: [standardPrincipalCVFromAddress(recipientAddress)],
    fee: 1000,
    nonce,
    network,
    anchorMode: AnchorMode.OnChainOnly,
    postConditionMode: PostConditionMode.Allow,
    senderKey: process.env.AUTHORITY_SECRET_KEY!,
  };
  const tx = await makeContractCall(txOptions);
```

In this protocol, this transaction assumes usage of p2pkh addresses, and sends the change back to the sender, using the same address.  

```bash
$ clarinet deployment apply -p deployments/btc-sendNFT.devnet-plan.yaml
```

