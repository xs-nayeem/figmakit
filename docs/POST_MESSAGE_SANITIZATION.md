# Post Message Sanitization Fix

This note explains the code added in [src/plugin/code.ts](../src/plugin/code.ts) to fix the runtime error:

> Error: in postMessage: Cannot unwrap symbol

## Why this was needed

Figma plugin messages use structured cloning when data is sent from the plugin sandbox to the UI. That means every value in the payload must be safe to serialize. Some Figma node properties can contain special values such as `figma.mixed`, which is represented internally as a `Symbol`. Symbols cannot be transferred through `postMessage`, so the message fails before it reaches the UI.

The fix was to sanitize the serialized node data before sending it.

## Added code block 1: sanitizer helper

```ts
function sanitizeForPostMessage(value: unknown, seen = new WeakSet<object>()): unknown {
	if (value === null || value === undefined) {
		return value;
	}

	if (typeof value === "symbol") {
		return "mixed";
	}

	if (typeof value === "bigint") {
		return value.toString();
	}

	if (typeof value !== "object") {
		return value;
	}

	if (Array.isArray(value)) {
		return value.map((item) => sanitizeForPostMessage(item, seen));
	}

	const obj = value as Record<string, unknown>;
	if (seen.has(obj)) {
		return undefined;
	}
	seen.add(obj);

	const sanitized: Record<string, unknown> = {};
	for (const [key, raw] of Object.entries(obj)) {
		if (typeof raw === "function") {
			continue;
		}

		const next = sanitizeForPostMessage(raw, seen);
		if (next !== undefined) {
			sanitized[key] = next;
		}
	}

	return sanitized;
}
```

### Purpose

This function makes the data safe to send to the UI.

### What each part does

- `value === null || value === undefined`
  - Preserves empty values as-is.
  - These are safe to send and should not be changed.

- `typeof value === "symbol"`
  - Converts symbols into the string `"mixed"`.
  - This is the main fix for `figma.mixed`, which is the most likely source of the error.

- `typeof value === "bigint"`
  - Converts bigints to strings.
  - Bigints are also not always safe in messaging payloads.

- `typeof value !== "object"`
  - Returns primitive values like strings, numbers, and booleans unchanged.
  - These are already safe for `postMessage`.

- `Array.isArray(value)`
  - Recursively sanitizes each item in arrays.
  - This keeps nested node data safe.

- `seen = new WeakSet<object>()`
  - Tracks objects already visited.
  - Prevents infinite loops if there are circular references.

### Why `WeakSet` specifically (and not `Set`)

`WeakSet` is used because we only need temporary "already visited" tracking during recursion, and the tracked values are objects.

- `WeakSet` only accepts objects:
	- This matches our need, because circular reference problems happen on object graphs.
- `WeakSet` entries are weakly held:
	- Once an object is no longer referenced elsewhere, it can be garbage collected.
	- This avoids keeping extra memory alive accidentally.
- `WeakSet` is ideal for cycle detection in tree/graph traversal:
	- `seen.has(obj)` tells us whether we already visited the same object.
	- If yes, we stop recursion for that path and return `undefined`.

Could we use `Set`? Yes, functionally it would also work for cycle detection. `WeakSet` is chosen because it is safer for memory behavior in object-recursion helpers like this, especially if reused or expanded later.

## Full walkthrough of the sanitizer logic

This is the exact runtime flow for `sanitizeForPostMessage(value, seen)`:

1. Input arrives (`value`, optional `seen`).
2. If `value` is `null` or `undefined`, return it immediately.
3. If `value` is a `symbol`, convert it to `"mixed"` and return.
4. If `value` is a `bigint`, convert to string and return.
5. If `value` is any other primitive (`string`, `number`, `boolean`), return as-is.
6. If `value` is an array:
	 - Call the sanitizer recursively for each element.
	 - Return a sanitized array.
7. If `value` is an object:
	 - Cast to a generic object map.
	 - Check `seen.has(obj)`.
	 - If already seen, return `undefined` to break circular loops.
	 - Otherwise `seen.add(obj)` and continue.
8. Create a new plain object `sanitized`.
9. Iterate over each `[key, raw]` pair in the source object.
10. If `raw` is a function, skip it (`continue`).
11. Otherwise recursively sanitize `raw`.
12. If result is not `undefined`, write it to `sanitized[key]`.
13. After all keys are processed, return `sanitized`.

In short, the function transforms unknown nested input into a transport-safe structure made of primitives, arrays, and plain objects, while removing or normalizing values that break structured cloning.

## Full flow of the added message path

1. UI sends `{ type: 'get-figma-nodes' }` to plugin.
2. Plugin reads `figma.currentPage.selection`.
3. Each selected node is serialized with `serializeNode(node)`.
4. Serialized output is passed through `sanitizeForPostMessage(...)`.
5. Plugin sends `{ type: 'figma-nodes-data', nodes }` with only safe values.
6. UI receives data without `Cannot unwrap symbol` failures.

- `typeof raw === "function"`
  - Skips functions entirely.
  - Functions cannot be cloned across the message boundary.

### Why it matters

Without this helper, a single unsafe field anywhere in the node tree can break the entire message send. With it, the payload is normalized into plain JSON-like data that the UI can receive safely.

## Added code block 2: sanitizing the serialized nodes before sending

```ts
const nodes = selection.map((node) => sanitizeForPostMessage(serializeNode(node)));
```

### Purpose

This is the point where the raw serialized node objects are converted into a safe form.

### Why it is needed

- `serializeNode(node)` collects all the relevant node data.
- That data may still contain Figma-specific values that are not safe to post directly.
- Wrapping it in `sanitizeForPostMessage(...)` ensures the final payload is safe before it leaves the plugin sandbox.

### Why this location is correct

This is the narrowest and safest place to apply the fix because:

- the serializer still produces the full node representation the UI expects,
- the message sender handles transport concerns,
- the UI code does not need to know about Figma internals or special values.

## End result

The plugin can now send selected node data to the UI without crashing on `postMessage`, even when the selection includes text or style fields that use `figma.mixed`.

## Related file

- [src/plugin/code.ts](../src/plugin/code.ts)
