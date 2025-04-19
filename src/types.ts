// Congress.gov API types

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginationInfo {
  count: number;
  next: string; // URL to next page
}

// Congress List Level Response
export interface CongressSession {
  chamber: "House of Representatives" | "Senate";
  type: "R" | "S"; // R = Regular, S = Special
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  number?: string; // Not present for special sessions
}

export interface CongressListItem {
  name: string; // e.g. "116th Congress"
  startYear: string;
  endYear: string;
  sessions: CongressSession[];
  url: string;
}

export interface CongressesResponse {
  congresses: CongressListItem[];
}

// Congress Item Level Response
export interface CongressDetails {
  sessions: CongressSession[];
  name: string;
  startYear: string;
  endYear: string;
  updateDate: string; // ISO date string
  number: string;
  url: string;
}

export interface CongressResponse {
  congress: CongressDetails;
  pagination: PaginationInfo;
}

export interface BaseMember {
  bioguideId: string;
  depiction: {
    attribution: string;
    imageUrl: string;
  };
  district?: number;
  name: string;
  partyName: string;
  state: string;
  terms: {
    chamber: string;
    startYear: number;
    endYear?: number;
  }[];
  updateDate: string;
  url: string;
}

export interface MembersResponse {
  members: BaseMember[];
  pagination: PaginationInfo;
}

export interface MemberDetails extends BaseMember {
  addressInformation: {
    city: string;
    district: string;
    officeAddress: string;
    phoneNumber: string;
    zipCode: number;
  };
  birthYear?: string;
  deathYear?: string;
  sponsoredLegislation: {
    count: number;
    url: string;
  };
  cosponsoredLegislation: {
    count: number;
    url: string;
  };
  currentMember: boolean;
  directOrderName: string;
  firstName: string;
  honorificName?: string;
  invertedOrderName: string;
  lastName: string;
  middleName?: string;
  officialWebsiteUrl?: string;
  terms: {
    chamber: string;
    congress: number;
    district?: number;
    endYear?: number;
    memberType: string;
    startYear: number;
    stateCode: string;
    stateName: string;
  }[];
  partyHistory?: {
    partyAbbreviation: string;
    partyName: string;
    startYear: number;
  }[];
  leadership?: {
    type: string;
    congress: number;
    current: boolean;
  }[];
}

export interface MemberResponse {
  member: MemberDetails;
}

// List Level Bill Response
export interface BaseBill {
  congress: number;
  type: string; // "HR", "S", "HJRES", "SJRES", "HCONRES", "SCONRES", "HRES", "SRES"
  originChamber: string; // "House" or "Senate"
  originChamberCode: string; // "H" or "S"
  number: string;
  url: string;
  title: string;
  updateDateIncludingText: string;
  latestAction: {
    actionDate: string;
    text: string;
    actionTime?: string; // Only for certain House actions
  };
  updateDate: string;
}

export interface BillsResponse {
  bills: BaseBill[];
  pagination: PaginationInfo;
}

// Item Level Bill Response
export interface BillDetails {
  number: string;
  updateDate: string;
  updateDateIncludingText: string;
  originChamber: string;
  type: string;
  introducedDate: string;
  congress: number;
  constitutionalAuthorityStatementText?: string; // Only for House Bills and Joint Resolutions
  committees: {
    count: number;
    url: string;
  };
  committeeReports?: {
    citation: string;
    url: string;
  }[];
  relatedBills: {
    count: number;
    url: string;
  };
  actions: {
    count: number;
    url: string;
  };
  sponsors: {
    bioguideId: string;
    fullName: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    party: string;
    state: string;
    url: string;
    district: number;
    isByRequest: string; // "Y" or "N"
  }[];
  cosponsors: {
    countIncludingWithdrawnCosponsors: number;
    count: number;
    url: string;
  };
  cboCostEstimates?: {
    pubDate: string;
    title: string;
    url: string;
    description: string;
  }[];
  laws?: {
    type: string; // "Public Law" or "Private Law"
    number: string;
  }[];
  notes?: {
    text: string; // CDATA wrapped
  }[];
  policyArea: {
    name: string;
  };
  subjects: {
    count: number;
    url: string;
  };
  summaries: {
    count: number;
    url: string;
  };
  title: string;
  titles: {
    count: number;
    url: string;
  };
  amendments: {
    count: number;
    url: string;
  };
  textVersions: {
    count: number;
    url: string;
  };
  latestAction: {
    actionDate: string;
    text: string;
    actionTime?: string; // Only for certain House actions
  };
}

