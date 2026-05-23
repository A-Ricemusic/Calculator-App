# Notes Feature Organization

Keep this feature split by responsibility:

- `drawing/`: canvas rendering, stroke geometry, and drawing input state.
- `navigation/`: note headers, page controls, and notebook manager UI.
- `notebook/`: note collection/page persistence, validation, and state updates.
- `platform/`: native platform adapters such as iOS PencilKit.
- `text/`: text block display and entry UI.
- `toolbar/`: drawing tool and color controls.
- `styles/`: notes style modules grouped by the same UI areas.

New notes code should land in the narrowest matching folder. Shared notebook mutations should stay in `notebook/utils`, and screen-level state in `screen/MathNotesScreen.tsx` should stay limited to wiring subfeatures together.
