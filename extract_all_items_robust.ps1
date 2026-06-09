# Read HTML and parse all rows in step2 table
$fileObj = Get-ChildItem -Path "d:\AI\BM ATVSTP" -Filter "*Checklist*.html" | Select-Object -First 1
$content = Get-Content -Raw -Path $fileObj.FullName -Encoding UTF8

# Let's extract everything inside the tbody of the table
$startTbody = $content.IndexOf("<tbody>")
$endTbody = $content.IndexOf("</tbody>", $startTbody)
$tbody = $content.Substring($startTbody, $endTbody - $startTbody)

# Split by <tr>
$rows = $tbody -split "<tr>|<tr\s+[^>]*>"

Write-Host "Total rows found: $($rows.Count)"
$items = @()
$currentSection = "I. CLEAN"

foreach ($row in $rows) {
    if ($row -match "colspan=`"7`"") {
        # This is a section divider row like:
        # <td style="background: #f7f7a6  !important"></td>
        # <td class="" style="background: #f7f7a6 !important" colspan="7">
        # <p class="bold">I. CLEAN</p>
        # </td>
        if ($row -match '<p class="bold">\s*(.*?)\s*</p>') {
            $currentSection = $Matches[1].Trim()
            Write-Host "New Section: $currentSection"
        }
        continue
    }
    
    # Check if this is a standard item row
    # It must contain a cell: <td class="sub_col">Number</td>
    if ($row -match '(?s)<td class="sub_col">(\d+)</td>') {
        $num = $Matches[1]
        
        # Now parse the second cell containing group, code, and description
        # <td style="max-width:500px;"> ... </td>
        if ($row -match '(?s)<td style="max-width:500px;">(.*?)</td>') {
            $cell2 = $Matches[1]
            
            # Inside cell2, find all <p> tags
            $pMatches = [regex]::Matches($cell2, '(?s)<p[^>]*>(.*?)</p>')
            if ($pMatches.Count -ge 2) {
                $group = $pMatches[0].Groups[1].Value.Trim()
                $p2 = $pMatches[1].Groups[1].Value
                
                # Check if p2 contains code and description separated by <br/> or space
                # Example: C1.1 <br/>Vỉa hè...
                $code = ""
                $desc = ""
                
                # Decode HTML entities
                $group = $group -replace '&#234;', 'ê' -replace '&#225;', 'á' -replace '&#224;', 'à' -replace '&#237;', 'í'
                $p2 = $p2 -replace '&#234;', 'ê' -replace '&#225;', 'á' -replace '&#224;', 'à' -replace '&#237;', 'í'
                
                if ($p2 -match '^\s*([A-Z0-9\.]+)\s*(?:<br\s*/?>)?\s*(.*)$') {
                    $code = $Matches[1].Trim()
                    $desc = $Matches[2].Replace("<br/>", " ").Replace("<br />", " ").Trim()
                } else {
                    $code = "ERR"
                    $desc = $p2.Trim()
                }
                
                # Clean up desc tags
                $desc = [regex]::Replace($desc, '<[^>]*>', '')
                $group = [regex]::Replace($group, '<[^>]*>', '')
                
                $items += [PSCustomObject]@{
                    num = $num
                    code = $code
                    group = $group
                    desc = $desc
                    section = $currentSection
                }
            }
        }
    }
}

$json = $items | ConvertTo-Json -Depth 4
$json | Out-File -FilePath "d:\AI\BM ATVSTP\extracted_items_robust.json" -Encoding UTF8
Write-Host "Extracted $($items.Count) items successfully."
