# Wireframe Proposal: Right-Side Survey Navigation

## Context
When viewing a Visit (e.g., AA42937), we currently have:
1.  **Survey Selector (Currently Dropdown):** To switch between broad contexts (General, Cervezas, Vinos, etc.).
2.  **Section Navigation (Tabs/Buttons):** To jump to specific parts *within* that survey (Layout, Contamination, Tags, etc.).

## Problem
If we add a Right-Side Panel for surveys, does it conflict with the existing "Section Buttons" (Layout, Contamination...)?
**Answer:** It actually solves the conflict by separating "Global Navigation" (Which Survey?) from "Local Navigation" (Which part of the survey?).

## Proposed Layout Structure

```
+-------------------+---------------------------------------------------+-----------------------+
|  LEFT SIDEBAR     |  MAIN CONTENT AREA                                |  RIGHT PANEL (NEW)    |
|  (App Nav)        |                                                   |  (Visit Context)      |
|                   |                                                   |                       |
|  [Dashboard]      |  +---------------------------------------------+  |  VISIT PROGRESS       |
|  [Visits]         |  |  HEADER: Genoveva Adasme (AA42937)          |  |                       |
|  [Reports]        |  |  Score: 50/100  | Time: 57m                 |  |  SURVEYS:             |
|                   |  +---------------------------------------------+  |                       |
|                   |                                                   |  | [CURRENT]          |
|                   |  +---------------------------------------------+  |  | Overview General   |
|                   |  |  LOCAL NAV (Sticky Header)                  |  |  | (Status: Done)     |
|                   |  |  [Layout] [Contam..] [Etiquetas] [Manual]   |  |  | -----------------  |
|                   |  +---------------------------------------------+  |                       |
|                   |                                                   |  | [Link]             |
|                   |  [ Scrollable Content Area ]                      |  | Cervezas           |
|                   |                                                   |  | (Status: Done)     |
|                   |  # Section: Layout                                |  | Score: 50/100      |
|                   |  [Metrics Cards]                                  |  |                    |
|                   |  [List of invalid items...]                       |  | [Link]             |
|                   |                                                   |  | Analcohólicos      |
|                   |  # Section: Contaminación                         |  | (Status: Done)     |
|                   |  [Metrics Cards]                                  |  | Score: 85/100      |
|                   |                                                   |  |                    |
|                   |  # Section: Etiquetas                             |  | [Link]             |
|                   |  [Metrics Cards]                                  |  | Vinos y Licores    |
|                   |                                                   |  | (Status: Done)     |
|                   |                                                   |  |                    |
|                   |                                                   |  | [Link]             |
|                   |  [ Photo Gallery ]                                |  | Material POP       |
|                   |                                                   |  | (Status: Pending)  |
|                   |                                                   |                       |
+-------------------+---------------------------------------------------+-----------------------+
```

## detailed Interaction Logic

1.  **Right Panel serves as the "Table of Contents" for the VISIT.**
    *   It lists every "Survey" available for this store visit.
    *   This replaces the Dropdown in the top header.
    *   It gives the PM the "At a glance" view of what is done vs pending for the whole visit.

2.  **Center Area serves as the "Context" for the SELECTED SURVEY.**
    *   When you click "Overview General" on the right -> The center shows Layout, Contamination, etc.
    *   When you click "Cervezas" on the right -> The center updates to show Cervezas-specific questions/metrics.
    *   **The "Layout/Contamination" buttons** remain at the top of the Center Area (Sticky). They are *local* anchors for the current view.

## Why this works
It creates a clear hierarchy:
1.  **Level 1 (App):** Left Sidebar (Visits vs Reports).
2.  **Level 2 (Visit):** Right Sidebar (Which Survey am I looking at?).
3.  **Level 3 (Survey):** Center Top Buttons (Which section of this survey?).

This prevents the "Dropdown blindly changes everything" confusion. You always know exactly where you are.
