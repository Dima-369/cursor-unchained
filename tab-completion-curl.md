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

## Example: Function Completion

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
    "streamTime": "708.8346170000732",
    "ttftTime": "55.067675000056624"
  },
  "trailer": {},
  "error": null
}
```

The `text` field contains the completed code - in this case, the AI preserved the comment "// this a test" and completed "function bubble_so" to a full bubble sort function implementation.

## Use Cases

This API is useful for:
- Code autocompletion in editors
- AI-assisted coding
- Generating function implementations
- Code snippet suggestions

## Troubleshooting

If the curl command fails:
1. Verify the server is running on `localhost:5173`
2. Check that you have the required dependencies installed
3. Ensure the request body is valid JSON