# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!--
   PRs should document their user-visible changes (if any) in the
   Unreleased section, uncommenting the header as necessary.
-->

<!-- ## Unreleased -->

<!-- ### Changed -->

<!-- ### Added -->

<!-- ### Removed -->

<!-- ### Fixed -->

## [1.2.0] - 2019-07-31

### Added

- Custom elements can now be detected via a new setting
(`settings.wc.elementBaseClasses`)

## [1.1.1] - 2019-06-10

### Fixed

- Updated dependencies to resolve security audits

## [1.1.0] - 2019-05-13

### Added

- Support for `@customElement` JSDoc tag introduced such that classes
with such a tag are detected as custom elements and linted correctly.

## [1.0.0] - 2019-02-26

### Fixed

- Validate element name even when specifying `window.customElements`
- Added `parserOptions.sourceType` of `'module'` to recommended config.

## [0.1.1] - 2019-02-26

### Fixed

- Added namespace to rules in configurations (`wc/`)

## [0.1.0] - 2019-02-26

### Added

- Initial release
