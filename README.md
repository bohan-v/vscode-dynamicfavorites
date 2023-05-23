# Dynamic Favorites README

Dynamic Favorites is a VSCode extension, that helps to quick access favorite files dynamicly.

## Features

Most of the projects following a certain structure pattern for orgnizing files. When you open a file in the editor **under a specific directory**, you may want to access a list of files quickly. This extension will help you to do that.

### Example

I want to favorite all the `project.yml` when I open a file under the `Features` directory.

The following is an example of a project structure:

- AmazingProject
  - Features
    - feature_a
      - contoler_a.ts
      - ...
      - foo.graphql
      - project.yml
    - feature_b
      - file_1.ts
      - file_2.ts
      - ...
      - project.yml
    - ...

## Extension Settings

This extension contributes the following settings:

* `dynamicfavorites.customRootDirPatterns`: add directory patterns to identify a custom root directory when opening a file in the editor.
* `dynamicfavorites.patterns`: the following example is a pattern for listing favorit files under a custom root directory.
  * {\"sectionLabel\": \"Project Files\", \"pattern\": \"**/*.project.yml\", \"iconName\": \"pinned\"}
    * sectionLabel: the label of the section
    * pattern: the pattern for searching files
    * iconName: the icon name for the section
      * use [Product Icon Themes](https://code.visualstudio.com/api/references/icons-in-labels) name provided by VSCode

## Release Notes

### 0.0.1

Initial release
