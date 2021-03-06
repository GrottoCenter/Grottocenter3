#!/usr/bin/env bash
# Author: Benjamin Soufflet - Wikicaves
# Date: Dec 29 2016
#
# Requirement: docker, gsutil, gcloud
#
# On Grottocenter V2 server :
# The user GROTTOCENTER_V2_SSH_USER need to be created on the gc2 server with sudo rights :
# /usr/sbin/usermod -a -G wheel GROTTOCENTER_V2_SSH_USER
# The user GROTTOCENTER_V2_SSH_USER need to have a file .my.cnf in his home directory with
# MySQL user root and password set :
# [client]
#         user=root
#         pass=XXXXX
#
# On Cloud SQL :
# The cloud SQL V2 Mysql database server need to be created from the UI of Google Cloud.
# A "sailsuser" user with password need to be added from the UI.
# The "grottoce" database need to be created from the UI.
#
#
# Deploy the current dump of GC2 to the local MySQL container or to the production
# Cloud SQL instance.
#
# WARNING : In case of "production" deployment, this script can replace the
#           Grottocenter 3 production database !
#           All the records on the Grottocenter 3 production database will be lost.
#
# Steps of this script :
# - create a dump of the GC2 production database with only the useful tables for GC3.
# - Add to the created dump the modification SQL scripts from the sql folder of
#   the project. Only the scripts starting with "20*" are used.
# IF [OPTIONAL_PROD_DEPLOY]=true
# - Personal data of the dump are preserved
# - Send the dump file to Google Cloud Storage
# - Import the dump file to the  GC3 Cloud SQL instance.
# - Delete all dump files
# ELSE
# - Personal data of the dump are anonymized
# - Load dump file to local mysql docker container
#
# USAGE :
# ./DBDeploy.sh [GROTTOCENTER_V2_SSH_USER] [GROTTOCENTER_V2_SSH_PORT] [OPTIONAL_PROD_DEPLOY]
# EXAMPLE :
# ./DBDeploy.sh mysshuser 12345 true
# OPTIONAL_PROD_DEPLOY can be skipped for local deployment and need to be set to 'true' for
# production deployment.
# -> The SSH password will be asked twice. This is normal.

PROJECT_ID="grottocenter-beta"
GROTTOCENTER_V2="37.59.123.105"
GROTTOCENTER_V2_SSH_USER=$1
GROTTOCENTER_V2_SSH_PORT=$2
CLOUD_STORAGE_BUCKET_NAME="staging.grottocenter-beta.appspot.com"
DUMP_FILE_PATH=".tmp/"
DUMP_FILE_NAME="mysqldump.sql"
SQL_PROD_INSTANCE_NAME="grottocenter-demo-db"
MYSQL_LOCAL_TAGNAME="mysqlgrotto"

LOCAL_DOCKER_MYSQL_USER="sailsuser"
LOCAL_DOCKER_MYSQL_PASSWORD="grottocepassword"
LOCAL_DOCKER_MYSQL_DATABASE="grottoce"

PRODUCTION_DEPLOY="false"
# Retrieved by using 'gcloud sql instances describe grottocenter-demo-db'
CLOUDSQL_SERVICE_ACCOUNT_EMAIL_ADDRESS="x7ouvznpljhvnpx6mweu3srkl4@speckle-umbrella-11.iam.gserviceaccount.com"


