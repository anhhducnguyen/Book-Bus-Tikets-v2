import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter";
import { userRegistry } from "@/api/user/userRouter";
import { routesRegistry} from "@/api/routes/routesRouter";
import { bannerRegistry } from "@/api/banners/bannerRouter";
<<<<<<< src/api-docs/openAPIDocumentGenerator.ts
import { BusReviewRepository } from "@/api/bus_reviews/busReviewRepository";
import { busReviewRegistry } from "@/api/bus_reviews/busReviewRouter";
=======
import { carRegistry } from "@/api/car/carRouter";
import { seatRegistry } from "@/api/seat/seatRouter";
import { ticketRegistry } from "@/api/ticket/ticketRouter"
>>>>>>> src/api-docs/openAPIDocumentGenerator.ts

export type OpenAPIDocument = ReturnType<OpenApiGeneratorV3["generateDocument"]>;

export function generateOpenAPIDocument(): OpenAPIDocument {
	const registry = new OpenAPIRegistry([
		healthCheckRegistry,
		userRegistry, 
		carRegistry, 
		seatRegistry,
		routesRegistry,
		bannerRegistry
	]);
	const generator = new OpenApiGeneratorV3(registry.definitions);
	return generator.generateDocument({
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
}
