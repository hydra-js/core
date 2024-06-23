# Hydra JS Core Module (@hydra-js/core)

This package consists of the core functionality of Hydra-JS.

## Development Guide

```bash
mkdir @hydra-js
cd @hydra-js
git clone git@github.com:hydra-js/core.git
npm i
npm run build
```

### FAQ

#### How to use local npm package for development projects with `npm link`?

To use a local npm package in your development projects, you can use the `npm link` command. Here are the steps:

1. First, navigate to the directory of the local npm package you want to use. In your case, it's the `@hydra-js/core` package. You can do this using the `cd` command in your terminal:

```bash
cd path/to/@hydra-js/core
```

2. Once you're in the package directory, you can create a symbolic link in the global folder using the `npm link` command:

```bash
npm link
```

3. Now, navigate to the directory of the project where you want to use this local package:

```bash
cd path/to/your/project
```

4. In your project directory, use npm link again to link the local package to your project:

```bash
npm link @hydra-js/core
```

Now, your project will use the local version of the `@hydra-js/core` package instead of the one from the npm registry. Any changes you make to the local package will be reflected in your project.

#### How can I unlink a locally linked npm package from my project?

To unlink a locally linked npm package from your project, you can use the `npm unlink` command. Here are the steps:

1. Navigate to the directory of your project where you have linked the local package:

```bash
cd path/to/your/project
```

2. Use the `npm unlink` command to unlink the local package from your project:

```bash
npm unlink @hydra-js/core
```

This will remove the symbolic link to the local package and your project will no longer use the local version of the `@hydra-js/core` package. If you have the package listed in your package.json dependencies, running `npm install` will fetch the package from the npm registry.

#### How can I check if a locally linked npm package is being used in my project?

You can check if a locally linked npm package is being used in your project by using the `npm ls` command. This command will list all the installed packages in your project, including their versions and dependencies.

Here's how you can use it:

```bash
cd path/to/your/project
npm ls @hydra-js/core
```

This command will output the version of `@hydra-js/core` that your project is using. If the package is linked locally, you will see the file path to your local package instead of a version number.

#### How can I update a locally linked npm package in my project?

To update a locally linked npm package in your project, you simply need to make the changes in the local package's code. Because the package is linked (not copied), any changes you make to the package's code will be reflected in your project immediately.

Here are the steps:

1. Navigate to the directory of the local npm package:

```bash
cd path/to/@hydra-js/core
```

2. Make the necessary changes to the package's code.

3. There's no need to run any command to update the package in your project. The changes will be reflected immediately because of the symbolic link.

Remember, if you want these changes to persist in future uses of the package, you should also increment the package version and publish it to the npm registry.

#### How can I publish a locally linked npm package to the npm registry?

To publish a locally linked npm package to the npm registry, you need to follow these steps:

1. Navigate to the directory of the local npm package:

```bash
cd path/to/@hydra-js/core
```
2. Make sure you have updated the version number in the `package.json` file. This is important because npm uses the version number to determine if the package is new or an update to an existing package. You can update the version number manually or use the `npm version` command:

```bash
npm version patch  # for a patch release
npm version minor  # for a minor release
npm version major  # for a major release
```

3. Before you can publish a package, you need to be logged in to npm. If you're not logged in, you can do so using the `npm login` command and entering your credentials:

```
npm login
```

4. Once you're logged in and ready to publish, you can use the `npm publish` command:

```
npm publish
```

This will publish your package to the npm registry. Now, anyone can install your package using `npm install @hydra-js/core`.
