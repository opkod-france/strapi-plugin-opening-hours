<p align="center">
  <img src="assets/logo.png" alt="Opening Hours Plugin" width="128" />
</p>

<h1 align="center">Strapi Plugin: Opening Hours</h1>

<p align="center">
  A custom field plugin for <a href="https://strapi.io">Strapi v5</a> that provides a rich UI for managing business opening hours, split shifts, and special/holiday schedules.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@opkod-france/strapi-plugin-opening-hours"><img src="https://img.shields.io/npm/v/@opkod-france/strapi-plugin-opening-hours" alt="npm version" /></a>
  <a href="https://github.com/opkod-france/strapi-plugin-opening-hours/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@opkod-france/strapi-plugin-opening-hours" alt="license" /></a>
  <a href="https://www.npmjs.com/package/@opkod-france/strapi-plugin-opening-hours"><img src="https://img.shields.io/npm/dm/@opkod-france/strapi-plugin-opening-hours" alt="downloads" /></a>
</p>

---

The JSON output follows [Schema.org OpeningHoursSpecification](https://schema.org/OpeningHoursSpecification) conventions for SEO interoperability.

## Features

- **Weekly schedule** with per-day open/closed toggle
- **Split shifts** — multiple time slots per day (e.g. lunch + dinner)
- **Copy hours** from one day to weekdays or all days
- **Special/holiday hours** with date ranges and labels
- **Preview tab** for read-only formatted display
- **Schema.org compatible** JSON structure
- Built entirely with **Strapi Design System** components

## Installation

```bash
yarn add @opkod-france/strapi-plugin-opening-hours
```

Add the plugin to your Strapi config:

```typescript
// config/plugins.ts
export default () => ({
  'opening-hours': {
    enabled: true,
  },
});
```

Rebuild your Strapi admin panel:

```bash
yarn build
yarn develop
```

## Usage

1. Open the **Content-Type Builder**
2. Add a new custom field and select **Opening Hours**
3. Save the content type
4. The field appears in the content editor with three tabs: **Regular Hours**, **Special Hours**, and **Preview**

## JSON Structure

```json
{
  "regularHours": [
    {
      "dayOfWeek": "Monday",
      "isOpen": true,
      "timeSlots": [
        { "opens": "09:00", "closes": "12:00" },
        { "opens": "14:00", "closes": "18:00" }
      ]
    },
    {
      "dayOfWeek": "Sunday",
      "isOpen": false,
      "timeSlots": []
    }
  ],
  "specialHours": [
    {
      "label": "Christmas Day",
      "validFrom": "2025-12-25",
      "validThrough": "2025-12-25",
      "isOpen": false,
      "timeSlots": []
    }
  ]
}
```

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `dayOfWeek` | string | Schema.org day name (Monday–Sunday) |
| `isOpen` | boolean | Whether the business is open |
| `timeSlots` | array | Time ranges; empty when closed |
| `opens` / `closes` | string | HH:MM in 24-hour format |
| `label` | string | Name for special hours entry |
| `validFrom` / `validThrough` | string | ISO date (YYYY-MM-DD) |

## Development

```bash
# Install dependencies
yarn install

# Build the plugin
yarn build

# Watch mode (rebuilds on changes)
yarn watch

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch
```

### Local development with a Strapi project

Link the plugin for local testing:

```bash
# In the plugin directory
yarn link

# In your Strapi project
yarn link @opkod-france/strapi-plugin-opening-hours
```

Add the plugin with an explicit resolve path in `config/plugins.ts`:

```typescript
export default () => ({
  'opening-hours': {
    enabled: true,
    resolve: './node_modules/@opkod-france/strapi-plugin-opening-hours',
  },
});
```

## Requirements

- Strapi v5
- Node.js 18+

## License

MIT
