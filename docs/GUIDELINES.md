# Documentation Guidelines & Workflow

This document defines how to maintain and update the project documentation system for consistency and effectiveness.

## 📁 File Structure & Purpose

### Core Documentation Files
```
docs/
├── README.md           # Project overview, setup, getting started
├── ROADMAP.md          # High-level phases, timeline, status overview
├── CURRENT_SPRINT.md   # Active work only (10-15 tasks max)
├── COMPLETED.md        # Historical archive of finished work
├── BACKLOG.md          # Future ideas, nice-to-haves, research topics
├── TECHNICAL_NOTES.md  # Patterns, decisions, architecture notes
└── GUIDELINES.md       # This file - how to maintain documentation
```

### Phase Files Directory
```
docs/phases/
├── PHASE_1_SVG_IMPORT.md
├── PHASE_2_ANIMATION_TARGETING.md
├── PHASE_3_EFFECTS_LIBRARY.md
└── PHASE_4_TIMELINE_CONTROLS.md
```

## 📋 Content Guidelines

### README.md Rules
- **Project overview** - Clear description of what SVG Studio does
- **Quick start** - Installation and basic usage instructions
- **Current status** - High-level project state and next milestones
- **Documentation links** - Navigation to other documentation files
- **Tech stack** - Key technologies and versions
- **Update frequency** - When major project changes occur

### ROADMAP.md Rules
- **Keep high-level** - No implementation details, only strategic overview
- **Use status emojis** - ✅ (completed), 🔄 (in progress), ⏳ (planned), 🚫 (blocked)
- **Include dates** - Start/completion dates for accurate tracking
- **Link to phase files** - Always reference detailed documentation
- **Update immediately** - When phase status changes
- **Success criteria** - Clear, measurable goals for each phase

### CURRENT_SPRINT.md Rules
- **Maximum 15 tasks** - If more, break into sub-phases or defer to backlog
- **Only current phase** - No future or past work cluttering the view
- **Actionable tasks** - Clear, specific, measurable items
- **Update daily** - Mark progress as work is completed
- **Include blockers** - Note what's preventing progress
- **Definition of done** - Clear completion criteria

### Phase File Rules
- **Complete context** - All information needed to understand and implement the phase
- **Technical depth** - Implementation details, decisions, rationale
- **Clear status** - Always show current state at the top of file
- **Preserve history** - Don't delete content, update in place
- **Lessons learned** - Add insights when completing phase
- **Link to related phases** - Previous/next phase navigation

### COMPLETED.md Rules
- **Summarize achievements** - What was built, not detailed how
- **Include metrics** - Timeline, performance, key numbers
- **Preserve lessons** - What worked, what didn't, insights gained
- **Link to phase files** - For detailed technical context
- **Chronological order** - Most recent work first
- **Archive format** - Consistent structure for all completed work

### BACKLOG.md Rules
- **Future focus** - Ideas not part of current 4-phase plan
- **Categorize ideas** - Group by type (features, research, platform, etc.)
- **No detailed planning** - High-level concepts only
- **Evaluation criteria** - How to assess ideas for promotion to roadmap
- **Review schedule** - Quarterly review and update process

### TECHNICAL_NOTES.md Rules
- **Implementation guidance** - Patterns and decisions that guide development
- **Code examples** - Concrete examples of preferred approaches
- **Architecture decisions** - Why certain technologies/patterns were chosen
- **Performance guidelines** - Optimization strategies and considerations
- **Update as needed** - When new patterns emerge or decisions change

## 🔄 Workflow Processes

### Starting a New Phase
1. **Update ROADMAP.md** - Change phase status from ⏳ to 🔄 with start date
2. **Update phase file** - Change status to 🔄 and add start date
3. **Clear CURRENT_SPRINT.md** - Remove previous phase tasks
4. **Add current tasks** - Copy actionable tasks from phase file (max 15)
5. **Set expectations** - Update timeline and success criteria

### During Development
1. **Work from CURRENT_SPRINT.md** - Daily task reference and updates
2. **Update task status** - Mark [x] as tasks are completed
3. **Add notes to phase file** - Technical decisions, issues, insights
4. **Update blockers** - Note impediments in CURRENT_SPRINT.md
5. **Keep phase file current** - Progress updates, decisions, learnings

### Completing a Phase
1. **Update phase file status** - 🔄 to ✅ with completion date and duration
2. **Add lessons learned** - What worked, what didn't, key insights
3. **Update ROADMAP.md** - Mark phase ✅, start next phase 🔄
4. **Archive in COMPLETED.md** - Summary with key achievements and metrics
5. **Clear CURRENT_SPRINT.md** - Prepare for next phase tasks
6. **Update README.md** - Reflect new project status if significant milestone

### Adding Future Ideas
1. **Use BACKLOG.md** - Don't clutter current work with future ideas
2. **Categorize appropriately** - Features, research, platform expansion, etc.
3. **No detailed planning** - High-level concepts and rationale only
4. **Include evaluation notes** - Why this might be valuable
5. **Review quarterly** - Assess for promotion to active roadmap

## 📝 Writing Standards

### Task Format
```markdown
- [ ] **Clear action verb + specific outcome**
  - Implementation approach or key considerations
  - Acceptance criteria or definition of done
  - Dependencies or prerequisites if any
```

