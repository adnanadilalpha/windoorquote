# WinDoor Quote

Cloud-based window and door quoting software marketing site, rebuilt in Next.js.

## Structure

```
app/                 # App Router pages & global styles
components/          # Header, Footer, homepage sections
data/home.ts         # Homepage content (from WordPress export)
public/images/       # Logos, icons, hero, team photos
```

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- The top navbar is **fixed** so it stays visible while scrolling.
- Page content is offset with `padding-top` matching the header height so nothing sits under the bar.
