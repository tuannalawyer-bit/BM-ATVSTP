# Read and parse the HAR file
Write-Host "Reading HAR file..."
$raw = Get-Content -Raw -Path "d:\AI\BM ATVSTP\ops.winmart.vn.har" -Encoding UTF8
$har = $raw | ConvertFrom-Json

Write-Host "Finding GET requests in ops.winmart.vn..."
$gets = $har.log.entries | Where-Object { 
    $_.request.method -eq 'GET' -and $_.request.url -like '*ops.winmart.vn*'
}

Write-Host "Total GET requests found: $($gets.Count)"
Write-Host "----------------------------------------"

foreach ($g in $gets) {
    Write-Host "URL: $($g.request.url)"
    Write-Host "Status: $($g.response.status)"
    Write-Host "----------------------------------------"
}
