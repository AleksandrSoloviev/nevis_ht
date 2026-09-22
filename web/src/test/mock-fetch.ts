import type { Company } from "../domain/types";
import company from "./fixtures/company.json";

export const companyFixture = company as Company;

export const okCompanyResponse = (): Response =>
  new Response(JSON.stringify(companyFixture), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

export const stubCompanyFetch = (): ReturnType<typeof vi.fn> => {
  const fetchMock = vi.fn(async () => okCompanyResponse());
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};
