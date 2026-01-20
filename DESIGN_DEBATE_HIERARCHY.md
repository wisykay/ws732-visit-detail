# Design Debate: Hierarchy of "Surveys" vs "Evidence"

**Topic:** The user noted that *"Encuestas (Surveys) and Evidencia (Evidence) are not the same level of information."* A tabbed interface implies they are siblings, but they are actually **Parent (Survey)** and **Child (Evidence)**.

---

### 🏛️ The Panel
*   **REX Client (Polar):** Focused on speed and audit efficiency. "I have 500 visits to check."
*   **Product Manager (PM):** Focused on feature completeness and avoiding user confusion.
*   **Sr. UX Designer:** Focused on information architecture and usability patterns.

---

### 🗣️ The Debate

**Sr. UX Designer:** "The user is absolutely right. Putting 'Survey List' and 'Photo Evidence' on the same tab bar is a **Hierarchy Violation**.
*   **Surveys** are the *Map* of the visit.
*   **Evidence** is the *Detail* of a specific task within that map.
By making them tabs, we are telling the user 'You can look at the Map OR the Detail', but in reality, the Detail *belongs* to a specific point on the map."

**REX Client:** "I don't care about 'Hierarchy Violations'. I just want to see the photo! When I click a rule, show me the photo. When I'm done, let me pick the next survey. Don't make me click 5 times."

**PM:** "But if we remove the Survey List to show the Photo, how do they navigate? If they finish the 'Cervezas' survey, how do they get to 'Vinos'? They'll feel trapped in the photo view."

**Sr. UX Designer:** "We solve this with a **Drill-Down (Master-Detail)** pattern, not Tabs."

---

### 💡 The Solution: "Drill-Down" Interaction

Instead of "Tab A vs Tab B", we treat the Right Panel as a dynamic context container.

**State 1: Navigation Mode (The "Parent")**
*   **Content:** The list of all Surveys (Cervezas, Vinos, etc.).
*   **When visible?** By default, or when explicitly navigating.

**State 2: Inspector Mode (The "Child")**
*   **Content:** The Photo / Bounding Boxes.
*   **When visible?** **Automatically** when a user clicks a specific Rule row in the center table.
*   **The Fix:** This view must have a **clear, prominent '← Back to Surveys' button** at the very top.

**REX Client:** "So... I click a rule, the panel changes to the photo instantly? Good. I verify. Then what?"

**Sr. UX Designer:** "Then you have two choices:
1.  Click the 'Back' button to see the list again.
2.  (Better) We leave the **Survey Icons** visible as a thin strip on the left (the 'Collapsible' idea from earlier), so even when viewing photos, you can ONE-CLICK switch to 'Vinos'.

**PM:** "The 'Collapsed Strip' + 'Inspector' combo? That sounds complex to build."

**Sr. UX Designer:** "It's the most robust. It keeps **Global Navigation** (Icons) always available, while the **Panel Body** swaps between 'Survey Details' and 'Photo Evidence'."

---

### 🚀 Recommended Action Plan

We refactor `NEW-DESIGN-02` to use this **Drill-Down Pattern**:

1.  **Remove the Tabs.** They are conceptually wrong.
2.  **Default View:** Survey List (Rich view with progress bars).
3.  **Action:** Clicking a Rule in the center -> Slides the Right Panel into **"Evidence View"**.
4.  **Evidence View Header:** Replaces "Contenidos" with a **"← Back to List"** button.
5.  **Bonus:** If we really want speed, we keep the **Icon Strip** generic (like design 1) visible *next* to this panel, so you never lose high-level nav.

**Does this Drill-Down approach align better with your mental model?**
