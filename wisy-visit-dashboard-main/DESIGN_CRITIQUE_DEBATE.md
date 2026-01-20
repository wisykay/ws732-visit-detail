# The "Right-Side Panel" Design Breakdown
**Simulated Debate: Rex Client (Polar), Sr. UX Designer, Product Manager**

### 1. The Conflict: "At a Glance" vs "Verification"
*   **REX Client:** "I have 100 visits to audit. I need speed. I need to see *where I am* (Survey List) and *what I'm checking* (Photo Evidence) simultaneously. Don't make me click back and forth."
*   **UX Designer:** "We have limited screen real estate. If we show the Survey List AND the Photo Gallery side-by-side with the content, the middle 'Rules' section gets squashed, making data entry error-prone."
*   **Product Manager:** "So we have a trade-off: **Context** (List) vs. **Verification** (Photo). We can't fit both on the right sidebar."

### 2. The Options

#### Option A: Collapsible List (Layout 1)
*   **Concept:** The Survey List is the Right Panel. It can collapse to icons. The Photo stays in the center column.
*   **Critique:**
    *   *Good:* Survey context is always visible (as icons).
    *   *Bad:* The Photo takes up valuable center space, cramping the "Rules" list.

#### Option B: Tabbed Context (Layout 2) - **RECOMMENDED**
*   **Concept:** The Right Panel has two modes: **[ Encuestas ]** and **[ Evidencia ]**. The Center column is purely for Rules.
*   **The "Smart Switch" Solution:**
    *   By default, you see the **Survey List** (Navigation Mode).
    *   When you click a specific **Rule** in the center, the Right Panel **automatically switches** to the **Evidence Tab** (Verification Mode).
    *   You verify the photo, then click "Encuestas" to move to the next section.
*   **Client Response:** "This works *if* the switch is instant. It keeps me focused. I'm either 'Navigating' or 'Validating'. I rarely do both at the exact same millisecond."

### 3. Final Recommendation: The "Smart Tabbed" Layout
We proceeded with **Option B (Tabbed)** because it provides the cleanest "Heads Up Display" for the user.

*   **Left:** Global Navigation.
*   **Center:** The Work (Checklist). Wide, readable, no distractions.
*   **Right:** The Toolbox.
    *   *Tool 1:* Map / Survey List (Where am I?)
    *   *Tool 2:* Inspector / Photo (Is this valid?)

I have implemented this "Smart Switch" behavior in **Visit ID: NEW-DESIGN-02**. Go ahead and try clicking a "Rule" row to see it in action.
