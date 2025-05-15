import { db } from "@/common/config/database";
import { BusReview } from "./getBus_reviewModel";

export class BusReviewRepository {
    async getReviewStatsByCompany() {
        return db("bus_reviews as br")
            .select("bc.id as company_id", "bc.company_name")
            .sum({
                positive_reviews: db.raw("CASE WHEN br.rating >= 4 THEN 1 ELSE 0 END"),
                negative_reviews: db.raw("CASE WHEN br.rating <= 2 THEN 1 ELSE 0 END")
            })
            .join("buses as b", "br.bus_id", "b.id")
            .join("bus_companies as bc", "b.company_id", "bc.id")
            .groupBy("bc.id", "bc.company_name");
    }
}
