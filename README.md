# @breakdown_us/congress

A TypeScript client for the [congress.gov API](https://api.congress.gov/) that provides strongly typed access to legislative information from the U.S. Congress. Source for types can be found at [LibraryOfCongress/api.congress.gov](https://github.com/LibraryOfCongress/api.congress.gov)

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

// Example: Get information about the current Congress
const currentCongress = await congressService.getCurrentCongress();
console.log(`Current Congress: ${currentCongress}`);

// Example: Check if Congress is in session
const inSession = await congressService.isCongressInSession();
console.log(`Congress is in session: ${inSession}`);

// Example: Fetch recent bills
const recentBills = await congressService.getBills({ limit: 10 });
```

## Features

- Complete TypeScript coverage of the congress.gov API endpoints with full type definitions
- Clean, async API

## API Documentation

The package provides access to the following categories of data:

### Congress Information

```typescript
// Get a list of all congresses
const congresses = await congressService.getCongresses();

// Get details about a specific congress
const congress = await congressService.getCongress(117);

// Get the current congress
const currentCongress = await congressService.getCurrentCongress();

// Check if Congress is in session
const isInSession = await congressService.isCongressInSession();
```

### Bills and Legislation

```typescript
// Get a list of bills
const bills = await congressService.getBills({ limit: 10 });

// Get a specific bill
const bill = await congressService.getBill({
  congress: 117,
  billType: "HR",
  billNumber: 1319,
});

// Get bills that became law
const laws = await congressService.getLaws({ congress: 117 });

// Get subjects for a bill
const subjects = await congressService.getSubjectsForBill({
  congress: 117,
  billType: "HR",
  billNumber: 1319,
});

// Get summaries for a bill
const summaries = await congressService.getSummariesForBill({
  congress: 117,
  billType: "HR",
  billNumber: 1319,
});

// Get text versions for a bill
const texts = await congressService.getTextsForBill({
  congress: 117,
  billType: "HR",
  billNumber: 1319,
});
```

### Members of Congress

```typescript
// Get a list of members
const members = await congressService.getMembers({ limit: 10 });

// Get a specific member by Bioguide ID
const member = await congressService.getMember({
  memberBioguideId: "S000033",
});

// Get members by state
const stateMembers = await congressService.getMembersByState({
  congress: 117,
  state: "CA",
});

// Get sponsored legislation by a member
const sponsoredBills = await congressService.getMemberSponsoredLegislation({
  memberBioguideId: "S000033",
});
```

### Committees

```typescript
// Get a list of committees
const committees = await congressService.getCommittees({ limit: 10 });

// Get a specific committee
const committee = await congressService.getCommittee({
  chamber: "senate",
  systemCode: "ssju00",
});

// Get committee meetings
const meetings = await congressService.getCommitteeMeetings({
  congress: 117,
  chamber: "senate",
});
```

### Nominations

```typescript
// Get a list of nominations
const nominations = await congressService.getNominations({ limit: 10 });

// Get a specific nomination
const nomination = await congressService.getNomination({
  congress: 117,
  nominationNumber: "2",
});

// Get nominees for a nomination
const nominees = await congressService.getNominees({
  congress: 117,
  nominationNumber: "2",
});
```

### Treaties

```typescript
// Get a list of treaties
const treaties = await congressService.getTreaties({ limit: 10 });

// Get a specific treaty
const treaty = await congressService.getTreaty({
  congress: 117,
  treatyNumber: "1",
});
```

### Congressional Record

```typescript
// Get bound congressional record
const record = await congressService.getBoundCongressionalRecord({
  year: 2022,
  month: 1,
  day: 15,
});

// Get daily congressional record issues
const dailyIssues = await congressService.getDailyCongressionalRecords();
```

### More Endpoints

The package includes many more endpoints that cover the full range of the congress.gov API (if one is missing, please open an Issue!). Please refer to the TypeScript definitions for the complete list of available methods.

## Error Handling

The service throws errors differing per status code we get from the congress.gov API:

```typescript
try {
  const bill = await congressService.getBill({
    congress: 117,
    billType: "HR",
    billNumber: 1234,
  });
} catch (error) {
  console.error("Error fetching bill:", error.message);
}
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
