@noreajs/cli
============

Norea.js command lines for components and applications creation

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@noreajs/cli.svg)](https://npmjs.org/package/@noreajs/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@noreajs/cli.svg)](https://npmjs.org/package/@noreajs/cli)
[![License](https://img.shields.io/npm/l/@noreajs/cli.svg)](https://github.com/noreajs/cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @noreajs/cli
$ norea COMMAND
running command...
$ norea (-v|--version|version)
@noreajs/cli/0.0.1 win32-x64 node-v12.16.2
$ norea --help [COMMAND]
USAGE
  $ norea COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`norea autocomplete [SHELL]`](#norea-autocomplete-shell)
* [`norea hello`](#norea-hello)
* [`norea help [COMMAND]`](#norea-help-command)
* [`norea make:controller [FILE]`](#norea-makecontroller-file)
* [`norea make:model [FILE]`](#norea-makemodel-file)
* [`norea new APPNAME`](#norea-new-appname)
* [`norea plugins`](#norea-plugins)
* [`norea plugins:install PLUGIN...`](#norea-pluginsinstall-plugin)
* [`norea plugins:link PLUGIN`](#norea-pluginslink-plugin)
* [`norea plugins:uninstall PLUGIN...`](#norea-pluginsuninstall-plugin)
* [`norea plugins:update`](#norea-pluginsupdate)
* [`norea update [CHANNEL]`](#norea-update-channel)

## `norea autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ norea autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ norea autocomplete
  $ norea autocomplete bash
  $ norea autocomplete zsh
  $ norea autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.2.0/src\commands\autocomplete\index.ts)_

## `norea hello`

describe the command here

```
USAGE
  $ norea hello

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ norea hello
```

_See code: [src\commands\hello.ts](https://github.com/noreajs/cli/blob/v0.0.1/src\commands\hello.ts)_

## `norea help [COMMAND]`

display help for norea

```
USAGE
  $ norea help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src\commands\help.ts)_

## `norea make:controller [FILE]`

create a new controller

```
USAGE
  $ norea make:controller [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src\commands\make\controller.ts](https://github.com/noreajs/cli/blob/v0.0.1/src\commands\make\controller.ts)_

## `norea make:model [FILE]`

create a new model

```
USAGE
  $ norea make:model [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src\commands\make\model.ts](https://github.com/noreajs/cli/blob/v0.0.1/src\commands\make\model.ts)_

## `norea new APPNAME`

create a new norea.js application (API)

```
USAGE
  $ norea new APPNAME

ARGUMENTS
  APPNAME  application name

OPTIONS
  -d, --dbStrategy=mongoose|sequelize   [default: mongoose] mongoose for MongoDB database and sequelize ORM for
                                        Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server database

  -f, --force

  -h, --help                            show CLI help

  -p, --package=npm|yarn                [default: npm] package manager to use

  -t, --template=typescript|javascript  [default: typescript] project template
```

_See code: [src\commands\new.ts](https://github.com/noreajs/cli/blob/v0.0.1/src\commands\new.ts)_

## `norea plugins`

list installed plugins

```
USAGE
  $ norea plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ norea plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.0/src\commands\plugins\index.ts)_

## `norea plugins:install PLUGIN...`

installs a plugin into the CLI

```
USAGE
  $ norea plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  plugin to install

OPTIONS
  -f, --force    yarn install with force flag
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command 
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in 
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ norea plugins:add

EXAMPLES
  $ norea plugins:install myplugin 
  $ norea plugins:install https://github.com/someuser/someplugin
  $ norea plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.0/src\commands\plugins\install.ts)_

## `norea plugins:link PLUGIN`

links a plugin into the CLI for development

```
USAGE
  $ norea plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello' 
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLE
  $ norea plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.0/src\commands\plugins\link.ts)_

## `norea plugins:uninstall PLUGIN...`

removes a plugin from the CLI

```
USAGE
  $ norea plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

ALIASES
  $ norea plugins:unlink
  $ norea plugins:remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.0/src\commands\plugins\uninstall.ts)_

## `norea plugins:update`

update installed plugins

```
USAGE
  $ norea plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.0/src\commands\plugins\update.ts)_

## `norea update [CHANNEL]`

update the norea CLI

```
USAGE
  $ norea update [CHANNEL]
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.3.10/src\commands\update.ts)_
<!-- commandsstop -->
