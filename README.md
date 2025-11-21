harmony
<p align="center">
  <img src="assets/harmony-logo-green-full.svg" alt="Harmony Logo" width="260">
</p>

<h1 align="center">Harmony – Regenerative Workforce Incentives on Stellar</h1>

<p align="center">
  Turning real work into recurring on-chain income for Latin American workers.
</p>

---

## 🟢 What is Harmony?

Harmony is a Web3 incentive platform that helps companies – starting with logistics and warehouse teams – **measure real performance and pay fair, recurring bonuses on Stellar**.

Instead of creating hundreds of dead wallets at events, Harmony focuses on **corporate onboarding**: each company creates or links wallets for their workers and sends periodic performance bonuses.  
Those wallets become **recurring income channels**, not one-time airdrops, and workers gain access to **on-chain financial services** (savings, basic DeFi, trading, off-ramp).

---

## 🖼 Logos & Visual Identity

> Minimal, green, and frequency-based – to represent alignment between people, work and value flows.

- **Primary logo**  
  `assets/harmony-logo-green-full.svg`  
  Full wordmark “Harmony” with a green arc made of aligned waves/frequencies.

- **Icon / App mark**  
  `assets/harmony-mark-green.svg`  
  Simplified green wave/arc, suitable for wallet/app icon and favicon.

Use green as the main color (growth, regeneration, trust) with neutral dark text.

---

## 💥 Problem – What we are fixing (and how bad it is)

### 1. Inside companies (especially logistics)

Most small and mid-size companies in Latin America struggle with:

- **Low and unstable motivation**:  
  Workers feel their effort is rarely recognized. Performance peaks around payday and drops the rest of the month.
- **No clear way to measure performance**:  
  Tasks are managed via WhatsApp, paper or basic spreadsheets. It’s hard to know:
  - Who did what,
  - How long it took,
  - Whether it was done correctly.
- **Bonuses that feel arbitrary**:  
  Even when owners *want* to reward people, they lack **clear, verifiable metrics**, so incentives end up based on perception, favoritism or last-minute pressure.

This leads to:

- Less productivity and profitability  
- More mistakes in operations (especially in picking/packing)  
- Higher conflict inside the team  
- Difficulty meeting goals and keeping good workers

> In short: **we have “Juan” everywhere** – the demotivated worker who doesn’t know exactly what to do, when, or why it matters.

---

### 2. In the Web3 ecosystem

At the same time, **onboarding to Web3 is broken**:

- We create wallets at events, drop a few tokens…
- …and people **never use that wallet again**.
- There is no recurring value, no real habit, no connection to daily life.

Real, recurring income for millions of workers in LatAm still happens **off-chain** (cash, envelopes, payroll lines) while Web3 spins in circles creating wallets with no life.

If we don’t change this:

- Companies will keep seeing blockchain as “nice marketing” but not as operational infrastructure.
- Workers will remain excluded from Web3 tools that could genuinely help them (saving in stable assets, DeFi, off-ramp).
- The ecosystem will continue to burn resources on short-term airdrops with no long-term impact.

---

## ✅ Our Solution – Harmony

Harmony is an **automated rewards system** for worker performance, built on the **Stellar network** with **Soroban smart contracts**, designed for **logistics and warehouse operations** first.

We give companies:

- A **clear, tamper-proof record** of worker performance
- **Metrics** (tasks completed, quality, time) instead of opinions
- A way to send **periodic bonuses directly to each worker’s wallet**
- A simple, mobile-friendly app so supervisors and workers can actually use it on the warehouse floor

We give workers:

- **Clarity** on what they have to do, how, and by when  
- **Immediate recognition** every time they complete tasks correctly  
- **On-chain income** they receive monthly in a Stellar wallet  
- Access to **savings, DeFi, trading or off-ramp** using those tokens

---

## 🧩 How Harmony Addresses the Problem

### 1. From chaos to clear tasks

For each organization:

- Managers define **activity templates** (e.g. “Pick orders in Zone A”, “Inventory count”, “Cleaning aisle”).
- Supervisors create **tasks** from these templates, assign them to workers and set expected time.

Each task tracks:

- `created_at` – when it was assigned  
- `completed_at` – when the worker marked it as done  
- `reviewed_at` – when a supervisor reviewed it  
- Status: `ASSIGNED`, `PENDING_REVIEW`, `APPROVED_OK`, `APPROVED_MINOR`, `REJECTED_MAJOR`  
- Evidence: photos + notes from the worker (via mobile webapp)

Workers know exactly **what** to do, **how** and **by when**.

---

### 2. From opinion to metrics

Harmony calculates on-chain metrics per worker and per month:

- Tasks completed  
- Tasks OK / minor issue / major error  
- Average completion time  
- Points earned (performance score)  

All of this is stored on Soroban contracts and mirrored in SQL for analytics and Power BI dashboards.

> Companies move from “I *feel* you’re not performing” to “Here is your **clear performance history**, stored on-chain.”

---

### 3. From salary-only to recurring on-chain income

Each month:

