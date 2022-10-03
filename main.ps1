Set-Location $env:GITHUB_WORKSPACE

cargo outdated -v --exit-code 1 --color Always

if ($LASTEXITCODE -eq 0) {
    exit
}

# send discord

$content = (cargo outdated --root-deps-only)
$body = @{
    "username" = $env:GITHUB_REPOSITORY
    "content" = $content
}

Invoke-WebRequest `
    -Method Post `
    -ContentType "application/json" `
    -Body ($body | ConvertTo-Json )  `
    -Uri $env:INPUT_DISCORD_WEBHOOK_URL