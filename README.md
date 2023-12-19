#  Gossip

# Structure

## API

Web API developed with Typescript and Express JS

### Developer

Vscode configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run api in debug mode",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "/Users/mario/.nvm/versions/node/v20.10.0/bin/node",
      "runtimeArgs": ["-r", "ts-node/register"],
      "args": ["${workspaceFolder}/api/src/index.ts"],
      "cwd": "${workspaceFolder}/api",
      "sourceMaps": true,
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "env": { "NODE_ENV": "development" }
    },
    {
      "name": "Run single api unit test",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "node",
      "runtimeArgs": ["-r", "ts-node/register"],
      "args": [
        "${workspaceFolder}/api/node_modules/.bin/jest",
        "${file}",
        "--config",
        "${workspaceFolder}/api/jest.config.js"
      ],
      "cwd": "${workspaceFolder}/api",
      "sourceMaps": true,
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "name": "Run api E2E Tests",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "node",
      "args": [
        "${workspaceFolder}/api/node_modules/.bin/jest",
        "e2e/**/*.test.js",
        "--config",
        "${workspaceFolder}/api/jest.config.e2e.js"
      ],
      "cwd": "${workspaceFolder}/api",
      "sourceMaps": true,
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "name": "Run single api E2E Test",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "node",
      "args": [
        "${workspaceFolder}/api/node_modules/.bin/jest",
        "${file}",
        "--config",
        "${workspaceFolder}/api/jest.config.e2e.js"
      ],
      "cwd": "${workspaceFolder}/api",
      "sourceMaps": true,
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## App

Angular App