1. The company deposits a **reward pool** in a Stellar asset (e.g. stablecoin).
2. The contract distributes that pool according to each worker’s **points**.
3. Workers **claim** their bonus directly into their wallets.

This creates:

- **Recurring activity** in wallets (not one-time airdrops).
- A direct link between **real work → on-chain value**.
- A natural, safe entry point to Web3 for workers.

---

## 🏗 Technical Architecture (Present)

### On-chain (Soroban)

- **Factory Contract**
  - Creates organization contracts.
  - Registers `org_id → org_address` + owner metadata.

- **Organization Contract (per company)**
  - Membership: join/leave/kick, roles (`owner`, `supervisor`, `worker`).
  - Activity templates (task types).
  - Tasks:
    - assignment, completion, review, evidence URLs.
    - scoring logic (base points, difficulty, quality factor).
  - Monthly reward pools:
    - fund period, close period, claim rewards.
  - On-chain stats per worker/period.

### Off-chain

- **Backend/API (Node or Python)**
  - Handles wallet-based auth.
  - Interacts with Soroban contracts.
  - Mirrors state into SQL Server / Azure SQL.
  - Exposes REST/GraphQL endpoints for the webapp.

- **Database (SQL Server)**
  - `Organizations`, `Members`, `ActivityTemplates`
  - `Tasks` with timestamps and evidence
  - `MemberPeriodStats` for fast analytics
  - Designed as **multi-tenant**: many companies, each with its own org contract and data namespace.

- **Webapp (Mobile-first)**
  - Workers:
    - view tasks, upload evidence (photos), mark as done
    - see their monthly score & rewards
  - Supervisors:
    - create/assign tasks
    - review pending tasks and score them
  - Admins:
    - configure organization, reward asset, periods
    - fund reward pools, close periods

---

## 🔮 Future – Where Harmony is Going

After the hackathon, Harmony has a clear path to production:

1. **Deeper logistics integration**
   - Connect to existing WMS/ERPs and digital twins.
   - Use QR/barcode scans to auto-create tasks and evidence.
   - Heatmaps of productivity by zone, shift, and worker.

2. **Advanced incentive design**
   - Multiple pools (quality bonus, safety bonus, team bonus).
   - Long-term streaks and badges on-chain.
   - Reputation portable across organizations (a worker’s on-chain track record follows them).

3. **Financial inclusion layer**
   - Savings vaults and simple DeFi products built on Stellar.
   - Educational content embedded in the app (“What is Stellar?”, “How to save safely?”).
   - Optional contribution to **community funds** (ReFi angle) – e.g. 1% of each pool goes to training, safety or wellbeing.

4. **LatAm-first, global-ready**
   - Start with logistics operations in Latin America (high informal work, high turnover).
   - Expand to retail, field services, and other blue-collar segments.
   - Offer white-label versions for HR/consulting firms.

---

## 🌎 Why this Matters for Latin America

- High levels of **labor demotivation** and **informality**.
- Limited access to **formal financial tools** for many workers.
- Companies under pressure to be more efficient while keeping costs under control.

Harmony:

- Helps companies **do more with the same people and space** by aligning incentives.
- Gives workers in LatAm a **first real use case for Web3**: bonuses they can actually use and understand.
- Uses Stellar’s low fees and fast settlement to make it viable even for **small bonuses**.

---

## 💚 Brand – Present & Future

**Purpose**  
> Empower more human, efficient and motivated companies through a fair, transparent and automated system that recognizes the real performance of every worker.

**Mission**  
Offer companies a Web3 tool that is **automated, reliable and metrics-based**, allowing them to recognize good performance in (near) real time and sustain motivation over time.

**Vision**  
Become the leading Web3 performance recognition platform in Latin America and beyond, transforming how companies and workers relate through transparent, immediate and measurable incentives.

**Values**

- Transparency – real, traceable, tamper-proof data  
- Fairness – rewards based on verifiable merit, not favoritism  
- Innovation – using blockchain to improve everyday work  
- Human-centric – people at the center of performance  
- Efficiency – less bureaucracy, more action  
- Trust – secure records and predictable processes  

**Taglines**

- “Motiva mejor. Gestiona mejor. Crece mejor.”  
- “Real metrics, real rewards.”  
- “Un sistema justo para un trabajo justo.”

---

## 🧪 Scope for this Hackathon

For this hackathon we focus on **execution**:

- ✅ Soroban Factory contract + Organization contract MVP  
- ✅ Core flows:
  - create org, join org, create activities, assign tasks
  - worker marks done, supervisor reviews & scores
  - monthly pool distribution + claim  
- ✅ SQL schema and basic API for stats  
- ✅ Mobile-first webapp for workers and supervisors  
- ✅ Demo scenario: “Juan” in a logistics company in Latin America

The code will prioritize:

- Clear, documented smart contract interfaces  
- Robust data modeling (on-chain + SQL)  
- Clean separation of concerns (contracts / backend / UI)  
- A realistic path to production with real companies

---

## 🚀 Getting Started (high-level)

> This section is indicative; exact commands will depend on the final implementation.

1. **Clone the repo**

```bash
git clone https://github.com/your-org/harmony.git
cd harmony