if [ $# -eq 3 ]
  then
    PRODUCTION_DEPLOY=$3
fi;

echo '### Get table names to dump from  Grottocenter V2 database ###'
TABLES_TO_DUMP=$(ssh -p ${GROTTOCENTER_V2_SSH_PORT} ${GROTTOCENTER_V2_SSH_USER}@${GROTTOCENTER_V2} \
"mysql -Ne\"SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='grottoce' AND TABLE_TYPE='BASE TABLE' AND TABLE_NAME NOT LIKE 'forum_%' AND TABLE_NAME NOT LIKE 'T_warning'\"")
TABLES_TO_DUMP=$(echo -n $TABLES_TO_DUMP)

echo '### Dump Grottocenter V2 database to local computer ###'
ssh -p ${GROTTOCENTER_V2_SSH_PORT} ${GROTTOCENTER_V2_SSH_USER}@${GROTTOCENTER_V2} \
"mysqldump --user=root --skip-triggers --hex-blob grottoce ${TABLES_TO_DUMP} \
 | sed 's/ENGINE=MyISAM/ENGINE=InnoDB/g' | gzip -3 -c" > ${DUMP_FILE_PATH}${DUMP_FILE_NAME}.gz
# All tables are converted from MyISAM to InnoDB

gunzip -f ${DUMP_FILE_PATH}${DUMP_FILE_NAME}.gz
if [ "${PRODUCTION_DEPLOY}" = "true" ]
then
  echo '################ PRODUCTION DEPLOY ###################'
  echo '### Concatenate all SQL changes to make to V2 database ###'
  cat sql/0_initDatabase.sql ${DUMP_FILE_PATH}${DUMP_FILE_NAME} sql/20*.sql | gzip > ${DUMP_FILE_PATH}${DUMP_FILE_NAME}.gz
  rm -f ${DUMP_FILE_PATH}${DUMP_FILE_NAME}
  echo '### Upload Dump file to the Cloud Storage bucket you created ###'
  gsutil cp ${DUMP_FILE_PATH}${DUMP_FILE_NAME}.gz gs://${CLOUD_STORAGE_BUCKET_NAME}
  rm -f ${DUMP_FILE_PATH}${DUMP_FILE_NAME}.gz
  # Add the service account to the bucket ACL as a writer
  gsutil acl ch -u ${CLOUDSQL_SERVICE_ACCOUNT_EMAIL_ADDRESS}:W gs://${CLOUD_STORAGE_BUCKET_NAME}
  # Add the service account to the import file as a reader
  gsutil acl ch -u ${CLOUDSQL_SERVICE_ACCOUNT_EMAIL_ADDRESS}:R gs://${CLOUD_STORAGE_BUCKET_NAME}/${DUMP_FILE_NAME}.gz

  echo "### Set GCloud Project ###"
  gcloud config set project ${PROJECT_ID}

  echo '### Import dump file to the prod database ###'
  gcloud sql import sql ${SQL_PROD_INSTANCE_NAME} gs://${CLOUD_STORAGE_BUCKET_NAME}/${DUMP_FILE_NAME}.gz

  echo "### Remove dump file from Google Cloud Storage"
  gsutil acl ch -d ${CLOUDSQL_SERVICE_ACCOUNT_EMAIL_ADDRESS} gs://${CLOUD_STORAGE_BUCKET_NAME}
  gsutil rm gs://${CLOUD_STORAGE_BUCKET_NAME}/${DUMP_FILE_NAME}.gz
else
  echo '################ LOCAL DEPLOY ###################'
  echo '### Concatenate all SQL changes to make to V2 database + ANONYMIZE ###'
  cat sql/0_initDatabase.sql ${DUMP_FILE_PATH}${DUMP_FILE_NAME} sql/20*.sql sql/1_anonymize.sql | gzip > ${DUMP_FILE_PATH}${DUMP_FILE_NAME}.gz
  rm -f ${DUMP_FILE_PATH}${DUMP_FILE_NAME}
  echo '### Upload Dump file to the local Mysql Docker ###'
  # cp ${DUMP_FILE_PATH}${DUMP_FILE_NAME}.gz ${DUMP_FILE_PATH}${DUMP_FILE_NAME}.gz.save
  gunzip -f ${DUMP_FILE_PATH}${DUMP_FILE_NAME}.gz
  docker exec -i ${MYSQL_LOCAL_TAGNAME} mysql --user=${LOCAL_DOCKER_MYSQL_USER} --password=${LOCAL_DOCKER_MYSQL_PASSWORD} ${LOCAL_DOCKER_MYSQL_DATABASE} < ${DUMP_FILE_PATH}${DUMP_FILE_NAME}
  rm -f ${DUMP_FILE_PATH}${DUMP_FILE_NAME}
fi;
echo '### End of process ###'
