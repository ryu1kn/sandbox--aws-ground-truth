#!/usr/bin/env bash

set -euo pipefail

bucket_name=sandbox--aws-ground-truth--labelling
account_id="$(aws sts get-caller-identity --query Account --output text)"

base_job_name=manually-created-test-job
timestamp="$(date +"%Y-%m-%dT%H-%M-%S")-AEST"

aws sagemaker create-labeling-job --cli-input-json "$(cat <<EOF
  {
    "LabelingJobName": "$base_job_name-$timestamp",
    "LabelAttributeName": "label",
    "InputConfig": {
      "DataSource": {
        "S3DataSource": {
          "ManifestS3Uri": "s3://$bucket_name/input/data.manifest"
        }
      }
    },
    "OutputConfig": {
      "S3OutputPath": "s3://$bucket_name/output"
    },
    "RoleArn": "arn:aws:iam::$account_id:role/sandbox--aws-ground-truth--labelling-job-execution",
    "LabelCategoryConfigS3Uri": "s3://$bucket_name/settings/labels.json",
    "HumanTaskConfig": {
      "WorkteamArn": "arn:aws:sagemaker:ap-southeast-2:$account_id:workteam/private-crowd/manually-created-for-test",
      "UiConfig": {
        "UiTemplateS3Uri": "s3://$bucket_name/settings/worker-task-template.html"
      },
      "PreHumanTaskLambdaArn": "arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-TextMultiClass",
      "TaskTitle": "$base_job_name-task-title-$timestamp",
      "TaskDescription": "$base_job_name task description - $timestamp",
      "NumberOfHumanWorkersPerDataObject": 1,
      "TaskTimeLimitInSeconds": 300,
      "TaskAvailabilityLifetimeInSeconds": 864000,
      "MaxConcurrentTaskCount": 1000,
      "AnnotationConsolidationConfig": {
        "AnnotationConsolidationLambdaArn": "arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-TextMultiClass"
      }
    },
    "Tags": [
      {
        "Key": "manually-created",
        "Value": "true"
      }
    ]
  }
EOF
)"