export interface BillResponse {
  bill: BillDetails;
}

// Committees Level Response
export interface BillCommitteesResponse {
  committees: {
    url: string;
    systemCode: string;
    name: string;
    chamber: string; // "House", "Senate", or "Joint"
    type: string; // "Standing", "Select", "Special", "Joint", "Task Force", "Other", "Subcommittee", or "Commission or Caucus"
    subcommittees?: {
      name: string;
      systemCode: string;
      url: string;
      activities: {
        name: string;
        date: string;
      }[];
    }[];
    activities: {
      name: string; // "Referred to", "Re-Referred to", "Hearings by", "Markup by", "Reported by", "Reported original measure", "Committed to", "Re-Committed to", "Legislative Interest"
      date: string;
    }[];
  }[];
}

// Related Bills Level Response
export interface RelatedBillsResponse {
  relatedBills: {
    url: string;
    title: string;
    congress: number;
    number: string;
    type: string;
    latestAction: {
      actionDate: string;
      text: string;
      actionTime?: string;
    };
    relationshipDetails: {
      type: string;
      identifiedBy: string; // "House", "Senate", or "CRS"
    }[];
  }[];
}

// Actions Level Response
export interface BillAction {
  actionDate: string;
  actionTime?: string;
  text: string;
  type: string; // "Committee", "Calendars", "Floor", "BecameLaw", "IntroReferral", "President", "ResolvingDifferences", "Discharge", "NotUsed", "Veto"
  actionCode?: string; // Only present for House or Library of Congress actions
  sourceSystem: {
    code: number; // 0 = Senate, 1/2 = House, 9 = Library of Congress
    name: string; // "Senate", "House committee actions", "House floor actions", "Library of Congress"
  };
  committees?: {
    url: string;
    systemCode: string;
    name: string;
  }[];
  recordedVotes?: {
    rollNumber: string;
    url: string;
    chamber: string; // "House" or "Senate"
    congress: number;
    date: string;
    sessionNumber: number;
  }[];
  calendarNumber?: {
    calendar: string;
    number?: string; // Only for Senate calendar numbers
  };
}

export interface ActionsResponse {
  actions: BillAction[];
}

// Cosponsors Level Response
export interface CosponsorsResponse {
  cosponsors: {
    bioguideId: string;
    fullName: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    party: string; // "D", "R", "I", "ID", "L"
    state: string;
    url: string;
    district: number;
    sponsorshipDate: string;
    isOriginalCosponsor: boolean;
    sponsorshipWithdrawnDate?: string;
  }[];
  pagination: {
    count: number;
    countIncludingWithdrawnCosponsors: number;
  };
}

// Subjects Level Response
export interface SubjectsResponse {
  legislativeSubjects: {
    name: string;
  }[];
  policyArea: {
    name: string;
    updateDate: string;
  };
}

// Summaries Level Response
export interface BillSummaryResponse {
  versionCode: string;
  actionDate: string;
  actionDesc: string;
  updateDate: string;
  text: string; // CDATA wrapped with HTML
}

export interface SummariesResponse {
  summaries: BillSummaryResponse[];
}

// Titles Level Response
export interface TitlesResponse {
  titles: {
    titleType: string;
    title: string;
    chamberCode?: string; // "H" or "S"
    chamberName?: string; // "House" or "Senate"
    billTextVersionName?: string;
    billTextVersionCode?: string;
    titleTypeCode: string;
    updateDate: string;
  }[];
}

