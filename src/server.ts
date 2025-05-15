import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { userRouter } from "@/api/user/userRouter";
import { stationRouter } from "@/api/station/stationRouter";
import { busCompanyRouter } from "@/api/busCompanies/busCompanyRouter";
import { routeRouter } from "@/api/route/route.routes";
import { ticketOrderRouter } from "@/api/ticketOrder/ticketOrder.routes";
import { authRouter } from "@/api/auth/authRouter";
import { routesRouter } from "./api/routes/routesRouter";
import { bannerRouter } from "./api/banners/bannerRouter";
import { busReviewRouter } from "./api/bus_reviews/busReviewRouter";
import { stationRouter } from "./api/stations/stationRouter";
import { carRouter } from "@/api/car/carRouter";
import { seatRoter } from "./api/seat/seatRouter";
import { ticketRouter } from "@/api/ticket/ticketRouter";
import { paymentProviderRouter } from "@/api/paymentProvider/paymentProvider.routes";
import { getBus_reviewRouter } from "@/api/getBus_review/getBus_reviewRouter";
import { getStationPassengerRouter } from "@/api/getStationPassenger/getStationPassengerRouter";
import { getStatusTicketRouter } from "@/api/getStatusTicket/getStatusTicketRouter";
import { getPaymentProviderRouter } from "@/api/getPaymentProvider/getPaymentProviderRouter";
// import { getRevenueRouter } from "@/api/getRevenue/getRevenueRouter";
import { getCustomerRouter } from "./api/getCustomer/getCustomerRouter";
import { findArrivalRouter } from "@/api/findArrival/findArrivalRouter";

import { getPopularStationRouter } from "@/api/getPopularStation/stationRouter";
import { popularRouteRouter } from "./api/popularRoute/popularRouteRouter";
import { getTopReviewRouter } from "@/api/getTopReview/busReviewRouter";
import { discountBannerRouter } from "./api/discountBanner/bannerRouter";


import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";

import '@/common/config/passport';
import session from 'express-session';
import passport from 'passport';
import sessionMiddleware from '@/common/middleware/sessionMiddleware';

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// auth passport
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
// app.use(session({
//     secret: 'your_secret',
//     resave: false,
//     saveUninitialized: false
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/users", userRouter);
app.use("/stations", stationRouter);
app.use("/bus-companies", busCompanyRouter);
app.use("/routes", routeRouter);
app.use("/ticket-orders", ticketOrderRouter);
app.use("/auth", authRouter);
app.use("/routes", routesRouter);
app.use("/banners", bannerRouter);
app.use("/bus-reviews", busReviewRouter)
app.use("/stations", stationRouter);
app.use("/cars", carRouter);
app.use("/seats", seatRoter);
app.use("/tickets", ticketRouter);
app.use("/payment-providers", paymentProviderRouter);
app.use("/", getBus_reviewRouter);
app.use("/getstationpassenger", getStationPassengerRouter);
app.use("/", getStatusTicketRouter);
app.use("/getPaymentProvider", getPaymentProviderRouter);
// app.use("/revenue", getRevenueRouter);
app.use("/get-customer", getCustomerRouter);
app.use("/search", findArrivalRouter);

// Home route
app.use("/", getPopularStationRouter);
app.use("/", popularRouteRouter);
app.use("/", getTopReviewRouter);
app.use("/discount-banner", discountBannerRouter);



// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
