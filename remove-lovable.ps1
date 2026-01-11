# Script to Remove Lovable from Git History
# Run this script in PowerShell from the insight-hub directory

Write-Host "Removing Lovable from Git history..." -ForegroundColor Yellow

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found. Please run this script from the insight-hub directory." -ForegroundColor Red
    exit 1
}

# Backup current remote URL if exists
$remoteUrl = ""
if (Test-Path ".git") {
    $remoteUrl = git remote get-url origin 2>$null
    Write-Host "Current remote: $remoteUrl" -ForegroundColor Cyan
}

# Remove old Git history
if (Test-Path ".git") {
    Write-Host "Removing old Git history..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .git
}

# Initialize fresh repository
Write-Host "Initializing fresh Git repository..." -ForegroundColor Green
git init

# Add all files
Write-Host "Adding all files..." -ForegroundColor Green
git add .

# Create initial commit
Write-Host "Creating initial commit..." -ForegroundColor Green
$commitMessage = "Initial commit: TruthCrew - Misinformation verification platform"
git commit -m $commitMessage

# Set main branch
git branch -M main

# Add remote if it existed
if ($remoteUrl) {
    Write-Host "Adding remote: $remoteUrl" -ForegroundColor Cyan
    git remote add origin $remoteUrl
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Review the changes: git log" -ForegroundColor White
    Write-Host "2. Push to GitHub: git push -u origin main --force" -ForegroundColor White
    Write-Host "   (WARNING: --force will overwrite existing history on GitHub)" -ForegroundColor Red
} else {
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Add your GitHub remote: git remote add origin <your-repo-url>" -ForegroundColor White
    Write-Host "2. Push to GitHub: git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "Done! Lovable bot will be removed from contributors after you push." -ForegroundColor Green

