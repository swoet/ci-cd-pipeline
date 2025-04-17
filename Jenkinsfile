pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps { git url: 'https://github.com/yourusername/ci-cd-pipeline-app.git' }
    }
    stage('Build') {
      steps { sh 'npm install' }
    }
    stage('Test') {
      steps { sh 'npm test' }
    }
    stage('Deploy') {
      steps { echo 'Deploy step placeholder' }
    }
  }
}
