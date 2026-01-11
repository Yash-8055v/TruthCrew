# Remove Lovable from Git History

The "lovable-dev[bot]" contributor appears in GitHub because of Git commit history, not code files.

## Quick Fix: Create Fresh Git History

Run these commands in the `insight-hub` directory:

```bash
# Navigate to project
cd insight-hub

# Remove old Git history (if exists)
rm -rf .git

# Initialize fresh repository
git init

# Add all files
git add .

# Create initial commit with your name
git commit -m "Initial commit: TruthCrew - Misinformation verification platform" --author="Your Name <your.email@example.com>"

# Set main branch
git branch -M main

# Add your GitHub repository (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Force push to replace history (WARNING: This will overwrite existing history)
git push -u origin main --force
```

## Alternative: If you want to keep the repository URL

1. Go to your GitHub repository
2. Go to Settings → General → Scroll to "Danger Zone"
3. Click "Delete this repository" (or create a new one)
4. Create a new repository with the same name
5. Follow the commands above

## Verify

After pushing, check GitHub:
- Contributors should only show your account
- No "lovable-dev[bot]" should appear
- All code remains the same, only history is fresh

