# Import auth-service into a remote GitHub repository.
# Usage:
#   .\import-auth-service.ps1 -RemoteUrl 'https://github.com/AsmaaElfathi/Claude_native.git' -Branch 'main'

param(
    [Parameter(Mandatory = $true)]
    [string]$RemoteUrl,

    [string]$Branch = 'main',

    [string]$SourceFolder = 'auth-service',

    [string]$GitUserName = '',

    [string]$GitUserEmail = '',

    [string]$GitExecutable = ''
)

function Get-GitExecutable {
    if ($GitExecutable -ne '' -and (Test-Path $GitExecutable)) {
        return $GitExecutable
    }

    $gitCommand = Get-Command git -ErrorAction SilentlyContinue
    if ($gitCommand) {
        return $gitCommand.Path
    }

    $commonPaths = @(
        'C:\Program Files\Git\cmd\git.exe',
        'C:\Program Files\Git\bin\git.exe',
        'C:\Program Files (x86)\Git\cmd\git.exe',
        'C:\Program Files (x86)\Git\bin\git.exe'
    )

    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            return $path
        }
    }

    return $null
}

$git = Get-GitExecutable
if (-not $git) {
    Write-Error 'Git n''est pas installé ou n''est pas détecté. Installe Git ou précisez -GitExecutable.'
    exit 1
}

$workspace = Get-Location
$cloneFolder = Join-Path $workspace 'repo-clone'

if (Test-Path $cloneFolder) {
    Write-Host "Suppression du dossier existant '$cloneFolder'..."
    Remove-Item -Recurse -Force $cloneFolder
}

Write-Host "Clonage du dépôt distant $RemoteUrl dans $cloneFolder..."
& $git clone --branch $Branch $RemoteUrl $cloneFolder
if ($LASTEXITCODE -ne 0) {
    Write-Error 'Échec du clone du dépôt distant.'
    exit $LASTEXITCODE
}

Set-Location $cloneFolder

if ($GitUserName -ne '' -and $GitUserEmail -ne '') {
    & $git config user.name "$GitUserName"
    & $git config user.email "$GitUserEmail"
} else {
    $currentName = & $git config user.name
    $currentEmail = & $git config user.email
    if (-not $currentName -or -not $currentEmail) {
        Write-Host 'Aucune identité git locale détectée. Veuillez exécuter le script avec -GitUserName et -GitUserEmail ou configurer Git globalement.'
        exit 1
    }
}

Set-Location $workspace
$sourcePath = Join-Path $workspace $SourceFolder
$targetPath = Join-Path $cloneFolder $SourceFolder

if (-not (Test-Path $sourcePath)) {
    Write-Error "Le dossier source n'existe pas : $sourcePath"
    exit 1
}

Write-Host "Copie du dossier $SourceFolder dans le dépôt cloné..."
if (Test-Path $targetPath) {
    Remove-Item -Recurse -Force $targetPath
}

New-Item -ItemType Directory -Force -Path $targetPath | Out-Null
robocopy $sourcePath $targetPath /E /COPYALL /R:2 /W:2 | Out-Null

Set-Location $cloneFolder

& $git add $SourceFolder
if ($LASTEXITCODE -ne 0) {
    Write-Error 'Erreur lors de l''ajout des fichiers au commit.'
    exit $LASTEXITCODE
}

& $git commit -m 'Import auth-service code'
if ($LASTEXITCODE -eq 0) {
    Write-Host 'Commit créé.'
} else {
    Write-Host 'Aucun changement à committer ou erreur de commit.'
}

& $git push origin $Branch
if ($LASTEXITCODE -ne 0) {
    Write-Error 'Échec du push vers le dépôt distant.'
    exit $LASTEXITCODE
}

Write-Host 'Import terminé avec succès !'
