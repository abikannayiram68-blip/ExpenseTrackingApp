Add-Type -AssemblyName System.Drawing

$assetDir = Join-Path $PSScriptRoot '..\src\assets\images'
New-Item -ItemType Directory -Force -Path $assetDir | Out-Null

function New-RoundedRect {
  param([float]$X, [float]$Y, [float]$W, [float]$H, [float]$R)
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $d = $R * 2
  $path.AddArc($X, $Y, $d, $d, 180, 90)
  $path.AddArc($X + $W - $d, $Y, $d, $d, 270, 90)
  $path.AddArc($X + $W - $d, $Y + $H - $d, $d, $d, 0, 90)
  $path.AddArc($X, $Y + $H - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function Draw-AppIcon {
  param(
    [System.Drawing.Graphics]$G,
    [int]$Size,
    [bool]$TransparentBackground = $false
  )

  $G.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $G.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $G.Clear([System.Drawing.Color]::Transparent)

  if (-not $TransparentBackground) {
    $bg = New-RoundedRect 0 0 $Size $Size ($Size * 0.18)
    $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
      [System.Drawing.RectangleF]::new(0, 0, $Size, $Size),
      [System.Drawing.Color]::FromArgb(255, 124, 64, 255),
      [System.Drawing.Color]::FromArgb(255, 0, 118, 255),
      35
    )
    $G.FillPath($brush, $bg)
    $brush.Dispose()
    $bg.Dispose()
  }

  $scale = $Size / 1024
  function S([double]$v) { return [float]($v * $scale) }

  $cyan = [System.Drawing.Color]::FromArgb(255, 39, 232, 226)
  $blueDark = [System.Drawing.Color]::FromArgb(255, 12, 35, 132)
  $green = [System.Drawing.Color]::FromArgb(255, 20, 215, 158)
  $yellow = [System.Drawing.Color]::FromArgb(255, 255, 198, 34)
  $orange = [System.Drawing.Color]::FromArgb(255, 255, 126, 26)
  $white = [System.Drawing.Color]::White
  $rupee = [string][char]0x20B9

  $ringPen = [System.Drawing.Pen]::new($cyan, (S 16))
  $G.DrawArc($ringPen, (S 116), (S 114), (S 812), (S 812), 205, 300)
  $ringPen.Dispose()

  $arrowPen = [System.Drawing.Pen]::new($white, (S 18))
  $arrowPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $arrowPen.EndCap = [System.Drawing.Drawing2D.LineCap]::ArrowAnchor
  $G.DrawCurve($arrowPen, @(
    [System.Drawing.PointF]::new((S 78), (S 602)),
    [System.Drawing.PointF]::new((S 150), (S 560)),
    [System.Drawing.PointF]::new((S 214), (S 486)),
    [System.Drawing.PointF]::new((S 282), (S 402))
  ))
  $arrowPen.Dispose()

  $barColors = @(
    [System.Drawing.Color]::FromArgb(255, 26, 185, 255),
    [System.Drawing.Color]::FromArgb(255, 38, 219, 232),
    [System.Drawing.Color]::FromArgb(255, 32, 217, 170),
    [System.Drawing.Color]::FromArgb(255, 75, 236, 135)
  )
  for ($i = 0; $i -lt 4; $i++) {
    $x = S(76 + ($i * 58))
    $h = S(104 + ($i * 44))
    $y = S(742) - $h
    $rect = New-RoundedRect $x $y (S 42) $h (S 9)
    $b = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
      [System.Drawing.RectangleF]::new($x, $y, (S 42), $h),
      $barColors[$i],
      [System.Drawing.Color]::FromArgb(255, 0, 91, 231),
      90
    )
    $G.FillPath($b, $rect)
    $b.Dispose()
    $rect.Dispose()
  }

  $receipt = New-RoundedRect (S 318) (S 205) (S 410) (S 610) (S 50)
  $receiptBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.RectangleF]::new((S 318), (S 205), (S 410), (S 610)),
    [System.Drawing.Color]::FromArgb(255, 255, 255, 255),
    [System.Drawing.Color]::FromArgb(255, 232, 239, 255),
    90
  )
  $G.FillPath($receiptBrush, $receipt)
  $receiptBrush.Dispose()
  $receipt.Dispose()

  $fontExpense = [System.Drawing.Font]::new('Arial', (S 58), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $fontTracker = [System.Drawing.Font]::new('Arial', (S 58), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $G.DrawString('EXPENSE', $fontExpense, [System.Drawing.SolidBrush]::new($blueDark), (S 362), (S 258))
  $G.DrawString('TRACKER', $fontTracker, [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 0, 171, 183)), (S 362), (S 332))
  $fontExpense.Dispose()
  $fontTracker.Dispose()

  $smallFont = [System.Drawing.Font]::new('Arial', (S 32), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $linePen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 165, 180, 236), (S 12))
  $linePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $linePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $rows = @(
    @{Y=455; C=[System.Drawing.Color]::FromArgb(255, 0, 183, 176); T=($rupee + '1,250')},
    @{Y=535; C=[System.Drawing.Color]::FromArgb(255, 29, 116, 245); T=($rupee + '850')},
    @{Y=615; C=$yellow; T=($rupee + '2,400')},
    @{Y=695; C=[System.Drawing.Color]::FromArgb(255, 95, 64, 255); T=($rupee + '600')}
  )
  foreach ($row in $rows) {
    $dotBrush = [System.Drawing.SolidBrush]::new($row.C)
    $G.FillEllipse($dotBrush, (S 345), (S($row.Y - 19)), (S 50), (S 50))
    $dotBrush.Dispose()
    $G.DrawLine($linePen, (S 425), (S $row.Y), (S 555), (S $row.Y))
    $G.DrawLine($linePen, (S 425), (S($row.Y + 28)), (S 515), (S($row.Y + 28)))
    $G.DrawString($row.T, $smallFont, [System.Drawing.SolidBrush]::new($blueDark), (S 600), (S($row.Y - 17)))
  }
  $linePen.Dispose()
  $smallFont.Dispose()

  $pieCenter = [System.Drawing.PointF]::new((S 794), (S 506))
  $pieRect = [System.Drawing.RectangleF]::new((S 670), (S 382), (S 248), (S 248))
  $segments = @(
    @{S=280; A=100; C=$green},
    @{S=20; A=62; C=[System.Drawing.Color]::FromArgb(255, 27, 167, 255)},
    @{S=82; A=60; C=$yellow},
    @{S=142; A=48; C=[System.Drawing.Color]::FromArgb(255, 255, 76, 78)},
    @{S=190; A=90; C=[System.Drawing.Color]::FromArgb(255, 24, 91, 218)}
  )
  foreach ($seg in $segments) {
    $b = [System.Drawing.SolidBrush]::new($seg.C)
    $G.FillPie($b, $pieRect.X, $pieRect.Y, $pieRect.Width, $pieRect.Height, $seg.S, $seg.A)
    $b.Dispose()
  }
  $G.DrawEllipse([System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 168, 224, 255), (S 5)), $pieRect)

  for ($i = 0; $i -lt 4; $i++) {
    $coin = [System.Drawing.RectangleF]::new((S(236 + $i * 34)), (S(742 - $i * 25)), (S 162), (S 54))
    $coinBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($coin, $yellow, $orange, 90)
    $G.FillEllipse($coinBrush, $coin)
    $G.DrawEllipse([System.Drawing.Pen]::new($orange, (S 4)), $coin)
    $coinBrush.Dispose()
  }
  $rupeeCoin = [System.Drawing.RectangleF]::new((S 384), (S 710), (S 152), (S 152))
  $coinBrush2 = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rupeeCoin, $yellow, $orange, 45)
  $G.FillEllipse($coinBrush2, $rupeeCoin)
  $G.DrawEllipse([System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 255, 233, 62), (S 8)), $rupeeCoin)
  $coinBrush2.Dispose()
  $rupeeFont = [System.Drawing.Font]::new('Arial', (S 98), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $G.DrawString($rupee, $rupeeFont, [System.Drawing.SolidBrush]::new($white), (S 424), (S 725))
  $rupeeFont.Dispose()

  $calc = New-RoundedRect (S 673) (S 610) (S 238) (S 235) (S 28)
  $calcBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.RectangleF]::new((S 673), (S 610), (S 238), (S 235)),
    [System.Drawing.Color]::FromArgb(255, 20, 54, 159),
    [System.Drawing.Color]::FromArgb(255, 4, 25, 98),
    35
  )
  $G.FillPath($calcBrush, $calc)
  $calcBrush.Dispose()
  $calc.Dispose()
  $screen = New-RoundedRect (S 705) (S 640) (S 160) (S 54) (S 10)
  $G.FillPath([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 96, 209, 240)), $screen)
  $screen.Dispose()
  $calcFont = [System.Drawing.Font]::new('Arial', (S 46), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $G.DrawString($rupee, $calcFont, [System.Drawing.SolidBrush]::new($blueDark), (S 813), (S 640))
  $calcFont.Dispose()
  $buttonLabels = @('+','T','-','x','/','=')
  for ($i = 0; $i -lt 6; $i++) {
    $col = $i % 3
    $row = [Math]::Floor($i / 3)
    $rect = New-RoundedRect (S(705 + $col * 62)) (S(714 + $row * 66)) (S 48) (S 48) (S 8)
    $btnColor = if ($buttonLabels[$i] -eq '=') { $orange } else { [System.Drawing.Color]::FromArgb(255, 35, 76, 180) }
    $G.FillPath([System.Drawing.SolidBrush]::new($btnColor), $rect)
    $btnFont = [System.Drawing.Font]::new('Arial', (S 40), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $G.DrawString($buttonLabels[$i], $btnFont, [System.Drawing.SolidBrush]::new($white), (S(718 + $col * 62)), (S(714 + $row * 66)))
    $btnFont.Dispose()
    $rect.Dispose()
  }
}

function Save-Icon {
  param([string]$Path, [int]$Size, [bool]$TransparentBackground = $false)
  $bitmap = [System.Drawing.Bitmap]::new($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  Draw-AppIcon $graphics $Size $TransparentBackground
  $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
}

Save-Icon (Join-Path $assetDir 'icon.png') 1024 $false
Save-Icon (Join-Path $assetDir 'adaptive-icon.png') 1024 $false
Save-Icon (Join-Path $assetDir 'splash.png') 1024 $true
Save-Icon (Join-Path $assetDir 'favicon.png') 128 $false

Write-Host "Generated ExpenseTracker app assets in $assetDir"