// Text Level Response
export interface BillTextVersion {
  type: string;
  date: string;
  formats: {
    url: string;
    type: string; // "Formatted Text", "PDF", "Formatted XML"
  }[];
}

export interface BillTextResponse {
  textVersions: BillTextVersion[];
}

// Amendments Level Response
export interface AmendmentsResponse {
  amendments: {
    number: string;
    description?: string; // Only for House amendments
    purpose?: string; // Only for House and proposed Senate amendments
    congress: number;
    type: string; // "HAMDT", "SAMDT", "SUAMDT"
    latestAction: {
      actionDate: string;
      text: string;
      actionTime?: string;
    };
    url: string;
  }[];
}

// Laws Response
export interface LawsResponse {
  bills: BaseBill[];
}

// House Floor Schedule Response (from docs.house.gov)
export interface HouseFloorScheduleResponse {
  floorschedule: {
    category: {
      "floor-items": {
        "floor-item": FloorItem[];
      };
    }[];
  };
}

export interface FloorItem {
  "legis-num": string;
  "floor-text": string;
  updates: {
    "update-date": {
      "explanatory-notes": {
        "@_doc-modified": string;
      };
      "@_date": string;
      "@_publish-date": string;
    };
  };
  files: {
    file: {
      "@_doc-url": string;
      "@_doc-type": string;
      "@_add-date": string;
      "@_sort-order": string;
      "@_publish-date": string;
    };
  };
  "@_id": string;
  "@_add-date": string;
  "@_remove-date": string;
  "@_sort-order": string;
  "@_publish-date": string;
}

enum HouseEnum {
  House,
  Senate,
  Joint,
  Unknown,
}

// Bound Congressional Record Types
export interface BoundCongressionalRecordItem {
  date: string;
  volumeNumber: string;
  congress: string;
  sessionNumber: string; // "1" or "2"
  updateDate: string;
  url: string;
  dailyDigest?: {
    startPage: string;
    endPage: string;
    text: {
      type: string; // e.g. "PDF"
      url: string;
    }[];
  };
  sections: {
    name: string; // e.g. "Senate"
    startPage: string;
    endPage: string;
  }[];
}

export interface BoundCongressionalRecordResponse {
  boundCongressionalRecord: BoundCongressionalRecordItem[];
}

// CRS Report Types
export interface CRSReportBase {
  status: string; // e.g. "active" or "archived"
  id: string; // e.g. "R40097"
  publishDate: string; // Format: YYYY-MM-DDT00:00:00Z
  version: string;
  contentType: string; // "reports" | "posts" | "resources" | "infographics" | "testimony"
  updateDate: string; // Format: YYYY-MM-DDT00:00:00Z
  title: string;
  url: string;
}

export interface CRSReportDetails extends CRSReportBase {
  authors: string[];
  formats: {
    type: string;
    url: string;
  }[];
  relatedMaterials?: {
    title: string;
    congress?: string;
    number?: string;
    type?: string; // "HR" | "S" | "HJRES" | "SJRES" | "HCONRES" | "SCONRES" | "HRES" | "SRES" | "PUB" | "PRIV"
    url?: string;
  }[];
  topics: {
    topic: string;
  }[];
  summary: string;
}

export interface CRSReportsResponse {
  CRSreports: CRSReportBase[];
}

export interface CRSReportResponse {
  CRSreport: CRSReportDetails;
}

// Committee List Level Response
export interface CommitteeListItem {
  url: string;
  systemCode: string;
  name: string;
  parent?: {
    url: string;
    systemCode: string;
    name: string;
  };
  subcommittees?: {
    url: string;
    systemCode: string;
    name: string;
  }[];
  chamber: "House" | "Senate" | "Joint";
  committeeTypeCode:
    | "Commission or Caucus"
    | "Joint"
    | "Other"
    | "Select"
    | "Special"
    | "Standing"
    | "Subcommittee"
    | "Task Force";
}

export interface CommitteesResponse {
  committees: CommitteeListItem[];
}

