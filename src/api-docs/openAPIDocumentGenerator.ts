import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter";
import { userRegistry } from "@/api/user/userRouter";
import { stationRegistry } from "@/api/station/stationRouter";
import { busCompanyRegistry } from "@/api/busCompanies/busCompanyRouter";
import { routeRegistry } from "@/api/route/route.routes";
import { ticketOrderRegistry } from "@/api/ticketOrder/ticketOrder.routes";
import { authRegistry } from "@/api/auth/authRouter";
import { carRegistry } from "@/api/car/carRouter";
import { seatRegistry } from "@/api/seat/seatRouter";
import { routesRegistry } from "@/api/routes/routesRouter";
import { bannerRegistry } from "@/api/banners/bannerRouter";
import { busReviewRegistry } from "@/api/bus_reviews/busReviewRouter";
import { ticketRegistry } from "@/api/ticket/ticketRouter";
import { paymentProviderRegistry } from "@/api/paymentProvider/paymentProvider.routes";

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
		busCompanyRegistry
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

