#  Car Marketplace App
##  Overview
This is a web-based car marketplace application designed for users who want to browse, search, and list vehicles for sale. It allows buyers to explore available cars with detailed specifications, while sellers can post advertisements easily. The platform is built to simplify the car buying and selling process with a clean interface and efficient data handling.

---

##  Features

  Browse and search for cars
-  View detailed car listings (price, mileage, engine, etc.)
-  Post new car advertisements
-  Multiple contact options (mobile & WhatsApp)
-  Image support for listings

###  AI-Powered Features (Gemini)
-  Smart car description generation using Gemini
-  AI-assisted search (suggesting relevant cars based on user input)
-  Auto-completion or recommendations for listings

---

##  Tech Stack

- **Frontend:** Nuxt.js (Vue 3)  
  - Chosen for its fast performance, SEO support, and modern UI capabilities.

- **Backend:** Node.js + Express  
  - Lightweight and efficient for handling API requests and server logic.

- **Database:** MongoDB (via Mongoose)  
  - Flexible schema design, ideal for handling dynamic car listing data.

- **AI Integration:** Google Gemini API  
  - Used to provide intelligent features like description generation and smart suggestions.

---

## Development Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
