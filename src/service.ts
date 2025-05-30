import {
  ActionsResponse,
  AmendmentsResponse,
  BillCommitteesResponse,
  BillResponse,
  BillsResponse,
  BillTextResponse,
  CosponsorsResponse,
  LawsResponse,
  MemberResponse,
  MembersResponse,
  PaginationParams,
  RelatedBillsResponse,
  SubjectsResponse,
  SummariesResponse,
  BoundCongressionalRecordResponse,
  CRSReportsResponse,
  CRSReportResponse,
  CommitteesResponse,
  CommitteeResponse,
  CommitteeNominationsResponse,
  HouseCommunicationsResponse,
  SenateCommunicationsResponse,
  SenateCommunicationResponse,
  CommitteeMeetingsResponse,
  CommitteeMeetingResponse,
  CommitteePrintsResponse,
  CommitteePrintResponse,
  CommitteePrintTextResponse,
  CommitteeReportsResponse,
  CommitteeReportResponse,
  CommitteeReportTextResponse,
  DailyCongressionalRecordListResponse,
  DailyCongressionalRecordIssueResponse,
  DailyCongressionalRecordArticlesResponse,
  HearingsResponse,
  HearingResponse,
  HouseCommunicationResponse,
  CongressesResponse,
  CongressResponse,
  NominationsResponse,
  NominationResponse,
  NomineesResponse,
  NominationCommitteesResponse,
  NominationActionsResponse,
  NominationHearingsResponse,
  SummariesListResponse,
  TreatiesResponse,
  TreatyResponse,
  TreatyActionsResponse,
  TreatyCommitteesResponse,
  SponsoredLegislationResponse,
  AmendmentResponse,
  HouseRollCallVoteMemberVotesResponse,
  HouseRollCallResponse,
  HouseRollCallVotesResponse,
  TitlesResponse,
  CosponsoredLegislationResponse,
} from "./types";
import { ACTIVE_CONGRESS } from "./consts";

const CONGRESS_GOV_BASE_API_URL = "https://api.congress.gov/v3/";

/**
 * Service class for interacting with the Congress.gov API.
 * Provides methods to fetch data related to congresses, members, bills, nominations, committees, etc.
 */
class CongressService {
  private apiKey: string;