// Committee Item Level Response
export interface CommitteeDetails {
  systemCode: string;
  parent?: {
    url: string;
    systemCode: string;
    name: string;
  };
  updateDate: string;
  isCurrent: boolean;
  subcommittees?: {
    url: string;
    systemCode: string;
    name: string;
  }[];
  name: string;
  chamber: "House" | "Senate" | "Joint";
  committeeTypeCode:
    | "Commission or Caucus"
    | "Joint"
    | "Other"
    | "Select"
    | "Special"
    | "Standing"
    | "Subcommittee"
    | "Task Force";
  url: string;
  bills?: {
    url: string;
    count: number;
    bills: {
      congress: number;
      billType: "HR" | "S" | "HJRES" | "SJRES" | "HCONRES" | "SCONRES" | "HRES" | "SRES";
      billNumber: string;
      relationshipType: string;
      actionDate: string;
      updateDate: string;
    }[];
  };
}

export interface CommitteeResponse {
  committee: CommitteeDetails;
}

// Committee Nominations Level Response
export interface CommitteeNominationItem {
  congress: number;
  number: string;
  partNumber?: string;
  citation: string;
  description: string;
  receivedDate: string;
  nominationType: {
    isCivilian: boolean;
    inMilitary: boolean;
  };
  updateDate: string;
  latestAction: {
    actionDate: string;
    text: string;
    url: string;
  };
}

export interface CommitteeNominationsResponse {
  nominations: CommitteeNominationItem[];
}

// House Communications Level Response
export interface HouseCommunicationItem {
  chamber: "House";
  number: string;
  communicationType: {
    code: "EC" | "PM" | "PT" | "ML";
    name: "Executive Communication" | "Presidential Message" | "Petition" | "Memorial";
  };
  congress: number;
  referralDate: string;
  updateDate: string;
  url: string;
}

export interface HouseCommunicationsResponse {
  houseCommunications: HouseCommunicationItem[];
  pagination: PaginationInfo;
}

// House Communication Item Level Response
export interface HouseCommunicationDetails extends HouseCommunicationItem {
  abstract: string;
  congressionalRecordDate: string;
  sessionNumber: string;
  isRulemaking: "Y" | "N";
  committees?: {
    item: {
      name: string;
      referralDate: string;
      systemCode: string;
    }[];
  };
  matchingRequirements?: {
    item: {
      number: string;
      URL: string;
    }[];
  };
  reportNature?: string;
  submittingAgency?: string;
  submittingOfficial?: string;
  legalAuthority?: string;
  houseDocument?: {
    item: {
      citation: string;
      title: string;
    }[];
  };
}

export interface HouseCommunicationResponse {
  houseCommunication: HouseCommunicationDetails;
  request: {
    contentType: string;
    format: string;
  };
}

// Senate Communications Level Response
export interface SenateCommunicationListItem {
  chamber: "Senate";
  number: string;
  communicationType: {
    code: "EC" | "POM" | "PM";
    name: "Executive Communication" | "Petition or Memorial" | "Presidential Message";
  };
  congress: number;
  url: string;
  updateDate: string;
}

export interface SenateCommunicationsResponse {
  senateCommunications: {
    item: SenateCommunicationListItem[];
  };
}

// Senate Communication Item Level Response
export interface SenateCommunicationDetails extends SenateCommunicationListItem {
  abstract: string;
  congressionalRecordDate: string;
  committees?: {
    item: {
      name: string;
      referralDate: string;
      url: string;
    }[];
  };
}

export interface SenateCommunicationResponse {
  senateCommunication: SenateCommunicationDetails;
}

// Committee Meeting List Level Response
export interface CommitteeMeetingListItem {
  eventId: string;
  url: string;
  updateDate: string;
  congress: number;
  chamber: "House" | "Senate" | "NoChamber";
}

export interface CommitteeMeetingsResponse {
  committeeMeetings: {
    item: CommitteeMeetingListItem[];
  };
}

