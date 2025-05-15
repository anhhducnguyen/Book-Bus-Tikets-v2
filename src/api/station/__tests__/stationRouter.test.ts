import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { Station } from "@/api/station/stationModel";
import { stations } from "@/api/station/stationRepository";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";

describe("Station API Endpoints", () => {
  describe("GET /stations", () => {
    it("should return a list of stations", async () => {
      // Act
      const response = await request(app).get("/stations");
      const responseBody: ServiceResponse<Station[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Stations found");
      expect(responseBody.responseObject.length).toEqual(stations.length);
      responseBody.responseObject.forEach((station, index) =>
        compareStations(stations[index] as Station, station)
      );
    });
  });

  describe("GET /stations/:id", () => {
    it("should return a station for a valid ID", async () => {
      // Arrange
      const testId = 1;
      const expectedStation = stations.find((station) => station.id === testId) as Station;

      // Act
      const response = await request(app).get(`/stations/${testId}`);
      const responseBody: ServiceResponse<Station> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Station found");
      if (!expectedStation) throw new Error("Invalid test data: expectedStation is undefined");
      compareStations(expectedStation, responseBody.responseObject);
    });

    it("should return a not found error for non-existent ID", async () => {
      const testId = Number.MAX_SAFE_INTEGER;

      const response = await request(app).get(`/stations/${testId}`);
      const responseBody: ServiceResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Station not found");
      expect(responseBody.responseObject).toBeNull();
    });
  });
});

function compareStations(mockStation: Station, responseStation: Station) {
  expect(responseStation.id).toEqual(mockStation.id);
  expect(responseStation.name).toEqual(mockStation.name);
  expect(responseStation.image).toEqual(mockStation.image);
  expect(responseStation.wallpaper).toEqual(mockStation.wallpaper);
  expect(responseStation.descriptions).toEqual(mockStation.descriptions);
  expect(responseStation.location).toEqual(mockStation.location);
  expect(new Date(responseStation.created_at)).toEqual(mockStation.created_at);
  expect(new Date(responseStation.updated_at)).toEqual(mockStation.updated_at);
}