  /**
   * Creates an instance of the CongressService.
   * @param apiKey - Your Congress.gov API key.
   */
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Makes a request to the Congress.gov API.
   * @private
   * @template T - The expected response type.
   * @param path - The API endpoint path (relative to the base URL).
   * @param params - Optional query parameters for the request.
   * @returns A promise resolving to the parsed JSON response.
   * @throws {Error} If the request fails due to network issues or API errors (4xx/5xx status codes).
   */
  private async makeRequest<T>(path: string, params: Record<string, any> = {}): Promise<T> {
    // Add format=json to all requests
    params = { ...params, format: "json" };

    // Build URL with query parameters
    const url = new URL(path, CONGRESS_GOV_BASE_API_URL);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });


    const response = await fetch(url.toString(), {
      headers: {
        "x-api-key": this.apiKey,
      },
    });

    // Handle response status
    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error(`Request failed with status ${response.status}`);
        case 401:
        case 403:
          throw new Error(`Request failed with status ${response.status}`);
        case 404:
          throw new Error(`Request failed with status ${response.status}`);
        case 429:
          throw new Error(`Request failed with status ${response.status}`);
        default:
          throw new Error(`Request failed with status ${response.status}`);
      }
    }

    return response.json();
  }

  /**
   * Retrieves a list of all past and present congresses and their sessions.
   * @param options - Optional pagination parameters.
   * @param options.limit - The maximum number of results to return (default: 20).
   * @param options.offset - The number of results to skip (for pagination) (default: 0).
   * @returns A promise resolving to a `CongressesResponse` object containing an array of congress items and pagination info.
   */
  async getCongresses({
    limit = 20,
    offset = 0,
  }: PaginationParams = {}): Promise<CongressesResponse> {
    return this.makeRequest("congress", { limit, offset });
  }

  /**
   * Retrieves detailed information about a specific congress, including its sessions.
   * @param congress - The congress number (e.g., 117 or "117").
   * @returns A promise resolving to a `CongressResponse` object containing details for the specified congress.
   */
  async getCongress(congress: number | string): Promise<CongressResponse> {
    return this.makeRequest(`congress/${congress}`);
  }

  /**
   * Retrieves information about the currently active congress.
   * @returns A promise resolving to a `CongressResponse` object containing details for the current congress.
   */
  async getCurrentCongress(): Promise<CongressResponse> {
    return this.makeRequest("congress/current");
  }

  /**
   * Retrieves a list of nominations, optionally filtered by congress.
   * @param options - Optional query and pagination parameters.
   * @param options.congress - The specific congress number to filter nominations by (e.g., 117). If omitted, retrieves nominations across all congresses.
   * @param options.limit - The maximum number of results to return (default: 20).
   * @param options.offset - The number of results to skip (for pagination) (default: 0).
   * @returns A promise resolving to a `NominationsResponse` object containing an array of nomination items and pagination info.
   */
  async getNominations({
    congress,
    limit = 20,
    offset = 0,
  }: {
    congress?: number;
  } & PaginationParams): Promise<NominationsResponse> {
    const path = congress ? `nomination/${congress}` : "nomination";
    return this.makeRequest(path, { limit, offset });
  }

  /**
   * Retrieves detailed information about a specific nomination.
   * @param options - Query parameters to identify the nomination.
   * @param options.congress - The congress number during which the nomination was made (e.g., 117).
   * @param options.nominationNumber - The unique number assigned to the nomination.
   * @returns A promise resolving to a `NominationResponse` object containing details for the specified nomination.
   */
  async getNomination({
    congress,
    nominationNumber,
  }: {
    congress: number;
    nominationNumber: string;
  }): Promise<NominationResponse> {
    return this.makeRequest(`nomination/${congress}/${nominationNumber}`);
  }

  /**
   * Retrieves the list of individuals nominated for a specific position within a nomination.
   * Some nominations cover multiple positions (parts), identified by an ordinal.
   * @param options - Query parameters to identify the specific part of the nomination.
   * @param options.congress - The congress number (e.g., 117).
   * @param options.nominationNumber - The nomination number.
   * @param options.ordinal - The part number (ordinal) for partitioned nominations.
   * @returns A promise resolving to a `NomineesResponse` object containing an array of nominee items for the specified nomination part.
   */
  async getNominees({
    congress,
    nominationNumber,
    ordinal,
  }: {
    congress: number;
    nominationNumber: string;
    ordinal: string;
  }): Promise<NomineesResponse> {
    const path = `nomination/${congress}/${nominationNumber}/${ordinal}`;
    return this.makeRequest(path);
  }

  /**
   * Retrieves the committees associated with a specific nomination and their activities.
   * @param options - Query parameters to identify the nomination.
   * @param options.congress - The congress number (e.g., 117).
   * @param options.nominationNumber - The nomination number.
   * @returns A promise resolving to a `NominationCommitteesResponse` object containing committee information and related activities.
   */
  async getNominationCommittees({
    congress,
    nominationNumber,
  }: {
    congress: number;
    nominationNumber: string;
  }): Promise<NominationCommitteesResponse> {
    return this.makeRequest(`nomination/${congress}/${nominationNumber}/committees`);
  }

  /**
   * Retrieves the actions taken on a specific nomination (e.g., referred to committee, confirmed).
   * @param options - Query parameters to identify the nomination.
   * @param options.congress - The congress number (e.g., 117).
   * @param options.nominationNumber - The nomination number.
   * @returns A promise resolving to a `NominationActionsResponse` object containing a list of actions.
   */
  async getNominationActions({
    congress,
    nominationNumber,
  }: {
    congress: number;
    nominationNumber: string;
  }): Promise<NominationActionsResponse> {
    return this.makeRequest(`nomination/${congress}/${nominationNumber}/actions`);
  }

  /**
   * Retrieves the hearings held related to a specific nomination.
   * @param options - Query parameters to identify the nomination.
   * @param options.congress - The congress number (e.g., 117).
   * @param options.nominationNumber - The nomination number.
   * @returns A promise resolving to a `NominationHearingsResponse` object containing a list of related hearings.
   */
  async getNominationHearings({
    congress,
    nominationNumber,
  }: {
    congress: number;
    nominationNumber: string;
  }): Promise<NominationHearingsResponse> {
    return this.makeRequest(`nomination/${congress}/${nominationNumber}/hearings`);
  }

  /**
   * Retrieves a list of members of Congress, filterable by update date and current status.
   * @param options - Optional query and pagination parameters.
   * @param options.limit - The maximum number of results to return (default: 20).
   * @param options.offset - The number of results to skip (for pagination) (default: 0).
   * @param options.updatedAfter - Filters results to include only members updated after this date.
   * @param options.updatedBefore - Filters results to include only members updated before this date.
   * @param options.currentMember - If true (default), returns only currently serving members.
   * @returns A promise resolving to a `MembersResponse` object containing an array of member items and pagination info.
   */
  async getMembers({
    limit = 20,
    offset = 0,
    updatedAfter,
    updatedBefore,
    currentMember = true,
  }: {
    updatedAfter?: Date;
    updatedBefore?: Date;
    currentMember?: boolean;
  } & PaginationParams): Promise<MembersResponse> {
    return this.makeRequest("member", {
      limit,
      offset,
      currentMember,
      ...(updatedAfter ? { fromDateTime: updatedAfter.toISOString() } : {}),
      ...(updatedBefore ? { toDateTime: updatedBefore.toISOString() } : {}),
    });
  }

  /**
   * Retrieves a list of members for a specific congress.
   * @param options - Query and pagination parameters.
   * @param options.congress - The congress number (e.g., 119).
   * @param options.limit - The maximum number of results to return (default: 20).
   * @param options.offset - The number of results to skip (for pagination) (default: 0).
   * @param options.currentMember - If true (default), returns only currently serving members within that congress.
   * @returns A promise resolving to a `MembersResponse` object containing an array of member items and pagination info.
   */
  async getMembersByCongress({
    limit = 20,
    offset = 0,
    congress = 119,
    currentMember = true,
  }: {
    congress: number;
    currentMember?: boolean;
  } & PaginationParams): Promise<MembersResponse> {
    return this.makeRequest(`member/congress/${congress}`, {
      limit,
      offset,
      congress,
      currentMember,
    });
  }

  /**
   * Retrieves detailed information about a specific member of Congress using their Bioguide ID.
   * @param options - Options containing the member's Bioguide ID.
   * @param options.memberBioguideId - The unique Bioguide ID for the member.
   * @returns A promise resolving to a `MemberResponse` object containing detailed information about the member.
   */
  async getMember({ memberBioguideId }: { memberBioguideId: string }): Promise<MemberResponse> {
    return this.makeRequest(`member/${memberBioguideId}`);
  }

  /**
   * Retrieves members representing a specific state and district within a given congress.
   * @param options - Query parameters to identify the state, district, and congress.
   * @param options.congress - The congress number (default: ACTIVE_CONGRESS).
   * @param options.state - The two-letter state code (e.g., "CA").
   * @param options.district - The district number (e.g., "12").
   * @param options.currentMember - If true (default), returns only currently serving members in that district.
   * @returns A promise resolving to a `MembersResponse` object containing members matching the criteria.
   */
  async getMembersByStateAndDistrict({
    congress = ACTIVE_CONGRESS,
    state,
    district,
    currentMember = true,
  }: {
    congress: number;
    state: string;
    district: string;
    currentMember?: boolean;
  }): Promise<MembersResponse> {
    return this.makeRequest(`member/congress/${congress}/${state}/${district}`, { currentMember });
  }

  /**
   * Retrieves members representing a specific state within a given congress.
   * @param options - Query parameters to identify the state and congress.
   * @param options.congress - The congress number (default: ACTIVE_CONGRESS).
   * @param options.state - The two-letter state code (e.g., "NY").
   * @param options.currentMember - If true (default), returns only currently serving members from that state.
   * @returns A promise resolving to a `MembersResponse` object containing members matching the criteria.
   */
  async getMembersByState({
    congress = ACTIVE_CONGRESS,
    state,
    currentMember = true,
  }: {
    congress: number;
    state: string;
    currentMember?: boolean;
  }): Promise<MembersResponse> {
    return this.makeRequest(`member/congress/${congress}/${state}`, {
      currentMember,
    });
  }

  /**
   * Retrieves legislation sponsored by a specific member of Congress.
   * @param options - Options containing the member's Bioguide ID and pagination parameters.
   * @param options.memberBioguideId - The unique Bioguide ID for the member.
   * @param options.limit - The maximum number of results to return (default: 20).
   * @param options.offset - The number of results to skip (for pagination) (default: 0).
   * @returns A promise resolving to a `SponsoredLegislationResponse` object containing an array of sponsored bills/amendments and pagination info.
   */
  async getMemberSponsoredLegislation({
    memberBioguideId,
    limit = 20,
    offset = 0,
  }: {
    memberBioguideId: string;
  } & PaginationParams): Promise<SponsoredLegislationResponse> {
    return this.makeRequest(`member/${memberBioguideId}/sponsored-legislation`, { limit, offset });
  }

  /**
   * Retrieves legislation cosponsored by a specific member of Congress.
   * @param options - Options containing the member's Bioguide ID and pagination parameters.
   * @param options.memberBioguideId - The unique Bioguide ID for the member.
   * @param options.limit - The maximum number of results to return (default: 20).
   * @param options.offset - The number of results to skip (for pagination) (default: 0).
   * @returns A promise resolving to a `SponsoredLegislationResponse` object containing an array of cosponsored bills/amendments and pagination info. (Note: API uses the same response type as sponsored legislation).
   */
  async getMemberCosponsoredLegislation({
    memberBioguideId,
    limit = 20,
    offset = 0,
  }: {
    memberBioguideId: string;
  } & PaginationParams): Promise<CosponsoredLegislationResponse> {
    return this.makeRequest(`member/${memberBioguideId}/cosponsored-legislation`, {
      limit,
      offset,
    });
  }

  /**
   * Retrieves a list of bills, optionally filtered by congress and update date, sorted by update date.
   * @param options - Optional query, sorting, and pagination parameters.
   * @param options.congress - The specific congress number to filter bills by (e.g., 117). If omitted, retrieves bills across all congresses.
   * @param options.limit - The maximum number of results to return (default: 20).
   * @param options.offset - The number of results to skip (for pagination) (default: 0).
   * @param options.updatedAfter - Filters results to include only bills updated after this date.
   * @param options.updatedBefore - Filters results to include only bills updated before this date.
   * @param options.sort - The sort order for the results (default: "updateDate+desc"). Can be "updateDate+asc" or "updateDate+desc".
   * @returns A promise resolving to a `BillsResponse` object containing an array of bill items and pagination info.
   */
  async getBills({
    limit = 20,
    offset = 0,
    updatedAfter,
    updatedBefore,
    congress,
    sort = "updateDate+desc",
  }: {
    updatedAfter?: Date;
    updatedBefore?: Date;
    congress?: number;
    sort?: "updateDate+desc" | "updateDate+asc";
  } & PaginationParams): Promise<BillsResponse> {
    const path = congress ? `bill${congress ? `/${congress}` : ``}` : "bill";
    return this.makeRequest(path, {
      limit,
      offset,
      sort,
      ...(updatedAfter ? { fromDateTime: updatedAfter.toISOString() } : {}),
      ...(updatedBefore ? { toDateTime: updatedBefore.toISOString() } : {}),
    });
  }

  /**
   * Retrieves detailed information about a specific bill or resolution.
   * @param options - Query parameters to identify the bill.
   * @param options.congress - The congress number (e.g., 117, default: ACTIVE_CONGRESS).
   * @param options.billType - The type of the bill (e.g., "hr", "s", "hjres", "sjres"). Case-insensitive.
   * @param options.billNumber - The number of the bill (e.g., 1234).
   * @returns A promise resolving to a `BillResponse` object containing detailed information about the specified bill.
   */
  async getBillDetails({
    congress = ACTIVE_CONGRESS,
    billType,
    billNumber,
  }: {
    congress: number;
    billType: string;
    billNumber: number;
  }): Promise<BillResponse> {
    return this.makeRequest(`bill/${congress}/${billType}/${billNumber}`);
  }

  /**
   * Retrieves the subjects (legislative and policy area) associated with a specific bill.
   * @param options - Query parameters to identify the bill.
   * @param options.congress - The congress number (e.g., 117, default: ACTIVE_CONGRESS).
   * @param options.billType - The type of the bill (e.g., "hr", "s"). Case-insensitive.
   * @param options.billNumber - The number of the bill (e.g., 1234).
   * @returns A promise resolving to a `SubjectsResponse` object containing the subjects for the specified bill.
   */
  async getSubjectsForBill({
    congress = ACTIVE_CONGRESS,
    billType,
    billNumber,
  }: {
    congress: number;
    billType: string;
    billNumber: number;
  }): Promise<SubjectsResponse> {
    return this.makeRequest(`bill/${congress}/${billType}/${billNumber}/subjects`);
  }

  /**
   * Retrieves summaries for a specific bill. Bills can have multiple summaries corresponding to different versions or stages.
   * @param options - Query parameters to identify the bill.
   * @param options.congress - The congress number (e.g., 117, default: ACTIVE_CONGRESS).
   * @param options.billType - The type of the bill (e.g., "hr", "s"). Case-insensitive.
   * @param options.billNumber - The number of the bill (e.g., 1234).
   * @returns A promise resolving to a `SummariesResponse` object containing an array of summaries for the specified bill.
   */
  async getSummariesForBill({
    congress = ACTIVE_CONGRESS,
    billType,
    billNumber,
  }: {
    congress: number;
    billType: string;
    billNumber: number;
  }): Promise<SummariesResponse> {
    return this.makeRequest(`bill/${congress}/${billType}/${billNumber}/summaries`);
  }

  /**
   * Retrieves the titles for a specific bill.
   * @param options - Query parameters to identify the bill.
   * @param options.congress - The congress number (e.g., 117, default: ACTIVE_CONGRESS).
   * @param options.billType - The type of the bill (e.g., "hr", "s"). Case-insensitive.
   * @param options.billNumber - The number of the bill (e.g., 1234).
   * @returns A promise resolving to a `TitlesResponse` object containing the titles for the specified bill.
   */
  async getTitlesForBill({
    congress = ACTIVE_CONGRESS,
    billType,
    billNumber,
  }: {
    congress: number;
    billType: string;
    billNumber: number;
  }): Promise<TitlesResponse> {
    return this.makeRequest(`bill/${congress}/${billType}/${billNumber}/titles`);
  }

  /**
   * Retrieves the different text versions available for a specific bill (e.g., Introduced, Engrossed, Enrolled).
   * @param options - Query parameters to identify the bill.
   * @param options.congress - The congress number (e.g., 117, default: ACTIVE_CONGRESS).
   * @param options.billType - The type of the bill (e.g., "hr", "s"). Case-insensitive.
   * @param options.billNumber - The number of the bill (e.g., 1234).
   * @returns A promise resolving to a `BillTextResponse` object containing information about available text versions and their formats.
   */
  async getTextsForBill({
    congress = ACTIVE_CONGRESS,
    billType,
    billNumber,
  }: {
    congress: number;
    billType: string;
    billNumber: number;
  }): Promise<BillTextResponse> {
    return this.makeRequest(`bill/${congress}/${billType}/${billNumber}/text`);
  }

  /**
   * Retrieves the list of cosponsors for a specific bill.
   * @param options - Query parameters to identify the bill.
   * @param options.congress - The congress number (e.g., 117, default: ACTIVE_CONGRESS).
   * @param options.billType - The type of the bill (e.g., "hr", "s"). Case-insensitive.
   * @param options.billNumber - The number of the bill (e.g., 1234).
   * @returns A promise resolving to a `CosponsorsResponse` object containing a list of cosponsors.
   */
  async getCosponsorsForBill({
    congress = ACTIVE_CONGRESS,
    billType,
    billNumber,
  }: {
    congress: number;
    billType: string;
    billNumber: number;
  }): Promise<CosponsorsResponse> {
    return this.makeRequest(`bill/${congress}/${billType}/${billNumber}/cosponsors`);
  }

  /**
   * Retrieves the actions taken on a specific bill (e.g., introduced, referred to committee, passed House).
   * @param options - Query parameters to identify the bill.
   * @param options.congress - The congress number (e.g., 117, default: ACTIVE_CONGRESS).
   * @param options.billType - The type of the bill (e.g., "hr", "s"). Case-insensitive.
   * @param options.billNumber - The number of the bill (e.g., 1234).
   * @returns A promise resolving to an `ActionsResponse` object containing a list of actions.
   */
  async getActionsForBill({
    congress = ACTIVE_CONGRESS,
    billType,
    billNumber,
  }: {
    congress: number;
    billType: string;
    billNumber: number;
  }): Promise<ActionsResponse> {
    return this.makeRequest(`bill/${congress}/${billType}/${billNumber}/actions`);
  }

  /**
   * Retrieves bills that are related to a specific bill (e.g., identical bills, bills with related subject matter).
   * @param options - Query parameters to identify the bill.
   * @param options.congress - The congress number (e.g., 117, default: ACTIVE_CONGRESS).
   * @param options.billType - The type of the bill (e.g., "hr", "s"). Case-insensitive.
   * @param options.billNumber - The number of the bill (e.g., 1234).
   * @returns A promise resolving to a `RelatedBillsResponse` object containing a list of related bills and relationship details.
   */
  async getRelatedBills({
    congress = ACTIVE_CONGRESS,
    billType,
    billNumber,
  }: {
    congress: number;
    billType: string;
    billNumber: number;
  }): Promise<RelatedBillsResponse> {
    return this.makeRequest(`bill/${congress}/${billType}/${billNumber}/relatedbills`);
  }

  /**
   * Retrieves the committees associated with a specific bill and their activities related to it.
   * @param options - Query parameters to identify the bill.
   * @param options.congress - The congress number (e.g., 117, default: ACTIVE_CONGRESS).
   * @param options.billType - The type of the bill (e.g., "hr", "s"). Case-insensitive.
   * @param options.billNumber - The number of the bill (e.g., 1234).
   * @returns A promise resolving to a `BillCommitteesResponse` object containing committee information and related activities.
   */
  async getCommitteesForBill({
    congress = ACTIVE_CONGRESS,
    billType,
    billNumber,
  }: {
    congress: number;
    billType: string;
    billNumber: number;
  }): Promise<BillCommitteesResponse> {
    return this.makeRequest(`bill/${congress}/${billType}/${billNumber}/committees`);
  }

  /**
   * Retrieves amendments proposed to a specific bill.
   * @param options - Query parameters to identify the bill.
   * @param options.congress - The congress number (e.g., 117, default: ACTIVE_CONGRESS).
   * @param options.billType - The type of the bill (e.g., "hr", "s"). Case-insensitive.
   * @param options.billNumber - The number of the bill (e.g., 1234).
   * @returns A promise resolving to an `AmendmentsResponse` object containing a list of amendments related to the bill.
   */
  async getAmendmentsForBill({
    congress = ACTIVE_CONGRESS,
    billType,
    billNumber,
  }: {
    congress: number;
    billType: string;
    billNumber: number;
  }): Promise<AmendmentsResponse> {
    return this.makeRequest(`bill/${congress}/${billType}/${billNumber}/amendments`);
  }

  /**
   * Get a list of bill summaries
   * @param congress - Optional congress number to filter by (e.g. 117)
   * @param billType - Optional bill type to filter by (e.g. "hr", "s")
   * @param fromDateTime - Optional date to get summaries published after
   * @param toDateTime - Optional date to get summaries published before
   * @param limit - Number of results to return (default 20)
   * @param offset - Number of results to skip (default 0)
   * @returns SummariesListResponse
   */
  async getSummaries({
    congress,
    billType,
    fromDateTime,
    toDateTime,
    limit = 20,
    offset = 0,
  }: {
    congress?: number;
    billType?: string;
    fromDateTime?: Date;
    toDateTime?: Date;
  } & PaginationParams): Promise<SummariesListResponse> {
    const path = congress
      ? `summaries/${congress}${billType ? `/${billType}` : ""}`
      : "summaries";

    return this.makeRequest(path, {
      limit,
      offset,
      ...(fromDateTime ? { fromDateTime: fromDateTime.toISOString() } : {}),
      ...(toDateTime ? { toDateTime: toDateTime.toISOString() } : {}),
    });
  }

  /**
   * Retrieves a list of amendments, optionally filtered by congress, type, and update date.
   * @param options - Optional query and pagination parameters.
   * @param options.congress - The specific congress number to filter amendments by (e.g., 117).
   * @param options.type - The type of amendment to filter by ("SAMDT", "HAMDT", or "SUAMDT").
   * @param options.limit - The maximum number of results to return (default: 20).
   * @param options.offset - The number of results to skip (for pagination) (default: 0).
   * @param options.updatedAfter - Filters results to include only amendments updated after this date.
   * @returns A promise resolving to an `AmendmentsResponse` object containing an array of amendment items and pagination info.
   */
  async getAmendments({
    congress,
    type,
    limit = 20,
    offset = 0,
    updatedAfter,
  }: {
    congress?: number;
    type?: "SAMDT" | "HAMDT" | "SUAMDT";
    updatedAfter?: Date;
  } & PaginationParams): Promise<AmendmentsResponse> {
    let path = "amendment";

    if (congress) {
      path += `/${congress}`;
      if (type) {
        path += `/${type}`;
      }
    }

    return this.makeRequest(path, {
      limit,
      offset,
      ...(updatedAfter ? { fromDateTime: updatedAfter.toISOString() } : {}),
    });
  }

  /**
   * Retrieves detailed information about a specific amendment.
   * @param options - Query parameters to identify the amendment.
   * @param options.congress - The congress number (e.g., 117).
   * @param options.amendmentType - The type of the amendment ("SAMDT", "HAMDT", or "SUAMDT").
   * @param options.amendmentNumber - The number assigned to the amendment.
   * @returns A promise resolving to an `AmendmentResponse` object containing detailed information about the specified amendment.
   */
  async getAmendmentDetails({
    congress,
    amendmentType,
    amendmentNumber,
  }: {
    congress: number;
    amendmentType: "SAMDT" | "HAMDT" | "SUAMDT";
    amendmentNumber: string;
  }): Promise<AmendmentResponse> {
    return this.makeRequest(`amendment/${congress}/${amendmentType.toLowerCase()}/${amendmentNumber}`);
  }

  /**
   * Retrieves amendments proposed *to* a specific amendment (second-degree amendments).
   * @param options - Query parameters to identify the base amendment.
   * @param options.congress - The congress number (e.g., 117).
   * @param options.amendmentType - The type of the base amendment ("SAMDT", "HAMDT", or "SUAMDT").
   * @param options.amendmentNumber - The number of the base amendment.
   * @returns A promise resolving to an `AmendmentsResponse` object containing a list of amendments to the specified amendment.
   */
  async getAmendmentsToAmendment({
    congress,
    amendmentType,
    amendmentNumber,
  }: {
    congress: number;
    amendmentType: "SAMDT" | "HAMDT" | "SUAMDT";
    amendmentNumber: string;
  }): Promise<AmendmentsResponse> {
    return this.makeRequest(
      `amendment/${congress}/${amendmentType.toLowerCase()}/${amendmentNumber}/amendments`
    );
  }

  /**
   * Retrieves the list of cosponsors for a specific amendment.
   * @param options - Query parameters to identify the amendment.
   * @param options.congress - The congress number (e.g., 117).
   * @param options.amendmentType - The type of the amendment ("SAMDT", "HAMDT", or "SUAMDT").
   * @param options.amendmentNumber - The number of the amendment.
   * @returns A promise resolving to a `CosponsorsResponse` object containing a list of cosponsors for the amendment.
   */
  async getCosponsorsForAmendment({
    congress,
    amendmentType,
    amendmentNumber,
  }: {
    congress: number;
    amendmentType: "SAMDT" | "HAMDT" | "SUAMDT";
    amendmentNumber: string;
  }): Promise<CosponsorsResponse> {
    return this.makeRequest(
      `amendment/${congress}/${amendmentType.toLowerCase()}/${amendmentNumber}/cosponsors`
    );
  }

  /**
   * Retrieves the text versions available for a specific amendment.
   * @param options - Query parameters to identify the amendment.
   * @param options.congress - The congress number (e.g., 117).
   * @param options.amendmentType - The type of the amendment ("SAMDT", "HAMDT", or "SUAMDT").
   * @param options.amendmentNumber - The number of the amendment.
   * @returns A promise resolving to a `BillTextResponse` object containing information about available text versions. (Note: API uses BillTextResponse type).
   */
  async getTextForAmendment({
    congress,
    amendmentType,
    amendmentNumber,
  }: {
    congress: number;
    amendmentType: "SAMDT" | "HAMDT" | "SUAMDT";
    amendmentNumber: string;
  }): Promise<BillTextResponse> {
    return this.makeRequest(`amendment/${congress}/${amendmentType.toLowerCase()}/${amendmentNumber}/text`);
  }

  /**
   * Retrieves the actions taken on a specific amendment.
   * @param options - Query parameters to identify the amendment.
   * @param options.congress - The congress number (e.g., 117).
   * @param options.amendmentType - The type of the amendment ("SAMDT", "HAMDT", or "SUAMDT").
   * @param options.amendmentNumber - The number of the amendment.
   * @returns A promise resolving to an `ActionsResponse` object containing a list of actions taken on the amendment.
   */
  async getActionsForAmendment({
    congress,
    amendmentType,
    amendmentNumber,
  }: {
    congress: number;
    amendmentType: "SAMDT" | "HAMDT" | "SUAMDT";
    amendmentNumber: string;
  }): Promise<ActionsResponse> {
    return this.makeRequest(`amendment/${congress}/${amendmentType.toLowerCase()}/${amendmentNumber}/actions`);
  }

  /**
   * Retrieves a list of bills that have become law (Public or Private Laws) for a specific congress.
   * @param options - Query parameters to identify the congress.
   * @param options.congress - The congress number (e.g., 117, default: ACTIVE_CONGRESS).
   * @returns A promise resolving to a `LawsResponse` object containing a list of laws for the specified congress.
   */
  async getLaws({ congress = ACTIVE_CONGRESS }: { congress: number }): Promise<LawsResponse> {
    return this.makeRequest(`law/${congress}`);
  }

  /**
   * Retrieves entries from the Bound Congressional Record, filterable by date.
   * Note: Data availability lags significantly (1-2 years), making it primarily useful for historical research.
   * @param options - Query parameters to specify the date.
   * @param options.year - The year to retrieve records for.
   * @param options.month - Optional month to filter by (1-12).
   * @param options.day - Optional day to filter by (1-31). Requires month to be specified.
   * @returns A promise resolving to a `BoundCongressionalRecordResponse` object containing record entries for the specified date range.
   * @throws {Error} If `day` is specified without `month`.
   */
  async getBoundCongressionalRecord({
    year,
    month,
    day,
  }: {
    year: number;
    month?: number;
    day?: number;
  }): Promise<BoundCongressionalRecordResponse> {
    let path = `bound-congressional-record/${year}`;

    if (month !== undefined) {
      path += `/${month}`;

      if (day !== undefined) {
        path += `/${day}`;
      }
    } else if (day !== undefined) {
      throw new Error("Cannot specify day without month");
    }

    return this.makeRequest(path);
  }

  /**
   * Retrieves a list of daily Congressional Record issues, optionally filtered by volume number.
   * @param volumeNumber - Optional volume number (as a string) to filter the list of issues.
   * @returns A promise resolving to a `DailyCongressionalRecordListResponse` object containing a list of issues.
   */
  async getDailyCongressionalRecords(
    volumeNumber?: string
  ): Promise<DailyCongressionalRecordListResponse> {
    const path = volumeNumber
      ? `daily-congressional-record/${volumeNumber}`
      : "daily-congressional-record";
    return this.makeRequest(path);
  }

  /**
   * Retrieves detailed information about a specific daily Congressional Record issue, including its sections.
   * @param options - Query parameters to identify the specific issue.
   * @param options.volumeNumber - The volume number of the issue (as a string).
   * @param options.issueNumber - The issue number within the volume (as a string).
   * @returns A promise resolving to a `DailyCongressionalRecordIssueResponse` object containing details of the issue.
   */
  async getDailyCongressionalRecordIssue({
    volumeNumber,
    issueNumber,
  }: {
    volumeNumber: string;
    issueNumber: string;
  }): Promise<DailyCongressionalRecordIssueResponse> {
    return this.makeRequest(`daily-congressional-record/${volumeNumber}/${issueNumber}`);
  }

  /**
   * Retrieves articles contained within a specific daily Congressional Record issue, organized by section (e.g., Senate, House, Extensions of Remarks).
   * @param options - Query parameters to identify the specific issue.
   * @param options.volumeNumber - The volume number of the issue (as a string).
   * @param options.issueNumber - The issue number within the volume (as a string).
   * @returns A promise resolving to a `DailyCongressionalRecordArticlesResponse` object containing articles from the issue.
   */
  async getDailyCongressionalRecordArticles({
    volumeNumber,
    issueNumber,
  }: {
    volumeNumber: string;
    issueNumber: string;
  }): Promise<DailyCongressionalRecordArticlesResponse> {
    return this.makeRequest(`daily-congressional-record/${volumeNumber}/${issueNumber}/articles`);
  }

  /**
   * Retrieves a list of Congressional Research Service (CRS) reports, optionally filtered by update date.
   * @param options - Optional query and pagination parameters.
   * @param options.limit - The maximum number of results to return (default: 20).
   * @param options.offset - The number of results to skip (for pagination) (default: 0).
   * @param options.updatedAfter - Filters results to include only reports updated after this date.
   * @returns A promise resolving to a `CRSReportsResponse` object containing an array of CRS report base items and pagination info.
   */
  async getCRSReports({
    limit = 20,
    offset = 0,
    updatedAfter,
  }: {
    updatedAfter?: Date;
  } & PaginationParams): Promise<CRSReportsResponse> {
    return this.makeRequest("crsreport", {
      limit,
      offset,
      ...(updatedAfter ? { fromDateTime: updatedAfter.toISOString() } : {}),
    });
  }

  /**
   * Retrieves detailed information about a specific Congressional Research Service (CRS) report using its report number.
   * @param reportNumber - The unique identifier for the CRS report (e.g., "R40097").
   * @returns A promise resolving to a `CRSReportResponse` object containing detailed information about the specified report.
   */
  async getCRSReport(reportNumber: string): Promise<CRSReportResponse> {
    return this.makeRequest(`crsreport/${reportNumber}`);
  }

  /**
   * Get list of committees
   * @param options - Query options
   * @param options.congress - Optional congress number to filter by
   * @param options.chamber - Optional chamber to filter by ("house" or "senate")
   * @param options.limit - Number of results to return (default 20)
   * @param options.offset - Number of results to skip (default 0)
   * @returns CommitteesResponse containing committee information including system codes, names, and subcommittees
   */
  async getCommittees({
    congress,
    chamber,
    limit = 20,
    offset = 0,
  }: {
    congress?: number;
    chamber?: "house" | "senate";
  } & PaginationParams): Promise<CommitteesResponse> {
    const path = congress ? `committee/${congress}${chamber ? `/${chamber}` : ""}` : "committee";

    return this.makeRequest(path, { limit, offset });
  }

  /**
   * Get detailed information about a committee
   * @param options - Query options
   * @param options.chamber - The chamber ("house" or "senate")
   * @param options.systemCode - The committee's system code identifier
   * @returns CommitteeResponse containing detailed committee information including bills, activities, and current status
   */
  async getCommittee({
    chamber,
    systemCode,
  }: {
    chamber: "house" | "senate";
    systemCode: string;
  }): Promise<CommitteeResponse> {
    return this.makeRequest(`committee/${chamber}/${systemCode}`);
  }

  /**
   * Get nominations for a Senate committee
   * @param options - Query options
   * @param options.systemCode - The committee's system code identifier
   * @param options.limit - Number of results to return (default 20)
   * @param options.offset - Number of results to skip (default 0)
   * @returns CommitteeNominationsResponse containing nominations associated with the committee
   */
  async getCommitteeNominations({
    systemCode,
    limit = 20,
    offset = 0,
  }: {
    systemCode: string;
  } & PaginationParams): Promise<CommitteeNominationsResponse> {
    return this.makeRequest(`committee/senate/${systemCode}/nominations`, {
      limit,
      offset,
    });
  }

  /**
   * Get House communications for a committee
   * @param options - Query options
   * @param options.chamber - Must be "house"
   * @param options.systemCode - The committee's system code identifier
   * @param options.limit - Number of results to return (default 20)
   * @param options.offset - Number of results to skip (default 0)
   * @returns HouseCommunicationsResponse containing communications including executive communications, presidential messages, and petitions
   */
  async getCommitteeHouseCommunications({
    chamber,
    systemCode,
    limit = 20,
    offset = 0,
  }: {
    chamber: "house";
    systemCode: string;
  } & PaginationParams): Promise<HouseCommunicationsResponse> {
    return this.makeRequest(`committee/${chamber}/${systemCode}/house-communication`, {
      limit,
      offset,
    });
  }

  /**
   * Get Senate communications for a committee
   * @param options - Query options
   * @param options.chamber - Must be "senate"
   * @param options.systemCode - The committee's system code identifier
   * @param options.limit - Number of results to return (default 20)
   * @param options.offset - Number of results to skip (default 0)
   * @returns SenateCommunicationsResponse containing communications including executive communications and presidential messages
   */
  async getCommitteeSenateCommmunications({
    chamber,
    systemCode,
    limit = 20,
    offset = 0,
  }: {
    chamber: "senate";
    systemCode: string;
  } & PaginationParams): Promise<SenateCommunicationsResponse> {
    return this.makeRequest(`committee/${chamber}/${systemCode}/senate-communication`, {
      limit,
      offset,
    });
  }

  /**
   * Get list of committee meetings
   * @param options - Query options
   * @param options.congress - Optional congress number to filter by
   * @param options.chamber - Optional chamber to filter by ("house" or "senate")
   * @param options.limit - Number of results to return (default 20)
   * @param options.offset - Number of results to skip (default 0)
   * @returns CommitteeMeetingsResponse containing meeting information including dates, locations, and related documents
   */
  async getCommitteeMeetings({
    congress,
    chamber,
    limit = 20,
    offset = 0,
  }: {
    congress?: number;
    chamber?: "house" | "senate";
  } & PaginationParams): Promise<CommitteeMeetingsResponse> {
    const path = congress
      ? `committee-meeting/${congress}${chamber ? `/${chamber}` : ""}`
      : "committee-meeting";

    return this.makeRequest(path, { limit, offset });
  }

  /**
   * Get detailed information about a committee meeting
   * @param congress - The congress number (e.g. 117)
   * @param chamber - The chamber ("house" or "senate")
   * @param eventId - The event ID of the committee meeting
   * @returns CommitteeMeetingResponse containing detailed information about the specified committee meeting
   */
  async getCommitteeMeeting({
    congress,
    chamber,
    eventId,
  }: {
    congress: number;
    chamber: "house" | "senate";
    eventId: string;
  }): Promise<CommitteeMeetingResponse> {
    return this.makeRequest(`committee-meeting/${congress}/${chamber}/${eventId}`);
  }

  /**
   * Get list of committee prints
   * @param options - Query options
   * @param options.congress - Optional congress number to filter by
   * @param options.chamber - Optional chamber to filter by ("house" or "senate")
   * @param options.limit - Number of results to return (default 20)
   * @param options.offset - Number of results to skip (default 0)
   * @returns CommitteePrintsResponse containing print information including dates, locations, and related documents
   */
  async getCommitteePrints({
    congress,
    chamber,
    limit = 20,
    offset = 0,
  }: {
    congress?: number;
    chamber?: "house" | "senate";
  } & PaginationParams): Promise<CommitteePrintsResponse> {
    const path = congress
      ? `committee-print/${congress}${chamber ? `/${chamber}` : ""}`
      : "committee-print";

    return this.makeRequest(path, { limit, offset });
  }

  /**
   * Get detailed information about a committee print
   * @param congress - The congress number (e.g. 117)
   * @param chamber - The chamber ("house" or "senate")
   * @param jacketNumber - The jacket number of the committee print
   * @returns CommitteePrintResponse containing detailed information about the specified committee print
   */
  async getCommitteePrint({
    congress,
    chamber,
    jacketNumber,
  }: {
    congress: number;
    chamber: "house" | "senate";
    jacketNumber: string;
  }): Promise<CommitteePrintResponse> {
    return this.makeRequest(`committee-print/${congress}/${chamber}/${jacketNumber}`);
  }

  /**
   * Get text formats for a committee print
   * @param congress - The congress number (e.g. 117)
   * @param chamber - The chamber ("house" or "senate")
   * @param jacketNumber - The jacket number of the committee print
   * @returns CommitteePrintTextResponse containing text versions in different formats (PDF, HTML)
   */
  async getCommitteePrintText({
    congress,
    chamber,
    jacketNumber,
  }: {
    congress: number;
    chamber: "house" | "senate";
    jacketNumber: string;
  }): Promise<CommitteePrintTextResponse> {
    return this.makeRequest(`committee-print/${congress}/${chamber}/${jacketNumber}/text`);
  }

  /**
   * Get list of committee reports
   * @param options - Query options
   * @param options.congress - Optional congress number to filter by
   * @param options.reportType - Optional report type to filter by ("hrpt", "srpt", "erpt")
   * @param options.limit - Number of results to return (default 20)
   * @param options.offset - Number of results to skip (default 0)
   * @returns CommitteeReportsResponse containing report information including dates, locations, and related documents
   */
  async getCommitteeReports({
    congress,
    reportType,
    limit = 20,
    offset = 0,
  }: {
    congress?: number;
    reportType?: "hrpt" | "srpt" | "erpt";
  } & PaginationParams): Promise<CommitteeReportsResponse> {
    const path = congress
      ? `committee-report/${congress}${reportType ? `/${reportType}` : ""}`
      : "committee-report";

    return this.makeRequest(path, { limit, offset });
  }

  /**
   * Get detailed information about a committee report
   * @param congress - The congress number (e.g. 117)
   * @param reportType - The report type ("hrpt", "srpt", "erpt")
   * @param reportNumber - The report number
   * @param part - Optional part number of the report
   * @returns CommitteeReportResponse containing detailed information about the specified committee report
   */
  async getCommitteeReport({
    congress,
    reportType,
    reportNumber,
    part,
  }: {
    congress: number;
    reportType: "hrpt" | "srpt" | "erpt";
    reportNumber: string;
    part?: number;
  }): Promise<CommitteeReportResponse> {
    return this.makeRequest(
      `committee-report/${congress}/${reportType}/${reportNumber}${part ? `/${part}` : ""}`
    );
  }

  /**
   * Get text formats for a committee report
   * @param congress - The congress number (e.g. 117)
   * @param reportType - The report type ("hrpt", "srpt", "erpt")
   * @param reportNumber - The report number
   * @param part - Optional part number of the report
   * @returns CommitteeReportTextResponse containing text versions in different formats (PDF, HTML)
   */
  async getCommitteeReportText({
    congress,
    reportType,
    reportNumber,
    part,
  }: {
    congress: number;
    reportType: "hrpt" | "srpt" | "erpt";
    reportNumber: string;
    part?: number;
  }): Promise<CommitteeReportTextResponse> {
    return this.makeRequest(
      `committee-report/${congress}/${reportType}/${reportNumber}${part ? `/${part}` : ""}/text`
    );
  }

  /**
   * Get list of hearings
   * @param congress - Optional congress number to filter by (e.g. 116)
   * @param chamber - Optional chamber to filter by ("house" or "senate")
   * @param limit - Number of results to return (default 20)
   * @param offset - Number of results to skip (default 0)
   * @returns HearingsResponse
   */
  async getHearings({
    congress,
    chamber,
    limit = 20,
    offset = 0,
  }: {
    congress?: number;
    chamber?: "house" | "senate";
  } & PaginationParams): Promise<HearingsResponse> {
    const path = congress ? `hearing/${congress}${chamber ? `/${chamber}` : ""}` : "hearing";

    return this.makeRequest(path, { limit, offset });
  }

  /**
   * Get detailed information about a specific hearing
   * @param congress - The congress number (e.g. 116)
   * @param chamber - The chamber ("house" or "senate")
   * @param jacketNumber - The jacket identifier of the hearing (usually five digits)
   * @returns HearingResponse
   */
  async getHearing({
    congress,
    chamber,
    jacketNumber,
  }: {
    congress: number;
    chamber: "house" | "senate";
    jacketNumber: string;
  }): Promise<HearingResponse> {
    return this.makeRequest(`hearing/${congress}/${chamber}/${jacketNumber}`);
  }

  /**
   * Get list of House communications
   * @param congress - Optional congress number to filter by (e.g. 117)
   * @param type - Optional communication type to filter by ("ec", "pm", "pt", or "ml")
   * @param limit - Number of results to return (default 20)
   * @param offset - Number of results to skip (default 0)
   * @returns HouseCommunicationsResponse
   */
  async getHouseCommunications({
    congress,
    type,
    limit = 20,
    offset = 0,
  }: {
    congress?: number;
    type?: "ec" | "pm" | "pt" | "ml";
  } & PaginationParams): Promise<HouseCommunicationsResponse> {
    const path = congress
      ? `house-communication/${congress}${type ? `/${type}` : ""}`
      : "house-communication";

    return this.makeRequest(path, { limit, offset });
  }

  /**
   * Get detailed information about a specific House communication
   * @param congress - The congress number (e.g. 117)
   * @param type - The communication type ("ec", "pm", "pt", or "ml")
   * @param number - The communication number
   * @returns HouseCommunicationResponse
   */
  async getHouseCommunication({
    congress,
    type,
    number,
  }: {
    congress: number;
    type: "ec" | "pm" | "pt" | "ml";
    number: string;
  }): Promise<HouseCommunicationResponse> {
    return this.makeRequest(`house-communication/${congress}/${type}/${number}`);
  }

  /**
   * Get list of Senate communications
   * @param congress - Optional congress number to filter by (e.g. 117)
   * @param type - Optional communication type to filter by ("ec", "pom", or "pm")
   * @param limit - Number of results to return (default 20)
   * @param offset - Number of results to skip (default 0)
   * @returns SenateCommunicationsResponse
   */
  async getSenateCommunications({
    congress,
    type,
    limit = 20,
    offset = 0,
  }: {
    congress?: number;
    type?: "ec" | "pom" | "pm";
  } & PaginationParams): Promise<SenateCommunicationsResponse> {
    const path = congress
      ? `senate-communication/${congress}${type ? `/${type}` : ""}`
      : "senate-communication";

    return this.makeRequest(path, { limit, offset });
  }

  /**
   * Get detailed information about a specific Senate communication
   * @param congress - The congress number (e.g. 117)
   * @param type - The communication type ("ec", "pom", or "pm")
   * @param number - The communication number
   * @returns SenateCommunicationResponse
   */
  async getSenateCommunication({
    congress,
    type,
    number,
  }: {
    congress: number;
    type: "ec" | "pom" | "pm";
    number: string;
  }): Promise<SenateCommunicationResponse> {
    return this.makeRequest(`senate-communication/${congress}/${type}/${number}`);
  }

  /**
   * Get a list of treaties
   * @param options - Query options
   * @param options.congress - Optional congress number to filter by (e.g. 117)
   * @param options.limit - Number of results to return (default 20)
   * @param options.offset - Number of results to skip (default 0)
   * @returns TreatiesResponse containing treaty information including congress received, dates, and topics
   */
  async getTreaties({
    congress,
    limit = 20,
    offset = 0,
  }: {
    congress?: number;
  } & PaginationParams): Promise<TreatiesResponse> {
    const path = congress ? `treaty/${congress}` : "treaty";
    return this.makeRequest(path, { limit, offset });
  }

  /**
   * Get detailed information about a specific treaty
   * @param options - Query options
   * @param options.congress - The congress number (e.g. 117)
   * @param options.treatyNumber - The treaty number
   * @param options.treatySuffix - Optional suffix identifier for partitioned treaties (e.g. "A", "B", "C")
   * @returns TreatyResponse containing detailed treaty information including text, committees, and actions
   */
  async getTreaty({
    congress,
    treatyNumber,
    treatySuffix,
  }: {
    congress: number;
    treatyNumber: string;
    treatySuffix?: string;
  }): Promise<TreatyResponse> {
    const path = treatySuffix
      ? `treaty/${congress}/${treatyNumber}/${treatySuffix}`
      : `treaty/${congress}/${treatyNumber}`;
    return this.makeRequest(path);
  }

  /**
   * Get actions taken on a treaty
   * @param options - Query options
   * @param options.congress - The congress number (e.g. 117)
   * @param options.treatyNumber - The treaty number
   * @param options.treatySuffix - Optional suffix identifier for partitioned treaties (e.g. "A", "B", "C")
   * @returns TreatyActionsResponse containing actions including referrals, committee actions, and floor actions
   */
  async getTreatyActions({
    congress,
    treatyNumber,
    treatySuffix,
  }: {
    congress: number;
    treatyNumber: string;
    treatySuffix?: string;
  }): Promise<TreatyActionsResponse> {
    const path = treatySuffix
      ? `treaty/${congress}/${treatyNumber}/${treatySuffix}/actions`
      : `treaty/${congress}/${treatyNumber}/actions`;
    return this.makeRequest(path);
  }

  /**
   * Get committees associated with a treaty
   * @param options - Query options
   * @param options.congress - The congress number (e.g. 117)
   * @param options.treatyNumber - The treaty number
   * @param options.treatySuffix - Optional suffix identifier for partitioned treaties (e.g. "A", "B", "C")
   * @returns TreatyCommitteesResponse containing committee information and activities related to the treaty
   */
  async getTreatyCommittees({
    congress,
    treatyNumber,
    treatySuffix,
  }: {
    congress: number;
    treatyNumber: string;
    treatySuffix?: string;
  }): Promise<TreatyCommitteesResponse> {
    const path = treatySuffix
      ? `treaty/${congress}/${treatyNumber}/${treatySuffix}/committees`
      : `treaty/${congress}/${treatyNumber}/committees`;
    return this.makeRequest(path);
  }

  /**
   * BETA: Get a list of House Roll Call Votes
   * @param options - Query options
   * @param options.congress - Optional congress number to filter by (e.g. 119)
   * @param options.session - Optional session number to filter by (e.g. 1 or 2)
   * @param options.limit - Number of results to return (default 20)
   * @param options.offset - Number of results to skip (default 0)
   * @returns HouseRollCallVotesResponse containing vote information including congress, session, roll call numbers, and results
   */
  async getHouseRollCallVotes({
    congress,
    session,
    limit = 20,
    offset = 0,
  }: {
    congress?: number;
    session?: number;
  } & PaginationParams): Promise<HouseRollCallVotesResponse> {
    return this.makeRequest(
      `house-vote/${congress ? `${congress}/` : ""}${session ? `${session}/` : ""}`,
      { limit, offset }
    );
  }

  /**
   * BETA: Get detailed information about a specific House Roll Call Vote
   * @param options - Query options
   * @param options.congress - The congress number (e.g. 119)
   * @param options.session - The session number (e.g. 1 or 2)
   * @param options.voteNumber - The vote number
   * @returns HouseRollCallResponse containing detailed vote information including party totals and vote question
   */
  async getHouseRollCallVote({
    congress,
    session,
    voteNumber,
  }: {
    congress: number;
    session: number;
    voteNumber: string;
  }): Promise<HouseRollCallResponse> {
    return this.makeRequest(`house-vote/${congress}/${session}/${voteNumber}`);
  }

  /**
   * BETA: Get member voting data for a specific House Roll Call Vote
   * @param options - Query options
   * @param options.congress - The congress number (e.g. 119)
   * @param options.session - The session number (e.g. 1 or 2)
   * @param options.voteNumber - The vote number
   * @returns HouseRollCallVoteMemberVotesResponse containing individual member voting data
   */
  async getHouseRollCallVoteMemberVotes({
    congress,
    session,
    voteNumber,
  }: {
    congress: number;
    session: number;
    voteNumber: string;
  }): Promise<HouseRollCallVoteMemberVotesResponse> {
    return this.makeRequest(`house-vote/${congress}/${session}/${voteNumber}/members`);
  }
}

export default CongressService;
