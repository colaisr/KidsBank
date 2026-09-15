# parent-reports Specification

## Purpose

Shows the parent a demo spending breakdown for the child by category and period for family money conversations and bank pitches.

## Requirements

### Requirement: Parent reports screen is reachable

The system SHALL expose `/parent/reports` with back to `/parent` and localized title «Отчёты».

#### Scenario: Open from services

- **WHEN** the parent taps the reports service row
- **THEN** the reports screen opens with period selector and spending breakdown

### Requirement: Reports show period and category breakdown

The screen SHALL let the parent switch between **week** and **month** demo periods, show a date-range label, a donut chart with total AMD in the center, and a list of categories with amount and percent.

#### Scenario: Switch period

- **WHEN** the parent selects «Месяц»
- **THEN** chart and list update to month demo totals

### Requirement: Download PDF is demo-only

A «Скачать отчёт (PDF)» control SHALL show localized demo feedback without generating a file.

#### Scenario: PDF tap

- **WHEN** the parent taps download PDF
- **THEN** a demo-only message appears and no download starts
