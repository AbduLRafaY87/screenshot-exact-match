<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- All user-facing strings live in src/lib/translations.ts (en + ur) and are read via useT(); never hardcode copy in components — the header toggle must switch every label.

- The shared playground shell owns navigation and profile prompts so every practice page remains reachable from the same menu.
- Keep practice destinations in one shared registry so sidebar options and home tiles remain consistent.
- The display name is a device-only preference, like language; hydrate it after mount and allow practice without a name or available browser storage.
