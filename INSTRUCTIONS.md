# AI Agent Instructions - IFA 2026 Cornhole Raffle System

## Project Overview

**Event:** IFA 2026 Booth Activation  
**Dates:** February 23–25, 2026  
**Location:** Mandalay Bay, Las Vegas, Booth 452  
**Game Name:** "Discovered: Bag the Meta"

**Objective:** Generate qualified leads, book DISC onboarding sessions, and convert pipeline through an interactive cornhole raffle experience.

---

## 1. EXPERIENCE OVERVIEW

### Primary Prize
🥇 **1st Place:** Meta Glasses

### Additional Participant Benefits
- Unlimited DISC assessments for their team
- Free DISC onboarding session
- Actionable team performance report

---

## 2. PARTICIPANT ENTRY FLOW

### Step 1 - Scan to Play

**Booth Tablet Display:**
```
PLAY CORNHOLE.
WIN META GLASSES.
UNLOCK UNLIMITED DISC.
```

**User Flow:**
1. Attendee taps "Tap to Play"
2. QR code appears on tablet
3. User scans QR code
4. Opens mobile-first landing page (`/ifa2026`)
5. Completes registration form

### Registration Form Fields (Required)
- First Name
- Last Name
- Company
- Job Title
- Work Email
- Phone Number
- Company Size
- Marketing Consent

### Post-Registration Actions
1. New registration record created in system
2. **+1 ticket** added automatically
3. `attempts_remaining = 3`
4. Contact upserted into HubSpot (CRM only, tagged "IFA 2026 participant")
5. User redirected to `/ifa2026/thanks`

---

## 3. GAME RULES (MUST BE IMPLEMENTED EXACTLY)

### Ticket Allocation

**Base Registration:**
- Registration = **+1 ticket**
- Each registration grants **3 attempts**

**Per Attempt Scoring:**
- Bag in hole = **+10 tickets**
- Board hit = **+5 tickets**
- Miss = **+0 tickets**

**Bonus:**
- DISC onboarding booking = **+15 tickets** (one-time per email, globally)

### Important Rules
- ✅ Tickets accumulate across all registrations per email
- ✅ Multiple registrations are allowed
- ✅ Each registration gets its own 3 attempts and +1 base ticket
- ✅ The +15 onboarding bonus can only be applied once per email across all registrations

---

## 4. TICKET MANAGEMENT ARCHITECTURE

### System Responsibilities

**Custom Raffle System (This Application):**
- ALL raffle logic and ticket calculations
- Ticket ledger and audit trails
- Attempt tracking
- Email automation
- Draw execution

**HubSpot:**
- Contact storage only
- Tagging for follow-up sequences
- No raffle logic permitted

### Staff Workflow

1. Participant registers via QR code
2. Registration + contact created in system
3. Booth staff searches by name/email in internal dashboard (`/internal`)
4. Staff clicks appropriate button after each throw:
   - **BAG IN (+10)**
   - **BOARD HIT (+5)**
   - **MISS (+0)**
   - **ADD +15 ONBOARDING BONUS** (Marketing only, one-time)

5. System actions per score entry:
   - Decrements `attempts_remaining`
   - Appends entry to `ticket_ledger`
   - Updates totals instantly
   - Writes audit log

### Email Trigger Logic

**When `attempts_remaining` reaches 0:**
- Send ONE summary email for that registration
- Set `summary_email_sent = true`
- Never send duplicate emails for the same registration

---

## 5. AUTOMATED EMAIL (Single Summary Per Registration)

**Trigger:** Only when all 3 attempts for a registration are completed

**Subject:** "Your raffle ticket total + claim 15 bonus tickets 🎟️"

**Email Content Must Include:**
- First name
- Total ticket count (across all registrations for this email)
- Reminder of +15 onboarding bonus opportunity
- Calendly link to book onboarding
- Live draw date: **February 25 @ 3:30 PM** (Las Vegas time)
- Prize reminder (Meta Glasses)
- Confirmation of Unlimited DISC unlock

**Important:**
- No automated winner notification emails
- Only summary emails are automated

---

## 6. LIVE DRAW - FEBRUARY 25, 2026

**Draw Details:**
- 📅 Date: February 25, 2026
- ⏰ Time: 3:30 PM Pacific
- 📍 Location: Booth 452

### Draw Algorithm

**Preparation:**
1. Snapshot total tickets grouped by email
2. Use weighted random selection (probability proportional to total tickets)

**Draw Order:**
1. Draw 3rd place
2. Remove winner from pool
3. Draw 2nd place
4. Remove winner from pool
5. Draw 1st place

### Winner Management

