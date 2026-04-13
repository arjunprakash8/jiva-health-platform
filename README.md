# JIVA — AI-Powered Pro-Active Healthcare Program (APHP)

MVP web platform complementing the JIVA Smart Health Ring wearable.

## Dashboards

| Role | URL | Description |
|------|-----|-------------|
| Landing | `/` | Role selector with platform overview |
| Patient | `/patient` | Real-time vitals, ECG, Health Score, Activity, Sleep, BIA, Status Tier |
| Provider | `/provider` | Patient roster, anomaly alerts, risk stratification, FHIR export |
| Insurer | `/insurer` | Population health, compliance trends, claims projection, premium adjustments |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

## Features per TOR

- Multi-sensor Health Score (ECG, PPG, HRV, SpO₂, Temp, BIA) — Section F
- Status Points formula: `(Activity × Multiplier) − Inactivity Penalty` — Section B/F
- Bronze → Diamond tier rewards system — Section F.4
- AI anomaly alerts with clinical context — Section F, K
- Insurance-linked premium adjustments — Section K
- Pilot KPI monitoring (500 users) — Section I
- HIPAA / ODPC / SOC3 compliance indicators — Section G
- FHIR export (UI placeholder) — Section K.2

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy

Push to GitHub and import at [vercel.com](https://vercel.com) — zero-config Next.js deployment.
