# Wdrożenie na Raspberry Pi

Aplikacja jest zbudowana jako statyczna strona przez Vite (`npm run build`) i serwowana przez nginx.
Po każdym pushu do `main` GitHub Actions automatycznie połączy się z Pi przez SSH, pobierze zmiany i przebuduje apkę.

---

## 1. Przygotowanie Raspberry Pi

```bash
# Aktualizacja systemu
sudo apt update && sudo apt upgrade -y

# Instalacja Node.js (v20 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalacja nginx
sudo apt install -y nginx

# Weryfikacja
node -v
npm -v
nginx -v
```

---

## 2. Klonowanie repozytorium na Pi

```bash
# Sklonuj repo do katalogu domowego
cd ~
git clone https://github.com/<TWOJ_UZYTKOWNIK>/SpanishLessons.git
cd SpanishLessons

# Zainstaluj zależności i zbuduj
npm install
npm run build
```

Zbudowane pliki trafiają do katalogu `dist/`.

---

## 3. Konfiguracja nginx

```bash
sudo nano /etc/nginx/sites-available/spanishlessons
```

Wklej:

```nginx
server {
    listen 80;
    server_name _;  # akceptuje każdy hostname / adres IP

    root /home/pi/SpanishLessons/dist;
    index index.html;

    # SPA fallback – wszystkie ścieżki trafiają do index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Aktywuj konfigurację i przeładuj nginx
sudo ln -s /etc/nginx/sites-available/spanishlessons /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Strona powinna być dostępna pod `http://<IP_RASPBERRY_PI>`.

---

## 4. Automatyczne aktualizacje po pushu (GitHub Actions + SSH)

### 4a. Wygeneruj klucz SSH na swoim komputerze

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/id_deploy_pi
```

Powstaną dwa pliki:
- `~/.ssh/id_deploy_pi` — klucz **prywatny** (trafi do GitHub Secrets)
- `~/.ssh/id_deploy_pi.pub` — klucz **publiczny** (trafi na Pi)

### 4b. Dodaj klucz publiczny na Raspberry Pi

```bash
# Na Pi:
mkdir -p ~/.ssh
echo "<ZAWARTOSC id_deploy_pi.pub>" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

Albo ze swojego komputera:

```bash
ssh-copy-id -i ~/.ssh/id_deploy_pi.pub pi@<IP_RASPBERRY_PI>
```

Sprawdź czy SSH działa:

```bash
ssh -i ~/.ssh/id_deploy_pi pi@<IP_RASPBERRY_PI> "echo OK"
```

### 4c. Dodaj sekrety do GitHub

W repozytorium na GitHubie: **Settings → Secrets and variables → Actions → New repository secret**

| Nazwa sekretu     | Wartość                                            |
|-------------------|----------------------------------------------------|
| `SSH_PRIVATE_KEY` | zawartość pliku `~/.ssh/id_deploy_pi` (cały tekst) |
| `SSH_HOST`        | adres IP Raspberry Pi, np. `192.168.1.42`          |
| `SSH_USER`        | użytkownik na Pi, domyślnie `pi`                   |

### 4d. Utwórz workflow GitHub Actions

Plik `.github/workflows/deploy.yml` jest już w repo. Po każdym pushu do `main`:
1. Łączy się z Pi przez SSH
2. Pobiera najnowszy kod (`git pull`)
3. Instaluje ewentualne nowe zależności
4. Przebudowuje apkę

---

## 5. Sprawdzenie działania

1. Zrób dowolną zmianę i `git push origin main`
2. W zakładce **Actions** na GitHubie zobaczysz uruchomiony workflow
3. Po ~1 minucie zmiany są widoczne na `http://<IP_RASPBERRY_PI>`

---

## Przydatne komendy na Pi

```bash
# Status nginx
sudo systemctl status nginx

# Logi nginx
sudo tail -f /var/log/nginx/error.log

# Ręczna aktualizacja (bez Githuba)
cd ~/SpanishLessons && git pull && npm install && npm run build
```

---

## Uwagi

- Jeśli Pi jest za routerem i chcesz dostęp z zewnątrz, ustaw **port forwarding** (port 80) w routerze lub użyj tunelu jak [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) (bezpłatny, bez publicznego IP).
- Upewnij się że adres IP Pi jest statyczny (ustaw w routerze rezerwację DHCP po MAC adresie).
