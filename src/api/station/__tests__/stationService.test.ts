import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";

import type { Station } from "@/api/station/stationModel";
import { StationRepository } from "@/api/station/stationRepository";
import { StationService } from "@/api/station/stationService";

vi.mock("@/api/station/stationRepository");

describe("stationService", () => {
  let stationServiceInstance: StationService;
  let stationRepositoryInstance: StationRepository;

  const mockStations: Station[] = [
    {
      id: 1,
      name: "Bến xe Miền Đông",
      image: "mien_dong.png",
      wallpaper: "mien_dong_wall.png",
      descriptions: "Bến xe lớn nhất miền Nam",
      location: "Hồ Chí Minh",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      name: "Bến xe Miền Tây",
      image: "mien_tay.png",
      wallpaper: "mien_tay_wall.png",
      descriptions: "Đi các tỉnh miền Tây",
      location: "Hồ Chí Minh",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  beforeEach(() => {
    stationRepositoryInstance = new StationRepository();
    stationServiceInstance = new StationService(stationRepositoryInstance);
  });

  describe("findAll", () => {
    it("should return all stations", async () => {
      // Arrange
      (stationRepositoryInstance.findAllAsync as Mock).mockReturnValue(mockStations);

      // Act
      const result = await stationServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("Stations found");
      expect(result.responseObject).toEqual(mockStations);
    });

    it("should return a not found error if no stations found", async () => {
      // Arrange
      (stationRepositoryInstance.findAllAsync as Mock).mockReturnValue(null);

      // Act
      const result = await stationServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual("No Stations found");
      expect(result.responseObject).toBeNull();
    });

    it("should handle errors during findAllAsync", async () => {
      // Arrange
      (stationRepositoryInstance.findAllAsync as Mock).mockRejectedValue(new Error("Database error"));

      // Act
      const result = await stationServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual("An error occurred while retrieving stations.");
      expect(result.responseObject).toBeNull();
    });
  });

  describe("findById", () => {
    it("should return a station for a valid ID", async () => {
      // Arrange
      const testId = 1;
      const mockStation = mockStations.find((station) => station.id === testId);
      (stationRepositoryInstance.findByIdAsync as Mock).mockReturnValue(mockStation);

      // Act
      const result = await stationServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("Station found");
      expect(result.responseObject).toEqual(mockStation);
    });

    it("should return not found if station not found", async () => {
      // Arrange
      const testId = 999;
      (stationRepositoryInstance.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const result = await stationServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual("Station not found");
      expect(result.responseObject).toBeNull();
    });

    it("should handle errors during findByIdAsync", async () => {
      // Arrange
      const testId = 1;
      (stationRepositoryInstance.findByIdAsync as Mock).mockRejectedValue(new Error("Database error"));

      // Act
      const result = await stationServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual("An error occurred while finding station.");
      expect(result.responseObject).toBeNull();
    });
  });
});
