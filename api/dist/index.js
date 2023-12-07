"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
// Create an application instance
const application = new server_1.Api();
// Run the application
application.start();
