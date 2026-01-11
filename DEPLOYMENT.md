# Deployment Instructions

## Removing Lovable from Git History

The "lovable-dev[bot]" contributor appears because of Git commit history. To remove it completely:

### Option 1: Fresh Start (Recommended for Hackathon)
1. Create a new repository on GitHub (or delete and recreate)
2. Initialize fresh Git history:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: TruthCrew - Misinformation verification platform"
   git branch -M main
   git remote add origin <your-new-repo-url>
   git push -u origin main --force
   ```

### Option 2: Rewrite History (Advanced)
If you want to keep the same repository:
```bash
# Create orphan branch (no history)
git checkout --orphan new-main

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: TruthCrew - Misinformation verification platform"

# Delete old main branch
git branch -D main

# Rename current branch to main
git branch -M main

# Force push (WARNING: This rewrites history)
git push -f origin main
```

### Option 3: GitHub Settings
- Go to your repository Settings
- Check if there are any bot integrations that can be removed
- The contributor list will update automatically after new commits

## Current Status
✅ All Lovable code references removed from codebase
✅ All Lovable dependencies removed
✅ Project is production-ready
⚠️ Git history still contains Lovable commits (visible in GitHub contributors)