// Committee Meeting Item Level Response
export interface CommitteeMeetingDetails {
  eventId: string;
  updateDate: string;
  congress: number;
  type: "Meeting" | "Hearing" | "Markup"; // Note: Senate meetings are all tagged as "Meeting"
  title: string;
  meetingStatus: "Scheduled" | "Canceled" | "Postponed" | "Rescheduled";
  date: string;
  chamber: "House" | "Senate" | "NoChamber";
  committees: {
    item: {
      systemCode: string;
      url: string;
      name: string;
    }[];
  };
  location?: {
    room?: string; // If virtual meeting via Webex, value will be 'WEBEX'
    building?: string; // If virtual meeting via Webex, value may be '----------'
    address?: {
      // Only present for field meetings
      buildingName: string;
      postalCode: string;
      state: string;
      streetAddress: string;
      city: string;
    };
  };
  videos?: {
    item: {
      name: string;
      url: string;
    }[];
  };
  witnesses?: {
    item: {
      name: string;
      position: string;
      organization: string;
    }[];
  };
  witnessDocuments?: {
    item: {
      documentType:
        | "Witness Biography"
        | "Witness Supporting Document"
        | "Witness Statement"
        | "Witness Truth in Testimony";
      format: string;
      url: string;
    }[];
  };
  meetingDocuments?: {
    item: {
      name: string;
      description?: string;
      documentType:
        | "Activity Report"
        | "Bills and Resolutions"
        | "Committee Amendment"
        | "Committee Recorded Vote"
        | "Committee Report"
        | "Committee Rules"
        | "Conference Report"
        | "Floor Amendment"
        | "Generic Document"
        | "Hearing: Cover Page"
        | "Hearing: Member Roster"
        | "Hearing: Questions for the Record"
        | "Hearing: Table of Contents"
        | "Hearing: Transcript"
        | "Hearing: Witness List"
        | "House or Senate Amendment"
        | "Member Statements"
        | "Support Document";
      url: string;
      format: string;
    }[];
  };
  hearingTranscript?: {
    jacketNumber: string;
    url: string;
  };
  relatedItems?: {
    bills?: {
      bill: {
        type: "HR" | "S" | "HJRES" | "SJRES" | "HCONRES" | "SCONRES" | "HRES" | "SRES";
        number: string;
        congress: number;
        url: string;
      }[];
    };
    treaties?: {
      item: {
        part?: string;
        number: string;
        congress: number;
        url: string;
      }[];
    };
    nominations?: {
      item: {
        part: string; // "00" if not partitioned
        number: string;
        congress: number;
        url: string;
      }[];
    };
  };
}

export interface CommitteeMeetingResponse {
  committeeMeeting: CommitteeMeetingDetails;
}

// Committee Print List Level Response
export interface CommitteePrintListItem {
  jacketNumber: string;
  url: string;
  updateDate: string;
  congress: number;
  chamber: "House" | "Senate" | "NoChamber";
}

export interface CommitteePrintsResponse {
  committeePrints: {
    item: CommitteePrintListItem[];
  };
}

// Committee Print Item Level Response
export interface CommitteePrintDetails {
  jacketNumber: string;
  citation?: string; // May not be numbered by committee
  congress: number;
  number?: string;
  title: string;
  chamber: "House" | "Senate" | "NoChamber";
  committees: {
    item: {
      url: string;
      systemCode: string;
      name: string;
    }[];
  };
  associatedBills?: {
    item: {
      congress: number;
      type: "HR" | "S" | "HJRES" | "SJRES" | "HCONRES" | "SCONRES" | "HRES" | "SRES";
      number: string;
      url: string;
    }[];
  };
  text: {
    count: number;
    url: string;
  };
}

export interface CommitteePrintResponse {
  committeePrint: {
    item: CommitteePrintDetails;
  };
}

// Committee Print Text Level Response
export interface CommitteePrintTextItem {
  url: string;
  type: "PDF" | "Formatted Text" | "Formatted XML" | "Generated HTML";
}

export interface CommitteePrintTextResponse {
  text: {
    item: CommitteePrintTextItem[];
  };
}

