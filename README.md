# bab-cli

CLI to create custom boilerplate code

## Installation
```
npm install -g bab-cli
```

## Settings
On first use the CLI will prompt a form asking you to setup the following settings

- base_folder { string } : starting from active directory in terminal, it will look for and create (if not present) base folder to execute commands such as **generate**. ( **default: "/"** )
example: 
	```
	base_folder = src/app
	babcli g components/my-component

	==> creates element in current-location/src/app/components/my-component
	```

- test_folder { boolean } : determines if there is another separate test folder inside the new directory or not ( **default:true** )
-  test_folder_name { string } : if _test_folder_ is set to _true_, represents the name of the test directory that will be created (  **default: "\_\_test__"**)
- template_path { string } : Path to templates folder, an example can be found [here](./template_examples/angular_custom.js)


## Commands

Currently only two commands exists, if needed others will come.

### config

Command to change the default configuration

**Usage**

```
babcli config
```

**Options**

-   _--custom=true_: Show options to create or modify a custom configuration, defaults values are those of the default configuration

### generate ( short: g )

Command to create scaffolding code according to a specific configuration, defaults to initial configuration

**Usage**

```
babcli generate path/to/folder/test-name
babcli g path/to/folder/test-name
```

**Options**

-   --custom=test: Creates files according to specific set of settings, in this case it looks for the settings saved as **_test_**
