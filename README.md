# @breakdown_us/congress

[![npm](https://img.shields.io/npm/v/@breakdown_us/congress)](https://www.npmjs.com/package/@breakdown_us/congress)

A TypeScript client for the [congress.gov API](https://api.congress.gov/) that provides strongly typed access to legislative information from the U.S. Congress. Made by the team at [Breakdown](https://breakdown.us/) Source for types can be found at [LibraryOfCongress/api.congress.gov](https://github.com/LibraryOfCongress/api.congress.gov)

## Installation

```bash
npm install @breakdown_us/congress
```

```bash
yarn add @breakdown_us/congress
```

```bash
pnpm add @breakdown_us/congress
```

## Usage

First, you'll need to obtain an API key from [congress.gov](https://api.congress.gov/sign-up/).

```typescript
import CongressService from "@breakdown_us/congress";

// Initialize with your API key
const congressService = new CongressService("your-api-key-here");

// Or use the CONGRESS_GOV_API_KEY environment variable
const congressService = new CongressService();

// Example: Get information about the current Congress
const currentCongress = await congressService.getCurrentCongress();
console.log(currentCongress.congress);

// Example: Fetch recent bills
const recentBills = await congressService.getBills({ limit: 10 });
```

## Features

- Complete TypeScript coverage of the congress.gov API v3 endpoints
- Strongly typed request parameters and response objects
- Clean, async/await API
- Support for pagination across all list endpoints
- Environment variable support for API key (`CONGRESS_GOV_API_KEY`)

## API Documentation

The package provides access to the following categories of data:

### Congress Information

```typescript
// Get a list of all congresses
const congresses = await congressService.getCongresses();

// Get details about a specific congress
const congress = await congressService.getCongress(119);

// Get the current congress
const currentCongress = await congressService.getCurrentCongress();
```

### Bills and Legislation

```typescript
// Get a list of bills
const bills = await congressService.getBills({ limit: 10 });

// Get bills from a specific congress
const bills119 = await congressService.getBills({ congress: 119 });

// Get bills updated after a specific date
const recentBills = await congressService.getBills({
  updatedAfter: new Date("2024-01-01"),
  sort: "updateDate+desc",
});

// Get a specific bill
const bill = await congressService.getBillDetails({
  congress: 119,
  billType: "hr",
  billNumber: 1,
});

// Get bills that became law
const laws = await congressService.getLaws({ congress: 119 });

// Get subjects for a bill
const subjects = await congressService.getSubjectsForBill({
  congress: 119,
  billType: "hr",
  billNumber: 1,
});

// Get summaries for a bill
const summaries = await congressService.getSummariesForBill({
  congress: 119,
  billType: "hr",
  billNumber: 1,
});

// Get text versions for a bill
const texts = await congressService.getTextsForBill({
  congress: 119,
  billType: "hr",
  billNumber: 1,
});

// Get titles for a bill
const titles = await congressService.getTitlesForBill({
  congress: 119,
  billType: "hr",
  billNumber: 1,
});

// Get cosponsors for a bill
const cosponsors = await congressService.getCosponsorsForBill({
  congress: 119,
  billType: "hr",
  billNumber: 1,
});

// Get actions for a bill
const actions = await congressService.getActionsForBill({
  congress: 119,
  billType: "hr",
  billNumber: 1,
});

// Get related bills
const relatedBills = await congressService.getRelatedBills({
  congress: 119,
  billType: "hr",
  billNumber: 1,
});

// Get committees for a bill
const committees = await congressService.getCommitteesForBill({
  congress: 119,
  billType: "hr",
  billNumber: 1,
});

// Get amendments for a bill
const amendments = await congressService.getAmendmentsForBill({
  congress: 119,
  billType: "hr",
  billNumber: 1,
});
```

### Bill Summaries

```typescript
// Get all summaries (across all bills)
const summaries = await congressService.getSummaries({ limit: 20 });

// Get summaries for a specific congress
const summaries119 = await congressService.getSummaries({ congress: 119 });

// Get summaries for a specific bill type
const hrSummaries = await congressService.getSummaries({
  congress: 119,
  billType: "hr",
});
```

### Amendments

```typescript
// Get a list of amendments
const amendments = await congressService.getAmendments({ limit: 10 });

// Get amendments for a specific congress and type
const senateAmendments = await congressService.getAmendments({
  congress: 119,
  type: "SAMDT",
});

// Get a specific amendment
const amendment = await congressService.getAmendmentDetails({
  congress: 119,
  amendmentType: "SAMDT",
  amendmentNumber: "1",
});

// Get amendments to an amendment (second-degree)
const secondDegree = await congressService.getAmendmentsToAmendment({
  congress: 119,
  amendmentType: "SAMDT",
  amendmentNumber: "1",
});

// Get cosponsors for an amendment
const cosponsors = await congressService.getCosponsorsForAmendment({
  congress: 119,
  amendmentType: "SAMDT",
  amendmentNumber: "1",
});

// Get text for an amendment
const text = await congressService.getTextForAmendment({
  congress: 119,
  amendmentType: "SAMDT",
  amendmentNumber: "1",
});

// Get actions for an amendment
const actions = await congressService.getActionsForAmendment({
  congress: 119,
  amendmentType: "SAMDT",
  amendmentNumber: "1",
});
```

### Members of Congress

```typescript
// Get a list of members
const members = await congressService.getMembers({ limit: 10 });

// Get members by congress
const members119 = await congressService.getMembersByCongress({ congress: 119 });

// Get a specific member by Bioguide ID
const member = await congressService.getMember({
  memberBioguideId: "S000033",
});

// Get members by state
const stateMembers = await congressService.getMembersByState({
  congress: 119,
  state: "CA",
});

// Get members by state and district
const districtMembers = await congressService.getMembersByStateAndDistrict({
  congress: 119,
  state: "CA",
  district: "12",
});

// Get sponsored legislation by a member
const sponsoredBills = await congressService.getMemberSponsoredLegislation({
  memberBioguideId: "S000033",
});

// Get cosponsored legislation by a member
const cosponsoredBills = await congressService.getMemberCosponsoredLegislation({
  memberBioguideId: "S000033",
});
```

### Committees

```typescript
// Get a list of committees
const committees = await congressService.getCommittees({ limit: 10 });

// Get committees by congress and chamber
const senateCommittees = await congressService.getCommittees({
  congress: 119,
  chamber: "senate",
});

// Get a specific committee
const committee = await congressService.getCommittee({
  chamber: "senate",
  systemCode: "ssju00",
});

// Get nominations for a Senate committee
const nominations = await congressService.getCommitteeNominations({
  systemCode: "ssju00",
});

// Get committee meetings
const meetings = await congressService.getCommitteeMeetings({
  congress: 119,
  chamber: "senate",
});

// Get a specific committee meeting
const meeting = await congressService.getCommitteeMeeting({
  congress: 119,
  chamber: "senate",
  eventId: "12345",
});
```

### Committee Prints

```typescript
// Get a list of committee prints
const prints = await congressService.getCommitteePrints({ limit: 10 });

// Get a specific committee print
const print = await congressService.getCommitteePrint({
  congress: 119,
  chamber: "senate",
  jacketNumber: "12345",
});

// Get text for a committee print
const printText = await congressService.getCommitteePrintText({
  congress: 119,
  chamber: "senate",
  jacketNumber: "12345",
});
```

### Committee Reports

```typescript
// Get a list of committee reports
const reports = await congressService.getCommitteeReports({ limit: 10 });

// Get reports by type
const houseReports = await congressService.getCommitteeReports({
  congress: 119,
  reportType: "hrpt",
});

// Get a specific committee report
const report = await congressService.getCommitteeReport({
  congress: 119,
  reportType: "hrpt",
  reportNumber: "1",
});

// Get text for a committee report
const reportText = await congressService.getCommitteeReportText({
  congress: 119,
  reportType: "hrpt",
  reportNumber: "1",
});
```

### Hearings

```typescript
// Get a list of hearings
const hearings = await congressService.getHearings({ limit: 10 });

// Get hearings by congress and chamber
const senateHearings = await congressService.getHearings({
  congress: 119,
  chamber: "senate",
});

// Get a specific hearing
const hearing = await congressService.getHearing({
  congress: 119,
  chamber: "senate",
  jacketNumber: "12345",
});
```

### Nominations

```typescript
// Get a list of nominations
const nominations = await congressService.getNominations({ limit: 10 });

// Get nominations for a specific congress
const nominations119 = await congressService.getNominations({ congress: 119 });

// Get a specific nomination
const nomination = await congressService.getNomination({
  congress: 119,
  nominationNumber: "2",
});

// Get nominees for a nomination
const nominees = await congressService.getNominees({
  congress: 119,
  nominationNumber: "2",
  ordinal: "1",
});

// Get committees for a nomination
const committees = await congressService.getNominationCommittees({
  congress: 119,
  nominationNumber: "2",
});

// Get actions for a nomination
const actions = await congressService.getNominationActions({
  congress: 119,
  nominationNumber: "2",
});

// Get hearings for a nomination
const hearings = await congressService.getNominationHearings({
  congress: 119,
  nominationNumber: "2",
});
```

### Treaties

```typescript
// Get a list of treaties
const treaties = await congressService.getTreaties({ limit: 10 });

// Get a specific treaty
const treaty = await congressService.getTreaty({
  congress: 119,
  treatyNumber: "1",
});

// Get actions for a treaty
const actions = await congressService.getTreatyActions({
  congress: 119,
  treatyNumber: "1",
});

// Get committees for a treaty
const committees = await congressService.getTreatyCommittees({
  congress: 119,
  treatyNumber: "1",
});
```

### Congressional Record

```typescript
// Get bound congressional record
const record = await congressService.getBoundCongressionalRecord({
  year: 2023,
  month: 1,
  day: 15,
});

// Get daily congressional record issues
const dailyIssues = await congressService.getDailyCongressionalRecords();

// Get daily issues by volume
const volumeIssues = await congressService.getDailyCongressionalRecords("169");

// Get a specific daily issue
const issue = await congressService.getDailyCongressionalRecordIssue({
  volumeNumber: "169",
  issueNumber: "1",
});

// Get articles from a daily issue
const articles = await congressService.getDailyCongressionalRecordArticles({
  volumeNumber: "169",
  issueNumber: "1",
});
```

### CRS Reports

```typescript
// Get a list of CRS reports
const reports = await congressService.getCRSReports({ limit: 10 });

// Get reports updated after a specific date
const recentReports = await congressService.getCRSReports({
  updatedAfter: new Date("2024-01-01"),
});

// Get a specific CRS report
const report = await congressService.getCRSReport("R40097");
```

### House Communications

```typescript
// Get a list of House communications
const communications = await congressService.getHouseCommunications({ limit: 10 });

// Get communications by type
const execCommunications = await congressService.getHouseCommunications({
  congress: 119,
  type: "ec", // executive communications
});

// Get a specific House communication
const communication = await congressService.getHouseCommunication({
  congress: 119,
  type: "ec",
  number: "1",
});
```

### Senate Communications

```typescript
// Get a list of Senate communications
const communications = await congressService.getSenateCommunications({ limit: 10 });

// Get a specific Senate communication
const communication = await congressService.getSenateCommunication({
  congress: 119,
  type: "ec",
  number: "1",
});
```

### House Roll Call Votes (Beta)

```typescript
// Get a list of House roll call votes
const votes = await congressService.getHouseRollCallVotes({ limit: 10 });

// Get votes for a specific congress and session
const sessionVotes = await congressService.getHouseRollCallVotes({
  congress: 119,
  session: 1,
});

// Get a specific roll call vote
const vote = await congressService.getHouseRollCallVote({
  congress: 119,
  session: 1,
  voteNumber: "1",
});

// Get member votes for a roll call
const memberVotes = await congressService.getHouseRollCallVoteMemberVotes({
  congress: 119,
  session: 1,
  voteNumber: "1",
});
```

## Error Handling

The service throws errors for failed API requests:

```typescript
try {
  const bill = await congressService.getBillDetails({
    congress: 119,
    billType: "hr",
    billNumber: 1234,
  });
} catch (error) {
  if (error instanceof Error) {
    console.error("Error fetching bill:", error.message);
  }
}
```

If the API key is not provided (either via constructor or environment variable), the service will throw an error on the first request:

```typescript
// Error: CongressService is disabled: Missing CONGRESS_GOV_API_KEY
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

- **CI Workflow**: Runs on pull requests to verify build status.

## Development & Release

This package uses automated releases with GitHub Actions and GitHub Packages:

- **Patch releases**: Automatically triggered on push to `main` branch
- **Minor releases**: Include `[Release:Minor]` in commit message when pushing to `main`
- **Pre-releases**: Add `prerelease` label to pull requests

See [.github/SETUP.md](.github/SETUP.md) for detailed configuration instructions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
