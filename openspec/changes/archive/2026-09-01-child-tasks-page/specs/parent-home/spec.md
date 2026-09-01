## MODIFIED Requirements

### Requirement: Parent home shows control dashboard

The parent home SHALL display: child summary (card balance, piggy balance), quick actions for transfer, limit, and add task, spending history preview, and pending task confirmations queue.

#### Scenario: Parent home loads

- **WHEN** the active role is `parent` and the user opens `/parent`
- **THEN** a localized dashboard is shown with transfer, limit, and add-task actions
