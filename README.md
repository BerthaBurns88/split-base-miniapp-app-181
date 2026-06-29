# Split

Base Mini App for instant ETH splits on Base.

Repository: <https://github.com/BerthaBurns88/split-base-miniapp-app-181.git>

## Overview

Split is a lightweight mini app for creating instant ETH splits on the Base network.

The project is built with a modern web stack and is intended to provide a simple interface for interacting with the deployed Split contract.

## Project Details

- **Project name:** `split-base-miniapp-app-181`
- **App ID:** `app-181`
- **Network:** Base
- **Contract:** `0x76242c1bdeca746a5dd9430b06c23af3ffe520f2`
- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Web3 libraries:** wagmi and viem

## Features

- Create ETH splits on Base.
- Interact with the deployed Split contract.
- Use a responsive interface built with Tailwind CSS.
- Benefit from typed application code with TypeScript.
- Use wagmi and viem for blockchain interactions.

## Tech Stack

This project uses:

- [Next.js](https://nextjs.org/) for the application framework.
- [TypeScript](https://www.typescriptlang.org/) for type-safe development.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [wagmi](https://wagmi.sh/) for Ethereum React hooks.
- [viem](https://viem.sh/) for low-level Ethereum utilities.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/BerthaBurns88/split-base-miniapp-app-181.git
cd split-base-miniapp-app-181
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local development URL shown in your terminal.

## Usage

1. Start the app locally.
2. Open the app in a browser.
3. Connect a compatible wallet.
4. Make sure the wallet is using the Base network.
5. Use the interface to prepare and submit an ETH split.

## Contract Information

The app is configured to work with the following contract:

```text
0x76242c1bdeca746a5dd9430b06c23af3ffe520f2
```

Before making changes to contract-related behavior, confirm that the contract address and network configuration are correct.

## Development Notes

- Keep contract addresses and chain configuration easy to review.
- Prefer typed utilities when working with transaction data.
- Keep UI components small and focused.
- Test changes locally before committing.
- Verify Base network behavior when updating web3 logic.

## Suggested Project Structure

The exact structure may vary, but a typical Next.js project includes:

```text
app/
components/
lib/
public/
styles/
```

Use the existing repository structure as the source of truth when making changes.

## Scripts

Common scripts for a Next.js project may include:

```bash
npm run dev
npm run build
npm run start
