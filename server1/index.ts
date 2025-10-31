import * as trpcExpress from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { join } from "path";

import { authRouter } from "./features/auth/router";
import { commentRouter } from "./features/comment/router";
import { experienceRouter } from "./features/experience/router";
import { notificationRouter } from "./features/notification/router";
import { tagRouter } from "./features/tag/router";
import { userRouter } from "./features/user/router";
import { createContext, router } from "./trpc";
import { env } from "./utils/env";

const appRouter = router({
  auth: authRouter,
  comments: commentRouter,
  experiences: experienceRouter,
  notifications: notificationRouter,
  tags: tagRouter,
  users: userRouter,
});
export type AppRouter = typeof appRouter;

const app = express();

app.use(cookieParser());

app.use((req, res, next) => {
  setTimeout(next, Math.floor(Math.random() * 1000 + 100));
});

app.use(
  cors({
    origin: env.CLIENT_BASE_URL,
    credentials: true,
  }),
);

app.use("/uploads", express.static(join(process.cwd(), "public", "uploads")));

// Mount tRPC server at /trpc so normal GET requests to `/` (e.g. browser
// navigation) don't hit the tRPC middleware with an empty path.
app.use(
  "/",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  // Helpful startup log
  // Note: you can override the port by setting the PORT environment variable
  // e.g. in PowerShell: $env:PORT = 3001; npm run dev
  // This is useful if port 3000 is already in use.
  // Mounting tRPC at `/trpc` avoids `No procedure found on path ""` errors
  // for non-tRPC requests to `/`.
  //
  // Keep the log minimal and platform agnostic.
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});
