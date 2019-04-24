# bab-cli

CLI to create custom boilerplate code

## Commands

Currently only two commands exists, if needed others will come.

### config

Command to change the default configuration. If the default configuration is not yet established, this will be prompted at first use no matter what command is called

**Usage**

`babcli config`

**Options**

-   _--custom=true_: Show options to create or modify a custom configuration, defaults values are those of the default configuration

### generate ( short: g )

Command to create scaffolding code according to a specific configuration, defaults to initial configuration

**Usage**

`babcli generate path/to/folder/test-name`
`babcli g path/to/folder/test-name`

**Options**

-   --custom=test: Creates files according to specific set of settings, in this case it looks for the settings saved as **_test_**
