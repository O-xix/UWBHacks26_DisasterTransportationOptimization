# UWBHacks26 — Disaster Transit Optimization Simulator: Planning Doc

> Living document. Update as decisions are made.

---

## Product Vision

An interactive web simulation — think NUKEMAP but for bus evacuation optimization. Users click a map to place a disaster, set parameters, hit Run, and watch an AI-optimized bus network respond in real time. Educational, explorable, realistic geography.

**Not an operational tool (yet).** The live city-deployment version is a future expansion.

**Core problem the simulation demonstrates:** How do you send the right number of buses to the right evacuation hubs, based on where people actually are — not just where they live?

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (web) |
| Map rendering | Leaflet + react-leaflet |
| Map tiles | OpenStreetMap (free) |
| Routing engine | OSRM — self-hosted via Docker |
| Backend | FastAPI (Python) |
| AI layer | Claude API (Anthropic SDK) |
| Geometry | Shapely (Python) — spread polygons, route intersection checks |
| Containerization | Docker + docker-compose |
| Data | Census TIGER, CAL FIRE GeoJSON perimeters, OSM .pbf extract |

**Note:** The existing Expo/React Native project in the repo is superseded. New project is a React web app.

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Browser (React)                    │
│                                                     │
│  ┌──────────────┐  ┌─────────────┐  ┌───────────┐  │
│  │  Leaflet Map │  │  Param Panel│  │ Stats +   │  │
│  │  (OSM tiles) │  │  (controls) │  │ Narration │  │
│  └──────┬───────┘  └──────┬──────┘  └─────┬─────┘  │
│         └─────────────────┴───────────────┘         │
│                           │ REST (fetch)             │
└───────────────────────────┼─────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────┐
│              FastAPI Backend (Python)               │
│                                                     │
│  POST /simulate   → runs full sim, returns frames   │
│  POST /narrate    → calls Claude, returns text      │
│                                                     │
│  Internal calls:                                    │
│  ┌──────────────────┐    ┌────────────────────────┐ │
│  │  OSRM (Docker)   │    │   Claude API           │ │
│  │  localhost:5000  │    │   (Anthropic SDK)      │ │
│  │  road routing    │    │   narration + weights  │ │
│  └──────────────────┘    └────────────────────────┘ │
│                                                     │
│  Static data (baked in):                           │
│  - Census population + vehicle ownership by zone   │
│  - CAL FIRE historical perimeters (GeoJSON)        │
│  - Pre-defined hub + depot locations per scenario  │
└─────────────────────────────────────────────────────┘
```

## Simulation Data Flow

```
User sets params → POST /simulate
                        │
                        ▼
          For each time step T:
          ┌─────────────────────────────────┐
          │ 1. Spread model                 │
          │    → disaster polygon at T      │
          │                                 │
          │ 2. Demand model                 │
          │    → people per hub at T        │
          │    (census × time-of-day ×      │
          │     disaster proximity)         │
          │                                 │
          │ 3. Route safety check           │
          │    → Shapely: does route        │
          │      intersect spread at T+ETA? │
          │    → green / yellow / red       │
          │                                 │
          │ 4. Allocation (greedy VRP)      │
          │    → priority scores per hub    │
          │    → assign buses from depots   │
          │                                 │
          │ 5. Routing (OSRM)               │
          │    → actual road path per bus   │
          └─────────────────────────────────┘
                        │
          Returns: array of frames
          [{ t, spread_polygon, buses[], hubs[], routes[] }, ...]
                        │
                        ▼
          Frontend receives all frames,
          animates them at chosen speed
```

## OSRM Setup (Self-Hosted)

OSM data extract for Northern California (~300MB compressed from Geofabrik).
Processed and served via Docker. Four commands, one-time setup:

```
osrm-extract  → parses OSM .pbf into routing graph
osrm-partition → partitions graph for MLD algorithm
osrm-customize → applies routing weights
osrm-routed   → serves HTTP routing API on port 5000
```

FastAPI calls OSRM internally at `localhost:5000/route/v1/driving/...`
Returns a road-snapped polyline for each bus trip.

---

## What "The Model" Actually Is

A combination of ML, algorithmic optimization, and stochastic simulation:

### 1. Demand Estimation — Scikit-learn Model (ML)
A pre-trained gradient boosting model (`.pkl` baked into backend) predicts people per hub given:
- Time of day + day of week
- Distance from hub to disaster origin
- Neighborhood vehicle ownership rate
- Disaster severity score

Trained offline on synthetic data (programmatically generated scenarios + Gaussian noise). Replaces the naive census × multiplier lookup.

### 2. Fire Spread — Stochastic Cellular Automata (ML-adjacent + randomness)
At each time step, each cell on the fire boundary has a *probability* of spreading:
- Base probability set by wind direction alignment and wind speed
- Gaussian noise added to wind direction each tick
- Different random seeds → different fire shapes each run

Output: a realistic, non-deterministic fire polygon that evolves over time. Makes the fire look alive, not mechanical.

### 3. Allocation — Greedy VRP (algorithmic)
Assigns buses to hubs each tick:
1. Compute priority score per hub: `demand × urgency × (1 / distance_to_disaster)`
2. Sort highest first, assign nearest available buses from depots
3. Re-run as buses complete trips

Greedy is correct here — fast, explainable, works at demo scale.

### 4. Monte Carlo Mode (stochastic)
Run the simulation N times (e.g., 50) with different random seeds for the fire spread.
- Show outcome distribution: average / best / worst case evacuation coverage
- Map overlay: route closure probability bands ("Route 9 closes in 80% of runs")
- Turns a single animation into a probabilistic planning tool

### 5. Claude API Layer (AI narration)
- Reads current simulation state
- Returns 2-3 sentence plain-English explanation of optimizer decisions
- Sets initial demand weight adjustments based on scenario context
- Does not do routing or allocation — that's algorithmic

---

## Architecture

```
Browser (React + Leaflet)
    │
    ├── Map canvas: disaster spread polygon, bus markers (animated),
    │   hub capacity rings, route safety coloring
    ├── Parameter panel: disaster origin (map click), type, time, buses, spread rate
    ├── Playback controls: Run / Pause / Speed
    └── Stats panel + narration box (Claude output)
         │
         ▼
