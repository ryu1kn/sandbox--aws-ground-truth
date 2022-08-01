
# Sandbox: AWS Ground Truth

Playing with AWS Ground Truth to better understand how to use it.

## Usage

### Deploy infrastructure

Go to [infra](./infra) and deploy the necessary resources.

### Review the labelling job data and settings

The labelling source data is stored in [job-data](./job-data) directory.

The labelling job settings are stored in [job-settings](./job-settings) directory.

### Create a labelling job

```sh
AWS_PROFILE=your-profile ./create-job.sh
```
