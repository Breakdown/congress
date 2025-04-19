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

## CI

This project uses GitHub Actions for continuous integration, so if you're contributing you can PR with confidence!

- **CI Workflow**: Runs on pull requests to verify build status.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Breakdown Rearchitecture Proposal

### Database Schema Improvements

#### 1. Events-focused Schema

```prisma
// New tables focused on upcoming events
model CongressionalCalendar {
  id          String    @id @default(uuid())
  date        DateTime
  chamberType Chamber   // Senate, House, Joint
  eventType   String    // Floor, Committee, Hearing
  title       String
  description String?
  location    String?
  isPublic    Boolean   @default(true)
  links       Json?     // Store URLs to associated documents
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime? @updatedAt @map("updated_at")

  // Relationships
  bills       Bill[]
  committees  Committee[]
  members     Member[]
}

model MemberActivity {
  id          String    @id @default(uuid())
  memberId    String    @map("member_id")
  activityType String   // Statement, PressRelease, SocialMedia, Interview, Speech, etc.
  content     String    // The actual content or summary
  source      String?   // Where this activity was sourced from
  sourceUrl   String?   @map("source_url")
  activityDate DateTime @map("activity_date")
  sentiment   Float?    // Optional sentiment analysis (-1 to 1)
  topics      String[]  // Array of topic tags
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime? @updatedAt @map("updated_at")

  member Member @relation(fields: [memberId], references: [id])
}

model UserEngagement {
  id          String    @id @default(uuid())
  userId      String    @map("user_id")
  engagementType String  // View, Click, Share, Save, React
  contentType String     // Bill, Member, Event, Activity
  contentId   String    @map("content_id")
  createdAt   DateTime  @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])
}

model NotificationEvent {
  id             String    @id @default(uuid())
  eventType      String    // UpcomingVote, MemberActivity, BillUpdate, etc.
  scheduledFor   DateTime  @map("scheduled_for")
  priority       Int       @default(1) // 1-5, with 5 being highest
  targetUsers    Json?     // Criteria for targeting users
  content        Json      // Title, body, etc.
  relatedEntities Json?    // Bills, members, etc. associated with this notification
  status         String    @default("PENDING") // PENDING, SENT, CANCELLED
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime? @updatedAt @map("updated_at")
}

// Enhanced Bill model with more status tracking and activity
model Bill {
  // ... existing fields ...

  lastStatusChange DateTime? @map("last_status_change")
  progressStage    String?   @map("progress_stage") // More granular than status
  isHotTopic       Boolean   @default(false) @map("is_hot_topic")
  popularity       Int?      // Track bill popularity based on user engagement
  lastMajorAction  String?   @map("last_major_action")

  // New relationships
  relatedNews      BillNews[]
  calendar         CongressionalCalendar[]
  activities       ActivityFeed[] // Generic activity feed items
}

model BillNews {
  id            String    @id @default(uuid())
  billId        String    @map("bill_id")
  title         String
  source        String
  url           String
  publishedDate DateTime  @map("published_date")
  createdAt     DateTime  @default(now()) @map("created_at")

  bill Bill @relation(fields: [billId], references: [id])
}

model ActivityFeed {
  id          String    @id @default(uuid())
  entityType  String    // Bill, Member, Committee
  entityId    String    @map("entity_id")
  activityType String
  title       String
  description String?
  timestamp   DateTime
  createdAt   DateTime  @default(now()) @map("created_at")

  // Polymorphic relationships (simplified)
  bill        Bill?    @relation(fields: [billId], references: [id])
  billId      String?
  member      Member?  @relation(fields: [memberId], references: [id])
  memberId    String?
}
```

#### 2. Enhanced User Preference Model