// Committee Report List Level Response
export interface CommitteeReportListItem {
  citation: string; // e.g., "H. Rept. 117-351"
  url: string;
  updateDate: string;
  congress: number;
  chamber: "House" | "Senate";
  type: "HRPT" | "SRPT" | "ERPT";
  number: string;
  part: number; // Reports without parts will have value of 1
}

export interface CommitteeReportsResponse {
  reports: {
    item: CommitteeReportListItem[];
  };
}

// Committee Report Item Level Response
export interface CommitteeReportDetails {
  committees: {
    item: {
      url: string;
      systemCode: string;
      name: string;
    }[];
  };
  congress: number;
  chamber: "House" | "Senate";
  sessionNumber: "1" | "2";
  citation: string;
  number: string;
  part: number;
  type: "HRPT" | "SRPT" | "ERPT";
  updateDate: string;
  isConferenceReport: boolean;
  title: string;
  issueDate: string;
  reportType: "H.Rept" | "S.Rept" | "Ex.Rept";
  text: {
    count: number;
    url: string;
  };
  associatedTreaties?: {
    item: {
      congress: number;
      number: string;
      part?: string;
      url: string;
    }[];
  };
  associatedBills?: {
    item: {
      congress: number;
      type: "HR" | "S" | "HJRES" | "SJRES" | "HCONRES" | "SCONRES" | "HRES" | "SRES";
      number: string;
      url: string;
    }[];
  };
}

export interface CommitteeReportResponse {
  committeeReport: CommitteeReportDetails;
}

// Committee Report Text Level Response
export interface CommitteeReportTextItem {
  formats: {
    item: {
      url: string;
      type: "Formatted Text" | "PDF";
      isErrata: "Y" | "N";
    }[];
  };
}

export interface CommitteeReportTextResponse {
  textVersions: {
    item: CommitteeReportTextItem[];
  };
}

// Daily Congressional Record Types
export interface DailyCongressionalRecordArticle {
  title: string;
  startPage: string;
  endPage: string;
  text: {
    type: string; // e.g. "PDF", "Formatted Text"
    url: string;
  }[];
}

export interface DailyCongressionalRecordSection {
  name: string; // e.g. "Senate"
  startPage: string;
  endPage: string;
  text: {
    item: {
      part: string;
      type: string;
      url: string;
    }[];
  };
  articles?: {
    count: number;
    url: string;
  };
}

export interface DailyCongressionalRecordIssue {
  issueNumber: string;
  volumeNumber: string;
  issueDate: string;
  congress: string;
  sessionNumber: string; // "1" or "2"
  url: string;
  updateDate: string;
  fullIssue: {
    entireIssue: {
      item: {
        part: string;
        type: string; // e.g. "PDF", "Formatted Text"
        url: string;
      }[];
    };
    sections: {
      item: DailyCongressionalRecordSection[];
    };
  };
}

export interface DailyCongressionalRecordListResponse {
  dailyCongressionalRecord: {
    issue: {
      issueNumber: string;
      volumeNumber: string;
      issueDate: string;
      congress: string;
      sessionNumber: string;
      url: string;
      updateDate: string;
    }[];
  };
  request: {
    contentType: string;
    format: string;
  };
}

export interface DailyCongressionalRecordIssueResponse {
  issue: DailyCongressionalRecordIssue;
  request: {
    contentType: string;
    format: string;
  };
}

export interface DailyCongressionalRecordArticlesResponse {
  articles: {
    section: {
      name: string;
      sectionArticles: {
        item: DailyCongressionalRecordArticle[];
      };
    }[];
  };
  request: {
    contentType: string;
    format: string;
  };
}

// Hearing List Level Response
export interface HearingListItem {
  jacketNumber: string;
  updateDate: string;
  chamber: "House" | "Senate" | "NoChamber";
  congress: number;
  number?: string; // Hearings may or may not be numbered by committee
  part?: string; // If printed in parts
  url: string;
}

