import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter";
import { userRegistry } from "@/api/user/userRouter";
import { busCompanyRegistry } from "@/api/busCompanies/busCompanyRouter";
import { routeRegistry } from "@/api/route/routeRoutes";
import { ticketOrderRegistry } from "@/api/ticketOrder/ticketOrderRoutes";
import { authRegistry } from "@/api/auth/authRouter";
import { carRegistry } from "@/api/car/carRouter";
import { seatRegistry } from "@/api/seat/seatRouter";
import { routesRegistry } from "@/api/routes/routesRouter";
import { bannerRegistry } from "@/api/banners/bannerRouter";
import { stationRegistry } from "@/api/station/stationRouter";
import { busReviewRegistry } from "@/api/bus_reviews/busReviewRouter";
import { ticketRegistry } from "@/api/ticket/ticketRouter";
import { paymentProviderRegistry } from "@/api/paymentProvider/paymentProvider.routes";
import { getBus_reviewRegistry } from "@/api/getBus_review/getBus_reviewRouter";
import { getStationPassengerRegistry } from "@/api/getStationPassenger/getStationPassengerRouter";
import { getStatusTicketRegistry } from "@/api/getStatusTicket/getStatusTicketRouter";
import { getPaymentProviderRegistry } from "@/api/getPaymentProvider/getPaymentProviderRouter";
import { getPopularStationRegistry } from "@/api/getPopularStation/stationRouter";
import { popularRouteRegistry } from "@/api/popularRoute/popularRouteRouter";
import { getTopReviewRegistry } from "@/api/getTopReview/busReviewRouter";
import { revenueRegistry } from "@/api/getRevenue/getRevenueRouter";
import { getCustomerRegistry } from "@/api/getCustomer/getCustomerRouter";
import { findArrivalRegistry } from "@/api/findArrival/findArrivalRouter";
import { get } from "http";
import { discountBannerRegistry } from "@/api/discountBanner/bannerRouter";
import { vehicleScheduleRegistry } from "@/api/vehicleSchedule/vehicleSchedule.routes";


export type OpenAPIDocument = ReturnType<OpenApiGeneratorV3["generateDocument"]>;

export function generateOpenAPIDocument(): OpenAPIDocument {
	const registry = new OpenAPIRegistry([
		healthCheckRegistry,
		authRegistry,
		userRegistry,
		carRegistry,
		seatRegistry,
		routesRegistry,
		bannerRegistry,
		busReviewRegistry,
		ticketOrderRegistry,
		ticketRegistry,
		ticketOrderRegistry,
		paymentProviderRegistry,
		routeRegistry,
		stationRegistry,
		busCompanyRegistry,
		stationRegistry,
		getBus_reviewRegistry,
		getStationPassengerRegistry,
		getStatusTicketRegistry,
		getPaymentProviderRegistry,
		revenueRegistry,
		getCustomerRegistry,
		findArrivalRegistry,

		getPopularStationRegistry,
		popularRouteRegistry,
		getTopReviewRegistry,
		discountBannerRegistry,
		vehicleScheduleRegistry
	]);

	const generator = new OpenApiGeneratorV3(registry.definitions);
	const document = generator.generateDocument({
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Swagger API",
		},
		externalDocs: {
			description: "View the raw OpenAPI Specification in JSON format",
			url: "/swagger.json",
		},
	});

	document.components = {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
		},
	};

	document.security = [
		{
			bearerAuth: [],
		},
	];

	return document;
}

