#!/usr/bin/env bash
echo "# SonarQube config
sonar.projectKey=intelligent-robot-MP
sonar.projectName=intelligent-robot-MP
sonar.sourceEncoding=UTF-8
sonar.sources=src/app
sonar.exclusions=**/node_modules/**,**/*.spec.ts,**/*.html
sonar.ts.tslint.configPath=src/tslint.json
sonar.branch.name=$CI_COMMIT_REF_NAME
" >sonar-project.properties
