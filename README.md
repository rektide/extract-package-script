# Extract Package Script

_"can you "include" npm scripts from other packages? as you would include a Makefile? would help reduce boiler_
https://twitter.com/tjholowaychuk/status/702643863056306177

Well, I'm not fluent in Makefile, but here's a Node script to extract an script.

# Usage

From the command line, extract installed package node-uuid's `test` script:

```
npm install node-uuid
NODE_UUID_TEST=$(extract-package-script node-uuid test)
PATH="~/.node_modules/.bin:$PATH" eval $NODE_UUID_TEST
```