**Requirements:**
- Winners do NOT need to be present at draw
- Manual winner notification (no automation)

**If Winner Unreachable:**
1. Mark status = `unreachable`
2. Redraw that prize tier
3. Staff contacts winners manually

**Winner Status Values:**
- `pending`
- `contacted`
- `confirmed`
- `unreachable`

---

## 7. DISC OFFER STRUCTURE

### What Participants Unlock
By registering, all participants receive:
- Unlimited DISC assessments for all franchisees
- Free onboarding strategy session
- Performance improvement report

### Booking Onboarding Session
- Adds **+15 tickets** to participant's total
- Can only be applied **once per email** (globally)
- Applied manually by Marketing via internal dashboard
- Triggers HubSpot tag: "Partner (IFA)" for booked meetings

---

## 8. TECHNICAL STRUCTURE

### Database Schema

**Required Tables:**

**`contacts`**
- email (primary, unique)
- first_name
- last_name
- company
- job_title
- phone
- company_size
- marketing_consent
- created_at

**`registrations`**
- id (primary)
- contact_email (foreign key to contacts)
- attempts_remaining (default: 3)
- summary_email_sent (default: false)
- created_at

**`ticket_ledger`**
- id (primary)
- contact_email (foreign key)
- registration_id (foreign key)
- ticket_type (values: 'base', 'bag_in', 'board_hit', 'miss', 'onboarding_bonus')
- ticket_amount (integer)
- created_at
- created_by (staff member or 'system')

**`draw_winners`**
- id (primary)
- draw_date
- prize_tier (1st, 2nd, 3rd)
- winner_email
- total_tickets
- status (pending/contacted/confirmed/unreachable)
- drawn_at
- notes

### Frontend Routes

| Route | Purpose |
|-------|---------|
| `/booth` | Tablet display with QR code generation |
| `/ifa2026` | Mobile registration form |
| `/ifa2026/thanks` | Thank you page after registration |
| `/internal` | Staff dashboard (search, score entry, bonus) |
| `/internal/draw` | Live draw interface |

### Backend API Endpoints

**Public:**
- `POST /api/register` - Create new registration

**Internal (Staff Only):**
- `POST /api/internal/score` - Record throw result
- `POST /api/internal/bonus` - Apply +15 onboarding bonus
- `POST /api/internal/draw/start` - Initialize draw
- `POST /api/internal/draw/pick` - Pick winner for tier
- `POST /api/internal/draw/confirm` - Confirm winner
- `POST /api/internal/draw/unreachable` - Mark unreachable, trigger redraw
- `GET /api/internal/draw/export` - Export draw results

### HubSpot Integration

**Contact Creation/Update:**
- Upsert contact on registration
- Apply tag: "IFA 2026 participant"
- When onboarding booked, apply tag: "Partner (IFA)"

**What NOT to Store in HubSpot:**
- Ticket counts
- Attempt tracking
- Draw logic
- Raffle-specific data

**Critical Rule:** All raffle logic must live in the custom system, NOT HubSpot.

---

## 9. IMPLEMENTATION REQUIREMENTS

### Data Integrity
- All ticket calculations must be auditable
- Complete ledger of all ticket additions
- Track staff member for manual entries
- Prevent duplicate onboarding bonuses per email

### Email Logic
- One summary email per registration when 3 attempts complete
- Check `summary_email_sent` flag before sending
- Calculate total tickets across ALL registrations for the email
- Include personalized Calendly link

### Draw Requirements
- Weighted random selection based on total tickets
- Sequential draw (3rd → 2nd → 1st)
- Remove winners from subsequent draws
- Support redraw if unreachable
- Export capability for audit

### Security
- Staff authentication for internal routes
- Rate limiting on public registration
- Input validation on all forms
- Prevent manipulation of ticket counts

### Testing Checklist
- [ ] Multiple registrations from same email accumulate tickets correctly
- [ ] Onboarding bonus can only be applied once per email
- [ ] Summary email only sends when attempts reach 0
- [ ] No duplicate summary emails for same registration
- [ ] Weighted draw produces correct probability distribution
- [ ] Redraw logic works for unreachable winners
- [ ] HubSpot integration creates/updates contacts properly
- [ ] Staff can search and find participants quickly

---

## 10. BUSINESS RULES SUMMARY

### Tickets
1. Registration = +1 ticket (automatic)
2. 3 attempts per registration
3. Bag in hole = +10, Board hit = +5, Miss = +0
4. Onboarding booking = +15 (once per email, ever)
5. Tickets accumulate across all registrations by email

### Emails
1. One summary email per registration (when 3 attempts complete)
2. No automated winner emails
3. Email shows total tickets across all registrations

