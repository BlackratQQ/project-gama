{
"tsx_to_astro_refactoring": {
"description": "Guidelines for refactoring .tsx components into .astro files using React integration.",

    "enabled": true,

    "rules": [
      {
        "description": "Gradually convert all .tsx components into .astro files for better performance."
      },
      {
        "description": "Keep React components only for interactive parts using client:* directives."
      },
      {
        "description": "Render static content as HTML within .astro files; use React with client:load/idle/visible for dynamic content."
      },
      {
        "description": "Each .astro file should serve as the main container for the page or component."
      },
      {
        "description": "Import React components into .astro files only when interactivity is required in the browser."
      }
    ],

    "workflow": [
      {
        "step": 1,
        "description": "Identify static versus interactive parts in the .tsx component."
      },
      {
        "step": 2,
        "description": "Create an .astro file for the overall structure and static content."
      },
      {
        "step": 3,
        "description": "Retain React only for interactive elements using the appropriate client: directive."
      },
      {
        "step": 4,
        "description": "Test functionality and performance after refactoring."
      }
    ],

    "examples": [
      {
        "before": "Component.tsx – entire component written in React",
        "after": "Component.astro – static structure + <ReactButton client:load /> for interactivity"
      }
    ]

}
}
