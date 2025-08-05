# lib-logger

Write logs to the console and files.


## Get started

Install the lib:

```bash
pnpm i lib-logger --workspace
```


## Usage

Import the `logger` object from the lib and use it to log messages:

```ts
import { logger } from "lib-logger"

logger.debug("Debug message") // will not be written in log files
logger.info("Info message")
logger.warn("Warning message")
logger.error("Error message")
logger.fatal("Fatal message") // exits the process
```

All logs will be written to the console and to the log files in the `logs` directory.
The log files will be rotated every day and will be named `logs/YYYY-MM-DD.log`.

Debug messages will not be written to the log files.
An env variable `LOG_LEVEL` can be set to change the minimum level of logs that will be written in the console.
The order of the log levels is as follows:
- DEBUG
- INFO
- WARN
- ERROR
- FATAL


## Env variables

| Name      | Description                                               | Values                                           |
| --------- | --------------------------------------------------------- | ------------------------------------------------ |
| LOG_LEVEL | Minimum level of logs that will be written in the console | DEBUG, INFO *(default)*, WARN, ERROR, FATAL, OFF |