### Draw
1. Weighted random by total tickets per email
2. Winners don't need to be present
3. Draw order: 3rd → 2nd → 1st
4. Support redraw if unreachable
5. Manual winner notification by staff

### Integrations
1. HubSpot = contacts + tags only
2. All raffle logic in custom system
3. Audit trail for all actions

---

## 11. DELIVERABLES

### Must Have for Launch
- ✅ Mobile registration form (`/ifa2026`)
- ✅ Booth tablet QR display (`/booth`)
- ✅ Staff scoring dashboard (`/internal`)
- ✅ Ticket ledger with audit trail
- ✅ Summary email automation
- ✅ Draw interface (`/internal/draw`)
- ✅ HubSpot contact sync
- ✅ Weighted random draw algorithm

### Nice to Have
- Real-time ticket leaderboard
- SMS notifications option
- Multi-language support
- Offline mode for booth tablet

---

## 12. CRITICAL CONSTRAINTS

⚠️ **These rules must be enforced at the code level:**

1. `attempts_remaining` cannot be negative
2. Onboarding bonus (+15) can only be applied once per email
3. Summary email flag prevents duplicate sends
4. Draw removes winners from subsequent tiers
5. All ticket modifications must append to ledger (no deletions)
6. Staff authentication required for all `/internal` routes

---

## DEVELOPMENT NOTES

- System must handle peak traffic during event hours (Feb 23-25)
- Booth staff may have limited technical knowledge - keep UI simple
- Mobile registration must work on all device sizes
- Consider offline fallback if venue WiFi fails
- Draw must be transparent and auditable for compliance

## 13. GLOBAL UI STYLE SYSTEM

### 1. Color Strategy

**Primary Gradient Background**

Radial gradient:
- `#1A237E` (deep indigo)
- → `#5E35B1` (electric violet)
- → `#00C6FF` (cyan glow accent)

**Overlay:**
- Animated floating particle layer (white @ 15% opacity)
- Soft diagonal light streaks

**Accent Colors**
- CTA Yellow: `#FFC107` → `#FF9800` gradient
- Success Green: `#2EE59D`
- Victory Orange: `#FF6A00` → `#FFB347`
- Meta Teal Accent: `#00E5FF`
- Card Surface Blue: `#1565C0` → `#1E88E5`

### 2. Button Style (Critical)

All primary buttons must include:

```css
border-radius: 24px;
padding: 18px 36px;
font-weight: 800;
letter-spacing: 0.5px;
background: linear-gradient(180deg, #FFD54F 0%, #FF9800 100%);
color: #FFFFFF;
box-shadow:
   0 8px 0 rgba(0,0,0,0.25),
   0 12px 30px rgba(0,0,0,0.35);
inset 0 4px 6px rgba(255,255,255,0.35);
```

**Hover State:**
- `transform: translateY(-3px)`
- `box-shadow: 0 12px 0 rgba(0,0,0,0.25), 0 16px 35px rgba(0,0,0,0.45)`

**Active State:**
- `transform: translateY(4px)`
- `box-shadow: 0 4px 0 rgba(0,0,0,0.25)`

### 3. Card Containers

All modal cards use:

```css
border-radius: 32px;
background: linear-gradient(180deg, #1E88E5 0%, #1565C0 100%);
padding: 40px;
box-shadow:
   0 25px 60px rgba(0,0,0,0.45),
   inset 0 3px 6px rgba(255,255,255,0.2);
outline: 2px solid rgba(255,255,255,0.15);
```

### 4. Splash Screen (`/`)

**Purpose:** Immediate brand impact + CTA into raffle funnel

**Layout Structure**
- Full screen container
- Centered vertical stack
- Animated glowing badge icon
- Headline
- Subheadline
- Primary CTA button
- Secondary subtle link

**Animated Central Emblem**
- Rounded hexagon badge
- Subtle rotating glow ring
- Inner animated pulse
- Badge gradient: `#FF6A00` → `#FFD54F`
- Badge content: "2026" or stylized cornhole bag icon

**Typography**

Headline:
- Font: Bold geometric sans (Poppins / Montserrat ExtraBold)
- Size: 48–60px desktop
- Color: White
- Text-shadow: `0 4px 12px rgba(0,0,0,0.4)`
- Example: "Discovered: Bag the Meta"

Subtext:
- "Play. Earn Tickets. Win Meta Glasses."

**Primary CTA**
- Button text: `PLAY TO WIN`
- Large, glowing, animated pulse every 5 seconds

**Background Motion**
- Subtle floating light particles
- Slow radial gradient shift
- Soft vignette edges