```prisma
model UserPreferences {
  id                String   @id @default(uuid())
  userId            String   @unique @map("user_id")
  preferredIssues   String[] // Array of issue IDs
  preferredMembers  String[] // Array of member IDs
  locationPrecision String   @default("DISTRICT") // DISTRICT, STATE, NATION
  notificationFrequency String @default("DAILY") // REALTIME, DAILY, WEEKLY
  customAlerts      Json?    // Custom alert settings
  contentSettings   Json?    // Content display preferences
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime? @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id])
}
```

### Job Flow Rearchitecture

#### 1. Upcoming Events Pipeline

```typescript
// Enhanced calendar sync that pulls from multiple sources
class CongressionalCalendarService {
  // Sync House floor schedule
  async syncHouseFloorSchedule() {
    // Using your existing getUpcomingBillsHouse with enhancements
  }

  // Sync Senate floor schedule
  async syncSenateFloorSchedule() {
    // Pull from senate.gov calendar and parse
  }

  // Sync committee hearings from both chambers
  async syncCommitteeHearings() {
    // Pull from committee websites and APIs
  }

  // Master job that runs all calendar syncs
  async syncAllCalendars() {
    await this.syncHouseFloorSchedule();
    await this.syncSenateFloorSchedule();
    await this.syncCommitteeHearings();

    // Generate notifications for upcoming important events
    await this.generateEventNotifications();
  }

  // Create notifications for important upcoming events
  async generateEventNotifications() {
    // Algorithm to determine which events need notifications
    // Based on user preferences, bill popularity, etc.
  }
}
```

#### 2. Member Activity Tracking

```typescript
class MemberActivityService {
  // Sync press releases from member websites
  async syncMemberPressReleases() {
    // Pull from member websites or congress API
  }

  // Sync social media posts
  async syncMemberSocialMedia() {
    // Pull from Twitter/X, Facebook, Instagram APIs
  }

  // Sync statements from congressional record
  async syncMemberStatements() {
    // Pull from congressional record API
  }

  // Analyze member activities for sentiment and topics
  async analyzeMemberContent() {
    // Use NLP to extract topics and sentiment
  }

  // Generate notifications for notable member activities
  async notifyUsersOfMemberActivities() {
    // Based on user follows and preferences
  }
}
```

#### 3. Enhanced Bill Tracking

```typescript
class EnhancedBillService {
  // Track bill progression with more granular stages
  async updateBillProgressStages() {
    // More detailed than just status - track through committees, amendments, etc.
  }

  // Sync related news articles for bills
  async syncBillNews() {
    // Use news APIs to find articles mentioning bills
  }

  // Calculate bill popularity and hotness scores
  async updateBillPopularityMetrics() {
    // Based on user engagement, news coverage, etc.
  }

  // Generate activity feed items for bills
  async generateBillActivityFeed() {
    // Create activity items for significant bill events
  }
}
```

#### 4. Intelligent Notification System

```typescript
class IntelligentNotificationService {
  // Schedule notifications based on upcoming events
  async scheduleEventNotifications() {
    // Create future-dated notification events
  }

  // Personalized daily digest of activity
  async generateDailyDigests() {
    // For users who prefer daily summaries
  }

  // Process and send scheduled notifications
  async processNotificationQueue() {
    // Send out pending notifications
  }

  // Prioritize notifications based on user engagement patterns
  async optimizeNotificationTiming() {
    // Use ML to determine optimal send times per user
  }
}
```

### Implementation Strategy

1. **Data Sources Enhancement**:

   - Integrate with House and Senate websites directly
   - Add social media APIs for member tracking
   - Incorporate news APIs for related content

2. **Job Scheduling**:

   - Daily jobs for calendar syncing
   - Hourly jobs for member activities
   - Real-time jobs for critical events (votes happening now)
   - Weekly jobs for analytics and recommendation generation

3. **User Engagement Focus**:

   - Track which content users engage with
   - Build personalization engine based on engagement
   - Develop recommendation system for bills and members

4. **Scalability Considerations**:
   - Separate heavy processing jobs from API service
   - Implement caching layer for frequently accessed data
   - Design for horizontal scaling of job workers
