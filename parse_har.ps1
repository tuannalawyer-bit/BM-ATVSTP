# Read and parse the HAR file
Write-Host "Reading HAR file..."
$raw = Get-Content -Raw -Path "d:\AI\BM ATVSTP\ops.winmart.vn.har" -Encoding UTF8
Write-Host "Parsing JSON..."
$har = $raw | ConvertFrom-Json

Write-Host "Finding POST requests..."
$posts = $har.log.entries | Where-Object { $_.request.method -eq 'POST' }

Write-Host "Total POST requests found: $($posts.Count)"
Write-Host "----------------------------------------"

foreach ($p in $posts) {
    Write-Host "URL: $($p.request.url)"
    Write-Host "Status: $($p.response.status)"
    
    # Get Content-Type
    $contentType = ($p.request.headers | Where-Object { $_.name -like 'content-type' }).value
    Write-Host "Content-Type: $contentType"
    
    # Get payload text if exists
    if ($p.request.postData.text) {
        $text = $p.request.postData.text
        if ($text.Length -gt 1000) {
            Write-Host "Payload (truncated): $($text.Substring(0, 1000))..."
        } else {
            Write-Host "Payload: $text"
        }
    } else {
        Write-Host "Payload: [Empty]"
    }
    Write-Host "----------------------------------------"
}
