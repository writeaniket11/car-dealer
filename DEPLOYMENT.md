# Second-Hand Car Dealer Deployment

## MongoDB Atlas

1. Create a free MongoDB Atlas cluster.
2. Add a database user and password.
3. Whitelist `0.0.0.0/0` for Render access.
4. Copy the connection URI into `backend/.env` as `MONGODB_URI`.

## Render Backend

1. Create a new Render Web Service from the GitHub repository.
2. Set the root directory to `backend`.
3. Add the environment variables from `backend/.env.example`.
4. Build command: `npm install`
5. Start command: `node server.js`
6. Set `FRONTEND_URL` to your Vercel frontend domain so CORS allows it.
7. Run `npm run seed:admin` once with `ADMIN_EMAIL` and `ADMIN_PASSWORD` configured.

## Vercel Frontend

1. Import the GitHub repository in Vercel.
2. Set the root directory to `frontend`.
3. Add `NEXT_PUBLIC_API_URL` with your Render backend URL.
4. Add `NEXT_PUBLIC_WHATSAPP_NUMBER`.
5. Deploy.

## Custom Domain

Add your custom domain in Vercel project settings, then create the DNS records shown by Vercel at your registrar.