### Status Indicators
- **✅ COMPLETED** - Finished and working correctly
- **🔄 IN PROGRESS** - Currently active work
- **⏳ PLANNED** - Future work, not yet started
- **🚫 BLOCKED** - Cannot proceed, needs resolution
- **⏸️ PAUSED** - Temporarily stopped (rare)

### Date Format
- **Standard format**: "January 15, 2025" (full month name, day, year)
- **Always include completion dates** for tracking and metrics
- **Duration tracking**: "5 days actual vs 7 days planned" when possible
- **Be consistent** across all documentation files

### Linking Conventions
- **Phase references**: `[PHASE_1_SVG_IMPORT.md](phases/PHASE_1_SVG_IMPORT.md)`
- **Internal links**: Use relative paths from current file location
- **External links**: Include context about why the link is relevant
- **Broken link prevention**: Verify links when moving or renaming files

## 📊 Quality Checklist

### Before Committing Documentation Changes
- [ ] All status indicators are current and accurate
- [ ] CURRENT_SPRINT.md has ≤15 tasks and is focused
- [ ] Phase files show current status at the top
- [ ] Links between documents work correctly
- [ ] Dates are included for all status changes
- [ ] No implementation details leaked into ROADMAP.md
- [ ] Technical decisions documented in appropriate files

### Weekly Documentation Review
- [ ] ROADMAP.md reflects actual project progress
- [ ] CURRENT_SPRINT.md is focused and actionable
- [ ] Completed work properly archived in COMPLETED.md
- [ ] Lessons learned captured in phase files
- [ ] Next phase prepared if current phase nearing completion
- [ ] README.md status section is current

### Monthly Documentation Health Check
- [ ] All files follow established guidelines
- [ ] Content distribution is appropriate (strategic vs tactical vs technical)
- [ ] Documentation supports both current work and onboarding
- [ ] Links and references are current and functional
- [ ] File sizes remain manageable and focused

## 🎯 Phase File Template

```markdown
# PHASE X: [Phase Name]

**Status**: ⏳ Planned  
**Goal**: [Clear, measurable goal statement]  
**Timeline**: [Estimated duration]  
**Previous Phase**: [Link to previous phase file]  
**Next Phase**: [Link to next phase file]

## Overview
[2-3 sentences describing what this phase accomplishes and why it's important]

## Technical Requirements
[Key technical considerations, constraints, and dependencies]

## Detailed Tasks
- [ ] **Task 1 with clear outcome**
  - Implementation approach or key considerations
  - Acceptance criteria or definition of done
  
- [ ] **Task 2 with specific deliverable**
  - Technical approach and considerations
  - Success criteria

## Technical Decisions
[Record important technical decisions made during planning/development]

## Performance Considerations
[Any performance requirements, optimizations, or concerns]

## Definition of Done
- [ ] [Specific, testable criteria]
- [ ] [User can accomplish X]
- [ ] [System performs at Y level]

## Testing Requirements
[How to verify the phase is complete and working correctly]

## Notes & Issues
[Running log of problems encountered, solutions found, insights gained]

## Lessons Learned
[To be filled when phase completes - what worked, what didn't, insights for future]
```

## ⚠️ Common Mistakes to Avoid

### Documentation Anti-Patterns
- ❌ **Implementation details in ROADMAP.md** - Keep strategic, not tactical
- ❌ **CURRENT_SPRINT.md growing beyond 15 tasks** - Break into smaller phases
- ❌ **Deleting completed phase files** - Archive, don't delete
- ❌ **Mixing current and future work** - Separate current from backlog
- ❌ **Forgetting to update status indicators** - Update immediately when status changes
- ❌ **Skipping lessons learned** - Always capture insights when completing work

### Content Distribution Errors
- ❌ **Technical details in README.md** - Keep high-level overview only
- ❌ **Future ideas in CURRENT_SPRINT.md** - Use BACKLOG.md for future work
- ❌ **Tactical tasks in ROADMAP.md** - Use phase files for detailed tasks
- ❌ **Architecture notes in phase files** - Use TECHNICAL_NOTES.md for patterns

### Process Violations
- ❌ **Working without updating CURRENT_SPRINT.md** - Keep documentation current
- ❌ **Completing phases without archiving** - Always update COMPLETED.md
- ❌ **Starting new phases without preparation** - Update all relevant files
- ❌ **Ignoring documentation guidelines** - Consistency is crucial for team work

## 🔄 Maintenance Schedule

### Daily (During Active Development)
- Update task status in CURRENT_SPRINT.md
- Add notes to phase files as decisions are made
- Update blockers and issues as they arise

### Weekly
- Review and update all status indicators
- Ensure documentation reflects actual progress
- Prepare next phase if current phase nearing completion

### Monthly
- Comprehensive documentation health check
- Review and update guidelines if needed
- Archive old completed work if files getting large

### Quarterly
- Review BACKLOG.md for ideas to promote
- Assess documentation system effectiveness
- Update guidelines based on lessons learned

---

*These guidelines ensure documentation remains useful, current, and navigable as the project grows.*

*Last updated: August 27, 2025*
