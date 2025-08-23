# Research Progress Refactoring - TODO List

**Date: 2025-08-23**

## 🎯 **Project Goal**
Refactor research progress handling to achieve clear separation of concerns and integrate live SSE events.

## 📋 **Current Status**
- ✅ **Phase 1 Complete**: ResearchProgressManager created and integrated
- ✅ **Phase 1 Tested**: New progress manager working with simulation
- 🔄 **Phase 2 In Progress**: Complete separation of concerns
- ⏳ **Phase 3 Pending**: Live SSE event integration

---

## 🚀 **Phase 1: Foundation Refactoring** ✅ COMPLETED
- [x] Create ResearchProgressManager class
- [x] Move progress simulation logic to manager
- [x] Comment out old code (conservative approach)
- [x] Test new implementation
- [x] Verify functionality works end-to-end

---

## 🔧 **Phase 2: Complete Separation of Concerns** 🔄 IN PROGRESS
- [ ] **Move SSE event handling to ResearchProgressManager**
  - [ ] Move `research_complete` event handler
  - [ ] Move `progress_update` event handler  
  - [ ] Move `collection_started` event handler
  - [ ] Move `sources_found` event handler
  - [ ] Move `research_findings` event handler

- [ ] **Make ResearchProgress component self-contained**
  - [ ] Move progress rendering logic to component
  - [ ] Let component manage its own state
  - [ ] Remove progress logic from Research.tsx

- [ ] **Clean up Research.tsx**
  - [ ] Remove all progress-related logic
  - [ ] Focus only on research flow orchestration
  - [ ] Keep only high-level state management

- [ ] **Test Phase 2**
  - [ ] Verify SSE events handled by manager
  - [ ] Verify progress component self-contained
  - [ ] Verify Research.tsx is clean

---

## ⚡ **Phase 3: Live SSE Event Integration** ⏳ PENDING
- [ ] **Replace simulation with live SSE events**
  - [ ] Update ResearchProgressManager to handle real SSE events
  - [ ] Remove simulation logic
  - [ ] Map SSE events to progress steps
  - [ ] Handle real-time progress updates

- [ ] **Test live integration**
  - [ ] Verify progress updates with real SSE data
  - [ ] Test error handling for SSE events
  - [ ] Verify smooth transition from simulation to live

---

## 🧪 **Testing Checklist**
- [ ] New research session flow
- [ ] Existing session loading flow  
- [ ] Progress steps display correctly
- [ ] Company overview renders after completion
- [ ] Research topics appear properly
- [ ] No lingering progress messages
- [ ] Error handling works
- [ ] Performance is acceptable

---

## 📝 **Git Commits Strategy**
1. **Commit Phase 1** - Foundation refactoring complete
2. **Commit Phase 2** - Separation of concerns complete  
3. **Commit Phase 3** - Live SSE integration complete
4. **Final commit** - Clean up and documentation

---

## 🎯 **Success Criteria**
- [ ] Research.tsx under 500 lines (currently 1000+)
- [ ] Clear separation of concerns
- [ ] Progress component self-contained
- [ ] Live SSE events working
- [ ] All existing functionality preserved
- [ ] Easy to maintain and extend

---

## 📚 **Files Involved**
- `src/pages/Research.tsx` - Main research flow (target: <500 lines)
- `src/components/research/ResearchProgressManager.tsx` - Progress logic & SSE handling
- `src/components/research/ResearchProgress.tsx` - Progress UI component
- `src/components/research/CompanyProgressSteps.tsx` - Old simulation logic (to be removed)

---

**Last Updated: 2025-08-23**
**Status: Phase 2 In Progress**
