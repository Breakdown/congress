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
  TreatyTextResponse,
  TreatyCommitteesResponse,
} from "./types";

const CONGRESS_GOV_BASE_API_URL = "https://api.congress.gov/v3";
const ACTIVE_CONGRESS = 119;

class CongressService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

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
   * Get a list of all congresses and their sessions
   * @param options - Pagination options
   * @param options.limit - Number of results to return (default 20)
   * @param options.offset - Number of results to skip (default 0)
   * @returns CongressesResponse containing an array of congress items with sessions, dates, and metadata
   */
  async getCongresses({
    limit = 20,
    offset = 0,
  }: PaginationParams = {}): Promise<CongressesResponse> {
    return this.makeRequest("/congress", { limit, offset });
  }

  /**
   * Get detailed information about a specific congress
   * @param congress - The congress number (e.g. 117)
   * @returns CongressResponse containing detailed congress information including sessions, dates, and metadata
   */
  async getCongress(congress: number): Promise<CongressResponse> {
    return this.makeRequest(`/congress/${congress}`);
  }

  /**
   * Get the current congress in session
   * @returns The current congress number
   */
  async getCurrentCongress(): Promise<CongressResponse> {
    return this.makeRequest("/congress/current");
  }

  /**
   * Check if Congress is currently in session
   * @returns boolean indicating if Congress is in session
   */
  async isCongressInSession(): Promise<boolean> {
    const currentCongress = await this.getCurrentCongress();
    const congressDetails = await this.getCongress(currentCongress);

    const now = new Date();
    const sessions = congressDetails.congress.sessions.item;

    return sessions.some((session) => {
      const startDate = new Date(session.startDate);
      const endDate = new Date(session.endDate);
      return now >= startDate && now <= endDate;
    });
  }

  /**
   * Get a list of nominations
   * @param options - Query options
   * @param options.congress - Optional congress number to filter by (e.g. 117)
   * @param options.limit - Number of results to return (default 20)
   * @param options.offset - Number of results to skip (default 0)
   * @returns NominationsResponse containing an array of nomination items with details like congress, number, description, and dates
   */
  async getNominations({
    congress,
    limit = 20,
    offset = 0,
  }: {
    congress?: number;
  } & PaginationParams): Promise<NominationsResponse> {
    const path = congress ? `/nomination/${congress}` : "/nomination";
    return this.makeRequest(path, { limit, offset });
  }

  /**
   * Get detailed information about a specific nomination
   * @param options - Query options
   * @param options.congress - The congress number (e.g. 117)
   * @param options.nominationNumber - The nomination number
   * @param options.partNumber - Optional part number for partitioned nominations (e.g. "00" if not partitioned)
   * @returns NominationResponse containing detailed nomination information including description, dates, and related data
   */
  async getNomination({
    congress,
    nominationNumber,
    partNumber,
  }: {
    congress: number;
    nominationNumber: string;
    partNumber?: string;
  }): Promise<NominationResponse> {
    const path = partNumber
      ? `/nomination/${congress}/${nominationNumber}/${partNumber}`
      : `/nomination/${congress}/${nominationNumber}`;
    return this.makeRequest(path);
  }

  /**
   * Get nominees for a specific nomination
   * @param options - Query options
   * @param options.congress - The congress number (e.g. 117)
   * @param options.nominationNumber - The nomination number
   * @param options.partNumber - Optional part number for partitioned nominations
   * @returns NomineesResponse containing an array of nominee items with details like name, state, and dates
   */
  async getNominees({
    congress,
    nominationNumber,
    partNumber,
  }: {
    congress: number;
    nominationNumber: string;
    partNumber?: string;
  }): Promise<NomineesResponse> {
    const path = partNumber
      ? `/nomination/${congress}/${nominationNumber}/${partNumber}/nominees`
      : `/nomination/${congress}/${nominationNumber}/nominees`;
    return this.makeRequest(path);
  }

  /**
   * Get committees associated with a nomination
   * @param options - Query options
   * @param options.congress - The congress number (e.g. 117)
   * @param options.nominationNumber - The nomination number
   * @param options.partNumber - Optional part number for partitioned nominations
   * @returns NominationCommitteesResponse containing committee information and activities
   */
  async getNominationCommittees({
    congress,
    nominationNumber,
    partNumber,
  }: {
    congress: number;
    nominationNumber: string;
    partNumber?: string;
  }): Promise<NominationCommitteesResponse> {
    const path = partNumber
      ? `/nomination/${congress}/${nominationNumber}/${partNumber}/committees`
      : `/nomination/${congress}/${nominationNumber}/committees`;
    return this.makeRequest(path);
  }

  /**
   * Get actions taken on a nomination
   * @param congress - The congress number (e.g. 117)
   * @param nominationNumber - The nomination number
   * @param partNumber - Optional part number for partitioned nominations
   * @returns NominationActionsResponse
   */
  async getNominationActions({
    congress,
    nominationNumber,
    partNumber,
  }: {
    congress: number;
    nominationNumber: string;
    partNumber?: string;
  }): Promise<NominationActionsResponse> {
    const path = partNumber
      ? `/nomination/${congress}/${nominationNumber}/${partNumber}/actions`
      : `/nomination/${congress}/${nominationNumber}/actions`;
    return this.makeRequest(path);
  }

  /**
   * Get hearings associated with a nomination
   * @param congress - The congress number (e.g. 117)
   * @param nominationNumber - The nomination number
   * @param partNumber - Optional part number for partitioned nominations
   * @returns NominationHearingsResponse
   */
  async getNominationHearings({
    congress,
    nominationNumber,
    partNumber,
  }: {
    congress: number;
    nominationNumber: string;
    partNumber?: string;
  }): Promise<NominationHearingsResponse> {
    const path = partNumber
      ? `/nomination/${congress}/${nominationNumber}/${partNumber}/hearings`
      : `/nomination/${congress}/${nominationNumber}/hearings`;
    return this.makeRequest(path);
  }

  /**
   * Get a list of members
   * @param options - Query options
   * @param options.limit - Number of results to return (default 20)
   * @param options.offset - Number of results to skip (default 0)
   * @param options.updatedAfter - Only return members updated after this date
   * @param options.updatedBefore - Only return members updated before this date
   * @param options.currentMember - Whether to only return current members (default true)
   * @returns MembersResponse containing an array of member items with bioguide IDs, names, parties, and terms
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
    return this.makeRequest("/member", {
      limit,
      offset,
      currentMember,
      ...(updatedAfter ? { fromDateTime: updatedAfter.toISOString() } : {}),
      ...(updatedBefore ? { toDateTime: updatedBefore.toISOString() } : {}),
    });
  }

  async getMembersByCongress({
    limit = 20,
    offset = 0,
    congress = 119,
  }: {
    congress: number;
  } & PaginationParams): Promise<MembersResponse> {
    return this.makeRequest(`/member/congress/${congress}`, {
      limit,
      offset,
      congress,
    });
  }

  // Get detailed information about a member
  async getMember({ memberBioguideId }: { memberBioguideId: string }): Promise<MemberResponse> {
    return this.makeRequest(`/member/${memberBioguideId}`);
  }

  // Get members by state and district
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
    return this.makeRequest(`/member/congress/${congress}/${state}/${district}`, { currentMember });
  }

  // Get members by state
  async getMembersByState({
    congress = ACTIVE_CONGRESS,
    state,
    currentMember = true,
  }: {
    congress: number;
    state: string;
    currentMember?: boolean;
  }): Promise<MembersResponse> {
    return this.makeRequest(`/member/congress/${congress}/${state}`, {
      currentMember,
    });
  }

  // Get sponsored legislation for a member
  async getMemberSponsoredLegislation({
    memberBioguideId,
    limit = 20,
    offset = 0,
  }: {
    memberBioguideId: string;
  } & PaginationParams): Promise<BillsResponse> {
    return this.makeRequest(`/member/${memberBioguideId}/sponsored-legislation`, { limit, offset });
  }

  // Get cosponsored legislation for a member
  async getMemberCosponsoredLegislation({
    memberBioguideId,
    limit = 20,
    offset = 0,
  }: {
    memberBioguideId: string;
  } & PaginationParams): Promise<BillsResponse> {
    return this.makeRequest(`/member/${memberBioguideId}/cosponsored-legislation`, {
      limit,
      offset,
    });
  }

  /**
   * Get bills sorted by updated at date
   * @param options - Query options
   * @param options.limit - Number of results to return (default 20)
   * @param options.offset - Number of results to skip (default 0)
   * @param options.updatedAfter - Only return bills updated after this date
   * @param options.updatedBefore - Only return bills updated before this date
   * @param options.congress - Optional congress number to filter by
   * @param options.sort - Optional sort order (default "updateDate+desc")
   * @returns BillsResponse containing an array of bills with congress, type, title, and latest action
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
    sort?: string;
  } & PaginationParams): Promise<BillsResponse> {
    const path = congress ? `/bill${congress ? `/${congress}` : ``}` : "/bill";
    return this.makeRequest(path, {
      limit,
      offset,
      sort,
      ...(updatedAfter ? { fromDateTime: updatedAfter.toISOString() } : {}),
      ...(updatedBefore ? { toDateTime: updatedBefore.toISOString() } : {}),
    });
  }

  /**
   * Get detailed information about a bill
   * @param options - Query options
   * @param options.congress - The congress number (default ACTIVE_CONGRESS)
   * @param options.billType - The type of bill (e.g. "HR", "S", "HJRES", "SJRES")
   * @param options.billNumber - The bill number
   * @returns BillResponse containing detailed bill information including sponsors, committees, actions, and related content
   */
  async getBill({
    congress = ACTIVE_CONGRESS,
    billType,
    billNumber,
  }: {
    congress: number;
    billType: string;
    billNumber: number;
  }): Promise<BillResponse> {
    return this.makeRequest(`/bill/${congress}/${billType}/${billNumber}`);
  }

  /**
   * Fetch subjects for a bill
   * @param options - Query options
   * @param options.congress - The congress number (default ACTIVE_CONGRESS)
   * @param options.billType - The type of bill
   * @param options.billNumber - The bill number
   * @returns SubjectsResponse containing legislative subjects and policy area information
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
    return this.makeRequest(`/bill/${congress}/${billType}/${billNumber}/subjects`);
  }

  /**
   * Fetch summaries for a bill
   * @param options - Query options
   * @param options.congress - The congress number (default ACTIVE_CONGRESS)
   * @param options.billType - The type of bill
   * @param options.billNumber - The bill number
   * @returns SummariesResponse containing bill summaries with version information and text
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
    return this.makeRequest(`/bill/${congress}/${billType}/${billNumber}/summaries`);
  }

  /**
   * Fetch text versions for a bill
   * @param options - Query options
   * @param options.congress - The congress number (default ACTIVE_CONGRESS)
   * @param options.billType - The type of bill
   * @param options.billNumber - The bill number
   * @returns BillTextResponse containing different versions of the bill text in various formats
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
    return this.makeRequest(`/bill/${congress}/${billType}/${billNumber}/text`);
  }

  /**
   * Get committees for a bill
   * @param options - Query options
   * @param options.congress - The congress number (default ACTIVE_CONGRESS)
   * @param options.billType - The type of bill
   * @param options.billNumber - The bill number
   * @returns BillCommitteesResponse containing committees and subcommittees involved with the bill
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
    return this.makeRequest(`/bill/${congress}/${billType}/${billNumber}/committees`);
  }

  /**
   * Get a list of amendments
   * @param options - Query options
   * @param options.congress - Optional congress number to filter by
   * @param options.type - Optional amendment type to filter by (e.g. "SAMDT", "HAMDT", "SUAMDT")
   * @param options.limit - Number of results to return (default 20)
   * @param options.offset - Number of results to skip (default 0)
   * @param options.updatedAfter - Only return amendments updated after this date
   * @returns AmendmentsResponse containing an array of amendments
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
    let path = "/amendment";

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
   * Get detailed information about a specific amendment
   * @param options - Query options
   * @param options.congress - The congress number (e.g. 117)
   * @param options.amendmentType - The type of amendment (e.g. "SAMDT", "HAMDT", "SUAMDT")
   * @param options.amendmentNumber - The amendment number
   * @returns AmendmentsResponse containing detailed amendment information
   */
  async getAmendment({
    congress,
    amendmentType,
    amendmentNumber,
  }: {
    congress: number;
    amendmentType: "SAMDT" | "HAMDT" | "SUAMDT";
    amendmentNumber: string;
  }): Promise<AmendmentsResponse> {
    return this.makeRequest(`/amendment/${congress}/${amendmentType}/${amendmentNumber}`);
  }

  /**
   * Get amendments to a specific amendment
   * @param options - Query options
   * @param options.congress - The congress number (e.g. 117)
   * @param options.amendmentType - The type of amendment (e.g. "SAMDT", "HAMDT", "SUAMDT")
   * @param options.amendmentNumber - The amendment number
   * @returns AmendmentsResponse containing amendments to the specified amendment
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
      `/amendment/${congress}/${amendmentType}/${amendmentNumber}/amendments`
    );
  }

  /**
   * Get cosponsors for a specific amendment
   * @param options - Query options
   * @param options.congress - The congress number (e.g. 117)
   * @param options.amendmentType - The type of amendment (e.g. "SAMDT", "HAMDT", "SUAMDT")
   * @param options.amendmentNumber - The amendment number
   * @returns CosponsorsResponse containing cosponsors of the amendment
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
      `/amendment/${congress}/${amendmentType}/${amendmentNumber}/cosponsors`
    );
  }

  /**
   * Get text versions for a specific amendment
   * @param options - Query options
   * @param options.congress - The congress number (e.g. 117)
   * @param options.amendmentType - The type of amendment (e.g. "SAMDT", "HAMDT", "SUAMDT")
   * @param options.amendmentNumber - The amendment number
   * @returns BillTextResponse containing text versions of the amendment
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
    return this.makeRequest(`/amendment/${congress}/${amendmentType}/${amendmentNumber}/text`);
  }

  /**
   * Get actions for a specific amendment
   * @param options - Query options
   * @param options.congress - The congress number (e.g. 117)
   * @param options.amendmentType - The type of amendment (e.g. "SAMDT", "HAMDT", "SUAMDT")
   * @param options.amendmentNumber - The amendment number
   * @returns ActionsResponse containing actions taken on the amendment
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
    return this.makeRequest(`/amendment/${congress}/${amendmentType}/${amendmentNumber}/actions`);
  }

  // Get amendments for a bill
  async getAmendmentsForBill({
    congress = ACTIVE_CONGRESS,
    billType,
    billNumber,
  }: {
    congress: number;
    billType: string;
    billNumber: number;
  }): Promise<AmendmentsResponse> {
    return this.makeRequest(`/bill/${congress}/${billType}/${billNumber}/amendments`);
  }

  // Fetch cosponsors for a bill
  async getCosponsorsForBill({
    congress = ACTIVE_CONGRESS,
    billType,
    billNumber,
  }: {
    congress: number;
    billType: string;
    billNumber: number;
  }): Promise<CosponsorsResponse> {
    return this.makeRequest(`/bill/${congress}/${billType}/${billNumber}/cosponsors`);
  }

  // Get related bills for a bill
  async getRelatedBills({
    congress = ACTIVE_CONGRESS,
    billType,
    billNumber,
  }: {
    congress: number;
    billType: string;
    billNumber: number;
  }): Promise<RelatedBillsResponse> {
    return this.makeRequest(`/bill/${congress}/${billType}/${billNumber}/relatedbills`);
  }

  // Get laws - passed bills
  async getLaws({ congress = ACTIVE_CONGRESS }: { congress: number }): Promise<LawsResponse> {
    return this.makeRequest(`/law/${congress}`);
  }

  /**
   * Get laws of a specific type
   * @param options - Query options
   * @param options.congress - The congress number (default ACTIVE_CONGRESS)
   * @param options.lawType - The type of law (e.g. "public", "private")
   * @param options.limit - Number of results to return (default 20)
   * @param options.offset - Number of results to skip (default 0)
   * @returns LawsResponse containing an array of laws of the specified type
   */
  async getLawsByType({
    congress = ACTIVE_CONGRESS,
    lawType,
    limit = 20,
    offset = 0,
  }: {
    congress: number;
    lawType: string;
  } & PaginationParams): Promise<LawsResponse> {
    return this.makeRequest(`/law/${congress}/${lawType}`, { limit, offset });
  }

  /**
   * Get detailed information about a specific law
   * @param options - Query options
   * @param options.congress - The congress number (default ACTIVE_CONGRESS)
   * @param options.lawType - The type of law (e.g. "public", "private")
   * @param options.lawNumber - The law number
   * @returns LawsResponse containing detailed information about the specified law
   */
  async getLaw({
    congress = ACTIVE_CONGRESS,
    lawType,
    lawNumber,
  }: {
    congress: number;
    lawType: string;
    lawNumber: string;
  }): Promise<LawsResponse> {
    return this.makeRequest(`/law/${congress}/${lawType}/${lawNumber}`);
  }

  // Get actions for a bill
  async getActionsForBill({
    congress = ACTIVE_CONGRESS,
    billType,
    billNumber,
  }: {
    congress: number;
    billType: string;
    billNumber: number;
  }): Promise<ActionsResponse> {
    return this.makeRequest(`/bill/${congress}/${billType}/${billNumber}/actions`);
  }

  // Get bound congressional record by date
  async getBoundCongressionalRecord({
    year,
    month,
    day,
  }: {
    year: number;
    month?: number;
    day?: number;
  }): Promise<BoundCongressionalRecordResponse> {
    let path = `/bound-congressional-record/${year}`;

    if (month !== undefined) {
      // Pad month with leading zero if needed
      const monthStr = month.toString().padStart(2, "0");
      path += `/${monthStr}`;

      if (day !== undefined) {
        // Pad day with leading zero if needed
        const dayStr = day.toString().padStart(2, "0");
        path += `/${dayStr}`;
      }
    } else if (day !== undefined) {
      throw new Error("Cannot specify day without month");
    }

    return this.makeRequest(path);
  }

  /**
   * Get a list of CRS Reports
   * @param limit - Number of results to return (default 20)
   * @param offset - Number of results to skip (default 0)
   * @param updatedAfter - Only return reports updated after this date
   * @returns CRSReportsResponse
   */
  async getCRSReports({
    limit = 20,
    offset = 0,
    updatedAfter,
  }: {
    updatedAfter?: Date;
  } & PaginationParams): Promise<CRSReportsResponse> {
    return this.makeRequest("/crs-reports", {
      limit,
      offset,
      ...(updatedAfter ? { fromDateTime: updatedAfter.toISOString() } : {}),
    });
  }

  /**
   * Get detailed information about a specific CRS Report
   * @param reportId - The ID of the report to fetch (e.g. "R40097")
   * @returns CRSReportResponse
   */
  async getCRSReport(reportId: string): Promise<CRSReportResponse> {
    return this.makeRequest(`/crs-reports/${reportId}`);
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
    const path = congress ? `/committee/${congress}${chamber ? `/${chamber}` : ""}` : "/committee";

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
    return this.makeRequest(`/committee/${chamber}/${systemCode}`);
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
    return this.makeRequest(`/committee/senate/${systemCode}/nominations`, {
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
    return this.makeRequest(`/committee/${chamber}/${systemCode}/house-communication`, {
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
    return this.makeRequest(`/committee/${chamber}/${systemCode}/senate-communication`, {
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
      ? `/committee-meeting/${congress}${chamber ? `/${chamber}` : ""}`
      : "/committee-meeting";

    return this.makeRequest(path, { limit, offset });
  }

  // Get detailed information about a committee meeting
  async getCommitteeMeeting({
    congress,
    chamber,
    eventId,
  }: {
    congress: number;
    chamber: "house" | "senate";
    eventId: string;
  }): Promise<CommitteeMeetingResponse> {
    return this.makeRequest(`/committee-meeting/${congress}/${chamber}/${eventId}`);
  }

  // Get list of committee prints
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
      ? `/committee-print/${congress}${chamber ? `/${chamber}` : ""}`
      : "/committee-print";

    return this.makeRequest(path, { limit, offset });
  }

  // Get detailed information about a committee print
  async getCommitteePrint({
    congress,
    chamber,
    jacketNumber,
  }: {
    congress: number;
    chamber: "house" | "senate";
    jacketNumber: string;
  }): Promise<CommitteePrintResponse> {
    return this.makeRequest(`/committee-print/${congress}/${chamber}/${jacketNumber}`);
  }

  // Get text formats for a committee print
  async getCommitteePrintText({
    congress,
    chamber,
    jacketNumber,
  }: {
    congress: number;
    chamber: "house" | "senate";
    jacketNumber: string;
  }): Promise<CommitteePrintTextResponse> {
    return this.makeRequest(`/committee-print/${congress}/${chamber}/${jacketNumber}/text`);
  }

  // Get list of committee reports
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
      ? `/committee-report/${congress}${reportType ? `/${reportType}` : ""}`
      : "/committee-report";

    return this.makeRequest(path, { limit, offset });
  }

  // Get detailed information about a committee report
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
      `/committee-report/${congress}/${reportType}/${reportNumber}${part ? `/${part}` : ""}`
    );
  }

  // Get text formats for a committee report
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
      `/committee-report/${congress}/${reportType}/${reportNumber}${part ? `/${part}` : ""}/text`
    );
  }

  /**
   * Get list of daily Congressional Record issues
   * @param volumeNumber - Optional volume number to filter by
   * @returns DailyCongressionalRecordListResponse
   */
  async getDailyCongressionalRecords(
    volumeNumber?: string
  ): Promise<DailyCongressionalRecordListResponse> {
    const path = volumeNumber
      ? `/daily-congressional-record/${volumeNumber}`
      : "/daily-congressional-record";
    return this.makeRequest(path);
  }

  /**
   * Get detailed information about a specific daily Congressional Record issue
   * @param volumeNumber - The volume number
   * @param issueNumber - The issue number
   * @returns DailyCongressionalRecordIssueResponse
   */
  async getDailyCongressionalRecordIssue({
    volumeNumber,
    issueNumber,
  }: {
    volumeNumber: string;
    issueNumber: string;
  }): Promise<DailyCongressionalRecordIssueResponse> {
    return this.makeRequest(`/daily-congressional-record/${volumeNumber}/${issueNumber}`);
  }

  /**
   * Get articles from a specific daily Congressional Record issue
   * @param volumeNumber - The volume number
   * @param issueNumber - The issue number
   * @returns DailyCongressionalRecordArticlesResponse
   */
  async getDailyCongressionalRecordArticles({
    volumeNumber,
    issueNumber,
  }: {
    volumeNumber: string;
    issueNumber: string;
  }): Promise<DailyCongressionalRecordArticlesResponse> {
    return this.makeRequest(`/daily-congressional-record/${volumeNumber}/${issueNumber}/articles`);
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
    const path = congress ? `/hearing/${congress}${chamber ? `/${chamber}` : ""}` : "/hearing";

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
    return this.makeRequest(`/hearing/${congress}/${chamber}/${jacketNumber}`);
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
      ? `/house-communication/${congress}${type ? `/${type}` : ""}`
      : "/house-communication";

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
    return this.makeRequest(`/house-communication/${congress}/${type}/${number}`);
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
      ? `/senate-communication/${congress}${type ? `/${type}` : ""}`
      : "/senate-communication";

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
    return this.makeRequest(`/senate-communication/${congress}/${type}/${number}`);
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
      ? `/summaries/${congress}${billType ? `/${billType}` : ""}`
      : "/summaries";

    return this.makeRequest(path, {
      limit,
      offset,
      ...(fromDateTime ? { fromDateTime: fromDateTime.toISOString() } : {}),
      ...(toDateTime ? { toDateTime: toDateTime.toISOString() } : {}),
    });
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
    const path = congress ? `/treaty/${congress}` : "/treaty";
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
      ? `/treaty/${congress}/${treatyNumber}/${treatySuffix}`
      : `/treaty/${congress}/${treatyNumber}`;
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
      ? `/treaty/${congress}/${treatyNumber}/${treatySuffix}/actions`
      : `/treaty/${congress}/${treatyNumber}/actions`;
    return this.makeRequest(path);
  }

  /**
   * Get text versions of a treaty
   * @param options - Query options
   * @param options.congress - The congress number (e.g. 117)
   * @param options.treatyNumber - The treaty number
   * @param options.treatySuffix - Optional suffix identifier for partitioned treaties (e.g. "A", "B", "C")
   * @returns TreatyTextResponse containing text versions in different formats (PDF, HTML)
   */
  async getTreatyText({
    congress,
    treatyNumber,
    treatySuffix,
  }: {
    congress: number;
    treatyNumber: string;
    treatySuffix?: string;
  }): Promise<TreatyTextResponse> {
    const path = treatySuffix
      ? `/treaty/${congress}/${treatyNumber}/${treatySuffix}/text`
      : `/treaty/${congress}/${treatyNumber}/text`;
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
      ? `/treaty/${congress}/${treatyNumber}/${treatySuffix}/committees`
      : `/treaty/${congress}/${treatyNumber}/committees`;
    return this.makeRequest(path);
  }
}

export default CongressService;
