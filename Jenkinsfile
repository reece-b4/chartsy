// This Jenkinsfile is for a Node.js application that builds and deploys to AWS S3 and invalidates CloudFront.
// It uses a Docker agent with Node.js 20 and Alpine Linux.
// The pipeline consists of four stages: Install, Build, Deploy to S3, and Invalidate CloudFront.
// It uses AWS CLI to sync the build artifacts to an S3 bucket and invalidate the CloudFront distribution.
// The AWS credentials are stored in Jenkins credentials and accessed using the 'credentials' function.
// BELOW IS STILL CORRECT ???????
// The S3 bucket name and CloudFront distribution ID are defined as environment variables.
// The pipeline is designed to be run in a Jenkins environment with the necessary plugins installed.
// Jenkinsfile is written in Groovy scripting language.

// TODO: dockerfile is not used in this pipeline? confirm and delete if not needed - same with BE

// Begin declarative pipeline
pipeline {
  // -------- AGENT CONFIGURATION --------
  // Tells Jenkins what kind of executor to use
  // 'any' = any available Jenkins agent
  // agent any
  // Alternative: Use docker container with specific image or Dockerfile
  // You could also write:
  // agent { docker { image 'node:18' } }
  // OR to build using a Dockerfile in repo:
  // aegent none as we define an agent for each stage
  agent none

  // -------- ENVIRONMENT VARIABLES --------
  environment {
    // AWS region where your S3 bucket and CloudFront distribution exist
    AWS_REGION = 'eu-west-2'

    // The name of the S3 bucket where the frontend will be deployed
    S3_BUCKET = 'chartsy-fe'

    // Optionally set NODE_ENV
    NODE_ENV = 'production'
    //credentials
    AWS_ACCESS_KEY_ID     = credentials('aws-access-key-id')
    AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
    // Your CloudFront distribution ID (for invalidation after deploy)
    CLOUDFRONT_DISTRIBUTION_ID = credentials('cloudfront-distribution-id')
    GITHUB_PAT = credentials('github-pat')
  }

  // -------- STAGES OF THE PIPELINE --------
  stages {
    stage('Install & Build') {
      agent {
        docker {
          image 'node:20.19.4-alpine'
          args '-u node -e NPM_CONFIG_CACHE=/home/node/.npm'
        }
      }
      steps {
        sh 'rm -rf node_modules'
        sh 'npm ci --omit=optional'
        sh 'npm ci --include=dev'
        sh 'node_modules/.bin/vite build'
      }
    }

    // Run unit tests
    stage('Run tests') {
        agent {
        docker {
          image 'node:20.19.4-alpine'
          args '-u node -e NPM_CONFIG_CACHE=/home/node/.npm'
        }
        }
          environment {
        NODE_ENV = 'test' // or unset NODE_ENV completely
          }
      steps {
        // Replace with your testing command, e.g., 'vitest run' or 'jest'
        sh 'npm run test'
      }
    }

  // Invalidate CloudFront cache so new build is served
  // CloudFront caches heavily, so this is important for users to see updated content
    stage('Deploy & Invalidate') {
      agent {
        docker {
          image 'node:20.19.4-alpine'
          args '-u root -e NPM_CONFIG_CACHE=/home/node/.npm'
        }
      }
      steps {
        script {
          sh '''
        set -eux

        # Install AWS CLI from Alpine packages
        apk update \
          && apk add --no-cache python3 py3-pip aws-cli

        # Upload all files EXCEPT index.html with long-term caching
        aws s3 cp dist/ s3://$S3_BUCKET/ --recursive \
          --exclude "index.html" \
          --cache-control "max-age=31536000,immutable" \
          --region $AWS_REGION

        # Upload index.html separately with no caching
        aws s3 cp dist/index.html s3://$S3_BUCKET/index.html \
          --cache-control "no-cache" \
          --region $AWS_REGION

        # Create a CloudFront invalidation and wait until it's done
        INV_ID=$(aws cloudfront create-invalidation \
          --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
          --paths '/index.html' \
          --query Invalidation.Id --output text)

        echo "Waiting for CloudFront invalidation $INV_ID to complete…"
        aws cloudfront wait invalidation-completed \
          --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
          --id $INV_ID

        echo "✅ Assets deployed and CDN cache cleared."
      '''
        }
      }
    }
  }

  // -------- OPTIONAL POST STEPS --------
  // You can add notifications, cleanup, or archiving here
  post {
    success {
      echo '✅ Deployment successful!'
    }
    failure {
      echo '❌ Deployment failed.'
    }
  }
}
