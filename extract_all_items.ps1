# Read the HTML file and parse checklist items
$fileObj = Get-ChildItem -Path "d:\AI\BM ATVSTP" -Filter "*Checklist*.html" | Select-Object -First 1
$content = Get-Content -Raw -Path $fileObj.FullName -Encoding UTF8

# Let's search for rows containing checklist items
# An item row usually looks like:
# <tr>
#   <td class="sub_col">X</td>
#   <td style="max-width:500px;">
#     <p>Group Name</p>
#     <p>Code <br/> Description</p>
#     ...
# Let's use Regex to find all these tr blocks and parse them.
# We will look for <tr> tags that contain class="sub_col" followed by a number.
$pattern = '(?s)<tr>\s*<td class="sub_col">(\d+)</td>\s*<td style="max-width:500px;">\s*<p>(.*?)</p>\s*<p>\s*([A-Z0-9\.]+)\s*(?:<br\s*/?>)?\s*(.*?)\s*</p>'
$matches = [regex]::Matches($content, $pattern)

Write-Host "Found $($matches.Count) matches."
$items = @()

foreach ($m in $matches) {
    $num = $m.Groups[1].Value
    $group = $m.Groups[2].Value.Trim()
    $code = $m.Groups[3].Value.Trim()
    $desc = $m.Groups[4].Value.Replace("<br/>", " ").Replace("<br />", " ").Trim()
    
    # We want to determine the Section based on the index or code prefix
    $section = "Other"
    if ($code -like "C*") { $section = "I. CLEAN" }
    elseif ($code -like "P*") { $section = "II. PRODUCT" }
    elseif ($code -like "S*") { $section = "III. DỊCH VỤ" } # Just a guess for service, let's verify later
    
    $items += [PSCustomObject]@{
        num = $num
        code = $code
        group = $group
        desc = $desc
        section = $section
    }
}

# Convert items to JSON
$json = $items | ConvertTo-Json -Depth 4
$json | Out-File -FilePath "d:\AI\BM ATVSTP\extracted_items.json" -Encoding UTF8
Write-Host "Saved extracted items to: d:\AI\BM ATVSTP\extracted_items.json"
