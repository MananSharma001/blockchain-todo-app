# ⛓ Blockchain Todo App

A **Decentralized Todo / Note App** built with React, inspired by blockchain principles — no MetaMask, no wallets, no internet required.

## Features

- **Immutable ledger** — every action (add, complete, delete) is recorded as a new block; nothing is ever overwritten
- **Proof-of-Work mining** — each block requires a small SHA-256 puzzle (difficulty 2) before it's appended
- **Chain-linked integrity** — every block stores the hash of the block before it, making tampering detectable
- **Visual blockchain explorer** — horizontal scrollable view shows every block with its hash, previous hash, nonce, and payload
- **Chain validity badge** — real-time indicator verifying the entire chain on every change
- **Export as JSON ledger** — download the full blockchain as a `.json` file for archival or inspection
- **100% local** — data lives in `localStorage`; no server, no wallet, no sign-up

## Tech Stack

| Concern | Solution |
|---|---|
| UI | React 17 (functional components + hooks) |
| Hashing | Browser Web Crypto API (`SubtleCrypto`) |
| Storage | `localStorage` |
| Deployment | GitHub Pages (`gh-pages`) |

## Getting Started

```bash
npm install
npm start          # development server
npm run build      # production build
npm run deploy     # deploy to GitHub Pages
```

> **Note:** If you're using Node 17+, prefix build/start commands with `NODE_OPTIONS=--openssl-legacy-provider` due to a webpack 4 / OpenSSL compatibility issue with `react-scripts` v4.

## How It Works

1. The app bootstraps with a **genesis block** on first run.
2. Every todo action produces a JSON payload (e.g. `{ action: "ADD_TODO", todoId: "...", text: "..." }`).
3. A new `Block` is created with that payload, linked to the previous block's hash.
4. The block is **mined**: a nonce is incremented until the SHA-256 hash starts with `"00"`.
5. The mined block is appended to the chain and persisted to `localStorage`.
6. The current todo list is derived by **replaying** the chain from genesis — just like an account balance in a real blockchain.

## Blockchain Actions

| Action | Description |
|---|---|
| `GENESIS` | First block; bootstraps the chain |
| `ADD_TODO` | Records a new todo item |
| `TOGGLE_TODO` | Marks a todo complete / incomplete |
| `DELETE_TODO` | Logically removes a todo from the derived state |
