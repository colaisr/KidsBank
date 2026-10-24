4b. **KidsBank checkpoint (blocking, before the archive step)**

   - **Gates.** Run:

     ```bash
     npm run verify:change-gates -- --change "<name>" --archive
     ```

     Non-zero exit = STOP, do not archive. Report the output: missing or failed gates → `/verify-change <name>`; unchecked tasks → finish them first. Do not use AskUserQuestion to bypass this unless the user explicitly asks for a documented owner-waiver recorded in the gate file. The same check also runs as a hook before the `mv` step below.
   - **Archive feedback loop.** Read `docs/ARCHIVE-FEEDBACK-LOOP.md` and the change's `proposal.md` / implementation diff. Update every applicable PlanDocs and role file, mark the `tasks.md` « Archive feedback loop » items `[x]`, and summarize the planned doc updates in chat before running the CLI archive.
   - **After the archive:** one commit with `openspec/changes/archive/`, `openspec/specs/`, PlanDocs, `docs/`, `AGENTS.md` as needed. Push only on the owner's request.
   - This block is project-specific: `openspec init` / `openspec update` rewrite this file and remove it. Restore it afterwards (see `docs/roles/openspec-gates.md`).

