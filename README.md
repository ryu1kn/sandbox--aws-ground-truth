
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

### Label the data

Visit your labelling job portal. You can find how to find the portal URL
in the `infra` directory README.

### Check the result

Visit your labelling job on AWS console and follow various links to
access labelling job results / output.