export interface HearingsResponse {
  hearings: {
    item: HearingListItem[];
  };
  request: {
    contentType: string;
    format: string;
  };
}

// Hearing Item Level Response
export interface HearingDetails {
  jacketNumber: string;
  libraryOfCongressIdentifier: string;
  number?: string;
  part?: string;
  updateDate: string;
  congress: number;
  title: string;
  citation?: string;
  chamber: "House" | "Senate" | "NoChamber";
  committees: {
    item: {
      name: string;
      systemCode: string;
      url: string;
    }[];
  };
  dates: {
    item: {
      date: string;
    }[];
  };
  formats: {
    item: {
      type: "PDF" | "Formatted Text";
      url: string;
    }[];
  };
  associatedMeeting?: {
    eventID: string;
    URL: string;
  };
}

export interface HearingResponse {
  hearing: HearingDetails;
  request: {
    contentType: string;
    format: string;
  };
}

export interface PaginationInfo {
  count: number;
  total: number;
  offset: number;
}

// House Requirements List Level Response
export interface HouseRequirementListItem {
  number: string;
  updateDate: string;
  url: string;
}

export interface HouseRequirementsResponse {
  houseRequirements: {
    item: HouseRequirementListItem[];
  };
  pagination: PaginationInfo;
}

// House Requirement Item Level Response
export interface HouseRequirementDetails {
  number: string;
  updateDate: string;
  parentAgency: string;
  frequency: string;
  nature: string;
  legalAuthority: string;
  activeRecord: "True" | "False";
  submittingAgency?: string;
  submittingOfficial?: string;
  matchingCommunications: {
    count: number;
    url: string;
  };
}

export interface HouseRequirementResponse {
  houseRequirement: HouseRequirementDetails;
  request: {
    contentType: string;
    format: string;
  };
}

// House Requirement Matching Communications Level Response
export interface HouseRequirementMatchingCommunicationsResponse {
  matchingCommunications: {
    item: {
      chamber: "House";
      number: string;
      communicationType: {
        code: "EC" | "PM" | "PT" | "ML";
        name: "Executive Communication" | "Presidential Message" | "Petition" | "Memorial";
      };
      congress: number;
      url: string;
    }[];
  };
  pagination: PaginationInfo;
}

// Nomination List Level Response
export interface NominationListItem {
  congress: number;
  number: string;
  partNumber?: string;
  citation: string;
  description: string;
  receivedDate: string;
  nominationType: {
    isCivilian: boolean;
    isMilitary: boolean;
  };
  latestAction: {
    actionDate: string;
    text: string;
  };
  updateDate: string;
  url: string;
  organization?: string;
}

export interface NominationsResponse {
  nominations: {
    item: NominationListItem[];
  };
}

// Nomination Item Level Response
export interface NominationDetails {
  congress: number;
  number: string;
  partNumber?: string;
  citation: string;
  isPrivileged: boolean;
  isList: boolean;
  description: string;
  receivedDate: string;
  nominationType: {
    isCivilian: boolean;
    isMilitary: boolean;
  };
  organization?: string;
  nominees: {
    count: number;
    url: string;
  };
  committees: {
    count: number;
    url: string;
  };
  actions: {
    count: number;
    url: string;
  };
  hearings?: {
    count: number;
    url: string;
  };
  updateDate: string;
}

export interface NominationResponse {
  nomination: NominationDetails;
}

// Nominees Level Response
export interface NomineeItem {
  ordinal: number;
  lastName: string;
  firstName?: string;
  middleName?: string;
  prefix?: string;
  suffix?: string;
  state?: string;
  effectiveDate?: string;
  predecessorName?: string;
  corpsCode?: string;
}

export interface NomineesResponse {
  nominees: {
    item: NomineeItem[];
  };
}

// Committees Level Response
export interface NominationCommitteeActivity {
  name: string;
  date: string;
}