FastAPI Backend
    ├── POST /simulate    → takes full scenario params, returns array of state frames
    ├── GET  /routes      → calls OSRM for bus routing between two points
    ├── POST /spread      → computes disaster polygon at time T
    ├── POST /demand      → estimates hub demand given time + disaster state
    └── POST /narrate     → calls Claude API with current state, returns explanation
```

**Simulation approach:** Frame-based. User hits Run → backend computes N state frames (bus positions, hub fills, spread polygon, route statuses) → returns all frames → frontend animates them. Keeps it simple, no WebSocket needed for MVP.

---

## Screens

### 1. Main Simulation Screen (single-page, NUKEMAP-style)
- Full-viewport map (Leaflet + OSM)
- Left or bottom panel: scenario parameters
  - Scenario type: Historical preset or Custom
  - Disaster type dropdown
  - Time of day slider
  - Bus count + depot placement
  - Spread rate / wind direction (wildfire)
- Click map to place disaster origin (custom) or select from preset list (historical)
- "Run Simulation" button
- Playback controls appear after run starts
- Narration box: Claude explains current optimization decisions in plain English

### 2. Results Overlay (same screen, post-run)
- Final stats: people evacuated, % coverage, buses rerouted, time to full evacuation
- "Adjust & Re-run" resets parameters panel

---

## Simulation Features

**What animates on the map:**
- Disaster zone spreading (polygon grows over time, color by severity)
- Bus markers moving along routes
- Hub markers with capacity fill rings (fill as buses arrive + people board)
- Route coloring: Green (safe) / Yellow (closing in ~30min) / Red (avoid)
- Population heatmap overlay (shows demand shift when time of day changes)

**The "aha" moment:** Change time from 2am to 2pm → watch bus allocation completely shift because population heatmap moves from residential to commercial zones.

---

## Demand Estimation

| Signal | In simulation |
|---|---|
| Time of day + day of week | User-controlled slider, shifts population heatmap |
| Census block population | Pre-baked per scenario region |
| Vehicle ownership by zone | Pre-baked, used to flag vulnerable hubs |
| Disaster proximity | Computed live from disaster origin + spread |

---

## Predictive Route Safety

Disaster spread cone projected 30 and 60 minutes forward.
Bus route segments checked against projected cone at estimated arrival time.

- **Green** — route is clear throughout trip duration
- **Yellow** — route intersects spread zone within 30 min, alternate pre-assigned now
- **Red** — route intersects within current trip window, bus rerouted immediately

---

## Historical Scenarios (Pre-loaded)

- **2018 Camp Fire — Paradise, CA** (recommend as primary demo)
  - Well-documented, visually dramatic, clear road network constraints
  - Real fire perimeter data available from CAL FIRE / FEMA
- Additional scenarios TBD

---

## Complexity Tiers — Hackathon Scope

**Tier 1 — Must have:**
- Map with OSM tiles, click-to-place disaster origin
- Disaster spread animation (wildfire cone)
- Greedy bus allocation + animated bus movement
- Route safety coloring
- One historical preset (Camp Fire)
- Claude narration of decisions

**Tier 2 — Strong addition:**
- Population heatmap overlay + time-of-day slider
- Hub capacity visualization
- Vulnerable population toggle (see allocation change)
- Speed controls
- Results summary

**Tier 3 — Do not attempt:**
- Multiple simultaneous disasters
- Flood / earthquake spread models (wildfire first)
- Self-hosted OSRM (use public API)
- User accounts / saved scenarios

---

## Future Expansion — Live System

The operational version builds directly on this simulation engine:
- Real-time data feeds replace simulated inputs
- Driver app with navigation
- Admin dashboard with overrides
- SMS alerts to public by zone
- Role-based auth via city/DOT credentials

The simulation engine becomes the live engine with a data layer swap.

---

## Open Questions / To Decide

- [ ] Do we use the OSRM public demo server (rate-limited) or set up a small self-hosted instance for the hackathon?
- [ ] How granular is the road network shown on the map — all streets, or just major roads?
- [ ] For the Camp Fire scenario: do we use real historical fire perimeter data, or approximate it?
- [ ] Does Claude narrate continuously as the sim plays, or only on user request?
- [ ] What does a "bus" look like on the map — icon, animated dot, route line?
- [ ] Where do depot locations come from for custom scenarios — user-placed or auto-generated near population centers?
