# Tab Completion API with Curl

This document explains how to use the tab completion API endpoint using curl commands.

## Prerequisites

- The development server must be running on `localhost:5173`
- You can start the server with: `bun run dev`

## API Endpoint

- **URL**: `http://localhost:5173/api/streamCpp`
- **Method**: `POST`
- **Content-Type**: `application/json`

## Basic Curl Command

To generate tab completion for a code snippet:

```bash
curl -X POST http://localhost:5173/api/streamCpp \
  -H "Content-Type: application/json" \
  -d '{"code": "your code here"}'
```

## Advanced: Specifying Cursor Position and File Context

The API now supports a detailed request format that includes cursor position and additional file context. This format allows for more precise completions by providing:

- `current_file.contents`: The full file content
- `current_file.cursor_position.line`: 0-indexed line number
- `current_file.cursor_position.column`: 0-indexed column number
- `current_file.language_id`: The programming language (e.g., "javascript")
- `current_file.relative_workspace_path`: The file path in the workspace

Example with cursor position:

```bash
curl -X POST http://localhost:5173/api/streamCpp \
  -H "Content-Type: application/json" \
  -d '{
    "current_file": {
      "contents": "// this a test\\n\\nfunction bubble_so",
      "cursor_position": {"line": 2, "column": 15},
      "language_id": "javascript",
      "relative_workspace_path": "test.js"
    }
  }'
```

### Response with Detailed Format

When using the detailed format, the API returns completions that respect your context:

```json
{
  "status": 200,
  "contentType": "application/connect+proto",
  "modelInfo": {
    "isFusedCursorPredictionModel": true,
    "isMultidiffModel": false
  },
  "rangeToReplace": {
    "startLine": 1,
    "startColumn": 3,
    "endLine": 0,
    "endColumn": 0
  },
  "text": "// this a test\\n\\nfunction bubble_sort(arr) {\\n    let n = arr.length;\\n    for (let i = 0; i < n - 1; i++) {\\n        for (let j = 0; j < n - i - 1; j++) {\\n            if (arr[j] > arr[j + 1]) {\\n\\n",
  "doneEdit": false,
  "doneStream": false,
  "debug": {
    "modelOutput": "",
    "modelInput": "",
    "streamTime": "693.5673660002649",
    "ttftTime": "55.10979699995369"
  },
  "trailer": {},
  "error": null
}
```

The detailed format now properly completes "function bubble_so" to "function bubble_sort" while preserving the context (the comment "// this a test").

## Example: Function Completion with Context

To get completion for code starting with "// this a test\n\nfunction bubble_so":

```bash
curl -X POST http://localhost:5173/api/streamCpp \
  -H "Content-Type: application/json" \
  -d $'{"code": "// this a test\\n\\nfunction bubble_so"}'
```

### Example Response

When you run the above command, you'll receive a JSON response like this:

```json
{
  "status": 200,
  "contentType": "application/connect+proto",
  "modelInfo": {
    "isFusedCursorPredictionModel": true,
    "isMultidiffModel": false
  },
  "rangeToReplace": {
    "startLine": 1,
    "startColumn": 3,
    "endLine": 0,
    "endColumn": 0
  },
  "text": "// this a test\\n\\nfunction bubble_sort(arr) {\\n    let n = arr.length;\\n    for (let i = 0; i < n - 1; i++) {\\n        for (let j = 0; j < n - i - 1; j++) {\\n            if (arr[j] > arr[j + 1]) {\\n\\n",
  "doneEdit": false,
  "doneStream": false,
  "debug": {
    "modelOutput": "",
    "modelInput": "",
    "streamTime": "575.5701519995928",
    "ttftTime": "54.11893399991095"
  },
  "trailer": {},
  "error": null
}
```

The `text` field contains the completed code - in this case, the AI preserved the comment "// this a test" and completed "function bubble_so" to a full bubble sort function implementation.

## Basic Function Completion

For simple function completion without additional context:

```bash
curl -X POST http://localhost:5173/api/streamCpp \
  -H "Content-Type: application/json" \
  -d '{"code": "function bubble_so"}'
```

### Basic Response

```json
{
  "status": 200,
  "contentType": "application/connect+proto",
  "modelInfo": {
    "isFusedCursorPredictionModel": true,
    "isMultidiffModel": false
  },
  "rangeToReplace": {
    "startLine": 1,
    "startColumn": 1,
    "endLine": 0,
    "endColumn": 0
  },
  "text": "function bubble_sort(arr) {\\n    let n = arr.length;\\n    for (let i = 0; i < n - 1; i++) {\\n        for (let j = 0; j < n - i - 1; j++) {\\n            if (arr[j] > arr[j + 1]) {\\n\\n",
  "doneEdit": false,
  "doneStream": false,
  "debug": {
    "modelOutput": "",
    "modelInput": "",
    "streamTime": "544.2174859996885",
    "ttftTime": "53.90054899919778"
  },
  "trailer": {},
  "error": null
}
```

## Use Cases

This API is useful for:
- Code autocompletion in editors
- AI-assisted coding
- Generating function implementations
- Code snippet suggestions
- Fixing typos in code (even when cursor is positioned elsewhere)

## Example: Typo Correction

The API can also correct typos in code. For example, when the cursor is positioned at the beginning of a line but there's a typo later in the comment, the API can still identify and fix the typo:

```bash
curl -X POST http://localhost:5173/api/streamCpp \
  -H "Content-Type: application/json" \
  -d '{
    "current_file": {
      "contents": "// This is a coment with a typo at the start",
      "cursor_position": {"line": 0, "column": 0},
      "language_id": "cpp",
      "relative_workspace_path": "test.cpp"
    }
  }'
```

In this example, even though the cursor is positioned at column 0, the API recognizes and fixes the typo "coment" to "comment" in the response.

## Troubleshooting

If the curl command fails:
1. Verify the server is running on `localhost:5173`
2. Check that you have the required dependencies installed
3. Ensure the request body is valid JSON