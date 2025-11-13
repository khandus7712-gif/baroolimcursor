
# Baroolim Project Plan

## 📋 Project Overview

**Baroolim** - 업종 무관 AI 마케팅 콘텐츠 생성기 MVP
- Next.js 14 (App Router, TypeScript)
- Prisma ORM with SQLite
- Google Gemini AI for content generation
- Multi-domain (food, beauty, retail) & multi-platform (Instagram, Blog, Threads, GMB)

---

## 🗂️ Key Files & Context (@ references)

### Database Schema
- **@prisma/schema.prisma** - Database models:
  - `User` - User accounts
  - `Brand` - Brand configurations per user
  - `DomainConfig` - Domain-specific settings (food, beauty, retail)
  - `PlatformConfig` - Platform templates (instagram, blog, threads, gmb)
  - `CatalogItem` - Domain/platform/plugin catalog
  - `Generation` - Generated content history

### Core Application Files
- **@app/layout.tsx** - Root layout
- **@app/page.tsx** - Landing page
- **@app/onboarding/page.tsx** - Onboarding flow
- **@app/studio/page.tsx** - Content generation studio

### API Endpoints
- **@pages/api/generate.ts** - Content generation API
- **@pages/api/onboarding.ts** - Onboarding data save API

### Core Libraries
- **@lib/ai.ts** - Google AI SDK wrapper
- **@lib/generate.ts** - Content generation logic
- **@lib/promptComposer.ts** - Prompt composition
- **@lib/postProcess.ts** - Post-processing (forbidden words, mustInclude)
- **@lib/profileLoader.ts** - Domain/platform profile loader
- **@lib/prisma.ts** - Prisma client instance
- **@lib/storage.ts** - S3 storage utilities
- **@lib/exporters.ts** - Content export utilities

### Plugins
- **@plugins/reviewReply.ts** - Review reply plugin
- **@plugins/adCopy.ts** - Ad copy plugin
- **@plugins/bookingCta.ts** - Booking CTA plugin
- **@plugins/hashtag.ts** - Hashtag generation plugin

### Type Definitions
- **@types/domain.ts** - Domain profile types
- **@types/platform.ts** - Platform template types
- **@types/plugin.ts** - Plugin interface types
- **@types/generate.ts** - Generation request/response types
- **@types/payment.ts** - Payment types

### Configuration Files
- **@profiles/domains/** - Domain profiles (food.json, beauty.json, retail.json)
- **@profiles/platforms/** - Platform templates (instagram.json, blog.json, threads.json, gmb.json)
- **@package.json** - Dependencies and scripts
- **@next.config.js** - Next.js configuration
- **@tailwind.config.ts** - Tailwind CSS configuration
- **@tsconfig.json** - TypeScript configuration
- **@middleware.ts** - Next.js middleware (CORS)

### Testing
- **@e2e/onboarding-studio.spec.ts** - E2E test suite
- **@playwright.config.ts** - Playwright configuration

---

## 🛠️ Common Commands (/ references)

### Development
```bash
# Start development server
npm run dev
# or
/ npm run dev

# Type checking
npm run typecheck
# or
/ npm run typecheck

# Linting
npm run lint
# or
/ npm run lint

# Format code
npm run format
# or
/ npm run format
```

### Database
```bash
# Push schema to database
npm run db:push
# or
/ npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio
# or
/ npm run db:studio

# Generate Prisma Client
npx prisma generate
# or
/ npx prisma generate
```

### Build & Production
```bash
# Build for production
npm run build
# or
/ npm run build

# Start production server
npm run start
# or
/ npm run start
```

### Testing
```bash
# Run E2E tests
npm run test:e2e
# or
/ npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
# or
/ npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed
# or
/ npm run test:e2e:headed

# Install Playwright browsers (first time)
npx playwright install
# or
/ npx playwright install
```

### Package Management
```bash
# Install dependencies
npm install
# or
/ npm install

# Add a new dependency
npm install <package-name>
# or
/ npm install <package-name>

# Add a dev dependency
npm install -D <package-name>
# or
/ npm install -D <package-name>
```

---

## 🎯 Development Workflow

### 1. Initial Setup
```bash
# Install dependencies
/ npm install

# Set up environment variables (.env)
# Required: GOOGLE_API_KEY, DATABASE_URL

# Push database schema
/ npm run db:push

# Start development server
/ npm run dev
```

### 2. Adding New Domain
1. Create `@profiles/domains/{domain-id}.json`
2. Update `@lib/profileLoader.ts` to register domain
3. Test with `/studio` page

### 3. Adding New Platform
1. Create `@profiles/platforms/{platform-id}.json`
2. Update `@lib/profileLoader.ts` to register platform
3. Test with `/studio` page

### 4. Adding New Plugin
1. Create `@plugins/{plugin-id}.ts`
2. Implement `Plugin` interface from `@types/plugin.ts`
3. Register in plugin registry
4. Test with `/studio` page

### 5. Database Changes
1. Update `@prisma/schema.prisma`
2. Run `/ npm run db:push` to apply changes
3. Prisma Client auto-generates

---

## 🔍 Quick Reference

### File Locations
- **Frontend Pages**: `app/` directory
- **API Routes**: `pages/api/` directory
- **Business Logic**: `lib/` directory
- **Plugins**: `plugins/` directory
- **Types**: `types/` directory
- **Profiles**: `profiles/` directory
- **Database**: `prisma/schema.prisma`

### Key URLs (Development)
- **App**: http://localhost:3000
- **Onboarding**: http://localhost:3000/onboarding
- **Studio**: http://localhost:3000/studio
- **Prisma Studio**: http://localhost:5555 (when running `db:studio`)

### Environment Variables
- `GOOGLE_API_KEY` - Google AI API key (required)
- `DATABASE_URL` - Database connection string (required)
- `STORAGE_ENDPOINT` - S3 storage endpoint (optional)
- `STORAGE_KEY` - S3 access key (optional)
- `STORAGE_SECRET` - S3 secret key (optional)
- `STORAGE_BUCKET` - S3 bucket name (optional)
- `ALLOWED_ORIGINS` - CORS allowed origins (optional)
- `NEXT_PUBLIC_APP_URL` - Public app URL (optional)

---

## 📝 Notes

- Database is SQLite (not PostgreSQL as mentioned in README)
- Content generation uses Google Gemini AI
- Supports image analysis (Vision API)
- Post-processing includes forbidden word filtering and mustInclude checks
- Plugin system for extensibility (review reply, ad copy, booking CTA, hashtags)

---

## 🚀 Next Steps / TODO

1. Review current schema for any missing relationships
2. Check API endpoints for proper error handling
3. Verify plugin system integration
4. Test content generation flow end-to-end
5. Review and update README if needed (SQLite vs PostgreSQL)

