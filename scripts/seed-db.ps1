# seed-db.ps1 - Seed basic development data into PostgreSQL
Write-Host "🌱 Seeding local database..." -ForegroundColor Magenta

# Check for psql
if (!(Get-Command psql -ErrorAction SilentlyContinue)) {
    Write-Error "PostgreSQL 'psql' not found. Please install PostgreSQL or use Docker Desktop."
    exit 1
}

# Example seeding logic using psql (assuming Docker is UP)
$env:PGPASSWORD = "password123"
psql -h localhost -p 5433 -U admin -d saas_db -c "INSERT INTO users (email, name) VALUES ('dev@example.com', 'Dev User') ON CONFLICT DO NOTHING;"

Write-Host "✅ Seeding complete." -ForegroundColor Green
