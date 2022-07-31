import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_iam as iam,
  aws_s3 as s3,
  aws_s3_deployment as s3deploy,
  RemovalPolicy
} from 'aws-cdk-lib'
import { join } from 'path'

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'LabellingJobBucket', {
      bucketName: 'sandbox--aws-ground-truth--labelling',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    })

    new iam.Role(this, 'LabellingJobExecutionRole', {
      assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
      roleName: 'sandbox--aws-ground-truth--labelling-job-execution',
      inlinePolicies: {
        main: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ['s3:ListBucket'],
              resources: [bucket.bucketArn]
            }),
            new iam.PolicyStatement({
              actions: [
                's3:GetObject',
                's3:PutObject',
                's3:DeleteObject'
              ],
              resources: [`${bucket.bucketArn}/*`]
            })
          ]
        })
      },
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess')]
    })

    new s3deploy.BucketDeployment(this, 'LabellingJobInput', {
      sources: [s3deploy.Source.asset(join(__dirname, '..', '..', 'job-data'))],
      destinationBucket: bucket,
      destinationKeyPrefix: 'input'
    })

    new s3deploy.BucketDeployment(this, 'LabellingJobSettings', {
      sources: [s3deploy.Source.asset(join(__dirname, '..', '..', 'job-settings'))],
      destinationBucket: bucket,
      destinationKeyPrefix: 'settings'
    })
  }
}
