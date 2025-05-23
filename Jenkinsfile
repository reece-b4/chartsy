// This Jenkinsfile is for a Node.js application that builds and deploys to AWS S3 and invalidates CloudFront.
// It uses a Docker agent with Node.js 18 and Alpine Linux.
// The pipeline consists of four stages: Install, Build, Deploy to S3, and Invalidate CloudFront.
// It uses AWS CLI to sync the build artifacts to an S3 bucket and invalidate the CloudFront distribution.
// The AWS credentials are stored in Jenkins credentials and accessed using the 'credentials' function.
// The S3 bucket name and CloudFront distribution ID are defined as environment variables.
// The pipeline is designed to be run in a Jenkins environment with the necessary plugins installed.
// Jenkinsfile is written in Groovy scripting language.

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
  agent { dockerfile true }

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
    CLOUDFRONT_DISTRIBUTION_ID = credentials('CLOUDFRONT_DISTRIBUTION_ID')
    GITHUB_PAT = credentials('github-pat')
  }

  // -------- STAGES OF THE PIPELINE --------
  stages {
    // Install Node dependencies from lockfile
    stage('Install dependencies') {
      steps {
        // 'pnpm ci' ensures clean install from package-lock or ppnpm-lock
        sh 'pnpm ci'
      }
    }

    // Run unit tests
    stage('Run tests') {
      steps {
        // Replace with your testing command, e.g., 'vitest run' or 'jest'
        sh 'pnpm run test'
      }
    }

    // Build the Vue/Vite project for production
    stage('Build app') {
      steps {
        // Compiles the frontend into static files inside 'dist/'
        sh 'pnpm run build'
      }
    }

    // Deploy to S3 bucket
    stage('Deploy to S3') {
      steps {
        // Syncs 'dist/' folder to your S3 bucket
        // '--delete' removes files on S3 that don't exist locally
        sh '''
          aws s3 sync dist/ s3://$S3_BUCKET --delete \
            --region $AWS_REGION
        '''
      }
    }

    // Invalidate CloudFront cache so new build is served
    // CloudFront caches heavily, so this is important for users to see updated content
    stage('Invalidate CloudFront') {
      steps {
        // Sends a request to invalidate CloudFront's cache of static files
        // Ensures updated files are served to end users
        sh '''
          aws cloudfront create-invalidation \
            --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
            --paths "/*"
        '''
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
