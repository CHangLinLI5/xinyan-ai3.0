# Test Notes - Mobile Flow Fix

## Desktop Home - OK
- Desktop layout uses page-locked, looks perfect
- Hero image, floating cards, nav all working

## Mobile Home - Fixed
- Changed from page-locked to natural flow (min-h-[100dvh] flex-col)
- Removed flex-1 spacer that caused huge white gap
- Content flows naturally without viewport lock
- Bottom padding accounts for TabBar + safe area
