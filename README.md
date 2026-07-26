# Tree-sitter Razor

<strong><span style="color:red">Let me know if you want upgrades.</span></strong>

> **Note:** This project made with AI. It does work. Use with caution. I quickly build this project (in 1 hour) just for using ZED with Blazor-Razor pages. It lacks structure, coding standarts, and every other professional aspect. Just an AI slop



A [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for ASP.NET Razor Pages (`.razor`, `.cshtml`).

This grammar provides robust parsing for the Razor syntax, including:
- Directives (`@page`, `@inject`, `@code`, etc.)
- Control structures (`@if`, `@foreach`, `@switch`, etc.)
- Explicit and implicit C# expressions (`@(...)`, `@someVar`)
- HTML integration with attributes
- C# code block injection

![Razor Syntax Highlighting](doc/screenshot1.png)

## Features

- **Accurate Parsing**: Handles mixed C# and HTML content typical in Razor files.
- **Syntax Highlighting**: Includes queries for syntax highlighting.
- **Injection Support**: seamless C# injection inside `@code` blocks and control structures.
- **Zed Editor Support**: Ready-to-use integration for the Zed editor.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- C Compiler (MSVC on Windows, GCC/Clang on Linux/macOS)
- Tree-sitter CLI (`npm install -g tree-sitter-cli`)


Linux setup by [kawa0710](https://github.com/kawa0710), 
[issue-3884643669](https://github.com/IbrahimSabriOrene/zed-razor-treesitter/issues/1#issue-3884643669)

### Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/tree-sitter-razor.git
    cd tree-sitter-razor
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Build the grammar:
    ```bash
    npm run build
    # or
    tree-sitter generate
    ```

### Testing

Run the corpus tests to verify the grammar:

```bash
# Standard test run
tree-sitter test

# Windows specific helper (sets up VS environment)
.\run_test.bat
```

To parse a specific file and see the syntax tree:

```bash
tree-sitter parse test/counter.razor
```

## Zed Editor Integration

This repository includes a local extension setup for [Zed](https://zed.dev).

### Local Development Setup

1.  Clone this repository.
2.  Install a C# extension in Zed (`zed: extensions` -> "C#"). Zed ships no C#
    grammar by default, and without it the `@code` blocks stay unhighlighted.
3.  Run `zed: install dev extension` and point it at the **`zed-razor` folder**,
    not the repository root.
4.  Open a `.razor` or `.cshtml` file.

You do **not** need to build a `.wasm` yourself. `extension.toml` declares the
grammar via `[grammars.razor]`; Zed clones this repository at the pinned `rev`
and compiles `src/parser.c` + `src/scanner.c` to wasm on install.

If highlighting does not appear, check `zed: open log` for a grammar build or
fetch error.

### Modifying the grammar

After editing `grammar.js`, run `tree-sitter generate`, commit the regenerated
`src/`, push, and bump `rev` in `zed-razor/extension.toml` to the new commit
SHA. Zed fetches the grammar by SHA, so an unpushed local commit will not
resolve.

### Extension Structure

- `zed-razor/extension.toml`: Extension manifest (declares grammar repo + rev).
- `zed-razor/languages/razor/`: Language configuration and queries.

Note: `zed-razor/languages/razor/*.scm` are copies of the files in `queries/`.
Keep both in sync when editing queries.

## Project Structure

- `grammar.js`: The Tree-sitter grammar definition.
- `src/`: Generated parser source code (C).
- `queries/`: Tree-sitter queries for highlighting and injections.
- `test/corpus/`: Test cases for the grammar.
- `zed-razor/`: Zed extension configuration files.

## License

MIT
