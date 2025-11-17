#!/bin/bash
set -e

mvn --batch-mode -f integrations/standalone/pom.xml versions:set versions:commit -DnewVersion=${1}
mvn --batch-mode -f playwright/tests/screenshots/pom.xml versions:set versions:commit -DnewVersion=${1}
mvn --batch-mode -f playwright/form-test-project/pom.xml versions:set versions:commit -DnewVersion=${1}

pnpm install
pnpm run raise:version ${1/SNAPSHOT/next}
pnpm install