export interface NominationCommitteeItem {
  url: string;
  systemCode: string;
  name: string;
  chamber: "Senate";
  type: "Standing" | "Select" | "Other";
  subcommittees?: {
    name: string;
    systemCode: string;
    url: string;
    activities: NominationCommitteeActivity[];
  }[];
  activities: NominationCommitteeActivity[];
}

export interface NominationCommitteesResponse {
  committees: {
    item: NominationCommitteeItem[];
  };
}

// Actions Level Response
export interface NominationAction {
  actionDate: string;
  text: string;
  type: "IntroReferral" | "Committee" | "Calendars" | "Floor";
  actionCode?: string;
  committees?: {
    url: string;
    systemCode: string;
    name: string;
  }[];
}

export interface NominationActionsResponse {
  actions: {
    item: NominationAction[];
  };
}

// Hearings Level Response
export interface NominationHearingItem {
  chamber: "Senate";
  number?: string;
  partNumber?: string;
  citation?: string;
  jacketNumber: string;
  errataNumber?: string;
  date: string;
}

export interface NominationHearingsResponse {
  hearings: {
    item: NominationHearingItem[];
  };
}

// Summaries List Level Response
export interface SummaryBill {
  congress: number;
  type: "HR" | "S" | "HJRES" | "SJRES" | "HCONRES" | "SCONRES" | "HRES" | "SRES";
  originChamber: "House" | "Senate";
  originChamberCode: "H" | "S";
  number: string;
  url: string;
  title: string;
  updateDateIncludingText: string;
}

export interface SummaryListItem {
  bill: SummaryBill;
  text: string; // CDATA wrapped with HTML
  actionDate: string;
  updateDate: string;
  currentChamber: "House" | "Senate";
  currentChamberCode: "H" | "S";
  actionDesc: string;
  versionCode: string; // See version codes table in docs
  lastSummaryUpdateDate: string;
}

export interface SummariesListResponse {
  summaries: {
    summary: SummaryListItem[];
  };
}

// Treaty List Level Response
export interface TreatyListItem {
  congressReceived: number;
  congressConsidered?: number;
  number: string;
  suffix?: string; // Part identifier if treaty was partitioned (e.g. "A", "B", "C")
  transmittedDate: string;
  resolutionText?: string; // CDATA wrapped with HTML
  topic: string;
  updateDate: string;
  parts?: {
    count: number;
    urls: {
      item: string[]; // URLs to treaty part items
    };
  };
  titles: {
    title: string;
    titleType: string;
  }[];
  actions: {
    count: number;
    url: string;
  };
}

export interface TreatiesResponse {
  treaties: {
    item: TreatyListItem[];
  };
}

// Treaty Item Level Response
export interface TreatyDetails extends TreatyListItem {
  text: {
    count: number;
    url: string;
  };
  committees: {
    count: number;
    url: string;
  };
}

export interface TreatyResponse {
  treaty: TreatyDetails;
}

// Treaty Actions Level Response
export interface TreatyAction {
  type: "IntroReferral" | "Committee" | "Calendars" | "Floor";
  actionDate: string;
  text: string;
  actionCode?: string;
  committees?: {
    url: string;
    systemCode: string;
    name: string;
  }[];
}

export interface TreatyActionsResponse {
  actions: {
    item: TreatyAction[];
  };
}

// Treaty Text Level Response
export interface TreatyTextVersion {
  date: string;
  formats: {
    url: string;
    type: "PDF" | "HTML";
  }[];
}

export interface TreatyTextResponse {
  textVersions: {
    item: TreatyTextVersion[];
  };
}

// Treaty Committees Level Response
export interface TreatyCommitteeActivity {
  name: string;
  date: string;
}

export interface TreatyCommitteeItem {
  url: string;
  systemCode: string;
  name: string;
  chamber: "Senate";
  type: "Standing" | "Select" | "Other";
  subcommittees?: {
    name: string;
    systemCode: string;
    url: string;
    activities: TreatyCommitteeActivity[];
  }[];
  activities: TreatyCommitteeActivity[];
}

export interface TreatyCommitteesResponse {
  committees: {
    item: TreatyCommitteeItem[];
  };
}
