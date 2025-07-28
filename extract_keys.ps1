# Extract translation keys from the codebase
$keys = @()

# Find all t('...') patterns
$files = Get-ChildItem -Path "src" -Include "*.tsx", "*.ts" -Recurse | Where-Object { $_.FullName -notmatch "node_modules" }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Match t('key') and t("key") patterns
    $matches = [regex]::Matches($content, "t\(['""]([^'""]+)['""]")
    foreach ($match in $matches) {
        $key = $match.Groups[1].Value
        if ($key -notmatch "^(GET|POST|PUT|DELETE|http)" -and $key.Contains('.')) {
            $keys += $key
        }
    }
    
    # Match t('key', options) patterns with parameters
    $matches = [regex]::Matches($content, "t\(['""]([^'""]+)['""], \{[^}]+\}")
    foreach ($match in $matches) {
        $key = $match.Groups[1].Value
        if ($key -notmatch "^(GET|POST|PUT|DELETE|http)" -and $key.Contains('.')) {
            $keys += $key
        }
    }
    
    # Match returnObjects: true patterns
    $matches = [regex]::Matches($content, "t\(['""]([^'""]+)['""], \{[^}]*returnObjects: true[^}]*\}")
    foreach ($match in $matches) {
        $key = $match.Groups[1].Value
        if ($key -notmatch "^(GET|POST|PUT|DELETE|http)" -and $key.Contains('.')) {
            $keys += $key
        }
    }
}

# Remove duplicates and sort
$uniqueKeys = $keys | Sort-Object | Get-Unique

Write-Output "Translation keys found in code:"
Write-Output "================================"
$uniqueKeys | ForEach-Object { Write-Output $_ }

Write-Output ""
Write-Output "Total unique keys: $($uniqueKeys.Count)"
