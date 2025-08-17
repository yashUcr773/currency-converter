# Development Tools

This folder contains development and testing utilities that were moved from the root directory to keep the production codebase clean.

## Files

### Test Pages
- `test-backend.html` - Backend API connection testing
- `test-sync.html` - Cloud synchronization testing  
- `test-multi-device.html` - Multi-device sync testing

### Debug Utilities
- `debug.html` - Debug interface for localStorage inspection
- `storageDebug.ts` - Storage debugging utilities

## Usage

These tools are intended for development and debugging purposes only. They are not included in the production build.

### Running Test Pages
1. Start the development server
2. Navigate to `/dev-tools/` in your browser
3. Open the specific test file you need

### Using Debug Tools
The debug utilities provide:
- localStorage inspection
- Data import/export functionality
- Storage state visualization
- Migration testing

## Notes

- These files were moved from the root directory as part of code organization improvements
- They should not be deployed to production
- Consider adding proper test framework integration in the future
