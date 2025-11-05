import { faker } from "@faker-js/faker";

export function createAirport() {
  return {
    id: faker.string.uuid(),
    cityCode: faker.airline.airport().iataCode,
    cityName: faker.airline.airport().name,
    countryCode: faker.location.countryCode("alpha-3"),
    countryName: faker.location.country(),
    regionCode: faker.location.countryCode(),
    regionName: faker.location.state(),
    continentName: faker.location.continent(),
    hasEuropeanFlag: faker.datatype.boolean(),
    hubRegionCode: faker.location.countryCode("alpha-2"),
    hubRegionName: faker.location.state(),
    isSchengen: faker.datatype.boolean(),
    isEuropean: faker.datatype.boolean(),
    regConDom: faker.location.continent(),
    timeZone: faker.date.timeZone(),
  };
}

export async function delay(t: number) {
  await new Promise((res) => setTimeout(res, t));
}
