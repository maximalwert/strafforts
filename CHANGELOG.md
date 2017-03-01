# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [0.4.2] - 2017-03-01
Issue #18: Hotfix to make athlete.is_active a boolean type but optional in model
  and set to true when creating new athlete.

## [0.4.1] - 2017-02-28
Issue #15: Use heroku-deflater gem to enable gzip compression
Issue #17: Setup new domain www.strafforts.com
Issue #18: Set athletes with outdated access token to inactive

## [0.3.0] - 2017-02-25
Issue #3: Update wordings on user-facing messages.
Issue #4: Fix relative athlete profile image causing 404.
Issue #5: Add pace to Strafforts.
 - Fix broken publicise profile checkbox.
 - Show measurement unit preference in settings.
 - Update installation and development guide.
 - Fetch only latest data when athlete connects.
 - Add pace column to all tables.
 - Add unit to elevation column.

## [0.2.0] - 2017-02-22
Issue #1: Fix nil exception setting location when city or country is nill.
Issue #2: Use semantic versioning.

## [0.1.0] - 2017-02-21
Initial stable version released.